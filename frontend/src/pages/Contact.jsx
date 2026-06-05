import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import api from '../services/api';

const contactTypes = [
  { icon: '🏫', label: 'School Registration', desc: 'Learn how to register your school for BAIO 2026-27' },
  { icon: '📋', label: 'Olympiad Details', desc: 'Questions about the exam format, syllabus, or dates' },
  { icon: '🤝', label: 'Partnership & Chains', desc: 'Group registration for multi-campus school groups' },
  { icon: '📊', label: 'AI Readiness Report', desc: 'Queries about your school\'s existing BAIO report' },
  { icon: '🎖️', label: 'Results & Certificates', desc: 'Questions about results, rankings, or certificate delivery' },
  { icon: '📢', label: 'Media & Press', desc: 'Press enquiries and partnership opportunities' },
];

const INITIAL_FORM = { name: '', email: '', phone: '', organization: '', message: '', type: '' };

export default function ContactPage() {
  const [form, setForm]     = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true); setError('');
    try {
      await api.post('/contact', form);
      setSuccess(true);
    } catch {
      setError('Failed to send message. Please try again or email us directly at hello@baio.in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen selection:bg-brand-orange selection:text-white pb-1">

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 px-6 text-center">
        
        {/* Floating Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-brand-orange/10 floating-slow-y" />
          <div className="absolute top-1/3 right-12 w-12 h-12 rounded-full bg-brand-green/10 floating-slow-x" />
          <div className="absolute top-10 right-1/4 text-brand-orange/20 floating-rotate">
            <Sparkles className="w-10 h-10" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="brand-badge brand-badge-orange">
            Support Desk
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.1]">
            We respond in <br />
            <span className="text-brand-orange">2 business hours.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Have questions about registrations, scheduling, syllabus guidelines, or results? Our team is standing by to help.
          </p>
        </div>
      </section>

      {/* ─── CONTACT SELECTION SECTION ────────────────────────────── */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-2xl font-extrabold text-brand-navy text-center">What is the nature of your inquiry?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactTypes.map((t, idx) => (
              <button
                key={idx}
                onClick={() => set('type', t.label)}
                className={`w-full text-left p-6 border-4 rounded-3xl transition-all duration-200 cursor-pointer ${
                  form.type === t.label
                    ? 'border-brand-orange bg-white shadow edu-shadow-orange'
                    : 'border-brand-navy bg-white hover:-translate-y-1 hover:shadow edu-shadow'
                }`}
              >
                <span className="text-3xl block mb-2">{t.icon}</span>
                <h3 className="font-extrabold text-brand-navy text-sm">{t.label}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FORM & INFO SECTION ──────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-t-2 border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact info column */}
          <div className="lg:col-span-5 bg-brand-cream border-4 border-brand-navy rounded-3xl p-8 edu-shadow space-y-8 h-fit">
            <h2 className="text-2xl font-extrabold text-brand-navy">Get in Touch</h2>
            <div className="space-y-6">
              {[
                { icon: <Mail className="w-5 h-5 text-brand-orange" />, label: 'General Help', value: 'hello@baio.in' },
                { icon: <Mail className="w-5 h-5 text-brand-green" />, label: 'School Onboarding', value: 'schools@baio.in' },
                { icon: <Phone className="w-5 h-5 text-brand-navy" />, label: 'Helpdesk Call', value: '+91 (000) 000-0000' },
                { icon: <MapPin className="w-5 h-5 text-brand-orange" />, label: 'Location Desk', value: 'Delhi NCR Region, India' },
                { icon: <Clock className="w-5 h-5 text-brand-green" />, label: 'Response Target', value: 'Under 2 Business Hours' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-150 flex items-center justify-center shrink-0 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{item.label}</span>
                    <span className="text-sm font-bold text-brand-navy mt-0.5 block">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider">Quick registration?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you are ready to onboard your school, skip this form and go straight to our{' '}
                <a href="/register" className="text-brand-orange font-bold hover:underline">online registration</a>{' '}
                — it takes less than 2 minutes and requires no payment.
              </p>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7 bg-brand-cream border-4 border-brand-navy rounded-3xl p-8 edu-shadow">
            {success ? (
              <div className="text-center space-y-4 py-16">
                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto border-2 border-brand-green">
                  <CheckCircle2 className="w-8 h-8 text-brand-green" />
                </div>
                <h3 className="text-3xl font-extrabold text-brand-navy">Message Sent!</h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                  We have received your ticket. A BAIO coordinator will reply to you at <span className="font-bold text-brand-navy">{form.email}</span> within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Your Name', field: 'name', placeholder: 'Coordinator / Principal name', type: 'text', required: true },
                    { label: 'Email Address', field: 'email', placeholder: 'yourname@school.edu.in', type: 'email', required: true },
                    { label: 'Phone Number', field: 'phone', placeholder: '+91 99999 99999', type: 'tel', required: false },
                    { label: 'School / Institution', field: 'organization', placeholder: 'Full school name', type: 'text', required: false },
                  ].map((field) => (
                    <div key={field.field} className="space-y-2">
                      <label className="text-sm font-bold text-brand-navy">
                        {field.label} {field.required && <span className="text-brand-orange">*</span>}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.field]}
                        onChange={(e) => set(field.field, e.target.value)}
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-navy placeholder:text-slate-300 font-medium"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-navy">
                    Message Body <span className="text-brand-orange">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Provide details about your query here..."
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-navy placeholder:text-slate-300 resize-none font-medium"
                  />
                </div>

                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 justify-center text-sm font-extrabold shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? 'Sending Request...' : 'Submit Contact Inquiry'}
                </button>

                <p className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  🔒 Guaranteed response under 2 business hours.
                </p>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
