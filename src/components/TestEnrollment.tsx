import React, { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TestEnrollment() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testEnrollment = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      // Test 1: Check if we can read courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('course_id, title')
        .limit(1);

      if (coursesError) {
        throw new Error(`Courses query failed: ${coursesError.message}`);
      }

      if (!courses || courses.length === 0) {
        throw new Error('No courses found. Please create a course first.');
      }

      const testCourse = courses[0];
      setTestResult(`✅ Found course: ${testCourse.title}`);

      // Test 2: Check if we can read profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, role')
        .eq('role', 'student')
        .limit(1);

      if (profilesError) {
        throw new Error(`Profiles query failed: ${profilesError.message}`);
      }

      setTestResult(prev => prev + `\n✅ Found ${profiles?.length || 0} student profiles`);

      // Test 3: Check if we can read enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('id, student_id, course_id')
        .limit(1);

      if (enrollmentsError) {
        throw new Error(`Enrollments query failed: ${enrollmentsError.message}`);
      }

      setTestResult(prev => prev + `\n✅ Found ${enrollments?.length || 0} existing enrollments`);

      // Test 4: Check if we can read topics
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id, name, subject_id')
        .limit(1);

      if (topicsError) {
        throw new Error(`Topics query failed: ${topicsError.message}`);
      }

      setTestResult(prev => prev + `\n✅ Found ${topics?.length || 0} topics`);

      setTestResult(prev => prev + `\n\n🎉 All database queries successful! Enrollment feature should work.`);

    } catch (error) {
      setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-violet-500/10 rounded-lg">
          <UserPlus className="text-violet-400" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Test Enrollment Feature</h3>
          <p className="text-sm text-gray-400">Verify database connectivity and permissions</p>
        </div>
      </div>

      <button
        onClick={testEnrollment}
        disabled={loading}
        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mb-4"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Testing...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2" size={16} />
            Test Database Access
          </>
        )}
      </button>

      {testResult && (
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            {testResult.includes('❌') ? (
              <AlertCircle className="text-red-400 mt-1 flex-shrink-0" size={16} />
            ) : (
              <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={16} />
            )}
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {testResult}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
