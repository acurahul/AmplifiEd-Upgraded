#!/usr/bin/env node

/**
 * Admin script to check database schema with service role key
 * Run with: node scripts/check_db_admin.js
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

// Get Supabase credentials - using service role key for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate credentials
if (!supabaseUrl || supabaseUrl.includes('YOUR_')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found or invalid');
  process.exit(1);
}

if (!supabaseServiceKey || supabaseServiceKey.includes('YOUR_')) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found or invalid');
  console.log('💡 Please set SUPABASE_SERVICE_ROLE_KEY in your .env file for admin access');
  process.exit(1);
}

console.log(`🔗 Using Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Using Service Role Key: ${supabaseServiceKey.substring(0, 20)}...`);

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabaseAdmin() {
  console.log('🔍 Admin Database Check (with Service Role Access)...\n');

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
    'messages',
    'subjects',
    'topics',
    'question_banks'
  ];

  console.log('📊 Database Schema Analysis:');
  console.log('============================');

  const tableAnalysis = {};

  for (const tableName of expectedTables) {
    try {
      // Get table structure by trying to select one row
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
        tableAnalysis[tableName] = { exists: false, error: error.message };
      } else {
        // Get total count
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        const rowCount = countError ? 'Unknown' : count || 0;
        
        console.log(`✅ ${tableName}: ${rowCount} rows`);
        
        if (data && data.length > 0) {
          const columns = Object.keys(data[0]);
          console.log(`   Columns: ${columns.join(', ')}`);
          
          // Show sample data (truncated)
          const sampleData = JSON.stringify(data[0], null, 2).substring(0, 200);
          console.log(`   Sample: ${sampleData}...`);
        }
        
        tableAnalysis[tableName] = { 
          exists: true, 
          rowCount, 
          columns: data && data.length > 0 ? Object.keys(data[0]) : [],
          sampleData: data && data.length > 0 ? data[0] : null
        };
      }
    } catch (err) {
      console.log(`❌ ${tableName}: ${err.message}`);
      tableAnalysis[tableName] = { exists: false, error: err.message };
    }
    console.log('');
  }

  // Check relationships and data integrity
  console.log('🔗 Relationship Analysis:');
  console.log('==========================');

  try {
    // Check profiles with different roles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('role, count(*)')
      .group('role');

    if (!profilesError) {
      console.log('📊 User Roles:');
      profiles.forEach(profile => {
        console.log(`   • ${profile.role}: ${profile.count} users`);
      });
    }

    // Check courses with enrollments
    const { data: courseStats, error: courseStatsError } = await supabase
      .from('courses')
      .select(`
        course_id,
        title,
        enrollments(count)
      `);

    if (!courseStatsError) {
      console.log('\n📚 Course Statistics:');
      courseStats.forEach(course => {
        console.log(`   • ${course.title}: ${course.enrollments?.[0]?.count || 0} students`);
      });
    }

    // Check processing jobs status
    const { data: jobStats, error: jobStatsError } = await supabase
      .from('processing_jobs')
      .select('status, count(*)')
      .group('status');

    if (!jobStatsError) {
      console.log('\n⚙️ Processing Jobs:');
      jobStats.forEach(job => {
        console.log(`   • ${job.status}: ${job.count} jobs`);
      });
    }

  } catch (error) {
    console.log(`❌ Relationship analysis failed: ${error.message}`);
  }

  // Summary
  console.log('\n📋 Summary:');
  console.log('============');
  const existingTables = Object.keys(tableAnalysis).filter(table => tableAnalysis[table].exists);
  const missingTables = Object.keys(tableAnalysis).filter(table => !tableAnalysis[table].exists);
  
  console.log(`✅ Tables found: ${existingTables.length}/${expectedTables.length}`);
  console.log(`❌ Missing tables: ${missingTables.length}`);
  
  if (missingTables.length > 0) {
    console.log('Missing tables:', missingTables.join(', '));
  }

  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('===================');
  
  if (existingTables.includes('profiles') && existingTables.includes('courses')) {
    console.log('✅ Core tables exist - ready for enrollment feature');
  } else {
    console.log('⚠️  Core tables missing - check your database migrations');
  }
  
  if (existingTables.includes('processing_jobs')) {
    console.log('✅ Processing jobs table exists - transcription worker should work');
  }
  
  if (tableAnalysis['enrollments']?.rowCount > 0) {
    console.log('✅ Students already enrolled - system is active');
  } else {
    console.log('📝 No students enrolled yet - ready for first enrollments');
  }
}

// Run the admin check
checkDatabaseAdmin()
  .then(() => {
    console.log('\n✅ Admin database check complete!');
    console.log('\n🚀 Next steps:');
    console.log('1. If core tables exist, we can implement enrollment');
    console.log('2. If processing_jobs table exists, your transcription worker should work');
    console.log('3. Check any missing tables and run migrations if needed');
  })
  .catch(error => {
    console.error('❌ Admin database check failed:', error);
  });
