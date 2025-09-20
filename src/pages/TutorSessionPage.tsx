import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, FileText, MessageSquare, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import PortalHeader from '../components/PortalHeader';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';
import { formatDateTime, formatDuration } from '../../lib/format';

interface Session {
  session_id: string;
  course_id: string;
  title: string;
  description?: string;
  session_date: string;
  video_source_url: string;
  status: string;
  created_at: string;
}

interface StudyMaterial {
  material_id: string;
  session_id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
}

interface Transcript {
  transcript_id: string;
  session_id: string;
  full_text: string;
  duration_ms: number;
  created_at: string;
}

interface TranscriptChunk {
  chunk_id: string;
  transcript_id: string;
  start_ms: number;
  end_ms: number;
  text: string;
  embedding_score: number;
}

export default function TutorSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [transcriptChunks, setTranscriptChunks] = useState<TranscriptChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'materials' | 'transcript'>('materials');

  useEffect(() => {
    if (sessionId) {
      fetchSession();
      fetchMaterials();
      fetchTranscript();
    }
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      const data = await response.json();
      setSession(data);
    } catch (error) {
      console.error('Failed to fetch session:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/materials`);
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    }
  };

  const fetchTranscript = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/transcript`);
      const data = await response.json();
      setTranscript(data.transcript);
      setTranscriptChunks(data.chunks);
    } catch (error) {
      console.error('Failed to fetch transcript:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMaterial = async (materialId: string) => {
    try {
      await fetch(`/api/materials/${materialId}/approve`, { method: 'POST' });
      fetchMaterials();
    } catch (error) {
      console.error('Failed to approve material:', error);
    }
  };

  const handleRejectMaterial = async (materialId: string, comment: string) => {
    try {
      await fetch(`/api/materials/${materialId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      });
      fetchMaterials();
    } catch (error) {
      console.error('Failed to reject material:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'approved': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending_review': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'draft': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'summary': return <FileText size={20} />;
      case 'flashcards': return <MessageSquare size={20} />;
      case 'quiz': return <CheckCircle size={20} />;
      default: return <FileText size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <PortalHeader />
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <PortalHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Session Not Found</h1>
          <button
            onClick={() => navigate('/tutor/home')}
            className="text-violet-400 hover:text-violet-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PortalHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['tutor']}>
          {/* Back Navigation */}
          <button
            onClick={() => navigate('/tutor/home')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Dashboard
          </button>

          <Section 
            title={session.title}
            description={`Session created on ${formatDateTime(session.created_at)}`}
          >
            {/* Session Info */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Session Date</h4>
                  <p className="text-white">{formatDateTime(session.session_date)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
                  <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Duration</h4>
                  <p className="text-white">
                    {transcript ? formatDuration(transcript.duration_ms) : 'Processing...'}
                  </p>
                </div>
              </div>
              
              {session.description && (
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                  <p className="text-gray-300">{session.description}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6">
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'materials'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Study Materials ({materials.length})
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'transcript'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Transcript ({transcriptChunks.length} chunks)
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'materials' && (
              <div className="space-y-6">
                {materials.map((material) => (
                  <div key={material.material_id} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-violet-400">
                          {getMaterialIcon(material.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{material.title}</h4>
                          <p className="text-sm text-gray-400 capitalize">{material.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(material.status)}`}>
                          {material.status.replace('_', ' ')}
                        </span>
                        {material.status === 'pending_review' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveMaterial(material.material_id)}
                              className="text-green-400 hover:text-green-300 p-1"
                              title="Approve"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button
                              onClick={() => handleRejectMaterial(material.material_id, 'Needs revision')}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Reject"
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                        {material.content}
                      </pre>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                      <p className="text-xs text-gray-400">
                        Generated on {formatDateTime(material.created_at)}
                      </p>
                      <button className="text-violet-400 hover:text-violet-300 text-sm flex items-center">
                        <Download size={16} className="mr-1" />
                        Export
                      </button>
                    </div>
                  </div>
                ))}

                {materials.length === 0 && (
                  <div className="text-center py-12 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <h4 className="text-lg font-semibold text-white mb-2">No Materials Generated</h4>
                    <p className="text-gray-400">Materials are being processed and will appear here soon.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                {transcript ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-white">Session Transcript</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Duration: {formatDuration(transcript.duration_ms)}</span>
                        <span>•</span>
                        <span>{transcriptChunks.length} chunks</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {transcriptChunks.map((chunk) => (
                        <div key={chunk.chunk_id} className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">
                              {formatDuration(chunk.start_ms)} - {formatDuration(chunk.end_ms)}
                            </span>
                            <span className="text-xs text-gray-400">
                              Score: {chunk.embedding_score.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-gray-300">{chunk.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                    <h4 className="text-lg font-semibold text-white mb-2">Transcript Processing</h4>
                    <p className="text-gray-400">The transcript is being generated and will appear here soon.</p>
                  </div>
                )}
              </div>
            )}
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}