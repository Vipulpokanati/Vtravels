import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', form);
      setMessage('Login Successful ✅');
      if (onLogin) {
        onLogin(response.data.token, response.data.user_id);
        navigate('/');
      }
    } catch (error) {
      setMessage('Login Failed ❌');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>
        <label className="block mb-2 text-gray-600">Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <label className="block mb-2 text-gray-600">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
        <Link to="/register">
          <p className="text-center mt-3 text-blue-500 hover:underline">New User? Register</p>
        </Link>
        {message && <p className="text-center mt-4 text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
