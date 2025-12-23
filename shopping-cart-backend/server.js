const express = require('express');
const MySQL = require('MySQL2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
// Kết nối với MySQL
const db = MySQL.createConnection({
host: 'localhost',
user: 'root', // thay ‘user’ cho ‘root’
password: 'Nthao@1209', // Thay password bằng mật khẩu MySQL của bạn
database: 'shopping_cart2'
});
db.connect((err) => {
if (err) throw err;
console.log('Connected to MySQL');
});
// API để lấy sản phẩm trong giỏ hàng
app.get('/api/cart', (req, res) => {
db.query('SELECT * FROM cart_items', (err, results) => {
if (err) throw err;
res.json(results);
});
});
// API để thêm sản phẩm vào giỏ hàng
app.post('/api/cart', (req, res) => {
const { name, price, quantity } = req.body;
const query = 'INSERT INTO cart_items (name, price, quantity) VALUES (?, ?,?)';

db.query(query, [name, price, quantity], (err, result) => {
if (err) throw err;
res.json({
id: result.insertId,
name,
price,
quantity
});
});
});
// Xoá sản phẩm theo id
app.delete('/api/cart/:id', (req, res) => {
const { id } = req.params;
const query = 'DELETE FROM cart_items WHERE id = ?';
db.query(query, [id], (err, result) => {
if (err) throw err;
res.json({ message: 'Xoá sản phẩm thành công' });
});
});
// Cập nhật sản phẩm
app.put('/api/cart/:id', (req, res) => {
const { id } = req.params;
const { name, price, quantity } = req.body;
const query = `
UPDATE cart_items
SET name = ?, price = ?, quantity = ?
WHERE id = ?
`;
db.query(query, [name, price, quantity, id], (err) => {
if (err) throw err;
res.json({
id,
name,
price,
quantity
});
});
});
// Chạy server tại port 5000 nếu lỗi xung đột cổng có thể đổi thành công khác
// có thể đổi thành 5001 hoặc 5002
app.listen(5000, () => {
console.log('Server is running on port 5000');
});