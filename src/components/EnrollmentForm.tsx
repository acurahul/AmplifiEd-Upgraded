import React, { useState } from 'react';
import { UserPlus, Mail, BookOpen, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EnrollmentFormProps {
  courseId: string;
  onEnrollmentSuccess?: () => void;
  onCancel?: () => void;
}

interface Student {
  email: string;
  full_name: string;
  grade?: string;
}

export default function EnrollmentForm({ courseId, onEnrollmentSuccess, onCancel }: EnrollmentFormProps) {
  const [students, setStudents] = useState<Student[]>([{ email: '', full_name: '', grade: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addStudent = () => {
    setStudents([...students, { email: '', full_name: '', grade: '' }]);
  };

  const removeStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const updateStudent = (index: number, field: keyof Student, value: string) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  const validateStudents = () => {
    for (const student of students) {
      if (!student.email || !student.full_name) {
        return 'All students must have email and full name';
      }
      if (!student.email.includes('@')) {
        return 'Please enter valid email addresses';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateStudents();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create or find student profiles
      const studentProfiles = [];
      for (const student of students) {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('email', student.email)
          .single();

        if (existingProfile) {
          studentProfiles.push(existingProfile);
        } else {
          // Create new profile
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert({
              email: student.email,
              full_name: student.full_name,
              role: 'student',
              timezone: 'Asia/Kolkata', // Default timezone
              created_at: new Date().toISOString()
            })
            .select('user_id')
            .single();

          if (profileError) {
            throw new Error(`Failed to create profile for ${student.email}: ${profileError.message}`);
          }
          studentProfiles.push(newProfile);
        }
      }

      // Step 2: Create enrollments (using your schema structure)
      const enrollments = studentProfiles.map(profile => ({
        student_id: profile.user_id,
        course_id: courseId,
        enrolled_on: new Date().toISOString().split('T')[0], // Date format: YYYY-MM-DD
        left_on: null
      }));

      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert(enrollments);

      if (enrollmentError) {
        throw new Error(`Failed to enroll students: ${enrollmentError.message}`);
      }

      // Step 3: Initialize topic mastery for each student
      // First get the course's subject_id, then get all topics for that subject
      const { data: course } = await supabase
        .from('courses')
        .select('subject_id')
        .eq('course_id', courseId)
        .single();

      if (course?.subject_id) {
        const { data: courseTopics } = await supabase
          .from('topics')
          .select('id')
          .eq('subject_id', course.subject_id);

        if (courseTopics && courseTopics.length > 0) {
          const masteryRecords = studentProfiles.flatMap(profile =>
            courseTopics.map(topic => ({
              student_id: profile.user_id,
              topic_id: topic.id,
              attempts: 0,
              correct: 0,
              last_attempt: null
            }))
          );

          await supabase
            .from('topic_mastery')
            .insert(masteryRecords);
        }
      }

      console.log(`✅ Successfully enrolled ${students.length} students`);
      onEnrollmentSuccess?.();

    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to enroll students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-violet-500/10 rounded-lg">
          <UserPlus className="text-violet-400" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Enroll Students</h3>
          <p className="text-sm text-gray-400">Add students to this course</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {students.map((student, index) => (
          <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-300">Student {index + 1}</h4>
              {students.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStudent(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  <Mail className="inline mr-1" size={14} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={student.email}
                  onChange={(e) => updateStudent(index, 'email', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                  placeholder="student@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  <GraduationCap className="inline mr-1" size={14} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={student.full_name}
                  onChange={(e) => updateStudent(index, 'full_name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  <BookOpen className="inline mr-1" size={14} />
                  Grade (Optional)
                </label>
                <select
                  value={student.grade}
                  onChange={(e) => updateStudent(index, 'grade', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="">Select Grade</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={addStudent}
            className="text-violet-400 hover:text-violet-300 text-sm font-medium flex items-center"
          >
            <UserPlus className="mr-1" size={14} />
            Add Another Student
          </button>

          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Enrolling...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" size={16} />
                  Enroll Students
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
