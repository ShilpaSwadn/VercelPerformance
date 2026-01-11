'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiUser, FiLock, FiLogIn, FiCopy, FiDownload } from 'react-icons/fi'
import { ImSpinner2 } from 'react-icons/im'

export default function LoginTest() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generateMessage, setGenerateMessage] = useState('')
  const [userCount, setUserCount] = useState(100)
  const [totalUsers, setTotalUsers] = useState(0)

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      // Try to fetch from API with cache busting
      const response = await fetch(`/api/admin/users?limit=50&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      })
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        setUsers(data.data)
        setTotalUsers(data.total || data.data.length)
      } else {
        setUsers([])
        setTotalUsers(0)
      }
    } catch (apiError) {
      console.log('API fetch failed:', apiError)
      setUsers([])
      setTotalUsers(0)
    } finally {
      setLoadingUsers(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const generateUsers = async (countToGenerate) => {
    try {
      const count = countToGenerate || userCount
      setGenerating(true)
      setGenerateMessage('')
      const response = await fetch('/api/admin/generate-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count }),
      })
      const data = await response.json()
      if (data.success) {
        setGenerateMessage(`✅ Successfully generated ${data.data.count} users`)
        // Refresh the user list
        await fetchUsers()
      } else {
        setGenerateMessage(`❌ Error: ${data.message}`)
      }
    } catch (err) {
      setGenerateMessage(`❌ Error: ${err.message}`)
    } finally {
      setGenerating(false)
      setTimeout(() => setGenerateMessage(''), 5000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId.trim(),
          password: password,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed')
      }

      // Cookie is set automatically by the server (httpOnly, so not readable by JS)
      // If login was successful, the cookie is set and will be sent with future requests
      setSuccess('Login successful! You have been authenticated.')
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (user) => {
    setUserId(user.userId)
    setPassword(user.password)
    setError('')
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Test Login Page
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Login with user ID and password. JWT token will be set in cookies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiLogIn className="w-5 h-5 mr-2" />
              Login Form
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  {success}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={userId}
                    onChange={(e) => {
                      setUserId(e.target.value)
                      setError('')
                      setSuccess('')
                    }}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="user0001"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                      setSuccess('')
                    }}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="pwd0001"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !userId || !password}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <ImSpinner2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  Test Users
                  <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full">
                    {totalUsers} Total
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={userCount}
                  onChange={(e) => setUserCount(parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="100"
                />
                <button
                  onClick={() => window.open('/api/admin/export-users', '_blank')}
                  className="px-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  title="Export all users to CSV for JMeter"
                >
                  <FiDownload className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => generateUsers()}
                  disabled={generating || userCount <= 0}
                  className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                  title={`Generate ${userCount} test users`}
                >
                  {generating ? 'Generating...' : 'Generate Users'}
                </button>
              </div>
            </div>
            {generateMessage && (
              <div className={`mb-4 p-2 rounded text-sm ${generateMessage.includes('✅')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                {generateMessage}
              </div>
            )}

            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <ImSpinner2 className="animate-spin h-6 w-6 text-indigo-600" />
              </div>
            ) : (
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Password
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            No data in database
                          </td>
                        </tr>
                      ) : (
                        users.slice(0, 5).map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                              {user.userId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                              {user.password}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <button
                                onClick={() => fillCredentials(user)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mr-3"
                                title="Fill form"
                              >
                                Use
                              </button>
                              <button
                                onClick={() => copyToClipboard(`${user.userId}\t${user.password}`)}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                title="Copy credentials"
                              >
                                <FiCopy className="w-4 h-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}