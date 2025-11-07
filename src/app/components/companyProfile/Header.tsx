import React from 'react'

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div>
            <div className="font-semibold">Company</div>
            <div className="text-sm font-semibold text-gray-600">VNG</div>
          </div>
        </div>
        <button className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition">
          + Đăng việc làm
        </button>
      </div>
    </header>
  );
}
