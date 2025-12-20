"use client"
import { useState, useEffect } from 'react'
import ConfirmModal from './ConfirmModal'
import { Users, Globe, Edit } from 'lucide-react'
import CompanyBasicInfoForm, { CompanyBasicInfo } from './CompanyBasicInfoForm'

const locationOptions = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai']

export default function CompanyHeader() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [formData, setFormData] = useState<CompanyBasicInfo>({
    companyName: 'VNG',
    website: 'https://www.vng.com.vn',
    locations: ['Hồ Chí Minh'],
    fields: ['Công nghệ thông tin', 'Trò chơi'],
    province: 'Hồ Chí Minh',
    district: 'Phường Bến Nghé',
    streetAddress: '182 Lê Đại Hành, Phường 15',
    foundingDay: '15',
    foundingMonth: 'July',
    foundingYear: '2004',
    technologies: ['HTML 5', 'CSS 3', 'Javascript'],
    description: 'VNG là công ty công nghệ hàng đầu Việt Nam, chuyên phát triển các sản phẩm và dịch vụ về trò chơi trực tuyến, điện toán đám mây, thanh toán điện tử và mạng xã hội. Được thành lập từ năm 2004, VNG đã khẳng định vị thế của mình trong ngành công nghiệp game và công nghệ.'
  })

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useEffect(() => {
    // Calculate scrollbar width once
    const measureScrollbarWidth = () => {
      const scrollDiv = document.createElement('div')
      scrollDiv.style.width = '100px'
      scrollDiv.style.height = '100px'
      scrollDiv.style.overflow = 'scroll'
      scrollDiv.style.position = 'absolute'
      scrollDiv.style.top = '-9999px'
      document.body.appendChild(scrollDiv)
      const width = scrollDiv.offsetWidth - scrollDiv.clientWidth
      document.body.removeChild(scrollDiv)
      return width
    }
    setScrollbarWidth(measureScrollbarWidth())
  }, [])

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden'
      // prevent layout shift when hiding scrollbar
      if (scrollbarWidth > 0) {
        const currentPadding = parseInt(getComputedStyle(document.body).paddingRight || '0', 10)
        document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
      }
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
    }
  }, [isPopupOpen, scrollbarWidth])

  return (
    <>
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
                    <div className="text-xs text-gray-500">Lĩnh vực</div>
                    <div className="font-semibold">Trò chơi, Điện toán đám mây</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsPopupOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      {/* Popup Overlay */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b bg-white flex-shrink-0">
              <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">
              <p className="text-sm text-gray-500 mb-6">
                Đây là thông tin công ty mà bạn có thể cập nhật bất cứ lúc nào.
              </p>
              <CompanyBasicInfoForm value={formData} onChange={setFormData} />
            </div>

            {/* Footer - Fixed */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={isPopupOpen && showConfirmModal}
        title="Xác nhận lưu thay đổi"
        message="Bạn có chắc muốn lưu các thay đổi vừa chỉnh sửa không?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false)
          setShowSuccessModal(true)
        }}
      />
      {/* Success Modal */}
      {isPopupOpen && showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-teal-700">Lưu thành công</h3>
            </div>
            <div className="p-6 text-sm text-gray-600">
              Thay đổi của bạn đã được lưu thành công.
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  setIsPopupOpen(false)
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}