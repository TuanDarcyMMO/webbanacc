require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Order = require('./models/Order');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
});

// Get orders (sorted by createdAt asc)
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create order
app.post('/orders', async (req, res) => {
  try {
    const { name, item } = req.body;
    const order = new Order({ name, item });
    await order.save();
    io.emit('newOrder', order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
app.patch('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit('updateOrder', order);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
