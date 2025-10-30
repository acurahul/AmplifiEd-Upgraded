"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

type Student = { id: string; name: string }

type Props = {
  students: Student[]
  currentStudentId: string
  basePath?: string
}

export default function StudentSelector({ students, currentStudentId, basePath = '/parent/students' }: Props) {
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    router.push(`${basePath}/${id}/performance`)
  }

  if (!students || students.length <= 1) return null

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">Select student</label>
        <select className="bg-slate-900/50 text-slate-100 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          value={currentStudentId}
          onChange={handleChange}
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}


