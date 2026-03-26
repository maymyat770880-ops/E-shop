// const express = require('express');
// const app =express();


// const { Pool } = require('pg'); // mysql2 အစား pg ကို သုံးမယ်

// // Database connection link (ဒါကို .env ဖိုင်ထဲမှာ ထည့်ထားတာ ပိုကောင်းတယ်)
// const connectionString = 'postgresql://postgres:CyberGadget@2026@db.lawzwstbftiawplrweyk.supabase.co:5432/postgres';

// const db = new Pool({
//   connectionString: connectionString,
//   ssl: {
//     rejectUnauthorized: false // Cloud database ဖြစ်လို့ ဒါလေး ထည့်ပေးရတယ်
//   }
// });

// // Connection စစ်ဆေးတဲ့ code
// db.connect((err, client, release) => {
//   if (err) {
//     return console.error('Supabase connection failed:', err.stack);
//   }
//   console.log('Connected to Supabase Database successfully!');
//   release();
// });





// // --- Register API ---
// app.post('/api/register', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // သင့် table ထဲက column နာမည်များ (id, username, email, password) အတိုင်း သိမ်းဆည်းခြင်း
//         const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
//         db.query(sql, [username, email, hashedPassword], (err, result) => {
//             if (err) return res.status(500).json({ error: "Registration failed: " + err.message });
//             res.status(201).json({ message: "User Registered Successfully!" });
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // --- Login API ---
// app.post('/api/login', (req, res) => {
//     const { email, password } = req.body;
//     const sql = "SELECT * FROM users WHERE email = ?";
    
//     db.query(sql, [email], async (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
        
//         if (results.length > 0) {
//             const user = results[0];
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (isMatch) {
//                 // Login အောင်မြင်လျှင် user data ပို့ပေးခြင်း
//                 res.json({ message: "Login Success", user: { id: user.id, name: user.username } });
//             } else {
//                 res.status(400).json({ message: "Invalid Credentials" });
//             }
//         } else {
//             res.status(400).json({ message: "User not found" });
//         }
//     });
// });







// app.get('/api/products', (req, res) => {
//     db.query("SELECT * FROM products", (err, result) => {
//         if (err) return res.status(500).json(err);
//         res.json(result);
//     });
// });


// // ပစ္စည်းအသစ်ထည့်ရန် API
// app.post('/api/products', (req, res) => {
//     const { name, price, description, image,category } = req.body;
//     const sql = "INSERT INTO products (name, price, description, image,category) VALUES (?, ?, ?, ?,?)";
    
//     db.query(sql, [name, price, description, image,category], (err, result) => {
//         if (err) return res.status(500).json(err);
//         res.json({ message: "Product added successfully!", id: result.insertId });
//     });
// });

// // Product တစ်ခုချင်းစီရဲ့ details ကို ID နဲ့ ရှာပေးတဲ့ API
// app.get('/api/products/:id', (req, res) => {
//     // URL က id ကို ယူတာပါ (ဥပမာ: /api/products/1)
//     const productId = req.params.id; 
    
//     // products table ထဲမှာ id က productId နဲ့ တူတာကို ရှာခိုင်းတဲ့ SQL syntax ပါ
//     const sql = `SELECT * FROM products WHERE id = ?`; // ? နေရာမှာ တိုက်ရိုက်အစားထိုးလိုက်တယ်
    
//     db.query(sql, [productId],(err, data) => {
//         if (err) {
//             console.error("Database connection error or query failed:", err); // console မှာ error ပြအောင် လုပ်ထားတယ်
//             return res.status(500).json({ error: "Server Database Error", details: err });
//         }
        
//         // Database ထဲမှာ data ရှိမရှိ စစ်မယ်
//         if (data.length > 0) {
//             console.log("Product found:", data[0].name); // Product နာမည်ကို backend terminal မှာ ပြမယ်
//             return res.json(data[0]); // ရှာတွေ့တဲ့ data ကို frontend ဆီ ပို့ပေးမယ်
//         } else {
//             console.log("No product found with ID:", productId); // ရှာမတွေ့ရင် backend terminal မှာ ပြမယ်
//             return res.status(404).json({ message: "Product not found" });
//         }
//     });
// });

// // Database ထဲက order အားလုံးကို ပြန်ယူတဲ့ route
// app.get('/api/orders', (req, res) => {
//     const sql = "SELECT * FROM orders"; // နင့် database table နာမည် orders ဖြစ်ရမယ်
//     db.query(sql, (err, data) => {
//         if (err) return res.json(err);
//         return res.json(data);
//     });
// });

// // ပစ္စည်းပြန်ဖျက်ရန် API
// app.delete('/api/products/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = "DELETE FROM products WHERE id = ?";
    
//     db.query(sql, [id], (err, result) => {
//         if (err) return res.status(500).json(err);
//         res.json({ message: "Product deleted successfully!" });
//     });
// });

// // backend/index.js ထဲမှာ ထည့်ရန်
// app.post('/api/orders', (req, res) => {
//     const { name, phone, address, total } = req.body;
//     const sql = "INSERT INTO orders (customer_name, phone_number, address, total_price) VALUES (?, ?, ?, ?)";
    
//     db.query(sql, [name, phone, address, total], (err, result) => {
//         if (err) return res.json({ error: err });
//         return res.json({ message: "Order placed successfully!" });
//     });
// });

// // User ဆီက Message ကို Database ထဲ သိမ်းဖို့
// app.post('/api/contact', (req, res) => {
//     const { name, email, message } = req.body;
//     const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
//     db.query(sql, [name, email, message], (err, result) => {
//         if (err) return res.status(500).json(err);
//         return res.json({ message: "Message Sent Successfully!" });
//     });
// });

// // Admin Page မှာ ပြန်ပြဖို့ Message တွေ အကုန်ယူမယ်
// app.get('/api/messages', (req, res) => {
//     const sql = "SELECT * FROM contacts ORDER BY created_at DESC";
//     db.query(sql, (err, data) => {
//         if (err) return res.status(500).json(err);
//         return res.json(data);
//     });
// });

// // ပစ္စည်းအချက်အလက် ပြင်ဆင်ရန် API (Update)
// app.put('/api/products/:id', (req, res) => {
//   const { id } = req.params;
//   const { name, price, description, image } = req.body;
//   const sql = "UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?";

//   db.query(sql, [name, price, description, image, id], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: "Product updated successfully!" });
//   });
// });

// // Order Status ကို ပြောင်းပေးမည့် API
// app.put('/api/orders/:id/status', (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body; // 'Delivered' သို့မဟုတ် 'Pending' ပို့ပေးရမယ်
//   const sql = "UPDATE orders SET status = ? WHERE id = ?";

//   db.query(sql, [status, id], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: "Order status updated successfully!" });
//   });
// });

// // ၁။ Message ကို ဖတ်ပြီးသားအဖြစ် ပြောင်းရန် (Update)
// app.put('/api/contacts/:id/read', (req, res) => {
//     const { id } = req.params;
//     const sql = "UPDATE contacts SET is_read = 1 WHERE id = ?";
//     db.query(sql, [id], (err, result) => {
//         if (err) return res.status(500).json(err);
//         res.json({ message: "Message marked as read!" });
//     });
// });

// // ၂။ Message ကို ဖျက်ရန် (Delete)
// app.delete('/api/contacts/:id', (req, res) => {
//     const { id } = req.params;
//     const sql = "DELETE FROM contacts WHERE id = ?";
//     db.query(sql, [id], (err, result) => {
//         if (err) return res.status(500).json(err);
//         res.json({ message: "Message deleted!" });
//     });
// });

// // reviews sections
// app.post('/api/reviews', (req, res) => {
//     const { product_id, user_name, comment, parent_id } = req.body;
//     const sql = "INSERT INTO reviews (product_id, user_name, comment, parent_id) VALUES (?, ?, ?, ?)";
//     db.query(sql, [product_id, user_name, comment, parent_id], (err, result) => {
//         if (err) return res.json(err);
//         return res.json({ message: "Review posted!" });
//     });
// });

// app.get('/api/reviews/:product_id', (req, res) => {
//     const sql = "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC";
//     db.query(sql, [req.params.product_id], (err, data) => {
//         if (err) return res.json(err);
//         return res.json(data);
//     });
// });

// // Database ထဲက review အားလုံးကို ဆွဲထုတ်တဲ့ API
// app.get('/api/all-reviews', (req, res) => {
//     const sql = "SELECT * FROM reviews ORDER BY created_at DESC";
//     db.query(sql, (err, data) => {
//         if (err) return res.json(err);
//         return res.json(data);
//     });
// });

// // server.js ထဲမှာ ဒါလေး ရှိရမယ်
// app.delete('/api/reviews/:id', (req, res) => {
//     const { id } = req.params;
//     const sql = "DELETE FROM reviews WHERE id = ?";
//     db.query(sql, [id], (err, result) => {
//         if (err) return res.status(500).json(err);
//         return res.json({ message: "Review deleted successfully" });
//     });
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const app = express();
const { Pool } = require('pg'); // mysql2 အစား pg ကို သုံးထားတယ်
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors({
    origin: ["https://cyber-gadgets-ecommerce.vercel.app", "http://localhost:3000"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// --- Database Connection ---
const db = new Pool({
  connectionString: 'postgresql://postgres:CyberGadget%2026@db.lawzwstbftiawplrweyk.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
  if (err) return console.error('Supabase connection failed:', err.stack);
  console.log('Connected to Supabase Database successfully!');
});

// --- Register API ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
        await db.query(sql, [username, email, hashedPassword]);
        res.status(201).json({ message: "User Registered Successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Registration failed: " + err.message });
    }
});

// --- Login API ---
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = "SELECT * FROM users WHERE email = $1";
        const result = await db.query(sql, [email]);
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.json({ message: "Login Success", user: { id: user.id, name: user.username } });
            } else {
                res.status(400).json({ message: "Invalid Credentials" });
            }
        } else {
            res.status(400).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Products API ---
app.get('/api/products', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { name, price, description, image, category } = req.body;
        const sql = "INSERT INTO products (name, price, description, image, category) VALUES ($1, $2, $3, $4, $5) RETURNING id";
        const result = await db.query(sql, [name, price, description, image, category]);
        res.json({ message: "Product added successfully!", id: result.rows[0].id });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- Orders API ---
app.get('/api/orders', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM orders");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { name, phone, address, total } = req.body;
        const sql = "INSERT INTO orders (customer_name, phone_number, address, total_price) VALUES ($1, $2, $3, $4)";
        await db.query(sql, [name, phone, address, total]);
        res.json({ message: "Order placed successfully!" });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// --- Contact API ---
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const sql = "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)";
        await db.query(sql, [name, email, message]);
        res.json({ message: "Message Sent Successfully!" });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/api/messages', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM contacts ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- Reviews API ---
app.post('/api/reviews', async (req, res) => {
    try {
        const { product_id, user_name, comment, parent_id } = req.body;
        const sql = "INSERT INTO reviews (product_id, user_name, comment, parent_id) VALUES ($1, $2, $3, $4)";
        await db.query(sql, [product_id, user_name, comment, parent_id]);
        res.json({ message: "Review posted!" });
    } catch (err) {
        res.json(err);
    }
});

app.get('/api/reviews/:product_id', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC", [req.params.product_id]);
        res.json(result.rows);
    } catch (err) {
        res.json(err);
    }
});

// --- Update & Delete APIs ---
app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, price, description, image } = req.body;
        const sql = "UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5";
        await db.query(sql, [name, price, description, image, req.params.id]);
        res.json({ message: "Product updated successfully!" });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM products WHERE id = $1", [req.params.id]);
        res.json({ message: "Product deleted successfully!" });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.put('/api/contacts/:id/read', async (req, res) => {
    try {
        await db.query("UPDATE contacts SET is_read = TRUE WHERE id = $1", [req.params.id]);
        res.json({ message: "Message marked as read!" });
    } catch (err) {
        res.status(500).json(err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));