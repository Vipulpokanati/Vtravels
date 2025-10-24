import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username:'', email:'', password:''
    })
    const[ message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange =(e)=>{
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        
        try {
            await axios.post('https://travels-nkfu.onrender.com/api/register/', form);
            setMessage('Registration successful! Redirecting...')
            setTimeout(() => navigate('/login'), 2000)
        } catch (error) {
            setMessage("Registration failed: " + (error.response?.data?.username || error.message))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-3 sm:py-12 sm:px-4">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                        <p className="text-gray-600 text-sm sm:text-base">Join us for your next journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input 
                                type="text" 
                                name='username' 
                                value={form.username} 
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
                                placeholder="Choose a username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input 
                                type="email" 
                                name='email' 
                                value={form.email} 
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input 
                                type="password" 
                                name='password' 
                                value={form.password} 
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
                                placeholder="Create a password"
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-center font-medium text-sm sm:text-base ${
                                message.includes('successful') 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                                {message}
                            </div>
                        )}

                        <button 
                            type='submit'
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <div className="text-center pt-2 sm:pt-4">
                            <p className="text-gray-600 text-sm sm:text-base">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-4 sm:mt-6">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
