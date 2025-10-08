#!/usr/bin/env node

/**
 * Simple script to check database schema and data
 * Run with: node scripts/check_db.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
function loadEnvFile() {
  try {
    const envPath = join(__dirname, '..', '.env');
    const envContent = readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    });
    console.log('✅ Loaded environment variables from .env file');
  } catch (error) {
    console.log('⚠️  No .env file found, using system environment variables');
  }
}

loadEnvFile();

// Get Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || supabaseUrl.includes('YOUR_') || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found or invalid');
  console.log('💡 Please set NEXT_PUBLIC_SUPABASE_URL in your .env file');
  console.log('   Example: NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  process.exit(1);
}

if (!supabaseKey || supabaseKey.includes('YOUR_') || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found or invalid');
  console.log('💡 Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

console.log(`🔗 Using Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Using Supabase Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking AmplifiEd Database...\n');

  // List of tables we expect to exist
  const expectedTables = [
    'profiles',
    'courses', 
    'sessions',
    'enrollments',
    'transcripts',
    'transcript_chunks',
    'study_materials',
    'processing_jobs',
    'questions',
    'quiz_templates',
    'quiz_attempts',
    'topic_mastery',
    'notifications',
    'conversations',
    'messages'
  ];

  console.log('📊 Checking Tables and Sample Data:');
  console.log('===================================');

  for (const tableName of expectedTables) {
    try {
      // Try to get a sample row to understand the structure
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: ${data.length > 0 ? 'Has data' : 'Empty'}`);
        
        if (data.length > 0) {
          console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
          console.log(`   Sample: ${JSON.stringify(data[0], null, 2).substring(0, 100)}...`);
        }
      }
    } catch (err) {
      console.log(`❌ ${tableName}: ${err.message}`);
    }
    console.log('');
  }

  // Check specific relationships
  console.log('🔗 Checking Key Relationships:');
  console.log('==============================');

  try {
    // Check if we can get courses with their tutors
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        *,
        profiles!courses_tutor_id_fkey(*)
      `)
      .limit(3);

    if (!coursesError) {
      console.log(`✅ Courses with tutors: ${courses.length} found`);
      courses.forEach(course => {
        console.log(`   • ${course.title} (Tutor: ${course.profiles?.full_name || 'Unknown'})`);
      });
    } else {
      console.log(`❌ Courses query failed: ${coursesError.message}`);
    }

    // Check enrollments
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses(*),
        profiles!enrollments_student_id_fkey(*)
      `)
      .limit(5);

    if (!enrollmentsError) {
      console.log(`✅ Enrollments: ${enrollments.length} found`);
      enrollments.forEach(enrollment => {
        console.log(`   • ${enrollment.profiles?.full_name} enrolled in ${enrollment.courses?.title}`);
      });
    } else {
      console.log(`❌ Enrollments query failed: ${enrollmentsError.message}`);
    }

    // Check processing jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('processing_jobs')
      .select('*')
      .limit(5);

    if (!jobsError) {
      console.log(`✅ Processing jobs: ${jobs.length} found`);
      jobs.forEach(job => {
        console.log(`   • ${job.job} for session ${job.session_id} (${job.status})`);
      });
    } else {
      console.log(`❌ Processing jobs query failed: ${jobsError.message}`);
    }

  } catch (error) {
    console.log(`❌ Relationship check failed: ${error.message}`);
  }
}

// Run the check
checkDatabase()
  .then(() => {
    console.log('\n✅ Database check complete!');
    console.log('\n💡 Next steps:');
    console.log('1. If tables are missing, check your migration status');
    console.log('2. If RLS policies are blocking access, you may need service role key');
    console.log('3. Once schema is confirmed, we can build the enrollment feature');
  })
  .catch(error => {
    console.error('❌ Database check failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure your .env file has correct Supabase credentials');
    console.log('2. Check if your database is accessible');
    console.log('3. Verify RLS policies allow anon access or use service role key');
  });
