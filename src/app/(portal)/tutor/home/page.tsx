// src/app/(portal)/tutor/home/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Users, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';
import Section from '@/components/Section';
import SessionCreationModal from '@/components/SessionCreationModal';

interface Course {
  course_id: string; // This will be the real UUID
  title: string;
  description: string;
}

export default function TutorHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);

  // --- LIVE DATA FETCH ---
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('course_id, title, description')
          .eq('tutor_id', user.id);

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  // --- HANDLERS ---
  const handleSessionSuccess = () => {
    // Optionally refresh courses or show success message
    console.log('Session created successfully!');
  };

  if (loading && courses.length === 0) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Header />
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['tutor']}>
          <Section 
            title="Tutor Dashboard" 
            description="Manage your courses, sessions, and student progress"
          >
            <div className="flex flex-wrap gap-4 mb-8">
              <button onClick={() => setShowAddSession(true)} className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center">
                <Plus size={20} className="mr-2" />
                Add Session by Link
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.course_id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{course.description}</p>
                  <Link href={`/tutor/courses/${course.course_id}`} className="mt-4 block w-full text-center bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-2 rounded-lg font-medium hover:bg-violet-500/20 transition-colors">
                    Open Course
                  </Link>
                </div>
              ))}
              {courses.length === 0 && !loading && (
                <p className="text-gray-400">No courses found for your account. Please create a course.</p>
              )}
            </div>
          </Section>
        </RoleGate>
      </main>
      <SessionCreationModal
        isOpen={showAddSession}
        onClose={() => setShowAddSession(false)}
        onSuccess={handleSessionSuccess}
        courses={courses}
      />
    </div>
  );
}