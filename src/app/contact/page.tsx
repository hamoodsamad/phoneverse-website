'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Contact PhoneVerse Support</h1>
        <p className="text-sm text-gray-400">
          Have an inquiry regarding smartphone listings, merchant price discrepancies, or order support?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 glass-panel p-6 rounded-3xl border border-gray-800 space-y-6 text-xs text-gray-300">
          <h2 className="text-base font-bold text-white">Support Channels</h2>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Email Inquiries</div>
              <div className="text-gray-400">support@phoneverse.com</div>
              <div className="text-gray-400">orders@phoneverse.com</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Helpline & WhatsApp Support</div>
              <div className="text-gray-400">+92 (051) 889-2026 (Mon-Sat 9AM-8PM PKT)</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Headquarters</div>
              <div className="text-gray-400">PhoneVerse Technology Towers, Blue Area, Islamabad, Pakistan</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Message Dispatched Successfully</h3>
              <p className="text-xs text-gray-400">Our Islamabad customer service team will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Mehmood"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="asad@example.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Price inquiry for Galaxy S25 Ultra"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your query or message..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-glow"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
