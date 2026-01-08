import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/redux'
import { setCredentials, setError } from '@/features/auth/authSlice'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Mock authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user' as const,
      }
      
      const mockToken = 'mock-jwt-token'
      const mockRefreshToken = 'mock-refresh-token'
      
      dispatch(setCredentials({
        user: mockUser,
        token: mockToken,
        refreshToken: mockRefreshToken,
      }))
      
      navigate('/dashboard')
    } catch (error) {
      dispatch(setError('Invalid credentials'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-primary">VibeClip AI</h2>
            <p className="text-base-content/70 mt-2">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="divider">OR</div>
          
          <div className="text-center">
            <p className="text-sm text-base-content/70">
              Don't have an account?{' '}
              <Link to="/register" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}