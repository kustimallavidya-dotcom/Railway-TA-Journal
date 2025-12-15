import React, { useState, useEffect } from 'react';
import { User, FileText, Plus, Save, Printer, ArrowLeft, Trash2, Copy, AlertTriangle, Settings, UserPlus, Home, Calendar, History, Download } from 'lucide-react';
import { UserProfile, MonthJournal, TAEntry } from './types';
import { MONTHS, INITIAL_ENTRY, DEVELOPER_NAME } from './constants';
import { PrintLayout } from './components/PrintLayout';

// --- TRANSLATIONS (Only English Used) ---
const STRINGS = {
  en: {
    welcome: "Welcome",
    switchProfile: "Switch Profile",
    addNewProfile: "Add New Profile",
    newJournal: "New TA Journal",
    newMonth: "New Month",
    history: "History",
    profile: "Profile",
    totalJournals: "Total Journals",
    recent: "My Journals History",
    noJournals: "No TA journals yet. Create one!",
    entries: "Entries",
    lastMod: "Last modified",
    create: "Create",
    cancel: "Cancel",
    selectPeriod: "Select Month & Year",
    unsavedTitle: "Unsaved Changes",
    unsavedMsg: "You have unsaved changes. Do you really want to exit?",
    exitAnyway: "Exit Anyway",
    deleteRow: "Delete this row?",
    installTitle: "Install App",
    installMsg: "Install Railway TA App for easier monthly claims and offline access.",
    installNow: "Install Now",
    later: "Later",
    printPdf: "Submit & Print",
    downloadPdf: "Download PDF",
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
    tapToAdd: "Tap + to add a daily journey",
    limitReached: "Limit Reached! Maximum 26 rows per journal.",
    developer: "Developed by"
  }
};

// --- STYLE CONSTANTS FOR INPUTS (Blue Ink) ---
const INPUT_BLUE_INK = "text-blue-700 font-bold uppercase handwriting tracking-wider";

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState<'splash' | 'dashboard' | 'editor' | 'profile' | 'print'>('splash');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [journals, setJournals] = useState<MonthJournal[]>([]);
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // --- INITIALIZATION ---

  useEffect(() => {
    // Load data from local storage
    const savedProfiles = localStorage.getItem('railway_ta_profiles');
    const savedJournals = localStorage.getItem('railway_ta_journals');
    
    if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
    if (savedJournals) setJournals(JSON.parse(savedJournals));

    // Splash screen timer
    const timer = setTimeout(() => {
      const hasProfiles = savedProfiles && JSON.parse(savedProfiles).length > 0;
      if (hasProfiles) {
         const p = JSON.parse(savedProfiles);
         if(p.length > 0) setActiveProfileId(p[0].id);
         setView('dashboard');
      } else {
         setView('profile');
      }
    }, 2500);

    // PWA Install Handler
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallModal(true);
    });

    return () => clearTimeout(timer);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('railway_ta_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('railway_ta_journals', JSON.stringify(journals));
  }, [journals]);
  
  const t = STRINGS.en;

  // --- HANDLERS ---

  const handleCreateProfile = (profile: UserProfile) => {
    setProfiles([...profiles, profile]);
    setActiveProfileId(profile.id);
    setView('dashboard');
  };

  const handleCreateJournal = (month: string, year: string) => {
    if (!activeProfileId) return;
    const newJournal: MonthJournal = {
      id: `${year}-${month}-${activeProfileId}-${Date.now()}`,
      profileId: activeProfileId,
      month,
      year,
      entries: [] // Start empty
    };
    setJournals([newJournal, ...journals]);
    setActiveJournalId(newJournal.id);
    setView('editor');
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      setShowInstallModal(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!activeJournal) return;
    setIsDownloading(true);

    const element = document.getElementById('print-content');
    if (!element) return;

    // Direct PDF Download Configuration
    const opt = {
      margin: 0,
      filename: `TA_Journal_${activeJournal.month}_${activeJournal.year}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // Use html2pdf lib added in index.html
    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloading(false);
      });
    } else {
      alert("PDF Generator loading... please try again in a second.");
      setIsDownloading(false);
    }
  };

  // --- RENDER VIEWS ---

  if (view === 'splash') {
    return (
      <div className="h-screen w-full bg-blue-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/train-pattern.png')]"></div>
        {/* Updated Splash Logo - Beautiful & Striking */}
        <div className="animate-pulse mb-8 relative z-10 p-6 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)]">
           <img src="https://cdn-icons-png.flaticon.com/512/2362/2362483.png" alt="Railway Logo" className="w-32 h-32 drop-shadow-xl" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2 text-center tracking-tight z-10 text-white drop-shadow-md">Railway TA Journal</h1>
        <p className="text-blue-200 text-lg z-10 font-medium">Simplify Your Journey Claims</p>
        <div className="mt-16 text-sm opacity-80 absolute bottom-10 z-10 font-medium tracking-wide text-center">
          {t.developer} <br/> {DEVELOPER_NAME}
        </div>
      </div>
    );
  }

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const activeJournal = journals.find(j => j.id === activeJournalId);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full animate-fade-in-up border-t-4 border-blue-600">
            <h3 className="text-xl font-bold text-blue-900 mb-2">{t.installTitle}</h3>
            <p className="text-gray-600 mb-6">{t.installMsg}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowInstallModal(false)} className="text-gray-500 font-medium px-3 py-2">{t.later}</button>
              <button onClick={handleInstallApp} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-transform">{t.installNow}</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PROFILE MANAGER */}
      {view === 'profile' && (
        <ProfileManager 
          onSave={handleCreateProfile} 
          onCancel={profiles.length > 0 ? () => setView('dashboard') : undefined}
          t={t}
        />
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && activeProfile && (
        <Dashboard 
          profile={activeProfile}
          profiles={profiles}
          journals={journals.filter(j => j.profileId === activeProfile.id)}
          onSwitchProfile={(id: string) => setActiveProfileId(id)}
          onAddProfile={() => setView('profile')}
          onOpenJournal={(id: string) => { setActiveJournalId(id); setView('editor'); }}
          onCreateJournal={handleCreateJournal}
          t={t}
        />
      )}

      {/* VIEW: EDITOR */}
      {view === 'editor' && activeJournal && activeProfile && (
        <JournalEditor 
          journal={activeJournal}
          profile={activeProfile}
          onUpdate={(updatedJournal: MonthJournal) => {
            setJournals(journals.map(j => j.id === updatedJournal.id ? updatedJournal : j));
          }}
          onBack={() => setView('dashboard')}
          onPrint={() => setView('print')}
          t={t}
        />
      )}

      {/* VIEW: PRINT PREVIEW (With Direct PDF Download) */}
      {view === 'print' && activeJournal && activeProfile && (
        <div className="min-h-screen bg-gray-600 flex flex-col items-center">
          <div className="no-print fixed top-0 w-full bg-white shadow-md z-50 p-4 flex justify-between items-center">
             <button onClick={() => setView('editor')} className="flex items-center text-gray-700 font-medium hover:text-blue-700">
               <ArrowLeft className="w-5 h-5 mr-1" /> {t.backToEdit}
             </button>
             
             {/* DIRECT DOWNLOAD BUTTON */}
             <button 
               onClick={handleDownloadPDF} 
               disabled={isDownloading}
               className={`flex items-center text-white px-6 py-2 rounded-lg shadow-lg font-bold transition-all ${isDownloading ? 'bg-gray-400 cursor-wait' : 'bg-green-600 hover:bg-green-700'}`}
             >
               {isDownloading ? (
                 <span>{t.downloading}</span>
               ) : (
                 <>
                   <Download className="w-5 h-5 mr-2" /> {t.downloadPdf}
                 </>
               )}
             </button>
          </div>
          
          <div className="mt-20 mb-10 w-full flex justify-center overflow-auto p-4">
             {/* This container will be converted to PDF */}
             <div className="bg-white shadow-2xl scale-[0.6] md:scale-90 origin-top"> 
                <PrintLayout journal={activeJournal} profile={activeProfile} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB COMPONENTS ---

const ProfileManager = ({ onSave, onCancel, t }: any) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    branch: 'TFC/OPTS', division: 'PUNE', headquarters: 'KARAD',
    name: '', designation: '', pay: '', level: 'Level-2', pfNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.name) {
      onSave({ ...formData, id: Date.now().toString() } as UserProfile);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white min-h-screen md:min-h-0 md:rounded-xl md:shadow-lg md:mt-10">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">{t.setupProfile}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label className="block text-sm font-medium text-gray-700">Full Name</label>
           <input required className={`w-full border-gray-300 border p-3 rounded-lg focus:ring-2 ring-blue-500 uppercase ${INPUT_BLUE_INK}`} 
             value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. MILIND D. MANUGADE" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <input required className={`w-full border-gray-300 border p-3 rounded-lg uppercase ${INPUT_BLUE_INK}`} 
              value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="PMA/SS" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Station</label>
            <input required className={`w-full border-gray-300 border p-3 rounded-lg uppercase ${INPUT_BLUE_INK}`} 
              value={formData.station} onChange={e => setFormData({...formData, station: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pay (Rs)</label>
            <input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_BLUE_INK}`} 
              value={formData.pay} onChange={e => setFormData({...formData, pay: e.target.value})} placeholder="24500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_BLUE_INK}`} 
              value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">P.F. Number</label>
           <input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_BLUE_INK}`} 
             value={formData.pfNumber} onChange={e => setFormData({...formData, pfNumber: e.target.value})} />
        </div>
        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
           <div>
             <label className="block text-xs font-medium text-gray-500">Branch</label>
             <input className={`w-full bg-white border p-2 rounded text-sm uppercase ${INPUT_BLUE_INK}`} value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-500">Division</label>
             <input className={`w-full bg-white border p-2 rounded text-sm uppercase ${INPUT_BLUE_INK}`} value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-500">HQ</label>
             <input className={`w-full bg-white border p-2 rounded text-sm uppercase ${INPUT_BLUE_INK}`} value={formData.headquarters} onChange={e => setFormData({...formData, headquarters: e.target.value})} />
           </div>
        </div>
        
        <button type="submit" className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold text-lg shadow-lg mt-6 active:scale-95 transition-transform">{t.saveProfile}</button>
        {onCancel && <button type="button" onClick={onCancel} className="w-full text-gray-500 p-3 mt-2 font-medium">{t.cancel}</button>}
      </form>
    </div>
  );
};

const Dashboard = ({ profile, profiles, journals, onSwitchProfile, onAddProfile, onOpenJournal, onCreateJournal, t }: any) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'profile'>('history');

  return (
    <div className="pb-24">
       {/* HEADER */}
       <div className="p-4 bg-white shadow-sm sticky top-0 z-20">
         <div className="flex justify-between items-center max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200 cursor-pointer"
              >
                {profile.name.charAt(0)}
              </div>
              <div>
                  <h1 className="text-xs font-bold text-gray-400 uppercase tracking-wide">{t.welcome}</h1>
                  <div 
                    onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                    className="text-blue-900 font-bold text-sm flex items-center cursor-pointer leading-tight"
                  >
                    {profile.name} <Settings className="w-3 h-3 ml-1" />
                  </div>
              </div>
            </div>
         </div>
       </div>

       {showProfileSwitcher && (
         <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setShowProfileSwitcher(false)}>
            <div className="absolute top-16 left-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-64 animate-fade-in-up" onClick={e => e.stopPropagation()}>
              <h3 className="text-xs font-bold mb-3 text-gray-400 uppercase tracking-wider">{t.switchProfile}</h3>
              <div className="space-y-2">
                {profiles.map((p: any) => (
                  <button key={p.id} onClick={() => { onSwitchProfile(p.id); setShowProfileSwitcher(false); }} 
                    className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-colors ${p.id === profile.id ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'hover:bg-gray-50'}`}>
                    <span className="font-semibold text-sm truncate">{p.name}</span>
                  </button>
                ))}
                <button onClick={onAddProfile} className="w-full flex items-center justify-center p-3 text-blue-600 font-bold border-t mt-2 hover:bg-blue-50 rounded-b-lg text-sm">
                  <UserPlus className="w-4 h-4 mr-2" /> {t.addNewProfile}
                </button>
              </div>
            </div>
         </div>
       )}

       <div className="p-4 max-w-2xl mx-auto">
         {/* TABS CONTENT */}
         {activeTab === 'history' && (
           <>
             <h3 className="font-bold text-gray-500 text-sm mb-4 px-1 uppercase tracking-wider flex items-center mt-2">
                <History className="w-4 h-4 mr-2" /> {t.recent}
             </h3>
             <div className="space-y-3">
               {journals.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                   <div className="text-gray-300 mb-3"><FileText className="w-12 h-12 mx-auto" /></div>
                   <p className="text-gray-400 font-medium">{t.noJournals}</p>
                 </div>
               ) : (
                 journals.map((j: MonthJournal) => (
                   <div key={j.id} onClick={() => onOpenJournal(j.id)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:shadow-md transition active:bg-gray-50">
                      <div className="flex items-center">
                        <div className="bg-blue-50 text-blue-700 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm mr-4 border border-blue-100">
                          {j.month.substring(0,3)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{j.month} {j.year}</h4>
                          <p className="text-xs text-gray-500 font-medium">{j.entries.length} {t.entries}</p>
                        </div>
                      </div>
                      <ArrowLeft className="w-5 h-5 rotate-180 text-gray-300" />
                   </div>
                 ))
               )}
             </div>
           </>
         )}

         {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
               <h3 className="font-bold text-lg mb-4">{t.profile}</h3>
               <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase">Name</label>
                    <div className="font-bold text-gray-800">{profile.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 font-bold uppercase">Designation</label>
                      <div className="font-medium text-gray-700">{profile.designation}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-bold uppercase">Station</label>
                      <div className="font-medium text-gray-700">{profile.station}</div>
                    </div>
                  </div>
                  <button onClick={onAddProfile} className="w-full mt-4 bg-gray-100 text-gray-600 py-2 rounded-lg font-bold text-sm">
                    {t.switchProfile} / Edit
                  </button>
               </div>
            </div>
         )}
       </div>

       {/* DEVELOPER FOOTER */}
       <div className="text-center text-[10px] text-gray-400 mt-8 mb-4">
          {t.developer} <span className="font-bold">{DEVELOPER_NAME}</span>
       </div>

       {/* BOTTOM NAVIGATION BAR */}
       <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-100 z-40">
          <div className="flex justify-around items-center max-w-2xl mx-auto h-16 relative">
             <button 
               onClick={() => setActiveTab('history')} 
               className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'history' ? 'text-blue-700' : 'text-gray-400'}`}
             >
               <Home className="w-6 h-6 mb-1" />
               <span className="text-[10px] font-bold">{t.history}</span>
             </button>

             {/* MAIN ACTION: NEW MONTH TAB */}
             <div className="relative -top-6">
                <button 
                  onClick={() => setShowMonthPicker(true)}
                  className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-300 flex items-center justify-center transform active:scale-95 transition-all border-4 border-white"
                >
                  <Plus className="w-8 h-8" />
                </button>
                <div className="text-center text-[10px] font-bold text-blue-700 mt-1 absolute w-24 -left-5 bg-white/80 rounded px-1">
                   {t.newMonth}
                </div>
             </div>

             <button 
               onClick={() => setActiveTab('profile')} 
               className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'profile' ? 'text-blue-700' : 'text-gray-400'}`}
             >
               <User className="w-6 h-6 mb-1" />
               <span className="text-[10px] font-bold">{t.profile}</span>
             </button>
          </div>
       </div>

       {/* Month Picker Modal */}
       {showMonthPicker && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl p-6 w-full max-w-xs animate-fade-in-up shadow-2xl">
             <div className="flex items-center justify-center mb-4 text-blue-600">
               <Calendar className="w-10 h-10" />
             </div>
             <h3 className="font-bold text-xl mb-6 text-gray-800 text-center">{t.selectPeriod}</h3>
             <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 ml-1">MONTH</label>
                  <select className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-50 font-semibold" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 ml-1">YEAR</label>
                   <select className="w-full border-2 border-gray-200 p-3 rounded-xl bg-gray-50 font-semibold" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                    {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                   </select>
                </div>
             </div>
             <div className="flex gap-3">
               <button className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold" onClick={() => setShowMonthPicker(false)}>{t.cancel}</button>
               <button className="flex-1 bg-blue-700 text-white p-3 rounded-xl font-bold shadow-lg" onClick={() => { onCreateJournal(selectedMonth, selectedYear); setShowMonthPicker(false); }}>{t.create}</button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

const JournalEditor = ({ journal, profile, onUpdate, onBack, onPrint, t }: any) => {
  const [entries, setEntries] = useState<TAEntry[]>(journal.entries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  
  // Auto Save Logic
  useEffect(() => {
     onUpdate({ ...journal, entries });
  }, [entries]);

  // Handle Back Button Click
  const handleBack = () => {
    // Show warning if there are entries, or just always show it for safety as requested
    setShowUnsavedWarning(true);
  };

  const addEntry = () => {
    // UNLIMITED ENTRIES ALLOWED - Pagination handled in PrintLayout
    const newEntry = { ...INITIAL_ENTRY, id: Date.now().toString() };
    setEntries([...entries, newEntry]);
    setEditingId(newEntry.id);
  };

  const updateEntry = (id: string, field: keyof TAEntry, value: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const deleteEntry = (id: string) => {
    if(confirm(t.deleteRow)) {
      setEntries(entries.filter(e => e.id !== id));
      if(editingId === id) setEditingId(null);
    }
  };

  const duplicateEntry = (entry: TAEntry) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setEntries([...entries, newEntry]);
    setEditingId(newEntry.id);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white text-gray-800 p-3 shadow-md z-30 sticky top-0 flex justify-between items-center border-b border-gray-200">
         <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft className="w-6 h-6 text-gray-700" /></button>
         <div className="text-center">
            <h2 className="font-bold text-lg">{journal.month} {journal.year}</h2>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Official TA Journal</p>
         </div>
         <button onClick={onPrint} className="p-2 rounded-full hover:bg-blue-50 text-blue-700 flex flex-col items-center">
             <Printer className="w-6 h-6" />
         </button>
      </div>

      {/* Warning Popup */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl p-6 w-full max-w-sm border-t-4 border-red-500 shadow-2xl animate-fade-in-up">
              <h3 className="text-xl font-bold text-red-600 mb-2 flex items-center">
                <AlertTriangle className="mr-2" /> {t.unsavedTitle}
              </h3>
              <p className="text-gray-700 font-medium mb-6">{t.unsavedMsg}</p>
              <div className="flex justify-end gap-3">
                 <button onClick={() => setShowUnsavedWarning(false)} className="px-5 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold">{t.cancel}</button>
                 <button onClick={() => { setShowUnsavedWarning(false); onBack(); }} className="px-5 py-2 bg-red-600 text-white rounded-lg font-bold shadow-lg">{t.exitAnyway}</button>
              </div>
           </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-32 scroll-smooth">
         {entries.length === 0 && (
           <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <div className="bg-white p-6 rounded-full shadow-sm mb-4">
               <Plus className="w-8 h-8 text-blue-300" />
             </div>
             <p className="font-medium">{t.tapToAdd}</p>
           </div>
         )}
         
         {entries.map((entry, index) => {
           const isEditing = editingId === entry.id;
           return (
             <div key={entry.id} className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02] z-10 my-4' : 'border border-gray-100'}`}>
                {/* Collapsed View */}
                {!isEditing && (
                  <div className="p-4 flex justify-between items-center active:bg-gray-50 cursor-pointer" onClick={() => setEditingId(entry.id)}>
                     <div className="flex items-center gap-4">
                        <div className="bg-gray-100 px-3 py-2 rounded-lg text-center min-w-[3.5rem] border border-gray-200">
                           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.dateFormat}</div>
                           <div className="font-bold text-blue-900 text-lg font-mono">{entry.date || '--'}</div>
                        </div>
                        <div>
                           <div className="font-bold text-gray-800 text-lg flex items-center">
                              {entry.stationFrom || '?'} 
                              <span className="text-gray-300 mx-2 text-sm">➜</span> 
                              {entry.stationTo || '?'}
                           </div>
                           <div className="text-xs text-gray-500 font-medium mt-1 flex gap-2">
                             <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{entry.trainNo || 'No Train'}</span>
                             <span>{entry.kms}km</span>
                             <span>{entry.dayNightPercent}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* Expanded Edit View */}
                {isEditing && (
                  <div className="bg-white">
                     <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                       <span className="font-bold text-sm flex items-center"><FileText className="w-4 h-4 mr-2" /> {t.fillDetails}</span>
                       <div className="flex gap-1">
                          <button onClick={() => duplicateEntry(entry)} className="p-2 bg-blue-500 rounded hover:bg-blue-400 text-white"><Copy size={16} /></button>
                          <button onClick={() => deleteEntry(entry.id)} className="p-2 bg-red-500 rounded hover:bg-red-400 text-white"><Trash2 size={16} /></button>
                       </div>
                     </div>
                     
                     <div className="p-4 space-y-4">
                        {/* Row 1 */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.dateFormat}</label>
                              <input type="text" className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors text-center ${INPUT_BLUE_INK}`} placeholder="DD-MM" 
                                value={entry.date} onChange={e => updateEntry(entry.id, 'date', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.trainNo}</label>
                              <input type="text" className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors text-center ${INPUT_BLUE_INK}`} 
                                value={entry.trainNo} onChange={e => updateEntry(entry.id, 'trainNo', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.rate}</label>
                              <input type="text" className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors text-center ${INPUT_BLUE_INK}`} 
                                value={entry.rate} onChange={e => updateEntry(entry.id, 'rate', e.target.value)} />
                            </div>
                        </div>

                        {/* Row 2: Stations */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.from}</label>
                              <input type="text" className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors ${INPUT_BLUE_INK}`} 
                                value={entry.stationFrom} onChange={e => updateEntry(entry.id, 'stationFrom', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.to}</label>
                              <input type="text" className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors ${INPUT_BLUE_INK}`} 
                                value={entry.stationTo} onChange={e => updateEntry(entry.id, 'stationTo', e.target.value)} />
                            </div>
                        </div>

                        {/* Row 3: Time */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.depart}</label>
                              <input type="time" className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors ${INPUT_BLUE_INK}`} 
                                value={entry.departTime} onChange={e => updateEntry(entry.id, 'departTime', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.arrive}</label>
                              <input type="time" className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors ${INPUT_BLUE_INK}`} 
                                value={entry.arriveTime} onChange={e => updateEntry(entry.id, 'arriveTime', e.target.value)} />
                            </div>
                        </div>

                        {/* Row 4: Details */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.kms}</label>
                              <input type="number" className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors text-center ${INPUT_BLUE_INK}`} 
                                value={entry.kms} onChange={e => updateEntry(entry.id, 'kms', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.percent}</label>
                              <select className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors ${INPUT_BLUE_INK}`} value={entry.dayNightPercent} onChange={e => updateEntry(entry.id, 'dayNightPercent', e.target.value)}>
                                 <option value="100%">100%</option>
                                 <option value="70%">70%</option>
                                 <option value="30%">30%</option>
                              </select>
                            </div>
                             <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 tracking-wider">{t.purpose}</label>
                              <input type="text" className={`w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors text-center ${INPUT_BLUE_INK}`} 
                                value={entry.purpose} onChange={e => updateEntry(entry.id, 'purpose', e.target.value)} />
                            </div>
                        </div>

                        <button onClick={() => setEditingId(null)} className="w-full bg-blue-600 active:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center text-lg mt-4">
                           <Save className="w-5 h-5 mr-2" /> {t.done}
                        </button>
                     </div>
                  </div>
                )}
             </div>
           );
         })}
      </div>

      {/* FAB */}
      <button onClick={addEntry} className="fixed bottom-20 right-6 text-white p-4 rounded-full shadow-xl shadow-blue-300 transition-transform active:scale-95 z-30 bg-blue-600 hover:bg-blue-700">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}