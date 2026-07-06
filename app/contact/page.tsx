"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, MessageSquare, Send, Loader2, Check, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Simulate send
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-xs text-gray-400 hover:text-indigo-600 mb-4 inline-block">&larr; Back to home</Link>
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-2 text-gray-500">Have a question, feedback, or need help? We&apos;d love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {sent ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-8 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Message Sent!</h2>
                <p className="text-sm text-gray-500 mb-4">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }} className="text-sm text-indigo-600 hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                  <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Tell us more..." />
                </div>
                <button type="submit" disabled={sending}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 rounded-lg px-5 py-2.5 hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-900">Email</h3>
              </div>
              <p className="text-sm text-gray-500">support@coxmos.io</p>
              <p className="text-sm text-gray-500">hello@coxmos.io</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-900">Chat</h3>
              </div>
              <p className="text-sm text-gray-500">Join our Discord community for real-time help.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-900">Response Time</h3>
              </div>
              <p className="text-sm text-gray-500">We typically respond within 24 hours on weekdays.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-900">Location</h3>
              </div>
              <p className="text-sm text-gray-500">Lagos, Nigeria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
