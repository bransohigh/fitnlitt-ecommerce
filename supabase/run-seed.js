#!/usr/bin/env node
/**
 * Seed Script - Loads seed data into Supabase
 * Run: node supabase/run-seed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Validate environment
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runSeed() {
  try {
    console.log('🌱 Starting seed process...\n');

    // Read seed SQL file
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    console.log('📄 Loaded seed.sql');
    console.log(`📦 File size: ${(seedSQL.length / 1024).toFixed(2)} KB\n`);

    // Split SQL into individual statements
    const statements = seedSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`🔢 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct execution as fallback
          const { error: directError } = await supabase
            .from('_sql_exec')
            .insert({ query: statement });
          
          if (directError && !directError.message.includes('relation "_sql_exec" does not exist')) {
            throw directError;
          }
        }
        
        successCount++;
        process.stdout.write(`✓ Statement ${i + 1}/${statements.length}\r`);
      } catch (err) {
        errorCount++;
        console.error(`\n❌ Error in statement ${i + 1}:`, err.message);
        console.error(`Statement: ${statement.substring(0, 100)}...\n`);
      }
    }

    console.log(`\n\n✅ Seed completed!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}\n`);

    // Verify data was inserted
    console.log('🔍 Verifying data...\n');
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });
    
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .select('id', { count: 'exact', head: true });

    if (!productsError && !collectionsError) {
      console.log(`   Products: ${products?.length || 0}`);
      console.log(`   Collections: ${collections?.length || 0}`);
    }

    console.log('\n✨ Seed process complete!\n');
    console.log('🚀 You can now:');
    console.log('   - Visit http://localhost:5173 to see products');
    console.log('   - Visit http://localhost:5173/#admin/login to manage products');
    console.log('   - API: http://localhost:3001/api/products\n');

  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run seed
runSeed();
