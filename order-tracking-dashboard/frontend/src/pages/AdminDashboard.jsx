import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../socket';
import { BASE_URL } from '../api';

export default function AdminDashboard(){
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    socket.on('newOrder', (order) => {
      // append and re-fetch to ensure sort
      fetchOrders();
    });
    socket.on('updateOrder', (order) => {
      fetchOrders();
    });
    return () => {
      socket.off('newOrder');
      socket.off('updateOrder');
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${BASE_URL}/orders/${id}`, { status });
      // server emits updateOrder, so we will receive it via socket
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-card">
      <h2>Admin Dashboard</h2>
      {loading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Item</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td className="mono">{o._id}</td>
                <td>{o.name}</td>
                <td>{o.item}</td>
                <td>{o.status}</td>
                <td>
                  <button onClick={()=>updateStatus(o._id,'Đang xử lý')}>Đang xử lý</button>
                  <button onClick={()=>updateStatus(o._id,'Đang giao')}>Đang giao</button>
                  <button onClick={()=>updateStatus(o._id,'Hoàn tất')}>Hoàn tất</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
