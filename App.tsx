import React, { useState, useEffect, useRef } from 'react';
import { User, FileText, Plus, Save, Printer, ArrowLeft, Trash2, Copy, AlertTriangle, Settings, UserPlus } from 'lucide-react';
import { UserProfile, MonthJournal, TAEntry } from './types';
import { ROWS_PER_PAGE, MONTHS, INITIAL_ENTRY } from './constants';
import { PrintLayout } from './components/PrintLayout';
import { AdComponent } from './components/AdComponent';

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState<'splash' | 'dashboard' | 'editor' | 'profile' | 'print'>('splash');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [journals, setJournals] = useState<MonthJournal[]>([]);
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
  
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
      setView(savedProfiles && JSON.parse(savedProfiles).length > 0 ? 'dashboard' : 'profile');
      if (savedProfiles) {
         const p = JSON.parse(savedProfiles);
         if(p.length > 0) setActiveProfileId(p[0].id);
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

  // --- RENDER VIEWS ---

  if (view === 'splash') {
    return (
      <div className="h-screen w-full bg-blue-900 flex flex-col items-center justify-center text-white p-4">
        <div className="animate-bounce mb-6">
           <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center">Railway TA Manager</h1>
        <p className="text-blue-200">Official Travelling Allowance App</p>
        <div className="mt-12 text-sm opacity-70 absolute bottom-10">
          Developed By Milind Manugade
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full animate-fade-in-up">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Install App</h3>
            <p className="text-gray-600 mb-4">Install Railway TA App for easier monthly claims and offline access.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowInstallModal(false)} className="text-gray-500 font-medium">Later</button>
              <button onClick={handleInstallApp} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">Install Now</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PROFILE MANAGER */}
      {view === 'profile' && (
        <ProfileManager 
          onSave={handleCreateProfile} 
          onCancel={profiles.length > 0 ? () => setView('dashboard') : undefined} 
        />
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && activeProfile && (
        <Dashboard 
          profile={activeProfile}
          profiles={profiles}
          journals={journals.filter(j => j.profileId === activeProfile.id)}
          onSwitchProfile={(id) => setActiveProfileId(id)}
          onAddProfile={() => setView('profile')}
          onOpenJournal={(id) => { setActiveJournalId(id); setView('editor'); }}
          onCreateJournal={handleCreateJournal}
        />
      )}

      {/* VIEW: EDITOR */}
      {view === 'editor' && activeJournal && activeProfile && (
        <JournalEditor 
          journal={activeJournal}
          profile={activeProfile}
          onUpdate={(updatedJournal) => {
            setJournals(journals.map(j => j.id === updatedJournal.id ? updatedJournal : j));
          }}
          onBack={() => setView('dashboard')}
          onPrint={() => setView('print')}
        />
      )}

      {/* VIEW: PRINT PREVIEW */}
      {view === 'print' && activeJournal && activeProfile && (
        <div className="min-h-screen bg-gray-200">
          <div className="no-print fixed top-0 w-full bg-white shadow-md z-10 p-4 flex justify-between items-center">
             <button onClick={() => setView('editor')} className="flex items-center text-gray-700 font-medium">
               <ArrowLeft className="w-5 h-5 mr-1" /> Back to Edit
             </button>
             <button onClick={() => window.print()} className="flex items-center bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800">
               <Printer className="w-5 h-5 mr-2" /> Print PDF
             </button>
          </div>
          <div className="pt-20 pb-10 px-4 overflow-auto">
             <div className="bg-white shadow-2xl mx-auto p-0"> 
                {/* Print Layout Component Injected Here */}
                <PrintLayout journal={activeJournal} profile={activeProfile} />
             </div>
          </div>
        </div>
      )}

      <AdComponent type="banner" />
    </div>
  );
}

// --- SUB COMPONENTS ---

const ProfileManager = ({ onSave, onCancel }: { onSave: (p: UserProfile) => void, onCancel?: () => void }) => {
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
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Setup Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label className="block text-sm font-medium text-gray-700">Full Name</label>
           <input required className="w-full border p-2 rounded focus:ring-2 ring-blue-500 uppercase" 
             value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Milind D. Manugade" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <input required className="w-full border p-2 rounded uppercase" 
              value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="PMA/SS" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Station</label>
            <input required className="w-full border p-2 rounded uppercase" 
              value={formData.station} onChange={e => setFormData({...formData, station: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pay (Rs)</label>
            <input required className="w-full border p-2 rounded" 
              value={formData.pay} onChange={e => setFormData({...formData, pay: e.target.value})} placeholder="24500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input required className="w-full border p-2 rounded" 
              value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">P.F. Number</label>
           <input required className="w-full border p-2 rounded" 
             value={formData.pfNumber} onChange={e => setFormData({...formData, pfNumber: e.target.value})} />
        </div>
        <div className="grid grid-cols-3 gap-2">
           <div>
             <label className="block text-xs font-medium text-gray-700">Branch</label>
             <input className="w-full border p-2 rounded text-sm uppercase" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-700">Division</label>
             <input className="w-full border p-2 rounded text-sm uppercase" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-700">HQ</label>
             <input className="w-full border p-2 rounded text-sm uppercase" value={formData.headquarters} onChange={e => setFormData({...formData, headquarters: e.target.value})} />
           </div>
        </div>
        
        <button type="submit" className="w-full bg-blue-700 text-white p-3 rounded-lg font-bold mt-4">Save Profile</button>
        {onCancel && <button type="button" onClick={onCancel} className="w-full text-gray-500 p-3 mt-2">Cancel</button>}
      </form>
    </div>
  );
};

const Dashboard = ({ profile, profiles, journals, onSwitchProfile, onAddProfile, onOpenJournal, onCreateJournal }: any) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  return (
    <div className="p-4 max-w-2xl mx-auto">
       <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-xl font-bold text-gray-800">Welcome,</h1>
            <div 
              onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
              className="text-blue-700 font-bold text-lg flex items-center cursor-pointer"
            >
               {profile.name} <Settings className="w-4 h-4 ml-2" />
            </div>
         </div>
         <div className="bg-blue-100 p-2 rounded-full text-blue-800 font-bold">{profile.designation}</div>
       </div>

       {showProfileSwitcher && (
         <div className="mb-6 bg-white p-4 rounded-lg shadow border">
           <h3 className="text-sm font-bold mb-2">Switch Profile</h3>
           <div className="space-y-2">
             {profiles.map((p: any) => (
               <button key={p.id} onClick={() => { onSwitchProfile(p.id); setShowProfileSwitcher(false); }} 
                 className={`w-full text-left p-2 rounded ${p.id === profile.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'hover:bg-gray-50'}`}>
                 {p.name} <span className="text-xs text-gray-500">({p.station})</span>
               </button>
             ))}
             <button onClick={onAddProfile} className="w-full flex items-center p-2 text-blue-600 font-medium">
               <UserPlus className="w-4 h-4 mr-2" /> Add New Profile
             </button>
           </div>
         </div>
       )}

       <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
             onClick={() => setShowMonthPicker(true)}
          >
             <div className="bg-blue-600 text-white p-3 rounded-full mb-2">
               <Plus className="w-6 h-6" />
             </div>
             <span className="font-semibold text-gray-700">New TA Journal</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
             <div className="bg-green-600 text-white p-3 rounded-full mb-2">
               <FileText className="w-6 h-6" />
             </div>
             <span className="font-semibold text-gray-700">Total: {journals.length}</span>
          </div>
       </div>

       {showMonthPicker && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg p-6 w-full max-w-xs animate-fade-in-up">
             <h3 className="font-bold text-lg mb-4">Select Period</h3>
             <select className="w-full border p-2 rounded mb-3" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
               {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
             </select>
             <select className="w-full border p-2 rounded mb-6" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
               {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
             </select>
             <div className="flex gap-3">
               <button className="flex-1 bg-gray-200 p-2 rounded" onClick={() => setShowMonthPicker(false)}>Cancel</button>
               <button className="flex-1 bg-blue-700 text-white p-2 rounded font-bold" onClick={() => { onCreateJournal(selectedMonth, selectedYear); setShowMonthPicker(false); }}>Create</button>
             </div>
           </div>
         </div>
       )}

       <h3 className="font-bold text-gray-600 mb-3 px-1">Recent Journals</h3>
       <div className="space-y-3">
         {journals.length === 0 ? (
           <p className="text-gray-400 text-center py-8">No TA journals yet. Create one!</p>
         ) : (
           journals.map((j: MonthJournal) => (
             <div key={j.id} onClick={() => onOpenJournal(j.id)} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center cursor-pointer hover:shadow-md transition">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg mr-4">
                    {j.month.substring(0,3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{j.month} {j.year}</h4>
                    <p className="text-xs text-gray-500">{j.entries.length} Entries • Last modified just now</p>
                  </div>
                </div>
                <Printer className="text-gray-400 w-5 h-5" />
             </div>
           ))
         )}
       </div>
    </div>
  );
};

const JournalEditor = ({ journal, profile, onUpdate, onBack, onPrint }: { 
    journal: MonthJournal, 
    profile: UserProfile, 
    onUpdate: (j: MonthJournal) => void,
    onBack: () => void,
    onPrint: () => void
}) => {
  const [entries, setEntries] = useState<TAEntry[]>(journal.entries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  
  // Auto Save Logic
  useEffect(() => {
     onUpdate({ ...journal, entries });
  }, [entries]);

  const handleBack = () => {
    // Usually save is automatic, but if we had dirty unsaved input state, we'd check here.
    // Since we sync state immediately, we just check if empty? No, checking logic per user request.
    // Simulating "Unsaved" if currently in edit mode
    if (editingId) {
      setShowUnsavedWarning(true);
    } else {
      onBack();
    }
  };

  const addEntry = () => {
    const newEntry = { ...INITIAL_ENTRY, id: Date.now().toString() };
    setEntries([...entries, newEntry]);
    setEditingId(newEntry.id);
  };

  const updateEntry = (id: string, field: keyof TAEntry, value: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const deleteEntry = (id: string) => {
    if(confirm('Delete this row?')) {
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
      <div className="bg-blue-900 text-white p-4 shadow-md z-10 sticky top-0">
         <div className="flex justify-between items-center">
            <button onClick={handleBack}><ArrowLeft className="w-6 h-6" /></button>
            <div className="text-center">
               <h2 className="font-bold">{journal.month} {journal.year}</h2>
               <p className="text-xs text-blue-200">Official TA Journal</p>
            </div>
            <button onClick={onPrint}><Printer className="w-6 h-6" /></button>
         </div>
      </div>

      {/* Warning Popup */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-lg p-6 w-full max-w-sm border-l-4 border-red-500 shadow-2xl">
              <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center">
                <AlertTriangle className="mr-2" /> Unsaved Changes
              </h3>
              <p className="text-gray-700 font-medium mb-4">तुमची माहिती सेव्ह केलेली नाही. बाहेर जायचे आहे का?</p>
              <div className="flex justify-end gap-3">
                 <button onClick={() => setShowUnsavedWarning(false)} className="px-4 py-2 bg-gray-200 rounded text-gray-700">Cancel</button>
                 <button onClick={() => { setShowUnsavedWarning(false); onBack(); }} className="px-4 py-2 bg-red-600 text-white rounded font-bold">Exit Anyway</button>
              </div>
           </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
         {entries.length === 0 && (
           <div className="text-center text-gray-400 mt-10">
             <p>No entries yet.</p>
             <p className="text-sm">Tap + to add a daily journey.</p>
           </div>
         )}
         
         {entries.map((entry, index) => {
           const isEditing = editingId === entry.id;
           return (
             <div key={entry.id} className={`bg-white rounded-lg shadow-sm overflow-hidden border ${isEditing ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                {/* Collapsed View */}
                {!isEditing && (
                  <div className="p-3 flex justify-between items-center" onClick={() => setEditingId(entry.id)}>
                     <div className="flex items-center gap-3">
                        <div className="bg-gray-100 px-2 py-1 rounded text-center min-w-[3rem]">
                           <div className="text-xs font-bold text-gray-500">DATE</div>
                           <div className="font-bold text-blue-900">{entry.date || '--'}</div>
                        </div>
                        <div>
                           <div className="font-bold text-gray-800">{entry.stationFrom || '?'} <span className="text-gray-400">➔</span> {entry.stationTo || '?'}</div>
                           <div className="text-xs text-gray-500">{entry.trainNo} • {entry.kms}km • {entry.dayNightPercent}</div>
                        </div>
                     </div>
                     <div className="text-gray-400">Edit</div>
                  </div>
                )}

                {/* Expanded Edit View */}
                {isEditing && (
                  <div className="p-4 space-y-3 bg-blue-50/30">
                     <div className="flex justify-between items-center border-b pb-2 mb-2">
                       <span className="font-bold text-blue-900">Entry #{index + 1}</span>
                       <div className="flex gap-2">
                          <button onClick={() => duplicateEntry(entry)} className="p-1 text-blue-600"><Copy size={18} /></button>
                          <button onClick={() => deleteEntry(entry.id)} className="p-1 text-red-600"><Trash2 size={18} /></button>
                       </div>
                     </div>
                     
                     {/* Row 1 */}
                     <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500">DATE</label>
                          <input type="text" className="w-full p-2 border rounded bg-white handwriting uppercase" placeholder="DD-MM" 
                            value={entry.date} onChange={e => updateEntry(entry.id, 'date', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500">TRAIN NO</label>
                          <input type="text" className="w-full p-2 border rounded bg-white handwriting uppercase" 
                            value={entry.trainNo} onChange={e => updateEntry(entry.id, 'trainNo', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500">RATE</label>
                          <input type="text" className="w-full p-2 border rounded bg-white handwriting uppercase" 
                            value={entry.rate} onChange={e => updateEntry(entry.id, 'rate', e.target.value)} />
                        </div>
                     </div>

                     {/* Row 2: Stations */}
                     <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500">FROM</label>
                          <input type="text" className="w-full p-2 border rounded bg-white handwriting uppercase" 
                            value={entry.stationFrom} onChange={e => updateEntry(entry.id, 'stationFrom', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500">TO</label>
                          <input type="text" className="w-full p-2 border rounded bg-white handwriting uppercase" 
                            value={entry.stationTo} onChange={e => updateEntry(entry.id, 'stationTo', e.target.value)} />
                        </div>
                     </div>

                     {/* Row 3: Time */}
                     <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500">DEPART TIME</label>
                          <input type="time" className="w-full p-2 border rounded bg-white handwriting" 
                            value={entry.departTime} onChange={e => updateEntry(entry.id, 'departTime', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500">ARRIVE TIME</label>
                          <input type="time" className="w-full p-2 border rounded bg-white handwriting" 
                            value={entry.arriveTime} onChange={e => updateEntry(entry.id, 'arriveTime', e.target.value)} />
                        </div>
                     </div>

                     {/* Row 4: Details */}
                     <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500">KMS</label>
                          <input type="number" className="w-full p-2 border rounded bg-white handwriting uppercase" 
                            value={entry.kms} onChange={e => updateEntry(entry.id, 'kms', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500">DAY/NIGHT %</label>
                          <select className="w-full p-2 border rounded bg-white handwriting" value={entry.dayNightPercent} onChange={e => updateEntry(entry.id, 'dayNightPercent', e.target.value)}>
                             <option value="100%">100%</option>
                             <option value="70%">70%</option>
                             <option value="30%">30%</option>
                          </select>
                        </div>
                         <div>
                          <label className="text-[10px] font-bold text-gray-500">PURPOSE</label>
                          <input type="text" className="w-full p-2 border rounded bg-white handwriting uppercase" 
                            value={entry.purpose} onChange={e => updateEntry(entry.id, 'purpose', e.target.value)} />
                        </div>
                     </div>

                     <button onClick={() => setEditingId(null)} className="w-full bg-blue-600 text-white py-2 rounded font-bold mt-2 flex items-center justify-center">
                        <Save className="w-4 h-4 mr-2" /> Done
                     </button>
                  </div>
                )}
             </div>
           );
         })}
      </div>

      {/* FAB */}
      <button onClick={addEntry} className="fixed bottom-20 right-6 bg-blue-700 text-white p-4 rounded-full shadow-lg hover:bg-blue-800 transition transform hover:scale-105">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};