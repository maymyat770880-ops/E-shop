import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    try {
      // သင့် table name ကို အတိအကျထည့်ပါ။ (ဥပမာ products, gadgets, etc.)
      const { data, error } = await supabase
        .from('products')   // <-- ဒီနေရာမှာ သင့် table name ထည့်
        .select('*');
      
      if (error) throw error;
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
