"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function DevToolbar() {
  const { user, mockEmployer, mockCandidate, mockAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // ⚠️ CHỈ HIỆN Ở DEV MODE
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-all"
        >
          🛠️ Dev Tools
        </button>
      ) : (
        <div className="bg-white border-2 border-purple-600 rounded-lg shadow-2xl p-4 min-w-[280px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">🛠️ Dev Toolbar</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mb-3 p-2 bg-gray-100 rounded text-sm">
            <div className="font-semibold text-gray-700">Current User:</div>
            <div className="text-gray-600">
              {user ? (
                <>
                  <div>Role: <span className="font-bold">{user.role}</span></div>
                  <div>Email: {user.email}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {user.sub}</div>
                </>
              ) : (
                <span className="text-red-500">Not logged in</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={mockEmployer}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              👔 Mock as EMPLOYER
            </button>
            
            <button
              onClick={mockCandidate}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              👤 Mock as CANDIDATE
            </button>

            <button
              onClick={mockAdmin}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              🛡️ Mock as ADMIN
            </button>

            {user && (
              <button
                onClick={logout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all font-medium"
              >
                🚪 Logout
              </button>
            )}
          </div>

          <div className="mt-3 text-xs text-gray-500 text-center">
            ⚠️ Development Only
          </div>
        </div>
      )}
    </div>
  );
}
