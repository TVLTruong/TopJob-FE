'use client';
import React from 'react';

export default function Contact() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Liên hệ</h2>
      <div className="space-y-3">
        <a
          href="https://twitter.com/vngcorporation"
          className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600">🐦</span>
          </div>
          <span className="text-sm">twitter.com/vngcorporation</span>
        </a>

        <a
          href="https://facebook.com/VNGCorporation"
          className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold">f</span>
          </div>
          <span className="text-sm">facebook.com/VNGCorporation</span>
        </a>

        <a
          href="https://linkedin.com/company/vng"
          className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold">in</span>
          </div>
          <span className="text-sm">linkedin.com/company/vng</span>
        </a>
      </div>
    </div>
  );
}
