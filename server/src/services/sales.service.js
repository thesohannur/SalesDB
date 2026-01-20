const supabase = require("../config/supabaseClient");

async function getMonthlySales(year) {
  const { data, error } = await supabase.rpc(
    "get_monthly_sales_summary",
    { p_year: year }
  );

  if (error) throw error;
  return data;
}

module.exports = { getMonthlySales };
