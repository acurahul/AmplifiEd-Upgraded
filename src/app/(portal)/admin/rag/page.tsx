// src/app/(portal)/admin/rag/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // <-- Add Supabase import
import { ArrowLeft, Database, Search, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation'; // <-- Use Next.js router
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';
import Section from '@/components/Section';
import StatCard from '@/components/StatCard';

export default function AdminRAGPage() {
  const router = useRouter(); // <-- Use Next.js router
  const [stats, setStats] = useState({
    transcriptChunks: 0,
    documentChunks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchRAGStats = async () => {
    setLoading(true);
    try {
      // Perform two separate count queries
      const { count: transcriptCount, error: transcriptError } = await supabase
        .from('transcript_chunks')
        .select('*', { count: 'exact', head: true });

      if (transcriptError) throw transcriptError;

      const { count: docCount, error: docError } = await supabase
        .from('doc_chunks')
        .select('*', { count: 'exact', head: true });
      
      if (docError) throw docError;

      setStats({
        transcriptChunks: transcriptCount || 0,
        documentChunks: docCount || 0,
      });

    } catch (error) {
      console.error('Error fetching RAG stats:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchRAGStats();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['admin']}>
          <button
            onClick={() => router.push('/admin/queue')} // <-- Use router.push
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Admin Dashboard
          </button>

          <Section 
            title="RAG System Health" 
            description="Monitor retrieval-augmented generation system status"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Transcript Chunks"
                value={loading ? '...' : stats.transcriptChunks.toLocaleString()} // <-- UPDATE THIS
                icon={<Database size={24} />}
              />
              <StatCard
                title="Document Chunks"
                value={loading ? '...' : stats.documentChunks.toLocaleString()} // <-- UPDATE THIS
                icon={<Database size={24} />}
              />
              <StatCard
                title="Avg Chunk Length"
                value="156 chars"
                icon={<Activity size={24} />}
              />
              <StatCard
                title="Last Embed"
                value="2 hrs ago"
                icon={<Activity size={24} />}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sample Retrieval</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter search query..."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                  />
                  <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center">
                    <Search size={20} className="mr-2" />
                    Search
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Embedding Service</span>
                    <span className="text-green-400">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Vector Database</span>
                    <span className="text-green-400">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Search Index</span>
                    <span className="text-green-400">Up to date</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}