# 🚀 Setup Instructions for Inactive Sellers Analytics

## ⚠️ IMPORTANT: Run SQL in Supabase First!

### Step 1: Install SQL Function in Supabase

1. Open **Supabase Dashboard** → Your Project → **SQL Editor**
2. Create a new query
3. Copy the entire contents from: `server/src/range_inactive_sql.sql`
4. Click **Run** or press `Ctrl+Enter`

Expected output: `Success. No rows returned`

---

## ✅ Step 2: Verify Backend is Running

Your backend is already running on port **5001**!

Test it:
```bash
curl "http://localhost:5001/api/analytics/inactive-sellers?startMonth=2024-01&endMonth=2024-12"
```

Expected response (after SQL is installed):
```json
{
  "summary": {
    "inactive_count": 5,
    "total_sellers": 10,
    "inactive_ratio": 50.0
  },
  "trend_data": [...],
  "inactive_sellers": [...]
}
```

---

## 🎨 Step 3: Test Frontend

```bash
# In a new terminal
cd /Users/sohannur/SalesDB/client
npm start
```

Navigate to the inactive sellers page in your app.

---

## 🐛 Current Status

✅ Backend server is running on port 5001
✅ API route is configured: `/api/analytics/inactive-sellers`
✅ Frontend component is ready
❌ **SQL function needs to be installed in Supabase** ← DO THIS NOW!

---

## 📝 SQL to Run in Supabase

Open the file: `server/src/range_inactive_sql.sql` and copy-paste it into Supabase SQL Editor.

The function handles:
- Counting inactive sellers in a date range
- Generating monthly trend data
- Listing all inactive sellers with details
- Calculating days inactive

---

## 🔍 Troubleshooting

**Error: "column o.seller_id does not exist"**
- This means the SQL function isn't installed yet
- Run the SQL in Supabase Dashboard

**Error: "function get_inactive_sellers_analytics does not exist"**
- Same as above - install the SQL function

**Frontend shows no data**
- Make sure backend is running (it is!)
- Check browser console for errors
- Verify the frontend is calling the correct API URL
