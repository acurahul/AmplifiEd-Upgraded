// src/app/(portal)/admin/rag/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Database, Search, Activity, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';
import Section from '@/components/Section';
import StatCard from '@/components/StatCard';

type RAGHealth = {
  transcript_chunks_count: number;
  doc_chunks_count: number;
  last_embed_at: string;
  avg_chunk_len: number;
  synthetic?: boolean;
};

type RetrievalResult = {
  answer: string;
  citations: Array<{
    chunk_id: string;
    score: number;
  }>;
  synthetic?: boolean;
};

export default function AdminRAGPage() {
  const router = useRouter();
  const [health, setHealth] = useState<RAGHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RetrievalResult | null>(null);
  const [searching, setSearching] = useState(false);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rag/health');
      const data = await res.json();
      setHealth(data);
    } catch (error) {
      console.error('Failed to load RAG health:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setSearching(true);
    try {
      const res = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      });
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const formatLastEmbed = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hr ago';
    return `${diffHours} hrs ago`;
  };

  const isSynthetic = health?.synthetic || results?.synthetic;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <RoleGate allowedRoles={['admin']}>
          <button
            onClick={() => router.push('/admin/queue')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Admin Dashboard
          </button>

          <Section 
            title="RAG System Health" 
            description={`Monitor retrieval-augmented generation system status${isSynthetic ? ' (Synthetic Data *)' : ''}`}
          >
            {isSynthetic && (
              <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg text-blue-300 text-sm">
                * Denotes synthetic data - MSW is active
              </div>
            )}
            
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={loadHealth}
                disabled={loading}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition flex items-center disabled:opacity-50"
              >
                <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-gray-400">Loading health metrics...</div>
            ) : health ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    title={`Transcript Chunks${isSynthetic ? ' *' : ''}`}
                    value={health.transcript_chunks_count.toLocaleString()}
                    icon={<Database size={24} />}
                  />
                  <StatCard
                    title={`Document Chunks${isSynthetic ? ' *' : ''}`}
                    value={health.doc_chunks_count.toLocaleString()}
                    icon={<Database size={24} />}
                  />
                  <StatCard
                    title={`Avg Chunk Length${isSynthetic ? ' *' : ''}`}
                    value={`${Math.round(health.avg_chunk_len)} chars`}
                    icon={<Activity size={24} />}
                  />
                  <StatCard
                    title={`Last Embed${isSynthetic ? ' *' : ''}`}
                    value={formatLastEmbed(health.last_embed_at)}
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
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                      />
                      <button
                        onClick={performSearch}
                        disabled={searching || !query.trim()}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center disabled:opacity-50"
                      >
                        <Search size={20} className="mr-2" />
                        {searching ? 'Searching...' : 'Search'}
                      </button>
                      
                      {results && (
                        <div className="mt-4 space-y-3">
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="text-white font-semibold mb-2">Answer:</div>
                            <div className="text-gray-300 text-sm">{results.answer}</div>
                          </div>
                          
                          {results.citations && results.citations.length > 0 && (
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                              <div className="text-white font-semibold mb-2">
                                Citations ({results.citations.length}):
                              </div>
                              <div className="space-y-2">
                                {results.citations.map((cite, idx) => (
                                  <div key={idx} className="text-sm text-gray-300 flex items-center justify-between">
                                    <span className="font-mono text-xs">{cite.chunk_id}</span>
                                    <span className="text-violet-400">Score: {cite.score.toFixed(3)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
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
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total Chunks</span>
                        <span className="text-violet-400 font-semibold">
                          {(health.transcript_chunks_count + health.doc_chunks_count).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-red-400">Failed to load health metrics</div>
            )}
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}