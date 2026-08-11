require("dotenv").config();
const supaBase = require("@supabase/supabase-js");

const supabase = supaBase.createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);  

module.exports = supabase;