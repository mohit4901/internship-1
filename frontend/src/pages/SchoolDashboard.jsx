import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Users, CheckCircle2, Clock, Bell, PlusCircle,
  LogOut, ChevronRight, Trophy, Upload, Eye, GraduationCap, Award,
  FileSpreadsheet, TrendingUp, BarChart3, FileText, CheckSquare, Square, Search, Download, RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';
import CurriculumModal from '../components/CurriculumModal';
import { 
  getParticipants, 
  addParticipants, 
  getSchoolMe,
  getSchoolResults,
  uploadParticipantsFile
} from '../services/auth.service';
import logoImg from '../assets/logo.jpg';

/* ── Brand Logo (matching Navbar/Footer) ── */
function BAIOLogo({ className = '' }) {
  return (
    <img 
      src={logoImg} 
      alt="BAIO Logo" 
      className={`${className} object-contain mix-blend-multiply`} 
    />
  );
}

export default function SchoolDashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activeCurriculumStage, setActiveCurriculumStage] = useState(null);
  const [school,       setSchool]       = useState(null);
  const [participants, setParticipants] = useState([]);
  const [pLoading,     setPLoading]     = useState(true);
  const [tab,          setTab]          = useState('overview');
  const [batchText,    setBatchText]    = useState('');
  const [batchError,   setBatchError]   = useState('');
  const [batchSuccess, setBatchSuccess] = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  // New States
  const [analytics,    setAnalytics]    = useState(null);
  const [aLoading,     setALoading]     = useState(false);
  const [file,         setFile]         = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [uploadError,  setUploadError]  = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Filters for analytics student table
  const [searchFilter, setSearchFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const refreshAllData = async () => {
    setPLoading(true);
    setALoading(true);
    try {
      const meRes = await getSchoolMe();
      setSchool(meRes.data?.data || user);
      
      const pRes = await getParticipants();
      setParticipants(pRes.data?.data?.participants || []);
      
      const aRes = await getSchoolResults();
      setAnalytics(aRes.data?.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setPLoading(false);
      setALoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) { navigate('/school/login'); return; }
    refreshAllData();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleBatchSubmit = async () => {
    setBatchError(''); setBatchSuccess('');
    let rows;
    try {
      rows = JSON.parse(batchText);
      if (!Array.isArray(rows)) throw new Error();
    } catch {
      setBatchError('Please enter a valid JSON array. Example: [{"name":"Priya","class":"7","section":"A"}]');
      return;
    }
    setSubmitting(true);
    try {
      const res = await addParticipants({ participants: rows });
      setBatchSuccess(`${res.data?.data?.added || rows.length} participant(s) added successfully.`);
      setBatchText('');
      refreshAllData();
    } catch (err) {
      setBatchError(err?.message || 'Failed to add participants. Please check the data and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await uploadParticipantsFile(formData);
      const data = res.data?.data;
      setUploadSuccess(`Imported ${data?.added || 0} student(s) successfully from ${data?.totalParsed || 0} records parsed.`);
      setFile(null);
      // Reset input element
      const fileInput = document.getElementById('student-file-input');
      if (fileInput) fileInput.value = '';
      refreshAllData();
    } catch (err) {
      setUploadError(err?.message || 'Failed to upload and parse file. Please verify formatting.');
    } finally {
      setUploading(false);
    }
  };

  const downloadExcelTemplate = () => {
    const templateData = [
      { "Student Name": "Rahul Kumar", "Class/Grade": "6", "Section": "A", "Roll No": "12", "Gender": "Male" },
      { "Student Name": "Anya Singh", "Class/Grade": "7", "Section": "B", "Roll No": "45", "Gender": "Female" },
      { "Student Name": "Zaid Khan", "Class/Grade": "8", "Section": "C", "Roll No": "33", "Gender": "Male" }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "BAIO_Student_Upload_Template.xlsx");
  };

  const exportStudentResultsExcel = (studentsToExport) => {
    const formatted = studentsToExport.map(s => ({
      "Roll Number": s.result?.rollNumber || "N/A",
      "Student Name": s.name,
      "Class/Grade": s.class,
      "Section": s.section || "—",
      "Gender": s.gender || "—",
      "Logical Reasoning": s.result?.scores?.logicalReasoning ?? "N/A",
      "Algorithmic Thinking": s.result?.scores?.algorithmicThinking ?? "N/A",
      "AI Core": s.result?.scores?.aiCore ?? "N/A",
      "Total Marks Obtained": s.result?.scores?.totalMarksObtained ?? "N/A",
      "Maximum Marks": s.result?.totalMaxMarks ?? "N/A",
      "Percentage": s.result?.percentage !== undefined ? `${s.result.percentage}%` : "N/A",
      "National Percentile": s.result?.percentile !== undefined ? `${s.result.percentile}%` : "N/A",
      "National Rank": s.result?.rankings?.national ?? "N/A",
      "State Rank": s.result?.rankings?.state ?? "N/A",
      "School Rank": s.result?.rankings?.school ?? "N/A",
      "Status": s.result?.qualificationStatus || "Registered"
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Results");
    XLSX.writeFile(wb, `${school?.name || 'School'}_Student_Results.xlsx`);
  };

  const exportClassStatsExcel = (statsObj) => {
    const data = Object.keys(statsObj).map(cls => ({
      "Class": `Class ${cls}`,
      "Total Registered": statsObj[cls].total,
      "Appeared": statsObj[cls].appeared,
      "Average Marks": statsObj[cls].average,
      "Highest Mark": statsObj[cls].highest,
      "Lowest Mark": statsObj[cls].lowest
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Class Stats");
    XLSX.writeFile(wb, `${school?.name || 'School'}_Class_Stats.xlsx`);
  };

  const exportSectionStatsExcel = (sectionsList) => {
    const data = sectionsList.map(sec => ({
      "Class": `Class ${sec.class}`,
      "Section": sec.section,
      "Appeared": sec.appeared,
      "Average Marks": sec.average,
      "Highest Mark": sec.highest,
      "Lowest Mark": sec.lowest
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Section Stats");
    XLSX.writeFile(wb, `${school?.name || 'School'}_Section_Stats.xlsx`);
  };

  const handleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleSelectAllFiltered = (filteredList) => {
    const allFilteredIds = filteredList.map(s => s._id);
    const hasAllSelected = allFilteredIds.every(id => selectedStudents.includes(id));
    if (hasAllSelected) {
      setSelectedStudents(selectedStudents.filter(id => !allFilteredIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedStudents, ...allFilteredIds]));
      setSelectedStudents(merged);
    }
  };

  const schoolData = school || user || {};
  const isVerified = schoolData?.isVerified;

  return (
    <div className="min-h-screen bg-brand-cream pb-12 selection:bg-brand-orange selection:text-white">

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 border-b-4 border-brand-navy px-6 py-4 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <BAIOLogo className="h-8 md:h-9 w-auto" />
            <span className="text-slate-400 text-xs font-semibold ml-2 pl-2 border-l border-slate-200">School Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-brand-navy">
                {schoolData?.name || 'Your School'}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Affiliation: {schoolData?.affiliationNumber || '—'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 border-2 border-slate-200 hover:border-red-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-bold bg-white shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Verification banner */}
        {!isVerified && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl px-6 py-5 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-amber-900 uppercase tracking-wide">Account Pending Verification</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed font-semibold">
                Your school registration is under review by the BAIO team. A dedicated coordinator will reach out
                within 24 hours. You'll be able to submit participant details once verified.
              </p>
            </div>
          </div>
        )}

        {isVerified && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl px-6 py-5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-emerald-900 uppercase tracking-wide">School Account Verified</p>
              <p className="text-xs text-emerald-700 mt-1 font-semibold leading-relaxed">
                Your school is fully verified and enrolled in BAIO 2026-27. You can now submit student registration batches.
              </p>
            </div>
          </div>
        )}

        {/* School stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <Building2 className="w-5 h-5 text-brand-orange" />, label: 'Board Affiliation', value: schoolData?.board || '—', bg: 'bg-orange-50', border: 'border-brand-navy' },
            { icon: <Users className="w-5 h-5 text-brand-green" />, label: 'Participants', value: schoolData?.registeredStudentsCount ?? participants.length, bg: 'bg-brand-cream', border: 'border-brand-navy' },
            { icon: <CheckCircle2 className="w-5 h-5 text-brand-navy" />, label: 'Portal Status', value: isVerified ? 'Verified' : 'Pending', bg: 'bg-indigo-50', border: 'border-brand-navy' },
            { icon: <Trophy className="w-5 h-5 text-brand-orange" />, label: 'BAIO Season', value: '2026-27', bg: 'bg-amber-50', border: 'border-brand-navy' },
          ].map((card, i) => (
            <div key={i} className={`bg-white border-4 ${card.border} rounded-3xl p-5 space-y-4 edu-shadow`}>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center border-2 border-brand-navy`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">{card.label}</p>
                <p className="font-heading font-black text-[#001F5E] text-2xl mt-1">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b-2 border-slate-200 pb-2.5">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'participants', label: 'Participants List' },
            { id: 'submit', label: 'Submit Students' },
            { id: 'analytics', label: 'Reports & Analytics' },
          ].map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-brand-orange text-white shadow-sm shadow-orange-500/20' 
                    : 'text-slate-600 hover:text-brand-navy hover:bg-white/60'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ─── TAB CONTENT CONTENTS ────────────────────────────────── */}
        
        {/* Overview tab */}
        {tab === 'overview' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* School details */}
              <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 space-y-4 lg:col-span-7 edu-shadow">
                <h2 className="font-heading font-extrabold text-brand-navy text-lg border-b-2 border-slate-100 pb-3">School Registry Information</h2>
                <div className="space-y-3.5 text-xs font-semibold text-slate-800">
                  {[
                    { label: 'School Registry Name', value: schoolData?.name },
                    { label: 'CBSE / Board Affiliation', value: schoolData?.affiliationNumber },
                    { label: 'Affiliated Board Type', value: schoolData?.board },
                    { label: 'School Principal Name', value: schoolData?.principalName || '—' },
                    { label: 'City Location', value: `${schoolData?.address?.city || ''}, ${schoolData?.address?.state || ''}` },
                    { label: 'Contact Registry Email', value: schoolData?.contactEmail },
                    { label: 'Contact Phone Number', value: schoolData?.contactPhone },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                      <span className="text-slate-400 font-bold">{row.label}</span>
                      <span className="text-brand-navy font-extrabold text-right max-w-[60%]">{row.value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="space-y-6 lg:col-span-5">
                <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 space-y-4 edu-shadow">
                  <h2 className="font-heading font-extrabold text-brand-navy text-lg border-b-2 border-slate-100 pb-3">Quick Actions</h2>
                  {[
                    { icon: <Upload className="w-4 h-4" />, label: 'Submit Student List', desc: 'Upload Excel/PDF or Paste JSON list', action: () => setTab('submit'), disabled: !isVerified },
                    { icon: <Eye className="w-4 h-4" />, label: 'View Participants List', desc: 'See all submitted student entries', action: () => setTab('participants'), disabled: false },
                    { icon: <BarChart3 className="w-4 h-4" />, label: 'Performance Analytics', desc: 'View level-wise reports & download Excel', action: () => setTab('analytics'), disabled: false },
                    { icon: <Bell className="w-4 h-4" />, label: 'Announcements Board', desc: 'Check dates & updates', action: () => navigate('/announcements'), disabled: false },
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={action.action}
                      disabled={action.disabled}
                      className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all border-2 border-transparent cursor-pointer ${
                        action.disabled
                          ? 'opacity-40 cursor-not-allowed bg-slate-50'
                          : 'hover:border-brand-navy/15 hover:bg-slate-50 border-slate-100/40 bg-white shadow-sm'
                      }`}
                    >
                      <div className="w-9 h-9 bg-brand-cream border border-slate-200 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-brand-navy">
                        {action.icon}
                      </div>
                      <div>
                        <p className="text-xs font-black text-brand-navy">{action.label}</p>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{action.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto mt-1 shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="bg-orange-50 border-2 border-brand-orange/20 rounded-3xl p-5 space-y-2">
                  <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Need Support?</p>
                  <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                    Your dedicated BAIO coordinator is available for any coordination support. Email us at{' '}
                    <a href="mailto:schools@baio.in" className="text-brand-orange font-bold hover:underline">schools@baio.in</a>{' '}
                    and we'll get back to you within 2 business hours.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Curriculum Cards Section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-8 space-y-6"
            >
              <h2 className="font-heading font-extrabold text-brand-navy text-xl">BAIO 2026-27 Curriculum & Syllabus</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Preparatory Stage */}
                <div className="bg-[#FFB040] text-[#001F5E] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-[220px] shadow-sm">
                  <div className="space-y-2 max-w-[75%]">
                    <h3 className="text-lg font-extrabold text-[#001F5E]">Preparatory Stage — Grades 3, 4 & 5</h3>
                    <p className="text-[10px] text-[#001F5E]/90 font-bold">
                      TOTAL: 35 Questions · 40 Marks · 60 Minutes
                    </p>
                    <p className="text-[10px] text-slate-850 leading-relaxed font-semibold">
                      Section A: 10 Marks | Section B: 10 Marks | Section C: 10 Marks | Section D (Innovation Arena): 10 Marks
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setActiveCurriculumStage('preparatory')}
                      className="inline-flex items-center gap-1.5 bg-[#001F5E] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:bg-[#002880] transition-colors cursor-pointer"
                    >
                      View Preparatory Curriculum <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute right-4 bottom-4 w-16 h-16 opacity-15 text-[#001F5E]">
                    <GraduationCap className="w-full h-full" />
                  </div>
                </div>

                {/* Card 2: Middle Stage */}
                <div className="bg-[#FF8C00] text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-[220px] shadow-sm">
                  <div className="space-y-2 max-w-[75%]">
                    <h3 className="text-lg font-extrabold text-white">Middle Stage — Grades 6, 7 & 8</h3>
                    <p className="text-[10px] text-slate-100 font-bold">
                      TOTAL: 45 Questions · 50 Marks · 60 Minutes
                    </p>
                    <p className="text-[10px] text-slate-100/95 leading-relaxed font-semibold">
                      Section A: 15 Marks | Section B: 15 Marks | Section C: 10 Marks | Section D (Innovation Arena): 10 Marks
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setActiveCurriculumStage('middle')}
                      className="inline-flex items-center gap-1.5 bg-white text-brand-orange text-xs font-bold px-4 py-2 rounded-full shadow-md hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      View Middle Stage Curriculum <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute right-4 bottom-4 w-16 h-16 opacity-15 text-white">
                    <Award className="w-full h-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Participants tab */}
        {tab === 'participants' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {pLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-white rounded-2xl animate-pulse border border-slate-200" />)}
              </div>
            ) : participants.length === 0 ? (
              <div className="bg-white border-4 border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-5">
                <div className="w-14 h-14 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-slate-700 text-lg">No participants submitted yet.</h3>
                  <p className="text-slate-400 text-xs font-semibold">
                    {isVerified ? 'Use the "Submit Students" tab to upload your school\'s participant list.' : 'Your school account must be verified before submitting participant lists.'}
                  </p>
                </div>
                {isVerified && (
                  <button 
                    onClick={() => setTab('submit')} 
                    className="btn-primary py-2.5 px-5 shadow-sm text-xs cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Submit Students
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white border-4 border-brand-navy rounded-3xl overflow-hidden edu-shadow">
                <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-white">
                  <div>
                    <h2 className="font-heading font-extrabold text-brand-navy text-base">Registered Participants ({participants.length})</h2>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">List of students registered for Bharat AI Olympiad.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => exportStudentResultsExcel(participants)}
                      className="flex items-center gap-1.5 text-xs text-brand-green font-extrabold border-2 border-brand-green/20 px-3.5 py-2 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer bg-white"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Export List to Excel
                    </button>
                    {isVerified && (
                      <button 
                        onClick={() => setTab('submit')} 
                        className="flex items-center gap-1.5 text-xs text-brand-orange font-extrabold border-2 border-brand-orange/20 px-3.5 py-2 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer bg-white"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Register More Students
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-brand-cream border-b-2 border-slate-150">
                        {['Name', 'Class Level', 'Section', 'Roll No', 'Gender', 'Registration Code'].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-wider text-brand-navy">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, i) => (
                        <tr key={p._id || i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors font-semibold text-slate-800">
                          <td className="px-5 py-4 font-bold text-brand-navy">{p.name}</td>
                          <td className="px-5 py-4">Class {p.class}</td>
                          <td className="px-5 py-4 text-slate-500">{p.section || '—'}</td>
                          <td className="px-5 py-4 text-slate-500">{p.rollNo || '—'}</td>
                          <td className="px-5 py-4 text-slate-500">{p.gender || '—'}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${p.division === 'Junior' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                              {p.division || '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Submit tab */}
        {tab === 'submit' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {!isVerified ? (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 lg:col-span-12 space-y-2">
                <p className="text-sm font-extrabold text-amber-900 uppercase tracking-wide">Account Verification Required</p>
                <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                  You can submit participant registries only after your school account has been verified by the BAIO team.
                  A coordinator will reach out within 24 hours of registration.
                </p>
              </div>
            ) : (
              <>
                {/* Excel & PDF Document Upload Console */}
                <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 space-y-6 lg:col-span-7 edu-shadow">
                  <div>
                    <h2 className="font-heading font-extrabold text-brand-navy text-lg">Document Uploader</h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                      Upload your school's candidate spreadsheet (.xlsx, .xls, .csv) or student PDF list.
                      Our high-accuracy parsing algorithm matches columns and extracts student names, classes, sections, roll numbers, and genders automatically.
                    </p>
                  </div>

                  <form onSubmit={handleFileUpload} className="space-y-4">
                    <div className="border-4 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/55 transition-colors group relative">
                      <Upload className="w-10 h-10 text-slate-400 group-hover:text-brand-orange transition-colors mb-3" />
                      <span className="text-xs font-extrabold text-brand-navy">
                        {file ? file.name : "Drag & drop or click to upload file"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold mt-1">Supports XLSX, XLS, CSV or PDF (Max 10MB)</span>
                      <input
                        type="file"
                        id="student-file-input"
                        accept=".xlsx,.xls,.csv,.pdf"
                        onChange={(e) => {
                          setFile(e.target.files[0]);
                          setUploadError('');
                          setUploadSuccess('');
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>

                    {uploadError && <p className="text-red-600 text-xs font-bold">{uploadError}</p>}
                    {uploadSuccess && (
                      <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{uploadSuccess}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={uploading || !file}
                        className="btn-primary py-3 px-6 shadow-md disabled:opacity-50 text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        {uploading ? 'Parsing & Saving File...' : 'Upload Student Document'}
                        <Upload className="w-4 h-4" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={downloadExcelTemplate}
                        className="flex items-center gap-1.5 text-xs text-brand-green font-extrabold border-2 border-brand-green/20 px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors bg-white cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Download Excel Template
                      </button>
                    </div>
                  </form>

                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <h3 className="font-heading font-extrabold text-brand-navy text-sm">Or Paste JSON Data (Legacy Console)</h3>
                    <textarea
                      rows={4}
                      value={batchText}
                      onChange={(e) => setBatchText(e.target.value)}
                      placeholder='[{"name":"Student Name","class":"7","section":"A","rollNo":"101","gender":"Male"}]'
                      className="w-full font-mono text-xs border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 resize-y placeholder:text-slate-300 font-semibold"
                    />
                    
                    {batchError && <p className="text-red-600 text-xs font-bold">{batchError}</p>}
                    {batchSuccess && (
                      <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {batchSuccess}
                      </div>
                    )}
                    
                    <button
                      onClick={handleBatchSubmit}
                      disabled={submitting || !batchText.trim()}
                      className="btn-primary py-3 px-5 shadow-sm disabled:opacity-50 text-xs cursor-pointer"
                    >
                      {submitting ? 'Submitting JSON...' : 'Submit JSON Batch'}
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Templates Format Instructions & Guidelines */}
                <div className="bg-white border-4 border-brand-navy rounded-3xl p-6 space-y-5 lg:col-span-5 edu-shadow">
                  <h2 className="font-heading font-extrabold text-brand-navy text-lg border-b-2 border-slate-100 pb-3">Sheet Format & Style Guide</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-xs font-extrabold text-slate-800">Expected Column Headers:</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                        Your Excel / CSV columns should contain these headers (spelling is case-insensitive):
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-1">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="font-extrabold text-[#001F5E]">Student Name</span>
                          <p className="text-[9px] text-slate-400 mt-0.5">e.g. Priyanshu Roy</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="font-extrabold text-[#001F5E]">Class/Grade</span>
                          <p className="text-[9px] text-slate-400 mt-0.5">e.g. 6 to 12</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="font-extrabold text-[#001F5E]">Section</span>
                          <p className="text-[9px] text-slate-400 mt-0.5">e.g. A, B, C (Optional)</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="font-extrabold text-[#001F5E]">Roll No</span>
                          <p className="text-[9px] text-slate-400 mt-0.5">e.g. 21 (Optional)</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-2">
                          <span className="font-extrabold text-[#001F5E]">Gender</span>
                          <p className="text-[9px] text-slate-400 mt-0.5">e.g. Male, Female, Other (Optional)</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-slate-500 text-[10px] leading-relaxed font-semibold border-t border-slate-150 pt-3.5">
                      <p className="font-extrabold text-brand-navy text-[11px] mb-1">Important Submission Rules:</p>
                      <p>• <strong>Classes Supported:</strong> Grades 6 to 12 are allowed in the database.</p>
                      <p>• <strong>PDF Lists:</strong> Ensure text is copyable in the PDF. PDF parser extracts students by searching for structured row lines.</p>
                      <p>• <strong>Batch Limit:</strong> Supports up to 200 rows per file upload.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Reports & Analytics tab */}
        {tab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {aLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-slate-200" />)}
                </div>
                <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
              </div>
            ) : !analytics || analytics.overview?.totalRegistered === 0 ? (
              <div className="bg-white border-4 border-dashed border-slate-350 rounded-3xl p-12 text-center space-y-4">
                <div className="w-14 h-14 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-slate-700 text-lg">No Performance Reports Yet</h3>
                  <p className="text-slate-400 text-xs font-semibold max-w-md mx-auto leading-relaxed">
                    Performance metrics, class averages, and student scorecards are made available once the BAIO administrators publish the final results.
                  </p>
                </div>
                <button
                  onClick={refreshAllData}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-navy border-2 border-brand-navy px-4 py-2.5 rounded-full hover:bg-slate-50 transition-colors font-extrabold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
                </button>
              </div>
            ) : (
              <>
                {/* Metrics overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { icon: <Users className="w-5 h-5 text-[#001F5E]" />, label: 'Registered Candidates', value: analytics.overview.totalRegistered, bg: 'bg-indigo-50' },
                    { icon: <CheckCircle2 className="w-5 h-5 text-brand-orange" />, label: 'Appeared Candidates', value: analytics.overview.totalAppeared, bg: 'bg-orange-50' },
                    { icon: <TrendingUp className="w-5 h-5 text-brand-green" />, label: 'School Average Score', value: `${analytics.overview.averageScore} / 100`, bg: 'bg-emerald-50' },
                    { icon: <Trophy className="w-5 h-5 text-amber-500" />, label: 'Qualifiers Count', value: `${analytics.overview.qualifiedCount} (${analytics.overview.qualificationRate}%)`, bg: 'bg-amber-50' },
                  ].map((card, i) => (
                    <div key={i} className="bg-white border-4 border-brand-navy rounded-3xl p-5 space-y-3.5 edu-shadow">
                      <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center border-2 border-brand-navy`}>
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">{card.label}</p>
                        <p className="font-heading font-black text-[#001F5E] text-2xl mt-1">{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grade and Section Reports Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Grade Level Stats */}
                  <div className="bg-white border-4 border-brand-navy rounded-3xl overflow-hidden edu-shadow">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                      <div>
                        <h3 className="font-heading font-extrabold text-brand-navy text-sm">Grade / Class Level Reports</h3>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Average score and performance mapped per grade.</p>
                      </div>
                      <button
                        onClick={() => exportClassStatsExcel(analytics.classStats)}
                        className="flex items-center gap-1.5 text-[10px] text-brand-green font-extrabold border border-brand-green/20 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors bg-white cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Excel
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="bg-brand-cream border-b border-slate-150">
                            {['Class', 'Total Registered', 'Appeared', 'Avg Score', 'Highest', 'Lowest'].map(h => (
                              <th key={h} className="text-left px-4 py-2.5 text-[9px] font-black uppercase text-brand-navy">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(analytics.classStats).map(cls => {
                            const stat = analytics.classStats[cls];
                            return (
                              <tr key={cls} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 font-bold text-slate-700">
                                <td className="px-4 py-3 text-brand-navy font-extrabold">Class {cls}</td>
                                <td className="px-4 py-3">{stat.total}</td>
                                <td className="px-4 py-3">{stat.appeared}</td>
                                <td className="px-4 py-3 text-brand-orange">{stat.average}</td>
                                <td className="px-4 py-3 text-brand-green">{stat.highest}</td>
                                <td className="px-4 py-3 text-slate-400">{stat.lowest}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section Level Stats */}
                  <div className="bg-white border-4 border-brand-navy rounded-3xl overflow-hidden edu-shadow">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                      <div>
                        <h3 className="font-heading font-extrabold text-brand-navy text-sm">Section Level Reports</h3>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Average scores split by class sections.</p>
                      </div>
                      <button
                        onClick={() => exportSectionStatsExcel(analytics.sectionStats)}
                        className="flex items-center gap-1.5 text-[10px] text-brand-green font-extrabold border border-brand-green/20 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors bg-white cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Excel
                      </button>
                    </div>

                    <div className="overflow-x-auto max-h-[300px]">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="bg-brand-cream border-b border-slate-150 sticky top-0">
                            {['Class & Section', 'Appeared', 'Avg Score', 'Highest', 'Lowest'].map(h => (
                              <th key={h} className="text-left px-4 py-2.5 text-[9px] font-black uppercase text-brand-navy">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.sectionStats.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center py-6 text-slate-400">No section-wise performance data found.</td>
                            </tr>
                          ) : (
                            analytics.sectionStats.map(sec => (
                              <tr key={sec.key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 font-bold text-slate-700">
                                <td className="px-4 py-3 text-brand-navy font-extrabold">Class {sec.class} - {sec.section}</td>
                                <td className="px-4 py-3">{sec.appeared}</td>
                                <td className="px-4 py-3 text-brand-orange">{sec.average}</td>
                                <td className="px-4 py-3 text-brand-green">{sec.highest}</td>
                                <td className="px-4 py-3 text-slate-400">{sec.lowest}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Individual Student Level Reports & Ranks Table */}
                <div className="bg-white border-4 border-brand-navy rounded-3xl overflow-hidden edu-shadow">
                  <div className="px-6 py-4.5 border-b border-slate-100 bg-white">
                    <h3 className="font-heading font-extrabold text-brand-navy text-base">Individual Candidate Performance Reports</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      Check each student's division, test scorecards, national rank, and status. Select students to download reports.
                    </p>

                    {/* Filters bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search roll no or name..."
                          value={searchFilter}
                          onChange={e => setSearchFilter(e.target.value)}
                          className="w-full text-xs pl-8.5 pr-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-navy font-semibold text-slate-700"
                        />
                      </div>

                      {/* Class filter */}
                      <select
                        value={classFilter}
                        onChange={e => setClassFilter(e.target.value)}
                        className="text-xs px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-navy font-semibold text-slate-700 bg-white"
                      >
                        <option value="">All Classes</option>
                        {['6', '7', '8', '9', '10', '11', '12'].map(c => (
                          <option key={c} value={c}>Class {c}</option>
                        ))}
                      </select>

                      {/* Section filter */}
                      <select
                        value={sectionFilter}
                        onChange={e => setSectionFilter(e.target.value)}
                        className="text-xs px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-navy font-semibold text-slate-700 bg-white"
                      >
                        <option value="">All Sections</option>
                        {Array.from(new Set(analytics.students.map(s => s.section))).filter(Boolean).map(sec => (
                          <option key={sec} value={sec}>Section {sec.toUpperCase()}</option>
                        ))}
                      </select>

                      {/* Status filter */}
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="text-xs px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-navy font-semibold text-slate-700 bg-white"
                      >
                        <option value="">All Statuses</option>
                        <option value="Registered">Registered (No Result)</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Participated">Participated</option>
                        <option value="MeritAwardee">Merit Awardee</option>
                        <option value="NationalRanker">National Ranker</option>
                      </select>

                      {/* Download actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const filtered = analytics.students.filter(s => {
                              const matchesSearch = s.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                                                    (s.result?.rollNumber || '').toLowerCase().includes(searchFilter.toLowerCase());
                              const matchesClass = !classFilter || s.class === classFilter;
                              const matchesSection = !sectionFilter || s.section?.toUpperCase() === sectionFilter.toUpperCase();
                              const matchesStatus = !statusFilter || (s.result?.qualificationStatus || 'Registered') === statusFilter;
                              return matchesSearch && matchesClass && matchesSection && matchesStatus;
                            });
                            exportStudentResultsExcel(filtered);
                          }}
                          title="Export all matching students to Excel"
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs text-brand-green font-extrabold border-2 border-brand-green/20 px-2 py-2 rounded-xl hover:bg-emerald-50 bg-white cursor-pointer transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Export Filtered
                        </button>
                      </div>
                    </div>

                    {/* Bulk Selection tools */}
                    <div className="flex flex-wrap gap-2.5 items-center mt-4 border-t border-slate-100 pt-3">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        {selectedStudents.length} student(s) selected
                      </span>
                      {selectedStudents.length > 0 && (
                        <>
                          <button
                            onClick={() => {
                              const list = analytics.students.filter(s => selectedStudents.includes(s._id));
                              exportStudentResultsExcel(list);
                            }}
                            className="flex items-center gap-1.5 text-[10px] text-white font-extrabold bg-[#001F5E] px-3 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-900 transition-colors shadow-sm"
                          >
                            <FileSpreadsheet className="w-3 h-3" /> Export Selected Chunk (Excel)
                          </button>
                          <button
                            onClick={() => setSelectedStudents([])}
                            className="text-[10px] text-slate-500 hover:text-slate-700 font-extrabold px-2 py-1.5 border border-slate-200 rounded-lg cursor-pointer bg-white"
                          >
                            Clear Selection
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-brand-cream border-b-2 border-slate-150">
                          <th className="px-5 py-3 text-left w-10">
                            <button
                              onClick={() => {
                                const filtered = analytics.students.filter(s => {
                                  const matchesSearch = s.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                                                        (s.result?.rollNumber || '').toLowerCase().includes(searchFilter.toLowerCase());
                                  const matchesClass = !classFilter || s.class === classFilter;
                                  const matchesSection = !sectionFilter || s.section?.toUpperCase() === sectionFilter.toUpperCase();
                                  const matchesStatus = !statusFilter || (s.result?.qualificationStatus || 'Registered') === statusFilter;
                                  return matchesSearch && matchesClass && matchesSection && matchesStatus;
                                });
                                handleSelectAllFiltered(filtered);
                              }}
                              className="text-slate-400 hover:text-[#001F5E] cursor-pointer"
                            >
                              {filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.includes(s._id)) ? (
                                <CheckSquare className="w-4 h-4 text-brand-navy" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </th>
                          {['Roll Number', 'Name', 'Class & Sec', 'Scores (Logic / Algo / AI)', 'Total Obtained', 'Percentile', 'National Rank', 'Status'].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-wider text-brand-navy">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="text-center py-8 text-slate-400 font-semibold">No candidates found matching the filters.</td>
                          </tr>
                        ) : (
                          filteredStudents.map(s => {
                            const isChecked = selectedStudents.includes(s._id);
                            return (
                              <tr key={s._id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors font-semibold text-slate-700 ${isChecked ? 'bg-indigo-50/30' : ''}`}>
                                <td className="px-5 py-4">
                                  <button onClick={() => handleSelectStudent(s._id)} className="text-slate-400 hover:text-brand-navy cursor-pointer">
                                    {isChecked ? (
                                      <CheckSquare className="w-4 h-4 text-brand-navy" />
                                    ) : (
                                      <Square className="w-4 h-4" />
                                    )}
                                  </button>
                                </td>
                                <td className="px-5 py-4 text-brand-navy font-extrabold">{s.result?.rollNumber || '—'}</td>
                                <td className="px-5 py-4">
                                  <div>
                                    <p className="font-bold text-slate-800">{s.name}</p>
                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">{s.gender || '—'}</p>
                                  </div>
                                </td>
                                <td className="px-5 py-4">Class {s.class} - {s.section || '—'}</td>
                                <td className="px-5 py-4">
                                  {s.result ? (
                                    <div className="flex gap-1 text-[10px] font-mono">
                                      <span className="bg-slate-50 px-1 py-0.5 rounded border border-slate-100" title="Logical Reasoning">{s.result.scores?.logicalReasoning ?? 0}</span>
                                      <span className="bg-slate-50 px-1 py-0.5 rounded border border-slate-100" title="Algorithmic Thinking">{s.result.scores?.algorithmicThinking ?? 0}</span>
                                      <span className="bg-slate-50 px-1 py-0.5 rounded border border-slate-100" title="AI Core">{s.result.scores?.aiCore ?? 0}</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-450">—</span>
                                  )}
                                </td>
                                <td className="px-5 py-4 font-bold text-brand-orange">
                                  {s.result ? `${s.result.scores?.totalMarksObtained ?? 0} / ${s.result.totalMaxMarks ?? 100}` : '—'}
                                </td>
                                <td className="px-5 py-4 font-mono font-bold text-slate-650">
                                  {s.result ? `${s.result.percentile}%` : '—'}
                                </td>
                                <td className="px-5 py-4 text-slate-500">{s.result?.rankings?.national ?? '—'}</td>
                                <td className="px-5 py-4">
                                  {s.result ? (
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                                      s.result.qualificationStatus === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                      s.result.qualificationStatus === 'MeritAwardee' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                      s.result.qualificationStatus === 'NationalRanker' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                      'bg-slate-50 text-slate-500 border border-slate-200'
                                    }`}>
                                      {s.result.qualificationStatus}
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-slate-50 text-slate-400 border border-slate-150">Registered</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

      </div>

      {/* Curriculum Modal */}
      <CurriculumModal
        isOpen={activeCurriculumStage !== null}
        stage={activeCurriculumStage}
        onClose={() => setActiveCurriculumStage(null)}
      />
    </div>
  );
}
