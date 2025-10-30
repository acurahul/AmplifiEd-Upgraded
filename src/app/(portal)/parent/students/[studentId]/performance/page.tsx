import React from 'react'
import { headers } from 'next/headers'
import Link from 'next/link'
import Header from '@/components/Header'
import { ArrowLeft, Home, User2 } from 'lucide-react'
import PerformanceView, { TopicRow } from '@/components/parent/PerformanceView'
import StudentSelector from '@/components/parent/StudentSelector'

type Params = { params: { studentId: string } }

async function fetchPerformance(studentId: string): Promise<{ student_id: string; topics: TopicRow[] }> {
  const h = headers()
  const host = h.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`
  const res = await fetch(`${baseUrl}/api/parent/students/${studentId}/performance`, {
    headers: { 'x-user-id': 'u_parent_demo' },
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error('Failed to load performance')
  }
  return res.json()
}

async function fetchGuardianStudents(): Promise<{ id: string; name: string }[]> {
  // Placeholder list for MVP; integrate with guardianships/profile tables when available
  return [
    { id: 'u_student_1', name: 'Aditi' },
    { id: 'u_student_2', name: 'Rohan' },
  ]
}

export default async function ParentStudentPerformancePage({ params }: Params) {
  const studentId = params.studentId
  const [perf, students] = await Promise.all([
    fetchPerformance(studentId),
    fetchGuardianStudents(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/portal" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
            Back to Portal
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/student/home" className="inline-flex items-center gap-2 bg-slate-800 text-white px-3 py-2 rounded-md border border-slate-700 hover:bg-slate-700 transition">
              <User2 size={16} /> Student Home
            </Link>
            <Link href="/portal" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-2 rounded-md font-medium hover:from-violet-600 hover:to-purple-700 transition">
              <Home size={16} /> Portal
            </Link>
          </div>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Student Performance</h1>
          <p className="text-sm text-slate-400 mt-1">Topic mastery overview — read only</p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-lg border border-white/10 p-4 sm:p-5 mb-5">
          <StudentSelector students={students} currentStudentId={studentId} />
        </div>

        <div className="bg-white/5 backdrop-blur rounded-lg border border-white/10">
          <PerformanceView topics={perf.topics} />
        </div>
      </div>
    </div>
  )
}


