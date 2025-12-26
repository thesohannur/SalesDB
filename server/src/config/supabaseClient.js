const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SP_URL;
const supabaseKey = process.env.SP_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
