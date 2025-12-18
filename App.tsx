import React, { useState, useEffect, useRef } from 'react';
import { User, FileText, Plus, Save, Printer, ArrowLeft, Trash2, Copy, AlertTriangle, Settings, UserPlus, Home, Calendar, History, Download, TrainFront, Share2, Mail, LogOut, Users } from 'lucide-react';
import { UserProfile, MonthJournal, TAEntry } from './types';
import { MONTHS, INITIAL_ENTRY, DEVELOPER_NAME } from './constants';
import { PrintLayout } from './components/PrintLayout';

// --- TRANSLATIONS ---
const STRINGS = {
  en: {
    welcome: "Welcome",
    switchProfile: "Manage Profiles",
    addNewProfile: "Add New Profile",
    newJournal: "New TA Journal",
    newMonth: "New Month",
    history: "Journal History",
    profile: "Profiles List",
    totalJournals: "Total Journals",
    recent: "Recent Journals",
    noJournals: "No journals found for this profile.",
    entries: "Entries",
    lastMod: "Last modified",
    create: "Create",
    cancel: "Cancel",
    selectPeriod: "Select Month & Year",
    unsavedTitle: "Unsaved Changes",
    unsavedMsg: "You have unsaved changes. Do you really want to exit?",
    exitAnyway: "Exit Anyway",
    deleteRowTitle: "Delete Entry?",
    deleteRowMsg: "Are you sure you want to remove this journey entry?",
    deleteJournalTitle: "Delete Month Journal?",
    deleteJournalMsg: "This will permanently delete all entries for this month. This action cannot be undone.",
    deleteConfirm: "Yes, Delete",
    exitAppTitle: "Exit App?",
    exitAppMsg: "Are you sure you want to exit the application?",
    exitAppConfirm: "Exit",
    duplicateTitle: "Duplicate Profile!",
    duplicateMsg: "A profile with this Name or P.F. Number already exists. Please check the list.",
    installTitle: "Install App",
    installMsg: "Install Railway TA App for easier monthly claims and offline access.",
    installNow: "Install Now",
    later: "Later",
    printPdf: "Submit & Print",
    downloadPdf: "Share / Save PDF",
    downloading: "Generating PDF...",
    backToEdit: "Back to Edit",
    setupProfile: "Setup Profile",
    saveProfile: "Save Profile",
    fillDetails: "Fill Daily TA Details",
    done: "Done",
    dateFormat: "DD-MM",
    trainNo: "TRAIN NO",
    rate: "RATE",
    from: "FROM",
    to: "TO",
    depart: "DEPART",
    arrive: "ARRIVE",
    kms: "KMS",
    percent: "DAY/NIGHT %",
    purpose: "PURPOSE",
    col11: "PVT DIST (COL 11)",
    col12: "REF ITEM 20 (COL 12)",
    leaveBlank: "Leave blank if N/A",
    tapToAdd: "Tap + to add a daily journey",
    limitReached: "Limit Reached! Maximum 26 rows per journal.",
    developer: "Developed by",
    feedbackTitle: "Feedback & Support",
    feedbackSub: "Send suggestions to Developer"
  }
};

const INPUT_STYLE = "text-black font-extrabold uppercase handwriting tracking-wider placeholder-gray-400";

const AnimatedTrain = () => {
  return (
    <div className="w-full h-48 relative overflow-visible flex items-center justify-center mb-6">
      <style>{`
        @keyframes moveTrainAcross { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
        @keyframes spinWheels { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounceTrain { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes steamPuff { 0% { opacity: 0; transform: scale(0.5) translate(0, 0); } 30% { opacity: 0.6; } 100% { opacity: 0; transform: scale(3) translate(-40px, -50px); } }
        .train-wrapper { animation: moveTrainAcross 4s linear infinite; position: absolute; left: 50%; margin-left: -150px; }
        .train-body-anim { animation: bounceTrain 0.4s infinite ease-in-out; }
        .wheel-anim { animation: spinWheels 0.6s linear infinite; transform-box: fill-box; transform-origin: center; }
        .smoke-particle { position: absolute; background: rgba(255, 255, 255, 0.6); border-radius: 50%; }
        .s1 { width: 15px; height: 15px; animation: steamPuff 1.5s infinite 0s; top: -10px; left: 220px; }
        .s2 { width: 20px; height: 20px; animation: steamPuff 1.5s infinite 0.5s; top: -20px; left: 230px; }
        .s3 { width: 12px; height: 12px; animation: steamPuff 1.5s infinite 1.0s; top: -5px; left: 210px; }
      `}</style>
      <div className="absolute bottom-4 w-[200%] h-1 bg-white/20"></div>
      <div className="train-wrapper flex items-end">
        <div className="smoke-particle s1"></div><div className="smoke-particle s2"></div><div className="smoke-particle s3"></div>
        <div className="train-body-anim">
          <svg width="340" height="100" viewBox="0 0 340 100" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0, 10)">
               <rect x="0" y="20" width="130" height="50" rx="4" fill="#1e3a8a" stroke="white" strokeWidth="2" />
               <rect x="0" y="35" width="130" height="5" fill="#fbbf24" /><rect x="10" y="25" width="20" height="15" fill="#93c5fd" stroke="white" strokeWidth="1"/>
               <rect x="40" y="25" width="20" height="15" fill="#93c5fd" stroke="white" strokeWidth="1"/><rect x="70" y="25" width="20" height="15" fill="#93c5fd" stroke="white" strokeWidth="1"/>
               <rect x="100" y="25" width="20" height="15" fill="#93c5fd" stroke="white" strokeWidth="1"/>
               <circle cx="30" cy="70" r="10" fill="#374151" stroke="gray" strokeWidth="2" className="wheel-anim" /><circle cx="100" cy="70" r="10" fill="#374151" stroke="gray" strokeWidth="2" className="wheel-anim" />
               <line x1="30" y1="70" x2="100" y2="70" stroke="#4b5563" strokeWidth="4" />
            </g>
            <rect x="130" y="55" width="10" height="6" fill="#4b5563" />
            <g transform="translate(140, 0)">
               <path d="M0 30 L160 30 L160 80 L0 80 Z" fill="#1e3a8a" stroke="white" strokeWidth="2" /><path d="M160 30 Q190 60 160 80 L160 30" fill="#ea580c" stroke="white" strokeWidth="2" />
               <rect x="100" y="10" width="50" height="20" fill="#fbbf24" stroke="white" strokeWidth="2"/><rect x="105" y="15" width="40" height="12" fill="#93c5fd" />
               <rect x="0" y="45" width="165" height="8" fill="#fbbf24" /><circle cx="170" cy="55" r="5" fill="#fef08a" />
               <circle cx="35" cy="80" r="12" fill="#374151" stroke="gray" strokeWidth="2" className="wheel-anim" /><circle cx="80" cy="80" r="12" fill="#374151" stroke="gray" strokeWidth="2" className="wheel-anim" /><circle cx="125" cy="80" r="12" fill="#374151" stroke="gray" strokeWidth="2" className="wheel-anim" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'splash' | 'dashboard' | 'editor' | 'profile_form' | 'print'>('splash');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [journals, setJournals] = useState<MonthJournal[]>([]);
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('railway_ta_profiles');
    const savedJournals = localStorage.getItem('railway_ta_journals');
    if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
    if (savedJournals) setJournals(JSON.parse(savedJournals));
    const timer = setTimeout(() => {
      const p = savedProfiles ? JSON.parse(savedProfiles) : [];
      if (p.length > 0) {
        setActiveProfileId(p[0].id);
        setView('dashboard');
      } else {
        setView('profile_form');
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      if (view === 'splash') return;
      if (showExitModal || showUnsavedModal || showDuplicateModal) {
        setShowExitModal(false); setShowUnsavedModal(false); setShowDuplicateModal(false);
      } else if (view === 'print') {
        setView('editor');
      } else if (view === 'editor' || view === 'profile_form') {
        setShowUnsavedModal(true);
      } else if (view === 'dashboard') {
        setShowExitModal(true);
      } else {
        setView('dashboard');
      }
    };
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [view, showExitModal, showUnsavedModal, showDuplicateModal, profiles.length]);

  useEffect(() => { localStorage.setItem('railway_ta_profiles', JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { localStorage.setItem('railway_ta_journals', JSON.stringify(journals)); }, [journals]);

  const t = STRINGS.en;

  const handleSaveProfile = (profile: UserProfile) => {
    const isDuplicate = profiles.some(p => 
      p.name.trim().toLowerCase() === profile.name.trim().toLowerCase() || 
      (profile.pfNumber && p.pfNumber === profile.pfNumber)
    );
    if (isDuplicate) {
      setShowDuplicateModal(true);
      return;
    }
    setProfiles([...profiles, profile]);
    setActiveProfileId(profile.id);
    setView('dashboard');
  };

  const handleDeleteProfile = (id: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== id);
    setProfiles(updatedProfiles);
    setJournals(journals.filter(j => j.profileId !== id));
    if (activeProfileId === id) {
      setActiveProfileId(updatedProfiles.length > 0 ? updatedProfiles[0].id : null);
    }
  };

  const handleCreateJournal = (month: string, year: string) => {
    if (!activeProfileId) return;
    const newJournal: MonthJournal = {
      id: `${year}-${month}-${activeProfileId}-${Date.now()}`,
      profileId: activeProfileId,
      month, year, entries: []
    };
    setJournals([newJournal, ...journals]);
    setActiveJournalId(newJournal.id);
    setView('editor');
  };

  if (view === 'splash') {
    return (
      <div className="h-screen w-full bg-blue-900 flex flex-col items-center justify-center text-white p-4 overflow-hidden">
        <AnimatedTrain />
        <h1 className="text-4xl font-extrabold mb-2 text-center tracking-tight text-white drop-shadow-md animate-fade-in-up">Railway TA Journal</h1>
        <p className="text-blue-200 text-lg font-medium animate-fade-in-up">Manage Your Claims Effortlessly</p>
        <div className="mt-16 text-sm opacity-80 absolute bottom-10 font-medium tracking-wide text-center">
          {t.developer} <br/> {DEVELOPER_NAME}
        </div>
      </div>
    );
  }

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const activeJournal = journals.find(j => j.id === activeJournalId);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {view === 'profile_form' && (
        <ProfileForm onSave={handleSaveProfile} onCancel={profiles.length > 0 ? () => setView('dashboard') : undefined} t={t} />
      )}
      {view === 'dashboard' && (
        <Dashboard 
          profiles={profiles} 
          journals={journals} 
          activeProfileId={activeProfileId}
          onSelectProfile={setActiveProfileId}
          onAddProfile={() => setView('profile_form')}
          onDeleteProfile={handleDeleteProfile}
          onOpenJournal={(id: string, pId: string) => { setActiveProfileId(pId); setActiveJournalId(id); setView('editor'); }}
          onCreateJournal={handleCreateJournal}
          onDeleteJournal={(id: string) => setJournals(journals.filter(j => j.id !== id))}
          t={t} 
        />
      )}
      {view === 'editor' && activeJournal && activeProfile && (
        <JournalEditor journal={activeJournal} profile={activeProfile} 
          onUpdate={(uj: MonthJournal) => setJournals(journals.map(j => j.id === uj.id ? uj : j))} 
          onBack={() => setView('dashboard')} onPrint={() => setView('print')} t={t} />
      )}
      {view === 'print' && activeJournal && activeProfile && (
        <PrintPreview journal={activeJournal} profile={activeProfile} onBack={() => setView('editor')} t={t} />
      )}

      {/* DUPLICATE MODAL */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
           <div className="bg-white rounded-xl p-6 shadow-2xl max-w-xs w-full animate-scale-in border-t-4 border-red-500">
               <div className="flex items-center justify-center mb-4 text-red-500"><AlertTriangle className="w-10 h-10" /></div>
               <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{t.duplicateTitle}</h3>
               <p className="text-gray-500 text-center mb-6 font-medium">{t.duplicateMsg}</p>
               <button onClick={() => setShowDuplicateModal(false)} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl">OK, Check List</button>
           </div>
        </div>
      )}

      {/* UNSAVED CHANGES MODAL */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
           <div className="bg-white rounded-xl p-6 shadow-2xl max-w-xs w-full animate-scale-in border-t-4 border-amber-500">
               <div className="flex items-center justify-center mb-4 text-amber-500"><AlertTriangle className="w-10 h-10" /></div>
               <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{t.unsavedTitle}</h3>
               <p className="text-gray-500 text-center mb-6 font-medium">{t.unsavedMsg}</p>
               <div className="flex gap-3">
                  <button onClick={() => setShowUnsavedModal(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 rounded-xl">{t.cancel}</button>
                  <button onClick={() => { setShowUnsavedModal(false); setView('dashboard'); }} className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-xl">{t.exitAnyway}</button>
               </div>
           </div>
        </div>
      )}

      {/* EXIT APP MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
           <div className="bg-white rounded-xl p-6 shadow-2xl max-w-xs w-full animate-scale-in border-t-4 border-gray-600">
               <div className="flex items-center justify-center mb-4 text-gray-600"><LogOut className="w-10 h-10" /></div>
               <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{t.exitAppTitle}</h3>
               <p className="text-gray-500 text-center mb-6 font-medium">{t.exitAppMsg}</p>
               <div className="flex gap-3">
                  <button onClick={() => setShowExitModal(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 rounded-xl">{t.cancel}</button>
                  <button onClick={() => window.close()} className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl">{t.exitAppConfirm}</button>
               </div>
           </div>
        </div>
      )}
    </div>
  );
}

const ProfileForm = ({ onSave, onCancel, t }: any) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    branch: 'TFC/OPTS', division: 'PUNE', headquarters: 'KARAD',
    name: '', designation: '', pay: '', level: 'Level-2', pfNumber: ''
  });

  return (
    <div className="p-6 max-w-lg mx-auto bg-white min-h-screen">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        {onCancel && <button onClick={onCancel} className="p-2 bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5"/></button>}
        <h2 className="text-2xl font-bold text-blue-900">{t.setupProfile}</h2>
      </div>
      <form onSubmit={e => { e.preventDefault(); onSave({ ...formData, id: Date.now().toString() }); }} className="space-y-4">
        <div><label className="text-xs font-bold text-gray-500 uppercase">Full Name</label><input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_STYLE}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Designation</label><input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_STYLE}`} value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Station</label><input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_STYLE}`} value={formData.station} onChange={e => setFormData({...formData, station: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Pay</label><input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_STYLE}`} value={formData.pay} onChange={e => setFormData({...formData, pay: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Level</label><input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_STYLE}`} value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} /></div>
        </div>
        <div><label className="text-xs font-bold text-gray-500 uppercase">P.F. Number</label><input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_STYLE}`} value={formData.pfNumber} onChange={e => setFormData({...formData, pfNumber: e.target.value})} /></div>
        <button type="submit" className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold shadow-lg mt-6">SAVE & CONTINUE</button>
      </form>
    </div>
  );
};

const Dashboard = ({ profiles, journals, activeProfileId, onSelectProfile, onAddProfile, onDeleteProfile, onOpenJournal, onCreateJournal, onDeleteJournal, t }: any) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'journals'>('profiles');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="bg-white shadow-sm p-4 sticky top-0 z-20 flex justify-between items-center">
        <h1 className="font-black text-xl text-blue-900 tracking-tight">Railway TA Pro</h1>
        <button onClick={onAddProfile} className="bg-blue-600 text-white p-2 rounded-full shadow-lg active:scale-95 transition-all"><UserPlus className="w-6 h-6"/></button>
      </div>

      <div className="flex border-b bg-white">
        <button onClick={() => setActiveTab('profiles')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'profiles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}>EMPLOYEES ({profiles.length})</button>
        <button onClick={() => setActiveTab('journals')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'journals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}>ALL JOURNALS ({journals.length})</button>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'profiles' ? (
          profiles.map((p: UserProfile) => (
            <div key={p.id} className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${activeProfileId === p.id ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex justify-between items-start">
                <div onClick={() => onSelectProfile(p.id)} className="flex-1 cursor-pointer">
                  <h3 className="font-black text-gray-800 uppercase text-lg">{p.name}</h3>
                  <div className="text-xs text-gray-500 font-bold uppercase">{p.designation} • {p.station} • PF: {p.pfNumber}</div>
                  <div className="mt-2 text-xs font-bold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                    {journals.filter(j => j.profileId === p.id).length} JOURNALS
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { onSelectProfile(p.id); setShowMonthPicker(true); }} className="p-2 text-green-600 bg-green-50 rounded-lg"><Plus className="w-5 h-5"/></button>
                  <button onClick={() => setProfileToDelete(p.id)} className="p-2 text-red-300 hover:text-red-600"><Trash2 className="w-5 h-5"/></button>
                </div>
              </div>
            </div>
          ))
        ) : (
          journals.map((j: MonthJournal) => {
            const p = profiles.find(pr => pr.id === j.profileId);
            return (
              <div key={j.id} onClick={() => onOpenJournal(j.id, j.profileId)} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center cursor-pointer active:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-700 flex items-center justify-center rounded-lg font-black mr-4 border border-blue-100">{j.month.substring(0,3)}</div>
                  <div>
                    <h4 className="font-black text-gray-800 uppercase">{j.month} {j.year}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{p?.name || 'Unknown'}</p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDeleteJournal(j.id); }} className="p-2 text-gray-300 hover:text-red-600"><Trash2 className="w-5 h-5"/></button>
              </div>
            );
          })
        )}
      </div>

      {showMonthPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
           <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl">
             <h3 className="font-bold text-xl mb-6 text-gray-800 text-center uppercase tracking-tight">Create TA Journal</h3>
             <div className="space-y-4 mb-6">
                <select className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-50 font-bold" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-50 font-bold" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                  {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
             </div>
             <div className="flex gap-3">
               <button className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold" onClick={() => setShowMonthPicker(false)}>CANCEL</button>
               <button className="flex-1 bg-blue-700 text-white p-3 rounded-xl font-bold" onClick={() => { onCreateJournal(selectedMonth, selectedYear); setShowMonthPicker(false); }}>CREATE</button>
             </div>
           </div>
        </div>
      )}

      {profileToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] p-4">
           <div className="bg-white rounded-xl p-6 max-w-xs w-full text-center">
             <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4"/>
             <h3 className="font-bold text-lg mb-2">Delete Profile?</h3>
             <p className="text-gray-500 text-sm mb-6">This will delete all saved journals for this employee.</p>
             <div className="flex gap-2">
               <button onClick={() => setProfileToDelete(null)} className="flex-1 p-3 bg-gray-100 rounded-lg font-bold">CANCEL</button>
               <button onClick={() => { onDeleteProfile(profileToDelete); setProfileToDelete(null); }} className="flex-1 p-3 bg-red-600 text-white rounded-lg font-bold">DELETE</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

const JournalEditor = ({ journal, profile, onUpdate, onBack, onPrint, t }: any) => {
  const [entries, setEntries] = useState<TAEntry[]>(journal.entries || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TAEntry | null>(null);
  const [newEntry, setNewEntry] = useState<TAEntry>({ ...INITIAL_ENTRY, id: '' });
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const updateEntries = (newEntries: TAEntry[]) => {
      setEntries(newEntries);
      onUpdate({ ...journal, entries: newEntries });
  };

  const handleSaveEntry = () => {
     const updated = editingEntry ? entries.map(e => e.id === editingEntry.id ? { ...newEntry, id: editingEntry.id } : e) : [...entries, { ...newEntry, id: Date.now().toString() }];
     updateEntries(updated);
     setShowAddModal(false); setEditingEntry(null); setNewEntry({ ...INITIAL_ENTRY, id: '' });
  };

  return (
    <div className="pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-20 p-4 border-b flex justify-between items-center">
        <button onClick={onBack} className="text-gray-600"><ArrowLeft/></button>
        <div className="text-center"><h2 className="font-black text-lg uppercase">{journal.month} {journal.year}</h2><p className="text-[10px] text-gray-500 font-bold">{profile.name}</p></div>
        <button onClick={onPrint} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-sm flex items-center"><Printer className="w-4 h-4 mr-1"/> PRINT</button>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
         {entries.map(e => (
           <div key={e.id} className="bg-white p-4 rounded-xl shadow-sm border relative">
              <div className="absolute top-3 right-3 flex gap-3 text-gray-300">
                <button onClick={() => { setNewEntry(e); setEditingEntry(e); setShowAddModal(true); }}><Settings className="w-4 h-4"/></button>
                <button onClick={() => updateEntries([...entries, { ...e, id: Date.now().toString() }])}><Copy className="w-4 h-4"/></button>
                <button onClick={() => setEntryToDelete(e.id)}><Trash2 className="w-4 h-4"/></button>
              </div>
              <div className="flex gap-4">
                 <div className="bg-blue-50 text-blue-800 p-2 rounded-lg text-center min-w-[50px]"><span className="text-[9px] font-black block text-blue-400 uppercase">DATE</span><span className="font-mono font-black text-lg">{e.date.split('/')[0]}</span></div>
                 <div><div className="text-xs font-black uppercase text-gray-400">Train: <span className="text-gray-800">{e.trainNo}</span></div><div className="text-sm font-black uppercase text-gray-600">{e.stationFrom} → {e.stationTo}</div></div>
              </div>
              <div className="flex justify-between items-center mt-3 border-t pt-2"><span className="text-[10px] font-bold text-gray-400 uppercase">{e.purpose}</span><span className="font-black text-green-700 text-lg">₹{e.rate}</span></div>
           </div>
         ))}
      </div>

      <button onClick={() => { setNewEntry({ ...INITIAL_ENTRY, id: '' }); setEditingEntry(null); setShowAddModal(true); }} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-all"><Plus className="w-8 h-8"/></button>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-black uppercase">Entry Details</h3><button onClick={() => setShowAddModal(false)}><ArrowLeft/></button></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-[10px] font-bold text-gray-400 uppercase">Date (DD/MM)</label><input value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className={`w-full border p-3 rounded-xl ${INPUT_STYLE}`} placeholder="DD/MM" /></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase">Train No</label><input value={newEntry.trainNo} onChange={e => setNewEntry({...newEntry, trainNo: e.target.value})} className={`w-full border p-3 rounded-xl ${INPUT_STYLE}`} placeholder="12345" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input value={newEntry.stationFrom} onChange={e => setNewEntry({...newEntry, stationFrom: e.target.value})} className={`w-full border p-3 rounded-xl ${INPUT_STYLE}`} placeholder="FROM" />
                <input value={newEntry.stationTo} onChange={e => setNewEntry({...newEntry, stationTo: e.target.value})} className={`w-full border p-3 rounded-xl ${INPUT_STYLE}`} placeholder="TO" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <input value={newEntry.kms} onChange={e => setNewEntry({...newEntry, kms: e.target.value})} className={`w-full border p-3 rounded-xl ${INPUT_STYLE}`} placeholder="KMS" />
                <select value={newEntry.dayNightPercent} onChange={e => setNewEntry({...newEntry, dayNightPercent: e.target.value})} className={`w-full border p-3 rounded-xl bg-white ${INPUT_STYLE}`}><option value="100%">100%</option><option value="70%">70%</option><option value="30%">30%</option></select>
                <input value={newEntry.rate} onChange={e => setNewEntry({...newEntry, rate: e.target.value})} className={`w-full border p-3 rounded-xl ${INPUT_STYLE}`} placeholder="RATE" />
              </div>
              <input value={newEntry.purpose} onChange={e => setNewEntry({...newEntry, purpose: e.target.value})} className={`w-full border p-3 rounded-xl mb-6 ${INPUT_STYLE}`} placeholder="PURPOSE OF JOURNEY" />
              <button onClick={handleSaveEntry} className="w-full bg-blue-700 text-white p-4 rounded-xl font-black shadow-lg">SAVE ENTRY</button>
           </div>
        </div>
      )}

      {entryToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
           <div className="bg-white rounded-xl p-6 max-w-xs w-full text-center">
             <h3 className="font-bold text-lg mb-4">Delete Entry?</h3>
             <div className="flex gap-2"><button onClick={() => setEntryToDelete(null)} className="flex-1 p-3 bg-gray-100 rounded-lg font-bold">CANCEL</button><button onClick={() => { updateEntries(entries.filter(e => e.id !== entryToDelete)); setEntryToDelete(null); }} className="flex-1 p-3 bg-red-600 text-white rounded-lg font-bold">DELETE</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

const PrintPreview = ({ journal, profile, onBack, t }: any) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = () => {
    setIsDownloading(true);
    const element = document.getElementById('print-content');
    const opt = { margin: 0, filename: `TA_${profile.name}_${journal.month}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } };
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save().then(() => setIsDownloading(false));
  };

  return (
    <div className="min-h-screen bg-gray-600">
      <div className="fixed top-0 w-full bg-white p-4 flex justify-between items-center z-50 shadow-md">
        <button onClick={onBack} className="flex items-center font-bold text-gray-700"><ArrowLeft className="w-5 h-5 mr-1"/> BACK</button>
        <button onClick={handleDownload} disabled={isDownloading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-black shadow-lg">{isDownloading ? 'GENERATING...' : 'DOWNLOAD PDF'}</button>
      </div>
      <div className="pt-20 pb-10 flex justify-center overflow-auto"><div className="bg-white scale-[0.5] sm:scale-90 origin-top shadow-2xl"><PrintLayout journal={journal} profile={profile} /></div></div>
    </div>
  );
}
