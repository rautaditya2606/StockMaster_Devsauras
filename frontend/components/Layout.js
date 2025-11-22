'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Products', href: '/products' },
    { name: 'Receipts', href: '/receipts' },
    { name: 'Deliveries', href: '/deliveries' },
    { name: 'Transfers', href: '/transfers' },
    { name: 'Adjustments', href: '/adjustments' },
  ];

  const [navigation, setNavigation] = useState(baseNavigation);

  useEffect(() => {
    if (user) {
      const newNav = [...baseNavigation];
      if (user.role === 'MANAGER') {
        newNav.push({ name: 'Tasks', href: '/tasks' });
      }
      if (user.role === 'WAREHOUSE_STAFF') {
        newNav.push({ name: 'My Tasks', href: '/my-tasks' });
      }
      setNavigation(newNav);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">StockMaster</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <span className="text-sm text-gray-700 mr-4">
                  {user.name} ({user.role})
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

