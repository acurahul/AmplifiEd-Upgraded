import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, TrendingUp, Clock, Target, Award } from 'lucide-react';
import PortalHeader from '../components/PortalHeader';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';
import StatCard from '../components/StatCard';
import { formatDate, formatScore } from '../../lib/format';

interface Enrollment {
  enrollment_id: string;
  course_id: string;
  enrolled_on: string;
  status: string;
  course: {
    course_id: string;
    title: string;
    description: string;
    academic_year: string;
    subject_id: string;
  };
}

interface TopicMastery {
  student_id: string;
  topic_id: string;
  attempts: number;
  correct: number;
  mastery_score: number;
  last_attempt: string;
}

export default function StudentHomePage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [topicMastery, setTopicMastery] = useState<TopicMastery[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrollments();
    fetchTopicMastery();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/student/enrollments?studentId=u_stu_01');
      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    }
  };

  const fetchTopicMastery = async () => {
    try {
      const response = await fetch('/api/student/topic-mastery?studentId=u_stu_01');
      const data = await response.json();
      setTopicMastery(data);
    } catch (error) {
      console.error('Failed to fetch topic mastery:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageMastery = topicMastery.length > 0 
    ? topicMastery.reduce((sum, topic) => sum + topic.mastery_score, 0) / topicMastery.length 
    : 0;

  const totalAttempts = topicMastery.reduce((sum, topic) => sum + topic.attempts, 0);
  const totalCorrect = topicMastery.reduce((sum, topic) => sum + topic.correct, 0);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PortalHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleGate allowedRoles={['student']}>
          <Section 
            title="Student Dashboard" 
            description="Track your learning progress and access course materials"
          >
            {/* Learning Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Enrolled Courses"
                value={enrollments.length}
                icon={<BookOpen size={24} />}
              />
              <StatCard
                title="Overall Mastery"
                value={formatScore(averageMastery)}
                icon={<Target size={24} />}
                trend={{ value: 5, label: 'improvement' }}
              />
              <StatCard
                title="Practice Sessions"
                value={totalAttempts}
                icon={<TrendingUp size={24} />}
              />
              <StatCard
                title="Accuracy Rate"
                value={totalAttempts > 0 ? formatScore(totalCorrect / totalAttempts) : '0%'}
                icon={<Award size={24} />}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Enrolled Courses */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-4">Your Courses</h3>
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div 
                      key={enrollment.enrollment_id}
                      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/student/course/${enrollment.course_id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {enrollment.course.title}
                          </h4>
                          <p className="text-gray-400 text-sm mb-3">
                            {enrollment.course.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span>{enrollment.course.academic_year}</span>
                            <span className="mx-2">•</span>
                            <span>{enrollment.course.subject_id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">3</div>
                          <div className="text-xs text-gray-400">Sessions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">8</div>
                          <div className="text-xs text-gray-400">Materials</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">75%</div>
                          <div className="text-xs text-gray-400">Progress</div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="flex-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-2 rounded-lg font-medium hover:bg-violet-500/20 transition-colors">
                          Continue Learning
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/student/chat/${enrollment.course_id}`);
                          }}
                          className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg font-medium hover:bg-teal-500/20 transition-colors flex items-center"
                        >
                          <MessageSquare size={16} className="mr-2" />
                          Ask AI
                        </button>
                      </div>
                    </div>
                  ))}

                  {enrollments.length === 0 && (
                    <div className="text-center py-12 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                      <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                      <h4 className="text-lg font-semibold text-white mb-2">No Courses Yet</h4>
                      <p className="text-gray-400">Contact your tutor to get enrolled in courses</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Topic Mastery */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Topic Mastery</h3>
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="space-y-4">
                    {topicMastery.map((topic) => (
                      <div key={topic.topic_id} className="bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-white capitalize">
                            {topic.topic_id.replace('topic-', '').replace('-', ' ')}
                          </h5>
                          <span className="text-sm font-bold text-violet-400">
                            {formatScore(topic.mastery_score)}
                          </span>
                        </div>
                        
                        <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-violet-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${topic.mastery_score * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{topic.correct}/{topic.attempts} correct</span>
                          <span>{formatDate(topic.last_attempt)}</span>
                        </div>
                      </div>
                    ))}

                    {topicMastery.length === 0 && (
                      <div className="text-center py-8">
                        <Target className="mx-auto text-gray-400 mb-3" size={32} />
                        <p className="text-gray-400 text-sm">
                          Start practicing to see your mastery progress
                        </p>
                      </div>
                    )}
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