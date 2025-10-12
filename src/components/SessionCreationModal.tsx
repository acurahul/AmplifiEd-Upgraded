import React, { useState } from 'react';
import { X, Upload, Calendar, BookOpen, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Course {
  course_id: string;
  title: string;
  description: string;
}

interface SessionCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  courses: Course[];
  preselectedCourseId?: string; // For when coming from a specific course page
}

export default function SessionCreationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  courses, 
  preselectedCourseId 
}: SessionCreationModalProps) {
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    video_source_url: '',
    date: '',
    courseId: preselectedCourseId || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form when preselectedCourseId changes
  React.useEffect(() => {
    if (preselectedCourseId) {
      setSessionForm(prev => ({ ...prev, courseId: preselectedCourseId }));
    }
  }, [preselectedCourseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate course selection
      if (!sessionForm.courseId) {
        throw new Error('Please select a course');
      }

      // Find the selected course to validate it exists
      const selectedCourse = courses.find(c => c.course_id === sessionForm.courseId);
      if (!selectedCourse) {
        throw new Error('Selected course not found');
      }

      // Step 1: Create the session record
      const { data: newSession, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          course_id: sessionForm.courseId,
          title: sessionForm.title,
          description: sessionForm.description,
          session_date: sessionForm.date || new Date().toISOString(),
          video_source_url: sessionForm.video_source_url,
          status: 'draft'
        })
        .select('id')
        .single();

      if (sessionError) throw sessionError;
      if (!newSession || !newSession.id) throw new Error("Failed to create session record.");

      // Step 2: Create the processing job record
      const { error: jobError } = await supabase
        .from('processing_jobs')
        .insert({
          job: 'transcription',
          status: 'queued',
          session_id: newSession.id,
          video_source_url: sessionForm.video_source_url,
          payload: { video_source_url: sessionForm.video_source_url }
        });

      if (jobError) throw jobError;

      // Success!
      console.log(`✅ Session created successfully for course: ${selectedCourse.title}`);
      onSuccess?.();
      handleClose();

    } catch (err) {
      console.error('Error creating session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSessionForm({
      title: '',
      description: '',
      video_source_url: '',
      date: '',
      courseId: preselectedCourseId || ''
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <Upload className="text-violet-400" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-white">Add New Session</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <BookOpen className="inline mr-1" size={14} />
              Select Course
            </label>
            <select
              value={sessionForm.courseId}
              onChange={(e) => setSessionForm({...sessionForm, courseId: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
              required
              disabled={!!preselectedCourseId} // Disable if preselected
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.title}
                </option>
              ))}
            </select>
            {preselectedCourseId && (
              <p className="text-xs text-gray-400 mt-1">
                Course is pre-selected from the current page
              </p>
            )}
          </div>

          {/* Session Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session Title
            </label>
            <input
              type="text"
              value={sessionForm.title}
              onChange={(e) => setSessionForm({...sessionForm, title: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
              placeholder="e.g., Introduction to Organic Chemistry"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="inline mr-1" size={14} />
              Description (Optional)
            </label>
            <textarea
              value={sessionForm.description}
              onChange={(e) => setSessionForm({...sessionForm, description: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
              rows={3}
              placeholder="Brief description of the session content..."
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Upload className="inline mr-1" size={14} />
              Video Source URL
            </label>
            <input
              type="url"
              value={sessionForm.video_source_url}
              onChange={(e) => setSessionForm({...sessionForm, video_source_url: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
              placeholder="e.g., Google Drive, Dropbox, or YouTube link"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="inline mr-1" size={14} />
              Session Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={sessionForm.date}
              onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave empty to use current date and time
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !sessionForm.courseId}
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={16} />
                  Create Session
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
