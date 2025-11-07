import React from 'react'
import { Users, Globe, Edit, Eye } from 'lucide-react'

export default function CompanyHeader() {
  return (
    <div className="bg-white rounded-xl p-8 mb-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
          <div>
            <h1 className="text-3xl font-bold mb-2">VNG</h1>
            <a href="https://www.vng.com.vn" className="text-teal-600 text-sm hover:underline mb-4 block">
              https://www.vng.com.vn
            </a>
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <div>
                  <div className="text-xs text-gray-500">Thành lập</div>
                  <div className="font-semibold">2004</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-600" />
                <div>
                  <div className="text-xs text-gray-500">Ngành nghề:</div>
                  <div className="font-semibold">Trò chơi, Điện toán đám mây</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-sm">
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}
