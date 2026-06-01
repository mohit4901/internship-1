import React, { useEffect, useState } from 'react';
import { getCmsContent } from '../services/cms.service';
import { submitContact } from '../services/contact.service';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Sparkles, Building2 } from 'lucide-react';

const DEFAULT_CMS = {
  title: 'Get in Touch',
  subtitle: 'Have questions about BAIO registrations, exam centers, or results? Our helpdesk is here to assist you.',
  email: 'support@bharataiolympiad.org',
  phone: '+91 88000 99000',
  address: 'Bharat AI Foundation, Sector 62, Electronic City, Noida, Uttar Pradesh - 201301',
  hours: 'Monday to Saturday, 9:00 AM to 6:00 PM IST',
};

export default function ContactPage() {
  const [cms, setCms] = useState(DEFAULT_CMS);
  const [loadingCms, setLoadingCms] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    role: 'Student',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' }); // 'success' | 'error' | null

  useEffect(() => {
    (async () => {
      try {
        const res = await getCmsContent('contact');
        const v = res?.data?.data?.value || res?.data?.value;
        if (v) setCms({ ...DEFAULT_CMS, ...v });
      } catch {
        // Fall back gracefully to DEFAULT_CMS
      } finally {
        setLoadingCms(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await submitContact(formData);
      setSubmitStatus({
        type: 'success',
        message: 'Your message has been received! Our support representative will reach out to you within 24 hours.',
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        role: 'Student',
        message: '',
      });
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to submit contact form. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(222,47%,7%)] text-slate-100 pb-24">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[hsl(222,47%,9%)] to-[hsl(222,47%,7%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Support Desk
          </div>
          {loadingCms ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-12 bg-white/5 rounded-2xl max-w-lg mx-auto" />
              <div className="h-6 bg-white/5 rounded-lg max-w-xl mx-auto" />
            </div>
          ) : (
            <>
              <h1 className="font-heading font-extrabold text-5xl md:text-6xl text-white leading-tight mb-6">
                {cms.title}
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {cms.subtitle}
              </p>
            </>
          )}
        </div>
      </section>

      {/* ── Main Layout Grid ── */}
      <section className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column: Contact Channels ── */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Email Support Card */}
            <div className="relative group rounded-2xl p-6 bg-white/3 border border-white/6 hover:border-brand-orange/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand-orange" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email Support</h3>
                  {loadingCms ? (
                    <div className="h-5 w-40 bg-white/5 rounded animate-pulse mt-1" />
                  ) : (
                    <a href={`mailto:${cms.email}`} className="text-base font-bold text-white hover:text-brand-orange transition-colors">
                      {cms.email}
                    </a>
                  )}
                  <p className="text-xs text-slate-400">Response expected within 1 business day.</p>
                </div>
              </div>
            </div>

            {/* Helpline Card */}
            <div className="relative group rounded-2xl p-6 bg-white/3 border border-white/6 hover:border-brand-green/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand-green" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Helpline Numbers</h3>
                  {loadingCms ? (
                    <div className="h-5 w-32 bg-white/5 rounded animate-pulse mt-1" />
                  ) : (
                    <a href={`tel:${cms.phone}`} className="text-base font-bold text-white hover:text-brand-green transition-colors">
                      {cms.phone}
                    </a>
                  )}
                  <p className="text-xs text-slate-400">Toll-free student & school queries.</p>
                </div>
              </div>
            </div>

            {/* Head Office Card */}
            <div className="relative group rounded-2xl p-6 bg-white/3 border border-white/6 hover:border-slate-700 transition-all duration-300 overflow-hidden">
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider font-semibold">National Head Office</h3>
                  {loadingCms ? (
                    <div className="space-y-2 animate-pulse mt-1">
                      <div className="h-4 w-48 bg-white/5 rounded" />
                      <div className="h-4 w-36 bg-white/5 rounded" />
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-slate-200 leading-relaxed">
                      {cms.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="relative group rounded-2xl p-6 bg-white/3 border border-white/6 hover:border-slate-700 transition-all duration-300 overflow-hidden">
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Helpdesk Timings</h3>
                  {loadingCms ? (
                    <div className="h-4 w-40 bg-white/5 rounded animate-pulse mt-1" />
                  ) : (
                    <p className="text-sm font-medium text-slate-200">
                      {cms.hours}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">Excluding National & Gazette Holidays.</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Column: Interactive Form ── */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl p-8 bg-slate-900/60 border border-white/6 shadow-2xl relative overflow-hidden">
              
              {/* Corner Glowing Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                    <Building2 className="w-4 h-4 text-brand-orange" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Send a Message</h2>
                </div>

                {submitStatus.type && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 mb-6 border ${
                    submitStatus.type === 'success' 
                      ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {submitStatus.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm font-medium">{submitStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="text-xs font-semibold text-slate-400 block mb-1.5">
                        Full Name <span className="text-brand-orange">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="text-xs font-semibold text-slate-400 block mb-1.5">
                        Email Address <span className="text-brand-orange">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="e.g. aarav@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="role" className="text-xs font-semibold text-slate-400 block mb-1.5">
                        I am a...
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-brand-orange/50 transition-all"
                      >
                        <option value="Student">Student</option>
                        <option value="Parent">Parent</option>
                        <option value="Teacher/Educator">Teacher or Educator</option>
                        <option value="School Coordinator">School Representative</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="text-xs font-semibold text-slate-400 block mb-1.5">
                        Query Subject <span className="text-brand-orange">*</span>
                      </label>
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        required
                        placeholder="e.g. Registration Payment Query"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Your Message <span className="text-brand-orange">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Please write details of your query here..."
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-brand-orange to-amber-600 hover:from-amber-500 hover:to-brand-orange text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Support Ticket</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
