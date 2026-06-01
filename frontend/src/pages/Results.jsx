import React, { useState } from 'react';
import { resultAPI } from '../services';
import { Search, Trophy, Calendar, Sparkles, CheckCircle2, ShieldAlert, Award, FileText, User, ArrowRight } from 'lucide-react';

export default function ResultsPage() {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Premium pre-compiled scorecards in case the backend is offline or for instant grading preview
  const mockResults = {
    'BAIO-2026-SR-911': {
      studentName: 'Aditya Sharma',
      olympiadName: 'AI Olympiad - Senior Division',
      rollNumber: 'BAIO-2026-SR-911',
      scores: {
        logicalReasoning: 28,
        algorithmicThinking: 34,
        aiCore: 30,
        totalMarksObtained: 92
      },
      totalMaxMarks: 100,
      percentage: 92,
      percentile: 99.82,
      rankings: {
        national: 14,
        state: 3,
        school: 1
      },
      qualificationStatus: 'MeritAwardee',
      certificateUrl: '#',
      scorecardUrl: '#'
    },
    'BAIO-2026-JR-402': {
      studentName: 'Kunal Sen',
      olympiadName: 'AI Olympiad - Junior Division',
      rollNumber: 'BAIO-2026-JR-402',
      scores: {
        logicalReasoning: 26,
        algorithmicThinking: 28,
        aiCore: 30,
        totalMarksObtained: 84
      },
      totalMaxMarks: 100,
      percentage: 84,
      percentile: 98.15,
      rankings: {
        national: 88,
        state: 12,
        school: 2
      },
      qualificationStatus: 'Qualified',
      certificateUrl: '#',
      scorecardUrl: '#'
    },
    'BAIO-2026-MS-888': {
      studentName: 'Drisha Roy',
      olympiadName: 'AI Olympiad - Masters Division',
      rollNumber: 'BAIO-2026-MS-888',
      scores: {
        logicalReasoning: 30,
        algorithmicThinking: 33,
        aiCore: 33,
        totalMarksObtained: 96
      },
      totalMaxMarks: 100,
      percentage: 96,
      percentile: 99.98,
      rankings: {
        national: 3,
        state: 1,
        school: 1
      },
      qualificationStatus: 'NationalRanker',
      certificateUrl: '#',
      scorecardUrl: '#'
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!rollNumber.trim()) return;

    setLoading(true);
    setSearched(true);
    setResult(null);
    setErrorMsg('');

    try {
      // 1. Attempt backend dynamic fetch
      const res = await resultAPI.search({ rollNumber: rollNumber.trim() });
      const resultData = res?.data?.data?.result || res?.data?.result || res?.data?.data || res?.data;
      
      if (resultData && resultData.rollNumber) {
        // Normalise fields if nested mongoose populate differs
        setResult({
          studentName: resultData.studentName || resultData.studentId?.name || 'Participant',
          olympiadName: resultData.olympiadName || resultData.olympiadId?.title || 'Bharat AI Olympiad',
          rollNumber: resultData.rollNumber,
          scores: resultData.scores || { totalMarksObtained: 0 },
          totalMaxMarks: resultData.totalMaxMarks || 100,
          percentage: resultData.percentage || 0,
          percentile: resultData.percentile || 0,
          rankings: resultData.rankings || { national: 0, state: 0, school: 0 },
          qualificationStatus: resultData.qualificationStatus || 'Participated',
          certificateUrl: resultData.certificateUrl || '#',
          scorecardUrl: resultData.scorecardUrl || '#'
        });
      } else {
        // 2. Fall back to local mock list if backend yields empty
        const mockMatch = mockResults[rollNumber.trim().toUpperCase()] || mockResults[rollNumber.trim()];
        if (mockMatch) {
          setResult(mockMatch);
        } else {
          setErrorMsg('No scorecard matches this roll number. Please verify the credentials.');
        }
      }
    } catch (err) {
      console.warn('Backend result fetch failed or roll number not found. Checking local pre-compiled registry.', err);
      // 3. Fall back to local mock list on network fail
      const mockMatch = mockResults[rollNumber.trim().toUpperCase()] || mockResults[rollNumber.trim()];
      if (mockMatch) {
        setResult(mockMatch);
      } else {
        setErrorMsg('Roll number not found. Check spelling or try the demo roll numbers below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NationalRanker':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 glow-navy';
      case 'MeritAwardee':
        return 'bg-brand-orange/10 text-brand-orange border-brand-orange/30 glow-orange';
      case 'Qualified':
        return 'bg-brand-green/10 text-brand-green border-brand-green/30 glow-green';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'NationalRanker': return 'National Top Ranker';
      case 'MeritAwardee': return 'Merit Awardee';
      case 'Qualified': return 'Exam Qualified';
      default: return 'Participation Certificate';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12 text-center">
      
      {/* ── Page Header ── */}
      <div className="space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          <span>Merit & Ranks</span>
        </div>
        <h1 className="font-heading font-extrabold text-4xl text-white">
          National Results Center
        </h1>
        <p className="text-slate-400 text-sm font-light leading-relaxed">
          Search, view, and verify your credentials using your proctored physical center Roll Number.
        </p>
      </div>

      {/* ── Search Bar Input Form ── */}
      <div className="glass-card p-6 md:p-8 rounded-3xl max-w-xl mx-auto border border-white/5 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Enter Roll Number (e.g. BAIO-2026-SR-911)"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-brand-orange rounded-xl pl-4 pr-10 py-3 text-sm text-slate-100 placeholder:text-slate-650 focus:outline-none transition-all font-mono"
            />
            <Search className="w-4 h-4 text-slate-550 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Search Marks</span>
            )}
          </button>
        </form>

        {/* Demo Help Block */}
        <div className="pt-2 text-left space-y-1 bg-slate-950/40 p-3 rounded-xl border border-slate-900/60">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
            💡 Practice Roll Numbers (Demo):
          </p>
          <div className="flex flex-wrap gap-2 pt-1.5 text-[11px] font-mono text-slate-400">
            <button onClick={() => setRollNumber('BAIO-2026-SR-911')} className="hover:text-brand-orange hover:underline">BAIO-2026-SR-911</button>
            <span className="text-slate-800">|</span>
            <button onClick={() => setRollNumber('BAIO-2026-MS-888')} className="hover:text-indigo-400 hover:underline">BAIO-2026-MS-888</button>
            <span className="text-slate-800">|</span>
            <button onClick={() => setRollNumber('BAIO-2026-JR-402')} className="hover:text-brand-green hover:underline">BAIO-2026-JR-402</button>
          </div>
        </div>
      </div>

      {/* ── Search Results Card rendering ── */}
      {searched && (
        <div className="max-w-2xl mx-auto transition-all duration-300">
          
          {loading && (
            <div className="py-20 flex justify-center">
              <RefreshCw className="w-8 h-8 text-brand-orange animate-spin" />
            </div>
          )}

          {!loading && errorMsg && (
            <div className="glass-card p-8 rounded-3xl border border-red-500/10 max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-slate-200">Scorecard Not Found</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{errorMsg}</p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="glass-card rounded-3xl border border-white/10 glow-orange overflow-hidden text-left relative animate-float">
              
              {/* Gold watermark back accent */}
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

              {/* 1. Scorecard Certificate Header */}
              <div className="bg-slate-950/80 px-6 md:px-8 py-5 border-b border-slate-900 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-md">
                    <Trophy className="w-4 h-4 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-none">
                      Bharat AI Olympiad
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1 leading-none">
                      Official Merit Scorecard
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border self-start sm:self-auto ${getStatusBadge(result.qualificationStatus)}`}>
                  {getStatusText(result.qualificationStatus)}
                </span>
              </div>

              {/* 2. Participant Bio */}
              <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Candidate Name</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <h2 className="font-heading font-extrabold text-xl text-slate-100">
                      {result.studentName}
                    </h2>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Olympiad Track</p>
                  <p className="text-sm font-semibold text-slate-200">
                    {result.olympiadName}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Roll No: {result.rollNumber}
                  </p>
                </div>
              </div>

              {/* 3. Sectional Marks Breakdown */}
              <div className="px-6 md:px-8 py-6 bg-slate-950/45 border-y border-slate-900/60 space-y-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sectional Marks Breakdown</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  
                  {/* Logical */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Logical Reasoning</p>
                    <p className="text-lg font-extrabold text-slate-200 mt-2 font-heading">
                      {result.scores.logicalReasoning} <span className="text-xs text-slate-500">/ 30</span>
                    </p>
                  </div>

                  {/* Algorithmic */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Algorithmic logic</p>
                    <p className="text-lg font-extrabold text-slate-200 mt-2 font-heading">
                      {result.scores.algorithmicThinking} <span className="text-xs text-slate-500">/ 35</span>
                    </p>
                  </div>

                  {/* AI Core */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">AI Core concepts</p>
                    <p className="text-lg font-extrabold text-slate-200 mt-2 font-heading">
                      {result.scores.aiCore} <span className="text-xs text-slate-500">/ 35</span>
                    </p>
                  </div>

                  {/* Total Marks */}
                  <div className="bg-brand-orange/5 p-4 rounded-2xl border border-brand-orange/20">
                    <p className="text-[10px] text-brand-orange font-bold uppercase leading-none">Total Marks</p>
                    <p className="text-lg font-extrabold text-brand-orange mt-2 font-heading">
                      {result.scores.totalMarksObtained} <span className="text-xs text-brand-orange/60">/ {result.totalMaxMarks}</span>
                    </p>
                  </div>

                </div>
              </div>

              {/* 4. Merit Percentile & Rankings */}
              <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-950/20">
                
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">National Rank</p>
                  <p className="text-2xl font-extrabold text-white font-heading">
                    AIR {result.rankings.national}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-none">All India Ranking position</p>
                </div>

                <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-slate-900/60 py-4 sm:py-0 sm:px-6">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">State Rank</p>
                  <p className="text-2xl font-extrabold text-slate-200 font-heading">
                    SR 0{result.rankings.state}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-none">Regional state standings</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Percentile Standings</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-2xl font-extrabold text-brand-green font-heading">
                      {result.percentile}%
                    </p>
                    <span className="text-[10px] text-brand-green font-bold bg-brand-green/10 border border-brand-green/20 rounded-md px-1.5 py-0.5">Top</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-none">Better score than {result.percentile}% participants</p>
                </div>

              </div>

              {/* 5. Document Downloads Block */}
              <div className="px-6 md:px-8 py-5 bg-slate-950/80 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" />
                  <span>Proctored physical center result verified</span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={result.scorecardUrl}
                    className="flex-1 sm:flex-initial text-center bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Scorecard PDF</span>
                  </a>
                  <a
                    href={result.certificateUrl}
                    className="flex-1 sm:flex-initial text-center bg-gradient-to-r from-brand-orange to-amber-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-brand-orange/20 transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 text-white" />
                    <span>Certificate</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Bottom Legal verification clause */}
      <div className="bg-slate-950/80 border border-slate-900/80 max-w-xl mx-auto p-4 rounded-2xl flex items-center justify-center text-slate-500 text-xs text-center gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
        <span>For official credentials verification by schools or institutions, contact registry@baio.in</span>
      </div>

    </div>
  );
}
