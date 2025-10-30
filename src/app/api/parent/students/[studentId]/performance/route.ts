import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type TopicPerformance = {
  topic_id: string
  topic_name: string
  attempts: number
  correct: number
  last_attempt: string | null
  accuracy_percent: number
}

type ApiResponse = {
  student_id: string
  topics: TopicPerformance[]
}

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase env vars are not configured')
  }
  return createClient(url, key)
}

async function ensureParentGuardianship(supabase: ReturnType<typeof createClient>, parentId: string, studentId: string) {
  const { data, error } = await supabase
    .from('guardianships')
    .select('parent_id, student_id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .limit(1)
    .maybeSingle()
  if (error) {
    throw error
  }
  if (!data) {
    return false
  }
  return true
}

async function fetchTopicPerformance(
  supabase: ReturnType<typeof createClient>,
  studentId: string
): Promise<TopicPerformance[]> {
  const sql = `
    with qa as (
      select qa.attempt_id, qa.student_id, qa.created_at as attempt_at
      from quiz_attempts qa
      where qa.student_id = $1
    ),
    ans as (
      select aa.attempt_id, aa.question_id, aa.is_correct
      from attempt_answers aa
      inner join qa on qa.attempt_id = aa.attempt_id
    ),
    q_topics as (
      select qt.question_id, qt.topic_id
      from question_topics qt
    ),
    topics_map as (
      select t.id as topic_id, t.name as topic_name
      from topics t
    ),
    joined as (
      select q_topics.topic_id,
             topics_map.topic_name,
             ans.is_correct,
             qa.attempt_at
      from ans
      inner join q_topics on q_topics.question_id = ans.question_id
      inner join topics_map on topics_map.topic_id = q_topics.topic_id
      inner join qa on qa.attempt_id = ans.attempt_id
    )
    select topic_id,
           topic_name,
           count(*)::int as attempts,
           sum(case when is_correct then 1 else 0 end)::int as correct,
           max(attempt_at) as last_attempt,
           case when count(*) = 0 then 0 else round(100.0 * sum(case when is_correct then 1 else 0 end) / count(*), 2) end as accuracy_percent
    from joined
    group by topic_id, topic_name
    order by topic_name asc
  `

  const { data, error } = await supabase.rpc('exec_sql', { query: sql, params: [studentId] })
  if (error) {
    // Fallback: attempt with standard selects if no RPC helper exists
    // This fallback may be slower; intended for dev setups without a SQL RPC shim
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('attempt_id, created_at')
      .eq('student_id', studentId)
    if (attemptsError) throw attemptsError

    if (!attempts || attempts.length === 0) return []

    const attemptIds = attempts.map(a => a.attempt_id)
    const { data: answers, error: answersError } = await supabase
      .from('attempt_answers')
      .select('attempt_id, question_id, is_correct')
      .in('attempt_id', attemptIds)
    if (answersError) throw answersError

    const questionIds = Array.from(new Set(answers?.map(a => a.question_id)))
    if (questionIds.length === 0) return []

    const { data: qTopics, error: qTopicsError } = await supabase
      .from('question_topics')
      .select('question_id, topic_id')
      .in('question_id', questionIds)
    if (qTopicsError) throw qTopicsError

    const topicIds = Array.from(new Set(qTopics.map(q => q.topic_id)))
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, name')
      .in('id', topicIds)
    if (topicsError) throw topicsError

    const topicIdToName = new Map<string, string>(topics.map(t => [t.id as unknown as string, (t as any).name]))
    const attemptIdToDate = new Map<string, string>((attempts as any[]).map(a => [a.attempt_id, a.created_at]))

    const map = new Map<string, TopicPerformance>()
    for (const ans of answers as any[]) {
      const relatedTopics = qTopics.filter(q => q.question_id === ans.question_id)
      for (const rel of relatedTopics) {
        const key = rel.topic_id as unknown as string
        if (!map.has(key)) {
          map.set(key, {
            topic_id: key,
            topic_name: topicIdToName.get(key) || 'Unknown',
            attempts: 0,
            correct: 0,
            last_attempt: null,
            accuracy_percent: 0,
          })
        }
        const entry = map.get(key)!
        entry.attempts += 1
        if (ans.is_correct) entry.correct += 1
        const attemptAt = attemptIdToDate.get(ans.attempt_id)
        if (attemptAt && (!entry.last_attempt || attemptAt > entry.last_attempt)) {
          entry.last_attempt = attemptAt
        }
      }
    }
    for (const entry of map.values()) {
      entry.accuracy_percent = entry.attempts === 0 ? 0 : Math.round((entry.correct * 10000) / entry.attempts) / 100
    }
    return Array.from(map.values()).sort((a, b) => a.topic_name.localeCompare(b.topic_name))
  }

  return (data as any[]).map(row => ({
    topic_id: row.topic_id,
    topic_name: row.topic_name,
    attempts: row.attempts,
    correct: row.correct,
    last_attempt: row.last_attempt,
    accuracy_percent: Number(row.accuracy_percent),
  }))
}

export async function GET(req: NextRequest, context: { params: { studentId: string } }) {
  const { studentId } = context.params
  if (!studentId) {
    return NextResponse.json({ error: 'studentId is required' }, { status: 400 })
  }

  const mockResponse = (): NextResponse => {
    const topics: TopicPerformance[] = [
      { topic_id: 't1', topic_name: 'Stoichiometry', attempts: 8, correct: 6, last_attempt: '2025-09-20T10:00:00Z', accuracy_percent: 75 },
      { topic_id: 't2', topic_name: 'Thermodynamics', attempts: 5, correct: 3, last_attempt: '2025-09-18T12:30:00Z', accuracy_percent: 60 },
    ]
    const body: ApiResponse = { student_id: studentId, topics }
    return NextResponse.json(body)
  }

  // If Supabase not configured, serve mock data to keep dev flow working
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    return mockResponse()
  }

  try {
    const supabase = getSupabaseServerClient()

    const authHeader = req.headers.get('x-user-id') || ''
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const parentId = authHeader

    const allowed = await ensureParentGuardianship(supabase, parentId, studentId)
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const topics = await fetchTopicPerformance(supabase, studentId)
    const body: ApiResponse = {
      student_id: studentId,
      topics,
    }
    return NextResponse.json(body)
  } catch (err) {
    // As a safety net in dev, fall back to mock data if DB calls fail
    if (process.env.NODE_ENV === 'development') {
      return mockResponse()
    }
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


