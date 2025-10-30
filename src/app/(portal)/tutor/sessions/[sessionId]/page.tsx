// src/app/(portal)/tutor/sessions/[sessionId]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';
import Section from '@/components/Section';

export default function TutorSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [session, setSession] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      console.log('useEffect triggered with params:', params);
      if (!params?.sessionId) {
        console.log('No sessionId in params, returning early');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);

        const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;

        if (!sessionId || typeof sessionId !== 'string') {
          throw new Error('Invalid session ID provided');
        }

        console.log('Fetching session data for ID:', sessionId);

        // Fetch session details first
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (sessionError) {
          console.error('Session query error:', sessionError);
          throw sessionError;
        }

        console.log('Session data fetched:', sessionData?.title);

        // Fetch course information separately
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('course_id, title, description')
          .eq('course_id', sessionData.course_id)
          .single();

        if (courseError) {
          console.error('Course query error:', courseError);
          throw courseError;
        }

        // Combine session and course data
        const combinedSessionData = {
          ...sessionData,
          courses: courseData
        };

        console.log('Course data fetched:', courseData?.title);

        // Fetch study materials for this session
        const { data: materialsData, error: materialsError } = await supabase
          .from('study_materials')
          .select('*')
          .eq('session_id', sessionId);

        if (materialsError) {
          console.error('Materials query error:', materialsError);
          throw materialsError;
        }

        console.log('Materials fetched:', materialsData?.length || 0);

        setSession(combinedSessionData);
        setMaterials(materialsData || []);

      } catch (err) {
        console.error('Error fetching session data:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          sessionId,
          params: params
        });
        setError(err instanceof Error ? err.message : 'Failed to load session data');
      } finally {
        setLoading(false);
      }
    };

    if (params?.sessionId) {
      fetchSessionData();
    }
  }, [params?.sessionId]);

  if (!params) {
    return <div>Loading...</div>;
  }

  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <div className="text-center text-white">Loading session...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <div className="text-center text-red-400">Error: {error}</div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <div className="text-center text-white">Session not found</div>
        </main>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending_review': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['tutor']}>
          <button
            onClick={() => router.push(`/tutor/courses/${session.course_id}`)}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Course
          </button>

          <Section 
            title={session.title}
            description={`Session created on ${new Date(session.created_at).toLocaleDateString()}`}
          >
            <div className="space-y-6">
              {materials.length === 0 ? (
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                  <h4 className="text-lg font-medium text-gray-300 mb-2">No Study Materials Yet</h4>
                  <p className="text-gray-400 mb-4">Study materials will appear here once they are generated.</p>
                </div>
              ) : (
                materials.map((material) => (
                  <div key={material.id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-violet-400">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{material.title || `${material.type || 'Study'} Material`}</h4>
                          <p className="text-sm text-gray-400 capitalize">{material.type || 'content'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(material.status || 'draft')}`}>
                          {material.status || 'draft'}
                        </span>
                        {(material.status === 'pending_review' || !material.status) && (
                          <div className="flex space-x-2">
                            <button className="text-green-400 hover:text-green-300 p-1" title="Approve">
                              <CheckCircle size={20} />
                            </button>
                            <button className="text-red-400 hover:text-red-300 p-1" title="Reject">
                              <XCircle size={20} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                        {material.content || 'Content will be available soon...'}
                      </pre>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}