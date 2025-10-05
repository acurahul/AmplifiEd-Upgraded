'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Square, RotateCcw, Database } from 'lucide-react';
import Header from '@/components/Header';
import RoleGate from '@/components/RoleGate';
import Section from '@/components/Section';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import { formatDateTime } from '@/lib/format';

interface ProcessingJob {
  job_id: string;
  type: string;
  session_id: string;
  status: string;
  queued_at: string;
  started_at?: string;
  finished_at?: string;
  assigned_to?: string;
  last_event: string;
}

interface JobEvent {
  event_id: string;
  job_id: string;
  event_type: string;
  message: string;
  timestamp: string;
}

export default function AdminQueuePage() {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ProcessingJob | null>(null);
  const [jobEvents, setJobEvents] = useState<JobEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchJobEvents(selectedJob.job_id);
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
   const { data, error } = await supabase
     .from('processing_jobs')
     .select('*')
     .order('queued_at', { ascending: false }); // Show newest jobs first

   if (error) throw error;
   
   // Map the data to match the component's expected structure
   const formattedData = data.map(job => ({
       ...job,
       job_id: job.id,
       type: job.job,
       last_event: 'N/A' // This is a placeholder as it's not in the jobs table
   }));

   setJobs(formattedData);
   if (formattedData.length > 0 && !selectedJob) {
     setSelectedJob(formattedData[0]);
   }
 } catch (error) {
   console.error('Failed to fetch jobs:', error);
 } finally {
   setLoading(false);
 }
  };

  const fetchJobEvents = async (jobId: string) => {
    try {
   const { data, error } = await supabase
     .from('job_events')
     .select('*')
     .eq('job_id', jobId)
     .order('created_at', { ascending: true }); // Show events in order

   if (error) throw error;
   
   // The component expects 'event_id' and 'event_type'. Let's ensure the mapping.
   const formattedEvents = data.map(event => ({
       ...event,
       event_id: event.id,
       event_type: event.status // Assuming 'status' in job_events maps to 'event_type'
   }));

   setJobEvents(formattedEvents || []);
 } catch (error) {
   console.error('Failed to fetch job events:', error);
 }
  };

  const handleRetry = async (jobId: string) => {
    try {
      await fetch(`/api/admin/jobs/${jobId}/retry`, { method: 'POST' });
      fetchJobs();
    } catch (error) {
      console.error('Failed to retry job:', error);
    }
  };

  const handleCancel = async (jobId: string) => {
    try {
      await fetch(`/api/admin/jobs/${jobId}/cancel`, { method: 'POST' });
      fetchJobs();
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'running': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'queued': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'canceled': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const columns = [
    {
      key: 'type' as keyof ProcessingJob,
      label: 'Job Type',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-white capitalize">
          {value.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'session_id' as keyof ProcessingJob,
      label: 'Session',
      sortable: true
    },
    {
      key: 'status' as keyof ProcessingJob,
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'queued_at' as keyof ProcessingJob,
      label: 'Queued',
      sortable: true,
      render: (value: string) => formatDateTime(value)
    },
    {
      key: 'assigned_to' as keyof ProcessingJob,
      label: 'Worker',
      render: (value: string) => value || '-'
    },
    {
      key: 'last_event' as keyof ProcessingJob,
      label: 'Last Event',
      render: (value: string) => (
        <span className="text-gray-400 text-sm">{value}</span>
      )
    },
    {
      key: 'job_id' as keyof ProcessingJob,
      label: 'Actions',
      render: (value: string, row: ProcessingJob) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedJob(row)}
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            View
          </button>
          {(row.status === 'failed' || row.status === 'canceled') && (
            <button
              onClick={() => handleRetry(row.job_id)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Retry
            </button>
          )}
          {row.status === 'queued' && (
            <button
              onClick={() => handleCancel(row.job_id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
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
        <RoleGate allowedRoles={['admin']}>
          <Section 
            title="Processing Queue" 
            description="Monitor and manage background processing jobs"
          >
            {/* --- ADD THIS BLOCK --- */}
  <div className="flex flex-wrap gap-4 mb-8">
    <button 
      onClick={() => router.push('/admin/rag')}
      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center"
    >
      <Database size={20} className="mr-2" />
      RAG Health
    </button>
  </div>
  {/* --- END BLOCK --- */}
            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Completed"
                value={statusCounts.completed || 0}
                icon={<Play size={24} />}
              />
              <StatCard
                title="Running"
                value={statusCounts.running || 0}
                icon={<Play size={24} />}
              />
              <StatCard
                title="Queued"
                value={statusCounts.queued || 0}
                icon={<Square size={24} />}
              />
              <StatCard
                title="Failed"
                value={statusCounts.failed || 0}
                icon={<RotateCcw size={24} />}
              />
            </div>

            {/* Jobs Table */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <DataTable data={jobs} columns={columns} />
              </div>

              {/* Job Events */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Job Events
                  {selectedJob && (
                    <span className="text-sm text-gray-400 ml-2">
                      ({selectedJob.job_id})
                    </span>
                  )}
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {jobEvents.map((event) => (
                    <div key={event.event_id} className="border-l-2 border-violet-500/30 pl-4 pb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white capitalize">
                          {event.event_type}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDateTime(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{event.message}</p>
                    </div>
                  ))}
                  
                  {jobEvents.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      {selectedJob ? 'No events for this job' : 'Select a job to view events'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Section>
        </RoleGate>
      </main>
    </div>
  );
}