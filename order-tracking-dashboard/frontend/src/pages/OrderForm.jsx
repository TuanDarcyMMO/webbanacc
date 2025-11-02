import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';
import { BASE_URL } from '../api';

export default function OrderForm(){
  const [name, setName] = useState('');
  const [item, setItem] = useState('');
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState(null);
  const [position, setPosition] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/orders`, { name, item });
      setOrder(res.data);
      setMessage('Đặt hàng thành công ✅');
    } catch (err) {
      setMessage('Lỗi khi đặt hàng');
    }
  };

  useEffect(() => {
    // When an update occurs, fetch position if we have an order
    const handleUpdate = (data) => {
      if (!order) return;
      if (data._id === order._id) {
        setOrder(data);
      }
      // recalc position
      fetchPosition();
    };
    socket.on('newOrder', fetchPosition);
    socket.on('updateOrder', handleUpdate);
    return () => {
      socket.off('newOrder', fetchPosition);
      socket.off('updateOrder', handleUpdate);
    };
  }, [order]);

  const fetchPosition = async () => {
    if (!order) return;
    try {
      const res = await axios.get(`${BASE_URL}/orders`);
      const orders = res.data;
      // position = index (0-based) + 1 among orders sorted by createdAt asc
      const idx = orders.findIndex(o => o._id === order._id);
      setPosition(idx >= 0 ? idx + 1 : null);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    // fetch initial position after placing order
    if (order) fetchPosition();
  }, [order]);

  return (
    <div className="form-card">
      <h2>Đặt hàng</h2>
      <form onSubmit={submit}>
        <input placeholder="Tên" value={name} onChange={e=>setName(e.target.value)} required/>
        <input placeholder="Sản phẩm" value={item} onChange={e=>setItem(e.target.value)} required/>
        <button type="submit">Đặt hàng</button>
      </form>
      <p>{message}</p>
      {order && (
        <div className="order-box">
          <h3>Chi tiết đơn</h3>
          <p><strong>ID:</strong> {order._id}</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>
          <p><strong>Vị trí trong hàng:</strong> {position ?? 'Đang tính...'}</p>
        </div>
      )}
    </div>
  );
}
