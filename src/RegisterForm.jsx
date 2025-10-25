import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register/', form);
      setMessage('Registration successful ✅');
      navigate('/login');
    } catch (error) {
      setMessage('Registration failed ❌');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Register</h2>
        {['username', 'email', 'password'].map(field => (
          <div key={field} className="mb-4">
            <label className="block mb-2 text-gray-600 capitalize">{field}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Register
        </button>
        {message && <p className="text-center mt-4 text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;

