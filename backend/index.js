const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
// require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306
});

const app = express();
app.use(cors());
app.use(express.json());



// Connection စစ်ဆေးခြင်း
db.getConnection((err, connection) => {
    if (err) console.error("DB Error:", err);
    else {
        console.log("Connected to elite-shop Database!");
        connection.release();
    }
});

// --- Register API ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // သင့် table ထဲက column နာမည်များ (id, username, email, password) အတိုင်း သိမ်းဆည်းခြင်း
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: "Registration failed: " + err.message });
            res.status(201).json({ message: "User Registered Successfully!" });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Login API ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Login အောင်မြင်လျှင် user data ပို့ပေးခြင်း
                res.json({ message: "Login Success", user: { id: user.id, name: user.username } });
            } else {
                res.status(400).json({ message: "Invalid Credentials" });
            }
        } else {
            res.status(400).json({ message: "User not found" });
        }
    });
});







app.get('/api/products', (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


// ပစ္စည်းအသစ်ထည့်ရန် API
app.post('/api/products', (req, res) => {
    const { name, price, description, image,category } = req.body;
    const sql = "INSERT INTO products (name, price, description, image,category) VALUES (?, ?, ?, ?,?)";
    
    db.query(sql, [name, price, description, image,category], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product added successfully!", id: result.insertId });
    });
});

// Product တစ်ခုချင်းစီရဲ့ details ကို ID နဲ့ ရှာပေးတဲ့ API
app.get('/api/products/:id', (req, res) => {
    // URL က id ကို ယူတာပါ (ဥပမာ: /api/products/1)
    const productId = req.params.id; 
    
    // products table ထဲမှာ id က productId နဲ့ တူတာကို ရှာခိုင်းတဲ့ SQL syntax ပါ
    const sql = `SELECT * FROM products WHERE id = ${productId}`; // ? နေရာမှာ တိုက်ရိုက်အစားထိုးလိုက်တယ်
    
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Database connection error or query failed:", err); // console မှာ error ပြအောင် လုပ်ထားတယ်
            return res.status(500).json({ error: "Server Database Error", details: err });
        }
        
        // Database ထဲမှာ data ရှိမရှိ စစ်မယ်
        if (data.length > 0) {
            console.log("Product found:", data[0].name); // Product နာမည်ကို backend terminal မှာ ပြမယ်
            return res.json(data[0]); // ရှာတွေ့တဲ့ data ကို frontend ဆီ ပို့ပေးမယ်
        } else {
            console.log("No product found with ID:", productId); // ရှာမတွေ့ရင် backend terminal မှာ ပြမယ်
            return res.status(404).json({ message: "Product not found" });
        }
    });
});

// Database ထဲက order အားလုံးကို ပြန်ယူတဲ့ route
app.get('/api/orders', (req, res) => {
    const sql = "SELECT * FROM orders"; // နင့် database table နာမည် orders ဖြစ်ရမယ်
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// ပစ္စည်းပြန်ဖျက်ရန် API
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM products WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product deleted successfully!" });
    });
});

// backend/index.js ထဲမှာ ထည့်ရန်
app.post('/api/orders', (req, res) => {
    const { name, phone, address, total } = req.body;
    const sql = "INSERT INTO orders (customer_name, phone_number, address, total_price) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [name, phone, address, total], (err, result) => {
        if (err) return res.json({ error: err });
        return res.json({ message: "Order placed successfully!" });
    });
});

// User ဆီက Message ကို Database ထဲ သိမ်းဖို့
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [name, email, message], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Message Sent Successfully!" });
    });
});

// Admin Page မှာ ပြန်ပြဖို့ Message တွေ အကုန်ယူမယ်
app.get('/api/messages', (req, res) => {
    const sql = "SELECT * FROM contacts ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// ပစ္စည်းအချက်အလက် ပြင်ဆင်ရန် API (Update)
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, description, image } = req.body;
  const sql = "UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?";

  db.query(sql, [name, price, description, image, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product updated successfully!" });
  });
});

// Order Status ကို ပြောင်းပေးမည့် API
app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Delivered' သို့မဟုတ် 'Pending' ပို့ပေးရမယ်
  const sql = "UPDATE orders SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Order status updated successfully!" });
  });
});

// ၁။ Message ကို ဖတ်ပြီးသားအဖြစ် ပြောင်းရန် (Update)
app.put('/api/contacts/:id/read', (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE contacts SET is_read = 1 WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Message marked as read!" });
    });
});

// ၂။ Message ကို ဖျက်ရန် (Delete)
app.delete('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM contacts WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Message deleted!" });
    });
});

// reviews sections
app.post('/api/reviews', (req, res) => {
    const { product_id, user_name, comment, parent_id } = req.body;
    const sql = "INSERT INTO reviews (product_id, user_name, comment, parent_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [product_id, user_name, comment, parent_id], (err, result) => {
        if (err) return res.json(err);
        return res.json({ message: "Review posted!" });
    });
});

app.get('/api/reviews/:product_id', (req, res) => {
    const sql = "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC";
    db.query(sql, [req.params.product_id], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Database ထဲက review အားလုံးကို ဆွဲထုတ်တဲ့ API
app.get('/api/all-reviews', (req, res) => {
    const sql = "SELECT * FROM reviews ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// server.js ထဲမှာ ဒါလေး ရှိရမယ်
app.delete('/api/reviews/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM reviews WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Review deleted successfully" });
    });
});


app.listen(5000, () => console.log("Server running on port 3000"));