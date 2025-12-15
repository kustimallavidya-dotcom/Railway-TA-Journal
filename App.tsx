import React, { useState, useEffect } from 'react';
import { User, FileText, Plus, Save, Printer, ArrowLeft, Trash2, Copy, AlertTriangle, Settings, UserPlus, Home, Calendar, History, Download, TrainFront, Share2 } from 'lucide-react';
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
    tapToAdd: "Tap + to add a daily journey",
    limitReached: "Limit Reached! Maximum 26 rows per journal.",
    developer: "Developed by"
  }
};

// --- STYLE CONSTANTS FOR INPUTS (Black & Extra Bold) ---
const INPUT_STYLE = "text-black font-extrabold uppercase handwriting tracking-wider placeholder-gray-400";

// --- SVG LOGO COMPONENT (Eliminates need for external image file) ---
const RailwayLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
    </defs>
    {/* Outer Ring */}
    <circle cx="100" cy="100" r="95" fill="#1e3a8a" stroke="white" strokeWidth="4" filter="url(#shadow)" />
    {/* Inner White Circle */}
    <circle cx="100" cy="100" r="70" fill="white" />
    {/* Stars */}
    <circle cx="100" cy="15" r="3" fill="white" />
    <circle cx="100" cy="185" r="3" fill="white" />
    <circle cx="15" cy="100" r="3" fill="white" />
    <circle cx="185" cy="100" r="3" fill="white" />
    
    {/* Text Curve Path Top */}
    <path id="curveTop" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
    {/* Text Curve Path Bottom */}
    <path id="curveBottom" d="M 35,100 A 65,65 0 0,0 165,100" fill="none" />

    {/* Text */}
    <text width="200" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2">
      {/* @ts-ignore */}
      <textPath xlinkHref="#curveTop" startOffset="50%" textAnchor="middle" side="left">
        INDIAN RAILWAYS
      </textPath>
    </text>
    
    <text width="200" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2">
       {/* @ts-ignore */}
       <textPath xlinkHref="#curveBottom" startOffset="50%" textAnchor="middle" side="right">
        भारतीय रेल
      </textPath>
    </text>

    {/* Train Engine Icon Center */}
    <g transform="translate(65, 65) scale(0.35)">
       <path fill="#1e3a8a" d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/>
       <path fill="#d97706" d="M140 130H60v-60h80v60zm-10-50H70v40h60V80z"/>
       <circle fill="#1e3a8a" cx="75" cy="145" r="10"/>
       <circle fill="#1e3a8a" cx="125" cy="145" r="10"/>
       <rect fill="#1e3a8a" x="95" y="60" width="10" height="20"/>
    </g>
  </svg>
);

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
    
    const fileName = `TA_Journal_${activeJournal.month}_${activeJournal.year}.pdf`;

    // PDF Configuration
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // Use html2pdf lib
    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      const worker = window.html2pdf().set(opt).from(element);
      
      // LOGIC: Instead of just saving, we try to Share first
      worker.output('blob').then(async (blob: Blob) => {
         const file = new File([blob], fileName, { type: 'application/pdf' });
         
         // Check if Web Share API is supported and can share files
         if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
               await navigator.share({
                  files: [file],
                  title: 'Railway TA Journal',
                  text: `Here is the TA Journal for ${activeJournal.month} ${activeJournal.year}`
               });
               setIsDownloading(false);
            } catch (error: any) {
               // User cancelled share or error
               if (error.name !== 'AbortError') {
                  console.log('Share failed, saving instead');
                  worker.save().then(() => setIsDownloading(false));
               } else {
                  setIsDownloading(false);
               }
            }
         } else {
            // Fallback for desktop or unsupported browsers
            worker.save().then(() => setIsDownloading(false));
         }
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
        
        {/* Updated Splash Logo - Using Internal Component instead of File */}
        <div className="animate-pulse mb-8 relative z-10 p-4 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] border-4 border-blue-800">
           <RailwayLogo className="w-32 h-32" />
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
             
             {/* SHARE / DOWNLOAD BUTTON */}
             <button 
               onClick={handleDownloadPDF} 
               disabled={isDownloading}
               className={`flex items-center text-white px-6 py-2 rounded-lg shadow-lg font-bold transition-all ${isDownloading ? 'bg-gray-400 cursor-wait' : 'bg-green-600 hover:bg-green-700'}`}
             >
               {isDownloading ? (
                 <span>{t.downloading}</span>
               ) : (
                 <>
                   <Share2 className="w-5 h-5 mr-2" /> {t.downloadPdf}
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
           <input required className={`w-full border-gray-300 border p-3 rounded-lg focus:ring-2 ring-blue-500 uppercase ${INPUT_STYLE}`} 
             value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. MILIND D. MANUGADE" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <input required className={`w-full border-gray-300 border p-3 rounded-lg uppercase ${INPUT_STYLE}`} 
              value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="PMA/SS" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Station</label>
            <input required className={`w-full border-gray-300 border p-3 rounded-lg uppercase ${INPUT_STYLE}`} 
              value={formData.station} onChange={e => setFormData({...formData, station: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pay (Rs)</label>
            <input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_STYLE}`} 
              value={formData.pay} onChange={e => setFormData({...formData, pay: e.target.value})} placeholder="24500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_STYLE}`} 
              value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">P.F. Number</label>
           <input required className={`w-full border-gray-300 border p-3 rounded-lg ${INPUT_STYLE}`} 
             value={formData.pfNumber} onChange={e => setFormData({...formData, pfNumber: e.target.value})} />
        </div>
        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
           <div>
             <label className="block text-xs font-medium text-gray-500">Branch</label>
             <input className={`w-full bg-white border p-2 rounded text-sm uppercase ${INPUT_STYLE}`} value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-500">Division</label>
             <input className={`w-full bg-white border p-2 rounded text-sm uppercase ${INPUT_STYLE}`} value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-500">HQ</label>
             <input className={`w-full bg-white border p-2 rounded text-sm uppercase ${INPUT_STYLE}`} value={formData.headquarters} onChange={e => setFormData({...formData, headquarters: e.target.value})} />
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
}

const JournalEditor = ({ journal, profile, onUpdate, onBack, onPrint, t }: any) => {
  const [entries, setEntries] = useState<TAEntry[]>(journal.entries || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TAEntry | null>(null);
  const [newEntry, setNewEntry] = useState<TAEntry>({ ...INITIAL_ENTRY, id: '' });
  
  // Sync with parent whenever local entries are modified
  const updateEntries = (newEntries: TAEntry[]) => {
      setEntries(newEntries);
      onUpdate({ ...journal, entries: newEntries });
  };

  const handleSaveEntry = () => {
     let updatedEntries;
     if (editingEntry) {
        updatedEntries = entries.map(e => e.id === editingEntry.id ? { ...newEntry, id: editingEntry.id } : e);
     } else {
        updatedEntries = [...entries, { ...newEntry, id: Date.now().toString() }];
     }
     updateEntries(updatedEntries);
     
     setShowAddModal(false);
     setEditingEntry(null);
     setNewEntry({ ...INITIAL_ENTRY, id: '' });
  };

  const handleDeleteEntry = (id: string) => {
     if (window.confirm(t.deleteRow)) {
        updateEntries(entries.filter(e => e.id !== id));
     }
  };
  
  const handleEdit = (entry: TAEntry) => {
     setNewEntry(entry);
     setEditingEntry(entry);
     setShowAddModal(true);
  };

  const handleDuplicate = (entry: TAEntry) => {
     const duplicated = { ...entry, id: Date.now().toString() };
     updateEntries([...entries, duplicated]);
  };

  const totalAmount = entries.reduce((sum, e) => sum + (parseFloat(e.rate) || 0), 0);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20 p-4 border-b">
         <div className="flex justify-between items-center max-w-2xl mx-auto">
            <button onClick={onBack} className="text-gray-600"><ArrowLeft /></button>
            <div className="text-center">
              <h2 className="font-bold text-lg">{journal.month} {journal.year}</h2>
              <p className="text-xs text-gray-500 font-bold">Total: ₹{totalAmount}</p>
            </div>
            <button onClick={onPrint} className="text-blue-700 font-medium text-sm flex items-center bg-blue-50 px-3 py-1 rounded-full">
              <Printer className="w-4 h-4 mr-1" /> {t.printPdf}
            </button>
         </div>
      </div>

      {/* Entries List */}
      <div className="max-w-2xl mx-auto p-4 space-y-3">
         {entries.length === 0 && (
           <div className="text-center py-10 opacity-50">
             <p>{t.tapToAdd}</p>
           </div>
         )}
         
         {entries.map((entry) => (
           <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute top-3 right-3 flex gap-3">
                 <button onClick={() => handleEdit(entry)} className="text-gray-400 hover:text-blue-600"><Settings className="w-4 h-4" /></button>
                 <button onClick={() => handleDuplicate(entry)} className="text-gray-400 hover:text-green-600"><Copy className="w-4 h-4" /></button>
                 <button onClick={() => handleDeleteEntry(entry.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-4 text-sm mb-2 items-start">
                 <div className="bg-blue-50 text-blue-800 p-2 rounded-lg text-center min-w-[60px]">
                    <span className="text-[10px] font-bold block text-blue-400 uppercase">Date</span>
                    <span className="font-mono font-bold text-lg leading-none">{entry.date.split('/')[0]}</span>
                 </div>
                 <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">Train</span>
                        <span className="font-mono font-bold bg-gray-100 px-1 rounded">{entry.trainNo}</span>
                    </div>
                    <div className="flex items-center text-xs font-mono text-gray-600">
                         <span>{entry.stationFrom}</span>
                         <span className="mx-1">→</span>
                         <span>{entry.stationTo}</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex justify-between items-end border-t pt-2 mt-2">
                 <div className="text-xs font-medium text-gray-500 max-w-[70%] truncate">{entry.purpose}</div>
                 <div className="font-bold text-lg text-green-700">₹ {entry.rate}</div>
              </div>
           </div>
         ))}
         
         <div className="h-10"></div> {/* Spacer */}
      </div>

       {/* Floating Action Button */}
       <button 
          onClick={() => { setNewEntry({...INITIAL_ENTRY, id: ''}); setEditingEntry(null); setShowAddModal(true); }} 
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30"
       >
          <Plus className="w-8 h-8" />
       </button>

      {/* Modal for Add/Edit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
           <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 h-[90vh] sm:h-auto overflow-y-auto animate-slide-up shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                 <h3 className="text-xl font-bold text-gray-800">{editingEntry ? 'Edit Entry' : t.fillDetails}</h3>
                 <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><ArrowLeft className="w-5 h-5" /></button>
              </div>
              
              <div className="space-y-5 overflow-y-auto flex-1 pb-20 sm:pb-0">
                 {/* Row 1 */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">{t.dateFormat}</label>
                      <input type="text" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className={`w-full border-gray-300 border p-3 rounded-xl focus:ring-2 ring-blue-500 outline-none ${INPUT_STYLE}`} placeholder="DD/MM" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">{t.trainNo}</label>
                      <input type="text" value={newEntry.trainNo} onChange={e => setNewEntry({...newEntry, trainNo: e.target.value})} className={`w-full border-gray-300 border p-3 rounded-xl focus:ring-2 ring-blue-500 outline-none ${INPUT_STYLE}`} placeholder="12345" />
                    </div>
                 </div>

                 {/* Row 2 - From/To */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                     <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center mb-3">
                        <div>
                           <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">{t.from}</label>
                           <input type="text" value={newEntry.stationFrom} onChange={e => setNewEntry({...newEntry, stationFrom: e.target.value})} className={`w-full border-gray-300 border p-2 rounded-lg text-center ${INPUT_STYLE}`} placeholder="STN" />
                        </div>
                        <div className="text-gray-300 mt-4">➔</div>
                        <div>
                           <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">{t.to}</label>
                           <input type="text" value={newEntry.stationTo} onChange={e => setNewEntry({...newEntry, stationTo: e.target.value})} className={`w-full border-gray-300 border p-2 rounded-lg text-center ${INPUT_STYLE}`} placeholder="STN" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" value={newEntry.departTime} onChange={e => setNewEntry({...newEntry, departTime: e.target.value})} className={`w-full border-gray-300 border p-2 rounded-lg text-center ${INPUT_STYLE}`} placeholder="Dep HH:MM" />
                        <input type="text" value={newEntry.arriveTime} onChange={e => setNewEntry({...newEntry, arriveTime: e.target.value})} className={`w-full border-gray-300 border p-2 rounded-lg text-center ${INPUT_STYLE}`} placeholder="Arr HH:MM" />
                     </div>
                 </div>

                 {/* Row 3 */}
                 <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">{t.kms}</label>
                      <input type="number" value={newEntry.kms} onChange={e => setNewEntry({...newEntry, kms: e.target.value})} className={`w-full border-gray-300 border p-3 rounded-xl ${INPUT_STYLE}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">{t.percent}</label>
                      <select value={newEntry.dayNightPercent} onChange={e => setNewEntry({...newEntry, dayNightPercent: e.target.value})} className={`w-full border-gray-300 border p-3 rounded-xl bg-white ${INPUT_STYLE}`}>
                        <option value="100%">100%</option>
                        <option value="70%">70%</option>
                        <option value="30%">30%</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">{t.rate}</label>
                      <input type="number" value={newEntry.rate} onChange={e => setNewEntry({...newEntry, rate: e.target.value})} className={`w-full border-gray-300 border p-3 rounded-xl ${INPUT_STYLE}`} />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">{t.purpose}</label>
                    <input type="text" value={newEntry.purpose} onChange={e => setNewEntry({...newEntry, purpose: e.target.value})} className={`w-full border-gray-300 border p-3 rounded-xl ${INPUT_STYLE}`} />
                 </div>
              </div>
              
              <div className="pt-4 border-t mt-4 sticky bottom-0 bg-white">
                   <button onClick={handleSaveEntry} className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex justify-center items-center text-lg">
                     <Save className="w-6 h-6 mr-2" /> {t.done}
                   </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}