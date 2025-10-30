import React from 'react'

export type TopicRow = {
  topic_id: string
  topic_name: string
  attempts: number
  correct: number
  last_attempt: string | null
  accuracy_percent: number
}

type Props = {
  topics: TopicRow[]
}

function formatDisplayDate(iso?: string | null) {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    const day = d.getDate().toString()
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return '-'
  }
}

export default function PerformanceView({ topics }: Props) {
  if (!topics || topics.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white/80">∅</div>
        <div className="mt-3 text-sm text-slate-300">No quiz attempts recorded yet</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-white/5 text-slate-300 uppercase text-[11px] tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Topic</th>
            <th className="px-4 py-3 text-right font-medium">Attempts</th>
            <th className="px-4 py-3 text-right font-medium">Correct</th>
            <th className="px-4 py-3 text-right font-medium">Last Attempt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {topics.map((t, idx) => (
            <tr key={t.topic_id} className={idx % 2 === 0 ? 'bg-white/[0.02]' : ''}>
              <td className="px-4 py-3 text-slate-100">{t.topic_name}</td>
              <td className="px-4 py-3 text-right text-slate-200 tabular-nums">{t.attempts}</td>
              <td className="px-4 py-3 text-right">
                <span className="text-slate-200 tabular-nums mr-2">{t.correct}</span>
                <span className="inline-block text-[11px] px-1.5 py-0.5 rounded border border-emerald-400/30 text-emerald-300 bg-emerald-400/10 align-middle">
                  {t.accuracy_percent.toFixed(2)}%
                </span>
              </td>
              <td className="px-4 py-3 text-right text-slate-200">{formatDisplayDate(t.last_attempt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


