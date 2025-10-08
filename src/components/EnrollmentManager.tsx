import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Search, Plus, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EmailService } from '../services/emailService';

interface EnrollmentManagerProps {
  courseId: string;
  courseTitle?: string;
  tutorName?: string;
  onEnrollmentSuccess?: () => void;
  onCancel?: () => void;
}

interface Student {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
}

interface ExistingEnrollment {
  id: string;
  student_id: string;
  enrolled_on: string;
  left_on: string | null;
}

export default function EnrollmentManager({ courseId, courseTitle = "Course", tutorName = "Tutor", onEnrollmentSuccess, onCancel }: EnrollmentManagerProps) {
  const [mode, setMode] = useState<'select' | 'new' | 'existing'>('select');
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [existingEnrollments, setExistingEnrollments] = useState<ExistingEnrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [newStudentForm, setNewStudentForm] = useState({
    email: '',
    full_name: '',
    grade: '',
    sendWelcomeEmail: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'existing') {
      loadExistingStudents();
      loadCurrentEnrollments();
    }
  }, [mode, courseId]);

  const loadExistingStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, role')
        .eq('role', 'student')
        .order('full_name');

      if (error) throw error;
      setAllStudents(data || []);
    } catch (err) {
      setError(`Failed to load students: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const loadCurrentEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id, student_id, enrolled_on, left_on')
        .eq('course_id', courseId);

      if (error) throw error;
      setExistingEnrollments(data || []);
    } catch (err) {
      console.error('Failed to load enrollments:', err);
    }
  };

  const filteredStudents = allStudents.filter(student => {
    const isEnrolled = existingEnrollments.some(enrollment => 
      enrollment.student_id === student.user_id && !enrollment.left_on
    );
    
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return !isEnrolled && matchesSearch;
  });

  const handleEnrollExisting = async () => {
    if (selectedStudents.length === 0) {
      setError('Please select at least one student to enroll');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const enrollments = selectedStudents.map(studentId => ({
        student_id: studentId,
        course_id: courseId,
        enrolled_on: new Date().toISOString().split('T')[0],
        left_on: null
      }));

      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert(enrollments);

      if (enrollmentError) throw enrollmentError;

      // Initialize topic mastery for each student
      await initializeTopicMastery(selectedStudents);

      console.log(`✅ Successfully enrolled ${selectedStudents.length} existing students`);
      onEnrollmentSuccess?.();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll students');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Check if user already exists in auth
      const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers();
      
      if (checkError) {
        console.warn('Could not check existing users:', checkError);
      }

      const existingUser = existingUsers?.users?.find(user => user.email === newStudentForm.email);
      let studentId: string;

      if (existingUser) {
        // User exists in auth, use their ID
        studentId = existingUser.id;
        console.log('✅ Found existing user:', existingUser.email);
      } else {
        // Step 2: Create new user via Supabase Auth (passwordless invitation flow)
        const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
          email: newStudentForm.email,
          email_confirm: true, // Skip email confirmation for now
          user_metadata: {
            full_name: newStudentForm.full_name,
            role: 'student', // SECURITY: Force student role only
            grade: newStudentForm.grade || null,
            created_by: 'tutor_enrollment',
            created_at: new Date().toISOString()
          }
        });

        if (authError) {
          throw new Error(`Failed to create user account: ${authError.message}`);
        }

        if (!newUser.user) {
          throw new Error('User creation failed - no user data returned');
        }

        studentId = newUser.user.id;
        console.log('✅ Created new user via Supabase Auth:', newUser.user.email);

        // Step 3: Update the auto-created profile with additional info
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: newStudentForm.full_name,
            timezone: 'Asia/Kolkata',
            grade: newStudentForm.grade || null
          })
          .eq('user_id', studentId);

        if (profileError) {
          console.warn('Could not update profile:', profileError);
          // Don't throw error - profile exists, just couldn't update metadata
        }
      }

      // Step 4: Create enrollment record
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          student_id: studentId,
          course_id: courseId,
          enrolled_on: new Date().toISOString().split('T')[0],
          left_on: null
        });

      if (enrollmentError) {
        throw new Error(`Failed to create enrollment: ${enrollmentError.message}`);
      }

      // Step 5: Initialize topic mastery
      await initializeTopicMastery([studentId]);

      // Step 6: Send welcome email if requested
      if (newStudentForm.sendWelcomeEmail) {
        const emailResult = await EmailService.sendWelcomeEmail(newStudentForm.email, {
          studentName: newStudentForm.full_name,
          courseTitle: courseTitle,
          tutorName: tutorName,
          platformUrl: window.location.origin,
          loginUrl: `${window.location.origin}/login`
        });

        if (!emailResult.success) {
          console.warn('Email sending failed:', emailResult.error);
          // Don't throw error - enrollment succeeded, email is secondary
        }
      }

      console.log(`✅ Successfully enrolled new student: ${newStudentForm.full_name}`);
      onEnrollmentSuccess?.();

    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to enroll student');
    } finally {
      setLoading(false);
    }
  };

  const initializeTopicMastery = async (studentIds: string[]) => {
    // Get course's subject_id
    const { data: course } = await supabase
      .from('courses')
      .select('subject_id')
      .eq('course_id', courseId)
      .single();

    if (course?.subject_id) {
      // Get all topics for this subject
      const { data: topics } = await supabase
        .from('topics')
        .select('id')
        .eq('subject_id', course.subject_id);

      if (topics && topics.length > 0) {
        // Create mastery records for each student and topic
        const masteryRecords = studentIds.flatMap(studentId =>
          topics.map(topic => ({
            student_id: studentId,
            topic_id: topic.id,
            attempts: 0,
            correct: 0,
            last_attempt: null
          }))
        );

        await supabase.from('topic_mastery').insert(masteryRecords);
      }
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  if (mode === 'select') {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <Users className="text-violet-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Enroll Students</h3>
            <p className="text-sm text-gray-400">Choose how you want to enroll students</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setMode('existing')}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-700 hover:border-slate-600 transition-colors text-left group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Search className="text-blue-400" size={20} />
              <h4 className="font-semibold text-white">Existing Students</h4>
            </div>
            <p className="text-sm text-gray-400">Enroll students who already have accounts in the system</p>
          </button>

          <button
            onClick={() => setMode('new')}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-700 hover:border-slate-600 transition-colors text-left group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Plus className="text-green-400" size={20} />
              <h4 className="font-semibold text-white">New Students</h4>
            </div>
            <p className="text-sm text-gray-400">Onboard new students who don't have accounts yet</p>
          </button>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    );
  }

  if (mode === 'existing') {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Search className="text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Enroll Existing Students</h3>
              <p className="text-sm text-gray-400">Select students to enroll in this course</p>
            </div>
          </div>
          <button
            onClick={() => setMode('select')}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
          />
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-400">
              {searchTerm ? 'No students found matching your search' : 'No available students to enroll'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {filteredStudents.map((student) => (
                <label
                  key={student.user_id}
                  className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.user_id)}
                    onChange={() => toggleStudentSelection(student.user_id)}
                    className="rounded border-slate-600 text-violet-600 focus:ring-violet-500"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{student.full_name}</div>
                    <div className="text-sm text-gray-400">{student.email}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setMode('select')}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleEnrollExisting}
                disabled={loading || selectedStudents.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Enrolling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2" size={16} />
                    Enroll Selected ({selectedStudents.length})
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'new') {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Plus className="text-green-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Enroll New Student</h3>
              <p className="text-sm text-gray-400">Onboard a new student to the system</p>
            </div>
          </div>
          <button
            onClick={() => setMode('select')}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleEnrollNew} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={newStudentForm.full_name}
              onChange={(e) => setNewStudentForm({...newStudentForm, full_name: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={newStudentForm.email}
              onChange={(e) => setNewStudentForm({...newStudentForm, email: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
              placeholder="student@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Grade (Optional)
            </label>
            <select
              value={newStudentForm.grade}
              onChange={(e) => setNewStudentForm({...newStudentForm, grade: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
            >
              <option value="">Select Grade</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newStudentForm.sendWelcomeEmail}
                onChange={(e) => setNewStudentForm({...newStudentForm, sendWelcomeEmail: e.target.checked})}
                className="rounded border-slate-600 text-violet-600 focus:ring-violet-500"
              />
              <div className="flex items-center space-x-2">
                <Mail className="text-blue-400" size={16} />
                <span className="text-sm font-medium text-white">Send welcome email</span>
              </div>
            </label>
            <p className="text-xs text-gray-400 mt-1 ml-7">
              Student will receive an email with course details and login instructions
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setMode('select')}
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2" size={16} />
                  Create & Enroll
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
