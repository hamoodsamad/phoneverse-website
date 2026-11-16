import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
      <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
        <FileText className="w-4 h-4" /> Legal Agreements
      </div>
      <h1 className="text-3xl font-black text-white">Terms & Conditions</h1>
      <p className="text-xs text-gray-400">Effective Date: January 1, 2026</p>

      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Platform Scope & Purpose</h2>
          <p>
            PhoneVerse operates as a smartphone discovery, AI hardware comparison, price monitoring, and electronic commerce service with primary emphasis on the Pakistani market (PKR currency).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. PTA Approval & Warranty Terms</h2>
          <p>
            Smartphones labeled &quot;PTA Approved&quot; comply with Pakistan Telecommunication Authority DIRBS verification standards. Devices marked &quot;Non-PTA&quot; or &quot;International&quot; are subject to applicable import taxes upon local SIM insertion in Pakistan.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Price Accuracy & E-Commerce Orders</h2>
          <p>
            Retail prices and stock availability are updated periodically. Orders placed through our direct commerce portal are fulfilled with official Pakistani brand warranties. Cash on Delivery (COD) transactions require phone confirmation before dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Intellectual Property & AI Assessments</h2>
          <p>
            Brand trademarks (Apple, Samsung, Xiaomi, etc.) belong to their respective proprietors. AI-generated evaluations represent algorithmic assessments based on verified technical specifications and should not replace professional technical counsel.
          </p>
        </section>
      </div>
    </div>
  );
}
