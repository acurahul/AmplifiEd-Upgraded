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
  const [sessionForm, setSessionForm] = useState({
    title: '',
    video_source_url: '',
    date: ''
  });

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

  // --- CORRECTED SUBMISSION LOGIC ---
  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (courses.length === 0) {
      alert("Error: No courses found. You must have at least one course to add a session to.");
      return;
    }
    
    // Use the REAL uuid from the fetched course
    const courseId = courses[0].course_id; 

    try {
      // Step 1: Create the 'sessions' record
      const { data: newSession, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          course_id: courseId, // Use the valid UUID
          title: sessionForm.title,
          session_date: sessionForm.date || new Date(),
          video_source_url: sessionForm.video_source_url,
          status: 'draft'
        })
        .select('id')
        .single();

      if (sessionError) throw sessionError;
      if (!newSession || !newSession.id) throw new Error("Failed to create session record.");
      
      // Step 2: Create the 'processing_jobs' record
      const newSessionId = newSession.id;

      const { error: jobError } = await supabase
        .from('processing_jobs')
        .insert({
          job: 'transcription',
          status: 'queued',
          session_id: newSessionId,
          video_source_url: sessionForm.video_source_url,
          payload: { video_source_url: sessionForm.video_source_url }
        });

      if (jobError) throw jobError;

      alert('Success! Session created and transcription job has been queued.');
      setShowAddSession(false);
      setSessionForm({ title: '', video_source_url: '', date: '' });

    } catch (error) {
      console.error('Error queuing transcription job:', error);
      alert(`Failed to queue job: ${(error as Error).message}`);
    }
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
      {showAddSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Add Session by Link</h3>
              <form onSubmit={handleAddSession} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Session Title</label>
                      <input type="text" value={sessionForm.title} onChange={(e) => setSessionForm({...sessionForm, title: e.target.value})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500" required />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Video Source URL</label>
                      <input type="url" value={sessionForm.video_source_url} onChange={(e) => setSessionForm({...sessionForm, video_source_url: e.target.value})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500" required placeholder="e.g., Google Drive or Dropbox link" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Session Date</label>
                      <input type="datetime-local" value={sessionForm.date} onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500" />
                  </div>
                  <div className="flex space-x-3 pt-4">
                      <button type="button" onClick={() => setShowAddSession(false)} className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
                      <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-300">Add Session</button>
                  </div>
              </form>
            </div>
        </div>
      )}
    </div>
  );
}