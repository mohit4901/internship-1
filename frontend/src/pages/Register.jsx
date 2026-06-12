import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Building2, Sparkles } from 'lucide-react';
import { schoolRegister } from '../services/auth.service';

const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];
const STATES = [
  'Andhra Pradesh', 'Delhi', 'Gujarat', 'Haryana', 'Karnataka', 'Maharashtra',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other',
];

const steps = ['School Details', 'Coordinator Info', 'Review & Submit'];

const INITIAL = {
  name: '', affiliationNumber: '', board: '', principalName: '',
  address: { street: '', city: '', state: '', zip: '', country: 'India' },
  contactEmail: '', contactPhone: '',
  coordinator: { name: '', phone: '', email: '' },
};

function Field({ label, required, children, hint }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-brand-navy">
        {label} {required && <span className="text-brand-orange">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-500 font-medium">{hint}</p>}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-brand-navy placeholder:text-slate-300 font-semibold"
    />
  );
}

function Select({ options, placeholder, ...props }) {
  return (
    <select
      {...props}
      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-brand-navy font-semibold appearance-none"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function RegisterPage() {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const setAddr = (field, value) => setForm((f) => ({ ...f, address: { ...f.address, [field]: value } }));
  const setCoord = (field, value) => setForm((f) => ({ ...f, coordinator: { ...f.coordinator, [field]: value } }));

  const validate = () => {
    if (step === 0) {
      if (!form.name.trim()) return 'School name is required.';
      if (!form.affiliationNumber.trim()) return 'Affiliation number is required.';
      if (!form.board) return 'Please select a board.';
      if (!form.contactEmail.trim()) return 'Contact email is required.';
      if (!form.contactPhone.trim()) return 'Contact phone is required.';
      if (!form.address.city.trim()) return 'City is required.';
      if (!form.address.state) return 'State is required.';
      if (!form.address.zip.trim()) return 'ZIP code is required.';
    }
    if (step === 1) {
      if (!form.coordinator.name.trim()) return 'Coordinator name is required.';
      if (!form.coordinator.phone.trim()) return 'Coordinator phone is required.';
      if (!form.coordinator.email.trim()) return 'Coordinator email is required.';
    }
    return '';
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => s + 1);
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await schoolRegister(form);
      setSuccess(true);
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-6 selection:bg-brand-orange selection:text-white py-12">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border-4 border-brand-navy p-8 md:p-12 edu-shadow text-center space-y-6">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto border-2 border-brand-green">
            <CheckCircle2 className="w-8 h-8 text-brand-green" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-navy">
            Registration Submitted!
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Thank you for registering <span className="font-bold text-brand-navy">{form.name}</span> for BAIO 2026-27. A dedicated BAIO coordinator will contact you at <span className="font-bold text-brand-navy">{form.contactEmail}</span> within 24 hours to organize details.
          </p>
          <div className="bg-brand-cream border-2 border-slate-200 rounded-2xl p-5 space-y-2 text-left">
            <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">Next steps:</h4>
            {[
              'Dedicated School Coordinator assigned',
              'Complete brochures and guide materials dispatched',
              'Select preferred test date calendar options',
              'No payments required until details are finalized',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen selection:bg-brand-orange selection:text-white pb-1">

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 px-6 text-center">
        
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
            <Building2 className="w-3.5 h-3.5" /> Registration
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.1]">
            Start your school's <br />
            <span className="text-brand-orange">AI journey today.</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
            Takes 2 minutes. No upfront payments. A dedicated coordinator is assigned within 24 hours.
          </p>
        </div>
      </section>

      {/* ─── STEP PROGRESS INDICATOR ──────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-2">
          {steps.map((label, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  idx < step ? 'bg-brand-green text-white' : idx === step ? 'bg-brand-orange text-white' : 'bg-white border border-slate-300 text-slate-400'
                }`}>
                  {idx < step ? '✓' : idx + 1}
                </div>
                <span className={`text-xs font-bold hidden sm:block ${idx === step ? 'text-brand-navy' : 'text-slate-400'}`}>
                  {label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 transition-all duration-500 rounded ${idx < step ? 'bg-brand-green' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ─── FORM CONTAINER ───────────────────────────────────────── */}
      <section className="pb-16 px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border-4 border-brand-navy p-8 edu-shadow">
          
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <div className="space-y-6">
            
            {/* Step 0 - School Details */}
            {step === 0 && (
              <>
                <h2 className="text-2xl font-extrabold text-brand-navy border-b-2 border-slate-100 pb-2">School Information</h2>
                
                <Field label="School Name" required>
                  <Input placeholder="e.g. Apeejay School, Noida" value={form.name}
                    onChange={(e) => set('name', e.target.value)} />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Affiliation Number" required hint="CBSE, ICSE or State board code">
                    <Input placeholder="e.g. 2130015" value={form.affiliationNumber}
                      onChange={(e) => set('affiliationNumber', e.target.value)} />
                  </Field>
                  <Field label="Board" required>
                    <Select options={BOARDS} placeholder="Select Board" value={form.board}
                      onChange={(e) => set('board', e.target.value)} />
                  </Field>
                </div>

                <Field label="Principal's Name">
                  <Input placeholder="e.g. Dr. Sangeeta Arya" value={form.principalName}
                    onChange={(e) => set('principalName', e.target.value)} />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="School Email Address" required>
                    <Input type="email" placeholder="office@school.edu.in" value={form.contactEmail}
                      onChange={(e) => set('contactEmail', e.target.value)} />
                  </Field>
                  <Field label="School Contact Phone" required>
                    <Input type="tel" placeholder="+91 99999 99999" value={form.contactPhone}
                      onChange={(e) => set('contactPhone', e.target.value)} />
                  </Field>
                </div>

                <div className="border-t-2 border-slate-100 pt-4 space-y-4">
                  <h3 className="font-extrabold text-brand-navy text-sm">School Address Details</h3>
                  <Field label="Street / Locality">
                    <Input placeholder="Sector, Street name" value={form.address.street}
                      onChange={(e) => setAddr('street', e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="City" required>
                      <Input placeholder="Noida" value={form.address.city}
                        onChange={(e) => setAddr('city', e.target.value)} />
                    </Field>
                    <Field label="State" required>
                      <Select options={STATES} placeholder="State" value={form.address.state}
                        onChange={(e) => setAddr('state', e.target.value)} />
                    </Field>
                    <Field label="ZIP Code" required>
                      <Input placeholder="201301" value={form.address.zip}
                        onChange={(e) => setAddr('zip', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </>
            )}

            {/* Step 1 - Coordinator Info */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-extrabold text-brand-navy border-b-2 border-slate-100 pb-2">School Coordinator</h2>
                <p className="text-slate-500 text-xs leading-relaxed">
                  The primary contact person inside the school for coordinating schedules, study booklet deliveries, exam booklets, and diagnostic results.
                </p>

                <Field label="Coordinator Name" required>
                  <Input placeholder="Ms. Priya Sharma" value={form.coordinator.name}
                    onChange={(e) => setCoord('name', e.target.value)} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Coordinator Phone" required>
                    <Input type="tel" placeholder="+91 98765 43210" value={form.coordinator.phone}
                      onChange={(e) => setCoord('phone', e.target.value)} />
                  </Field>
                  <Field label="Coordinator Email" required>
                    <Input type="email" placeholder="coordinator@school.edu.in" value={form.coordinator.email}
                      onChange={(e) => setCoord('email', e.target.value)} />
                  </Field>
                </div>
              </>
            )}

            {/* Step 2 - Review & Submit */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-extrabold text-brand-navy border-b-2 border-slate-100 pb-2">Review & Submit</h2>
                <div className="bg-brand-cream border-2 border-slate-200 rounded-2xl p-6 space-y-4 text-xs font-semibold text-slate-800">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">School Info</h4>
                    <p><span className="text-slate-400">Name:</span> {form.name}</p>
                    <p><span className="text-slate-400">Affiliation:</span> {form.affiliationNumber}</p>
                    <p><span className="text-slate-400">Board:</span> {form.board}</p>
                    {form.principalName && <p><span className="text-slate-400">Principal:</span> {form.principalName}</p>}
                    <p><span className="text-slate-400">Email:</span> {form.contactEmail}</p>
                    <p><span className="text-slate-400">Phone:</span> {form.contactPhone}</p>
                    <p><span className="text-slate-400">City:</span> {form.address.city}, {form.address.state} — {form.address.zip}</p>
                  </div>
                  
                  <div className="border-t-2 border-slate-100 pt-4">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Coordinator Info</h4>
                    <p><span className="text-slate-400">Name:</span> {form.coordinator.name}</p>
                    <p><span className="text-slate-400">Phone:</span> {form.coordinator.phone}</p>
                    <p><span className="text-slate-400">Email:</span> {form.coordinator.email}</p>
                  </div>
                </div>

                <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed font-semibold">
                  ⚡ Registration represents a spot reservation. All fee schedules and final confirmations will be finalized in coordination with your assigned BAIO contact person. No fees are due at submission.
                </div>
              </>
            )}

          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-slate-100">
            {step > 0 ? (
              <button
                onClick={() => { setStep((s) => s - 1); setError(''); }}
                className="px-6 py-3 border-2 border-brand-navy bg-white text-brand-navy hover:bg-slate-50 transition-colors font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Back
              </button>
            ) : <div />}

            {step < steps.length - 1 ? (
              <button
                onClick={next}
                className="btn-primary py-3 px-6 shadow-md hover:scale-102 text-xs"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={loading}
                className="btn-primary py-3 px-6 shadow-md hover:scale-102 text-xs disabled:opacity-60"
              >
                {loading ? 'Submitting Registration...' : 'Register My School'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>

        </div>
      </section>

      {/* ─── PROCESS BENTO GRID ───────────────────────────────────── */}
      <section className="py-16 bg-white border-t-2 border-slate-100">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <h2 className="text-2xl font-extrabold text-brand-navy text-center">
            Onboarding Timeline
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '24 hrs', desc: 'Dedicated coordinator assigned to school.' },
              { step: 'Day 2', desc: 'Sample papers & guidebooks shared.' },
              { step: 'Day 5', desc: 'Preferred test schedule locked.' },
              { step: 'Day 10', desc: 'Diagnostic results & certificates delivered.' },
            ].map((s, idx) => (
              <div key={idx} className="bg-brand-cream border-2 border-brand-navy rounded-3xl p-5 space-y-2 text-center edu-shadow">
                <p className="font-extrabold text-brand-orange text-sm uppercase tracking-wider">{s.step}</p>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
