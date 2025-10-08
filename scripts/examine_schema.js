#!/usr/bin/env node

/**
 * Script to examine the Supabase database schema
 * Run with: node scripts/examine_schema.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this for admin operations

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function examineSchema() {
  console.log('🔍 Examining AmplifiEd Database Schema...\n');

  try {
    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.error('❌ Error fetching tables:', tablesError);
      return;
    }

    console.log('📊 Found Tables:');
    console.log('================');
    tables.forEach(table => {
      console.log(`• ${table.table_name} (${table.table_type})`);
    });

    console.log('\n🔍 Table Details:');
    console.log('==================');

    // Examine each table structure
    for (const table of tables) {
      console.log(`\n📋 Table: ${table.table_name.toUpperCase()}`);
      console.log('─'.repeat(50));

      // Get columns for this table
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default, character_maximum_length')
        .eq('table_name', table.table_name)
        .eq('table_schema', 'public')
        .order('ordinal_position');

      if (columnsError) {
        console.error(`❌ Error fetching columns for ${table.table_name}:`, columnsError);
        continue;
      }

      columns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        console.log(`  ${col.column_name}: ${col.data_type}${length} ${nullable}${defaultVal}`);
      });

      // Get row count
      const { count, error: countError } = await supabase
        .from(table.table_name)
        .select('*', { count: 'exact', head: true });

      if (!countError) {
        console.log(`  📊 Row count: ${count}`);
      }

      // Get foreign key relationships
      const { data: foreignKeys, error: fkError } = await supabase
        .from('information_schema.key_column_usage')
        .select('column_name, referenced_table_name, referenced_column_name')
        .eq('table_name', table.table_name)
        .eq('table_schema', 'public')
        .not('referenced_table_name', 'is', null);

      if (!fkError && foreignKeys.length > 0) {
        console.log('  🔗 Foreign Keys:');
        foreignKeys.forEach(fk => {
          console.log(`    ${fk.column_name} → ${fk.referenced_table_name}.${fk.referenced_column_name}`);
        });
      }
    }

    // Check for indexes
    console.log('\n🔍 Indexes:');
    console.log('============');
    const { data: indexes, error: indexesError } = await supabase
      .from('pg_indexes')
      .select('tablename, indexname, indexdef')
      .eq('schemaname', 'public')
      .order('tablename');

    if (!indexesError) {
      indexes.forEach(idx => {
        console.log(`• ${idx.tablename}.${idx.indexname}`);
        if (idx.indexdef.includes('UNIQUE')) {
          console.log(`  🔑 UNIQUE INDEX`);
        }
      });
    }

    // Check for RLS policies
    console.log('\n🔒 Row Level Security:');
    console.log('======================');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, permissive, roles, cmd, qual')
      .eq('schemaname', 'public');

    if (!policiesError && policies.length > 0) {
      policies.forEach(policy => {
        console.log(`• ${policy.tablename}.${policy.policyname}`);
        console.log(`  ${policy.cmd} for ${policy.roles.join(', ')}`);
      });
    } else {
      console.log('No RLS policies found or error fetching policies');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Alternative method using raw SQL if the above doesn't work
async function examineSchemaWithSQL() {
  console.log('\n🔍 Alternative Schema Examination (Raw SQL):');
  console.log('============================================');

  try {
    // Get table schemas using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          t.table_name,
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default,
          c.character_maximum_length,
          CASE WHEN pk.column_name IS NOT NULL THEN 'PRIMARY KEY' END as key_type
        FROM information_schema.tables t
        LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
        LEFT JOIN (
          SELECT ku.table_name, ku.column_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage ku 
            ON tc.constraint_name = ku.constraint_name
          WHERE tc.constraint_type = 'PRIMARY KEY'
        ) pk ON c.table_name = pk.table_name AND c.column_name = pk.column_name
        WHERE t.table_schema = 'public'
        ORDER BY t.table_name, c.ordinal_position;
      `
    });

    if (error) {
      console.log('Raw SQL method failed, trying simpler approach...');
      await examineSchemaSimple();
    } else {
      console.log('Raw SQL results:', data);
    }
  } catch (error) {
    console.log('Raw SQL method not available, trying simple approach...');
    await examineSchemaSimple();
  }
}

async function examineSchemaSimple() {
  console.log('\n🔍 Simple Schema Examination:');
  console.log('==============================');

  // Try to query some common tables to understand structure
  const commonTables = [
    'profiles', 'courses', 'sessions', 'enrollments', 
    'transcripts', 'transcript_chunks', 'study_materials',
    'processing_jobs', 'questions', 'quiz_templates'
  ];

  for (const tableName of commonTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (!error && data) {
        console.log(`\n📋 Table: ${tableName.toUpperCase()}`);
        if (data.length > 0) {
          console.log('Sample columns:', Object.keys(data[0]));
        } else {
          console.log('Table exists but is empty');
        }
      } else {
        console.log(`❌ Table ${tableName} not found or error:`, error?.message);
      }
    } catch (error) {
      console.log(`❌ Error accessing ${tableName}:`, error.message);
    }
  }
}

// Run the schema examination
examineSchema()
  .then(() => examineSchemaWithSQL())
  .then(() => {
    console.log('\n✅ Schema examination complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Schema examination failed:', error);
    process.exit(1);
  });
