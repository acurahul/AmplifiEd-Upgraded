// src/app/(portal)/tutor/courses/[courseId]/page.tsx

'use client';

import React, { useState } from 'react';
import { ArrowLeft, Users, Play, FileText, Calendar, Plus } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation'; // <-- Use Next.js hooks
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';
import Section from '@/components/Section';
import EnrollmentManager from '@/components/EnrollmentManager';
import SessionCreationModal from '@/components/SessionCreationModal';

export default function TutorCoursePage() {
  const router = useRouter(); // <-- Use Next.js router
  const params = useParams(); // <-- Use Next.js params
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);

  if (!params) {
    return <div>Loading...</div>;
  }
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;

  // Mock courses data for the modal
  const courses = [
    { course_id: courseId, title: "Class 10 Chemistry (Full Year)", description: "CBSE Grade 10 Chemistry with weekly live classes and study materials" }
  ];

  const handleSessionSuccess = () => {
    setShowAddSession(false);
    console.log('Session created successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['tutor']}>
          <button
            onClick={() => router.push('/tutor/home')} // <-- Use router.push
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Tutor Dashboard
          </button>

          <Section 
            title="Class 10 Chemistry (Full Year)" 
            description="CBSE Grade 10 Chemistry with weekly live classes and study materials"
          >
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => setShowEnrollmentForm(true)}
                className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center"
              >
                <Users size={20} className="mr-2" />
                Manage Students
              </button>
              
              <button
                onClick={() => setShowAddSession(true)}
                className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add New Session
              </button>
            </div>

            {/* Enrollment Manager */}
            {showEnrollmentForm && (
              <div className="mb-8">
                <EnrollmentManager
                  courseId={courseId}
                  courseTitle="Class 10 Chemistry (Full Year)"
                  tutorName="Tutor Name"
                  onEnrollmentSuccess={() => {
                    setShowEnrollmentForm(false);
                    // You could add a refresh here if needed
                  }}
                  onCancel={() => setShowEnrollmentForm(false)}
                />
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-4">Course Sessions</h3>
                <div className="space-y-4">
                  {[
                    { id: 'ses-chem-001', title: 'Chemical Reactions – Part 1', status: 'published', date: '2025-07-01T10:00:00Z' },
                    { id: 'ses-chem-002', title: 'Acids, Bases and Salts – Part 1', status: 'approved', date: '2025-07-08T10:00:00Z' },
                    { id: 'ses-chem-003', title: 'Metals and Non-metals – Part 1', status: 'draft', date: '2025-07-15T10:00:00Z' }
                  ].map((session) => (
                    <div 
                      key={session.id}
                      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
                      onClick={() => router.push(`/tutor/sessions/${session.id}`)} // <-- Use router.push
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {session.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-2" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full border text-xs font-medium ${
                          session.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          session.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>3 materials generated</span>
                          <span>•</span>
                          <span>24 students enrolled</span>
                        </div>
                        <button className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                          Manage →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Enrolled Students</h3>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="space-y-3">
                    {[
                      { name: 'Aarav Patel', email: 'aarav@student.com' },
                      { name: 'Vivaan Singh', email: 'vivaan@student.com' },
                      { name: 'Aditya Kumar', email: 'aditya@student.com' }
                    ].map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                        <div>
                          <h5 className="text-sm font-medium text-white">{student.name}</h5>
                          <p className="text-xs text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>

      <SessionCreationModal
        isOpen={showAddSession}
        onClose={() => setShowAddSession(false)}
        onSuccess={handleSessionSuccess}
        courses={courses}
        preselectedCourseId={courseId}
      />
    </div>
  );
}