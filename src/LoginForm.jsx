import React, {useState} from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const LoginForm = ({onLogin}) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username:'', password:''
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
            const response = await axios.post('https://travels-nkfu.onrender.com/api/login/', form)
            setMessage('Login Successful')
            
            if(onLogin){
                onLogin(response.data.token, response.data.user_id)
                navigate('/')
            }
            
        } catch (error) {
            setMessage("Login Failed - Please check your credentials")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-3 sm:py-12 sm:px-4">
            <div className="max-w-md w-full mx-4">
                {/* Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 text-sm sm:text-base">Sign in to your account</p>
                    </div>

                    {/* Form */}
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
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                <span className="ml-2 text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`p-3 rounded-lg text-center font-medium text-sm sm:text-base ${
                                message.includes('Successful') 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                                {message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type='submit'
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-4 sm:my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 text-xs sm:text-sm">New to our platform?</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        <Link to="/register" className="block">
                            <button 
                                type="button"
                                className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
                            >
                                Create New Account
                            </button>
                        </Link>
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

                {/* Demo Credentials Hint */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-yellow-700 text-xs">
                        💡 Demo: Use any credentials to test the login
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginForm