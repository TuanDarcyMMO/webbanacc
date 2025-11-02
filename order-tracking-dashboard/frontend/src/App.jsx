import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderForm from './pages/OrderForm';
import AdminDashboard from './pages/AdminDashboard';
import './styles.css';

export default function App(){
  return (
    <div className="container">
      <header>
        <h1>Order Tracking Demo</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/admin">Admin</a>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<OrderForm/>}/>
          <Route path="/admin" element={<AdminDashboard/>}/>
        </Routes>
      </main>
    </div>
  );
}
