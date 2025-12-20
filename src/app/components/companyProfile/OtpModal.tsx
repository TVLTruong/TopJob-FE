'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

type OtpModalProps = {
  open: boolean
  title?: string
  message?: string
  onClose: () => void
  onVerify: (code: string) => Promise<boolean> | boolean
  resendLabel?: string
  submitLabel?: string
  secondsBeforeResend?: number
}

export default function OtpModal({
  open,
  title = 'Xác thực OTP',
  message = 'Nhập mã OTP đã được gửi đến liên hệ của bạn.',
  onClose,
  onVerify,
  resendLabel = 'Gửi lại mã',
  submitLabel = 'Xác nhận',
  secondsBeforeResend = 60
}: OtpModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [resendCountdown, setResendCountdown] = useState<number>(secondsBeforeResend)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!open) return
    setCode('')
    setError('')
    setSubmitting(false)
    setResendCountdown(secondsBeforeResend)
  }, [open, secondsBeforeResend])

  useEffect(() => {
    if (!open) return
    if (resendCountdown <= 0) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    intervalRef.current = window.setInterval(() => {
      setResendCountdown((s) => s - 1)
    }, 1000)
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [open, resendCountdown])

  const canResend = useMemo(() => resendCountdown <= 0, [resendCountdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!code || code.length < 6) {
      setError('Vui lòng nhập đầy đủ 6 ký tự OTP')
      return
    }
    setSubmitting(true)
    try {
      const ok = await onVerify(code)
      if (!ok) {
        setError('Mã OTP không hợp lệ. Vui lòng thử lại.')
        setSubmitting(false)
        return
      }
      onClose()
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = () => {
    if (!canResend) return
    setResendCountdown(secondsBeforeResend)
    // No-op for now (mock). In real app, trigger resend API here.
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="border-b border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mã OTP (6 ký tự)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, '').slice(0, 6)
                setCode(next)
                if (error) setError('')
              }}
              className={`w-full rounded-lg border px-4 py-2.5 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
              placeholder="Nhập mã OTP"
            />
            <p className="mt-1 min-h-[20px] text-xs text-red-500">{error}</p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Hủy
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={`rounded-lg px-4 py-2.5 ${canResend ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 cursor-not-allowed'}`}
                aria-disabled={!canResend}
                title={canResend ? '' : `Vui lòng chờ ${resendCountdown}s`}
              >
                {canResend ? resendLabel : `${resendLabel} (${resendCountdown}s)`}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}


