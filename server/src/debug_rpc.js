const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SP_URL, process.env.SP_KEY);

async function debugDashboard() {
  console.log("🔍 Checking Database Connection...");
  
  // 1. Check RPC 1
  console.log("\n1. Testing 'get_seller_activity_range'...");
  const { data: d1, error: e1 } = await supabase.rpc('get_seller_activity_range', {
    p_start_date: '2024-01-01',
    p_end_date: '2025-04-30'
  });
  
  if (e1) {
    console.error("❌ FAILED: 'get_seller_activity_range' is missing or broken.");
    console.error("Error Message:", e1.message);
  } else {
    console.log("✅ SUCCESS: Found " + (d1?.length || 0) + " sellers.");
  }

  // 2. Check RPC 2
  console.log("\n2. Testing 'get_inactivity_trend'...");
  const { data: d2, error: e2 } = await supabase.rpc('get_inactivity_trend', {
    p_start_date: '2024-01-01',
    p_end_date: '2025-04-30'
  });
  
  if (e2) {
    console.error("❌ FAILED: 'get_inactivity_trend' is missing or broken.");
    console.error("Error Message:", e2.message);
  } else {
    console.log("✅ SUCCESS: Found " + (d2?.length || 0) + " months of trend data.");
    if (d2 && d2.length > 0) {
        console.log("   Sample entry keys:", Object.keys(d2[0]));
    }
  }

  console.log("\n--- MISSION ---");
  if (e1 || e2) {
    console.log("👉 ACTION REQUIRED: You must run the SQL script I provided in your Supabase SQL Editor!");
  } else {
    console.log("Everything looks good on the database side.");
  }
}

debugDashboard();
