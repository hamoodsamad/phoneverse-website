import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
        <Shield className="w-4 h-4" /> Legal & Privacy
      </div>
      <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
      <p className="text-xs text-gray-400">Effective Date: January 1, 2026</p>

      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
          <p>
            When you browse PhoneVerse, configure smartphone comparisons, or place an order, we may collect your email address, name, shipping address, and phone number for delivery confirmation within Pakistan.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Use of AI and Analytics</h2>
          <p>
            Our AI recommendation engine processes user questionnaire parameters (budget, usage preferences) to generate hardware recommendations. We do not sell your personal telemetry or search history to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Third-Party Merchants & Price Tracking</h2>
          <p>
            PhoneVerse displays price intelligence across Pakistani merchants (such as PriceOye, Daraz Mall, and official brand outlets). External links redirect to respective merchant stores, which have separate privacy policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Data Security</h2>
          <p>
            User credentials and session tokens are encrypted using industry standard hashing algorithms (bcrypt/JWT). We strictly adhere to best security practices for database protection and HTTPS transport encryption.
          </p>
        </section>
      </div>
    </div>
  );
}
