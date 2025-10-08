import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import EnrollmentForm from './EnrollmentForm';

export default function QuickEnrollmentTest() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('course_id, title')
          .limit(10);

        if (error) throw error;
        setCourses(data || []);
        if (data && data.length > 0) {
          setSelectedCourse(data[0].course_id);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-violet-500/10 rounded-lg">
          <UserPlus className="text-violet-400" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Enrollment Test</h3>
          <p className="text-sm text-gray-400">Test the enrollment feature with any course</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="text-yellow-400 mx-auto mb-4" size={48} />
          <p className="text-gray-400 mb-4">No courses found</p>
          <p className="text-sm text-gray-500">Create a course first to test enrollment</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Course to Test Enrollment
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
            >
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowEnrollmentForm(true)}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
          >
            <UserPlus className="mr-2" size={16} />
            Test Enrollment Feature
          </button>
        </>
      )}

      {showEnrollmentForm && selectedCourse && (
        <div className="mt-6">
          <EnrollmentForm
            courseId={selectedCourse}
            onEnrollmentSuccess={() => {
              setShowEnrollmentForm(false);
              alert('Enrollment test successful! Check your database.');
            }}
            onCancel={() => setShowEnrollmentForm(false)}
          />
        </div>
      )}
    </div>
  );
}
