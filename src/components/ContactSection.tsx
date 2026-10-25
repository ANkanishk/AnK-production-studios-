import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2, Calendar, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 3:00 PM GMT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      sound.playClick();
      return;
    }

    sound.playSweep();
    setTimeout(() => {
      sound.playChime();
      setIsSent(true);
    }, 400);
  };

  const scheduleTimes = [
    'Tomorrow, 3:00 PM GMT',
    'Thursday, 11:00 AM GMT',
    'Friday, 4:30 PM GMT',
    'Next Monday, 2:00 PM GMT',
  ];

  return (
    <section id="contact" className="py-28 bg-[#FAFAFC] relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Studio Information & Calendar Demo (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 tracking-widest uppercase mb-3">
                <span>Direct Dialogue</span>
                <span aria-hidden="true" className="text-slate-300">/</span>
                <span>Get In Touch</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                LET&apos;S CREATE TOGETHER.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                Whether you have an ambitious spatial design challenge, want to reinvent your brand identity, or seek a full-scale WebGL experience, we are ready.
              </p>

              {/* Direct Studio Channels */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">General Studio Inquiries</span>
                    <a
                      href="mailto:contact@ankcreativemind.studio"
                      className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
                    >
                      contact@ankcreativemind.studio
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <MapPin className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">Global Presence</span>
                    <span className="text-sm font-semibold text-slate-800">
                      London · New York · Tokyo
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">Studio Working Hours</span>
                    <span className="text-sm font-semibold text-slate-800">
                      Mon – Fri, 09:00 – 19:00 (UTC)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 15-Min Virtual Intro Booking Simulator */}
            <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-100">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-indigo-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Instant Studio Intro Session</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Select an open studio slot for a direct creative discovery call:
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {scheduleTimes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedDate(t);
                    }}
                    className={`p-2 text-[11px] rounded-xl font-medium border text-center transition-all ${
                      selectedDate === t
                        ? 'bg-indigo-600 text-white font-semibold border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-400 font-mono text-right">
                Slot Reserved: {selectedDate}
              </div>
            </div>
          </div>

          {/* Right Column: Functional Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col justify-center">
            {isSent ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  Message Transmitted!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{formData.name}</strong>. In production, this notifies our executive creative director. (Frontend demonstration mode).
                </p>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsSent(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-6 py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Liam Sterling"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="liam@domain.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                    Subject / Project Interest
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. 3D Web Rebrand for Spatial Computing Product"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project vision, timeline, or key objectives..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Frontend Demo Mode
                  </span>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3.5 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-full shadow-md transition-all active:scale-95"
                  >
                    <span>Transmit Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
