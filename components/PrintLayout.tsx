import React from 'react';
import { UserProfile, TAEntry, MonthJournal } from '../types';

interface PrintLayoutProps {
  journal: MonthJournal;
  profile: UserProfile;
}

// CONSTANTS FOR PRINT GEOMETRY
const ROWS_PER_PAGE = 13;
const TOTAL_ROWS = 26;

// INK STYLES
const INK_STYLE = {
  fontFamily: '"Courier New", Courier, monospace',
  fontWeight: 'bold',
  color: '#1d4ed8', // Blue-700 to simulate ballpoint ink
  textTransform: 'uppercase' as const,
};

export const PrintLayout: React.FC<PrintLayoutProps> = ({ journal, profile }) => {
  // 1. Prepare exact 26 entries
  const fullJournal: TAEntry[] = [...journal.entries];
  
  // Fill strictly up to 26 rows
  while (fullJournal.length < TOTAL_ROWS) {
    fullJournal.push({ 
      id: `empty-${Math.random()}`, 
      date: "", trainNo: "", departTime: "", arriveTime: "", 
      stationFrom: "", stationTo: "", kms: "", dayNightPercent: "", 
      purpose: "", rate: "", distancePvt: "", refItem20: "" 
    });
  }

  // Split pages
  const page1Entries = fullJournal.slice(0, ROWS_PER_PAGE);
  const page2Entries = fullJournal.slice(ROWS_PER_PAGE, TOTAL_ROWS);

  // Helper: Is this row essentially empty?
  const isRowEmpty = (entry: TAEntry) => {
    return !entry.date && !entry.trainNo && !entry.stationFrom && !entry.stationTo;
  };

  // --- HEADER SECTION (Repeats on Page 1 & 2) ---
  const PageHeader = () => (
    <div className="text-black font-sans leading-none select-none">
      {/* Top Line */}
      <div className="flex justify-between items-start border-b border-black pb-1 mb-1">
        <div className="text-[10px] font-bold uppercase tracking-wide">मध्य रेल / CENTRAL RAILWAY</div>
        <div className="text-[9px] font-bold text-right leading-tight">
            <div>जी. ए. ३१ एस आर सी / जी 1677</div>
            <div>GA 31 SRC/G 1677</div>
            <div className="text-[8px] font-normal">G 69 F/G 69 F/A</div>
        </div>
      </div>
      
      {/* Title */}
      <div className="text-center mb-1">
        <span className="font-bold text-lg underline uppercase tracking-wider">यात्रा भत्ता जर्नल / TRAVELLING ALLOWANCE JOURNAL</span>
      </div>

      {/* Rule Line */}
      <div className="flex justify-center text-[11px] mb-1">
        <span className="mr-2">नियम जिससे शासित है / Rule by which governed</span>
        <span className="border-b border-dotted border-black px-4 min-w-[100px] text-center" style={INK_STYLE}>New Rule</span>
      </div>

      {/* Info Grid 1 */}
      <div className="flex justify-between text-[11px] px-1 mb-1 leading-tight">
        <div className="flex">
           <span className="mr-1">शाखा/Branch</span>
           <span className="border-b border-black px-2 min-w-[100px] font-bold" style={INK_STYLE}>{profile.branch}</span>
        </div>
        <div className="flex">
           <span className="mr-1">मंडल/जिला/Division/Distt.</span>
           <span className="border-b border-black px-2 min-w-[80px] text-center font-bold" style={INK_STYLE}>{profile.division}</span>
        </div>
        <div className="flex">
           <span className="mr-1">मुख्यालय/Headquarters at</span>
           <span className="border-b border-black px-2 min-w-[100px] text-right font-bold" style={INK_STYLE}>{profile.headquarters}</span>
        </div>
      </div>

      {/* Info Grid 2 (Journal Of Duties) */}
      <div className="flex items-end text-[11px] px-1 mb-1 leading-tight whitespace-nowrap">
         <span className="mr-1">द्वारा किये गये कार्यो का जर्नल, जिनके बारे में</span>
         <span className="border-b border-black px-2 min-w-[40px] text-center font-bold" style={INK_STYLE}>20</span>
         <span className="ml-1 mr-4">के लिये भत्ता मांगा गया है ।</span>
      </div>
      
      <div className="flex items-end text-[11px] px-1 mb-1 leading-tight">
        <span className="mr-1">Journal of duties performed by</span>
        <span className="border-b border-black px-2 min-w-[200px] text-center font-bold uppercase" style={INK_STYLE}>{profile.name}</span>
        <span className="mx-1">for which allowance for</span>
        <span className="border-b border-black px-2 min-w-[100px] text-center font-bold uppercase" style={INK_STYLE}>{journal.month}/{journal.year}</span>
        <span className="ml-1">is claimed.</span>
      </div>

      {/* Info Grid 3 (Designation etc) */}
      <div className="flex justify-between text-[11px] px-1 pb-1 border-b-2 border-black leading-tight">
        <div className="flex">
           <span className="mr-1">पदनाम/Designation</span>
           <span className="border-b border-black px-2 min-w-[80px] font-bold" style={INK_STYLE}>{profile.designation}</span>
        </div>
        <div className="flex">
           <span className="mr-1">वेतन/Pay</span>
           <span className="border-b border-black px-2 min-w-[60px] font-bold" style={INK_STYLE}>{profile.pay}</span>
        </div>
        <div className="flex">
           <span className="mr-1">Level</span>
           <span className="border-b border-black px-2 min-w-[40px] font-bold" style={INK_STYLE}>{profile.level}</span>
        </div>
        <div className="flex">
           <span className="mr-1">P.F. NO:</span>
           <span className="border-b border-black px-2 min-w-[100px] font-bold" style={INK_STYLE}>{profile.pfNumber}</span>
        </div>
      </div>
    </div>
  );

  // --- FOOTER SECTION (Page 2 Only) ---
  const PageFooter = () => (
    <div className="mt-1 text-[10px] leading-snug font-sans text-black select-none">
      <div className="flex gap-1 items-end mb-1">
        <span>मैं प्रमाणित करता हूँ कि उपर्युक्त</span>
        <span className="border-b border-black w-32 inline-block h-3"></span>
        <span>उस अवधि के दौरान, जिसके लिये इस बिल में भत्ता मांगा गया है रेलवे के कार्य से ड्यूटी पर मुख्यालय स्टेशन से बाहर गया था ।</span>
      </div>
      <div className="flex gap-1 items-end border-b border-black pb-2 mb-2">
         <span>I hereby certify that the above mentioned</span>
         <span className="border-b border-black w-32 inline-block h-3"></span>
         <span>was absent on duty from his headquarter's station during the period charged for in this bill on railway business.</span>
      </div>
      
      {/* Signature Grid */}
      <div className="grid grid-cols-3 gap-4 mt-8 px-2">
        <div className="text-center flex flex-col items-center justify-end h-16">
           <div className="font-bold mb-1 w-full"></div>
           <div className="border-t border-black w-3/4 pt-1 font-bold">परिवहन निरीक्षक<br/>Transportation Inspector</div>
        </div>
        <div className="text-center flex flex-col items-center justify-end h-16">
           <div className="font-bold mb-1 w-full"></div>
           <div className="border-t border-black w-3/4 pt-1 font-bold">नियंत्रक अधिकारी<br/>Controlling Officer</div>
        </div>
        <div className="text-center flex flex-col items-center justify-end h-16">
           {/* Auto-sign if profile name exists? Optional. Keeping blank for manual sign per form rules usually. */}
           <div className="font-bold mb-1 w-full font-serif italic text-lg"></div>
           <div className="border-t border-black w-3/4 pt-1 font-bold">हस्ताक्षर<br/>Signature</div>
        </div>
      </div>
      <div className="text-right text-[9px] mt-2 font-bold uppercase">Forms-04-06</div>
    </div>
  );

  // --- TABLE HEADER ---
  const TableHeader = () => (
    <div className="grid grid-cols-[8%_8%_6%_6%_16%_5%_5%_18%_6%_12%_10%] text-[9px] leading-tight font-bold text-center border-b border-black bg-white select-none">
        {/* Row 1 Headers */}
        <div className="border-r border-black p-1 flex flex-col justify-center h-[14mm]"><span>माह और तारीख</span><span>Month & Date</span></div>
        <div className="border-r border-black p-1 flex flex-col justify-center h-[14mm]"><span>गाड़ी का क्रमांक</span><span>Train No.</span></div>
        <div className="border-r border-black p-1 flex flex-col justify-center h-[14mm]"><span>प्रस्थान समय</span><span>Time left</span></div>
        <div className="border-r border-black p-1 flex flex-col justify-center h-[14mm]"><span>आगमन समय</span><span>Time arrived</span></div>
        
        {/* Station Combined */}
        <div className="border-r border-black h-[14mm]">
            <div className="border-b border-black h-[50%] flex items-center justify-center">स्टेशन / Station</div>
            <div className="grid grid-cols-2 h-[50%]">
                <div className="border-r border-black flex items-center justify-center h-full">से/From</div>
                <div className="flex items-center justify-center h-full">तक/To</div>
            </div>
        </div>

        <div className="border-r border-black p-1 flex flex-col justify-center h-[14mm]"><span>कि. मी.</span><span>Kms.</span></div>
        <div className="border-r border-black p-1 flex flex-col justify-center h-[14mm]"><span>दिन/रात</span><span>Day/Night</span></div>
        <div className="border-r border-black p-1 flex flex-col justify-center h-[14mm]"><span>यात्रा का उद्देश्य</span><span>Object of journey</span></div>
        <div className="border-r border-black p-1 flex flex-col justify-center h-[14mm]"><span>दर</span><span>Rate</span></div>
        <div className="border-r border-black p-1 flex flex-col justify-center h-[14mm]"><span>दूरी जिसके लिये<br/>प्राइवेट/सार्वजनिक<br/>सवारी का उपयोग<br/>किया गया</span></div>
        <div className="p-1 flex flex-col justify-center h-[14mm]"><span>दूरी-अनुसूची के<br/>मद 20 का संदर्भ</span></div>

        {/* Column Numbers Row */}
        <div className="col-span-11 grid grid-cols-[8%_8%_6%_6%_8%_8%_5%_5%_18%_6%_12%_10%] border-t border-black h-[4mm] items-center text-[8px]">
             <div className="border-r border-black">1</div>
             <div className="border-r border-black">2</div>
             <div className="border-r border-black">3</div>
             <div className="border-r border-black">4</div>
             <div className="border-r border-black">5</div>
             <div className="border-r border-black">6</div>
             <div className="border-r border-black">7</div>
             <div className="border-r border-black">8</div>
             <div className="border-r border-black">9</div>
             <div className="border-r border-black">10</div>
             <div className="border-r border-black">11</div>
             <div>12</div>
        </div>
    </div>
  );

  // --- DATA ROWS ---
  const TableRows = ({ entries }: { entries: TAEntry[] }) => {
    return (
      <div className="font-mono text-[10px]">
        {entries.map((entry, idx) => {
          const isEmpty = isRowEmpty(entry);
          return (
            <div key={idx} className="grid grid-cols-[8%_8%_6%_6%_8%_8%_5%_5%_18%_6%_12%_10%] text-center border-b border-black last:border-b-0 relative h-[9mm]">
              
              {/* === BLACK LINE STRIKETHROUGH LOGIC === */}
              {isEmpty ? (
                 // Full row strikethrough for empty rows
                 <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-black z-20 pointer-events-none print:block"></div>
              ) : (
                 // If row has some data, strike through SPECIFIC empty cells only
                 // Note: We use absolute positioning within the grid cells for cleanliness, or just global overlays
                 <>
                   {!entry.date && <div className="absolute top-1/2 left-[0%] w-[8%] h-[1.5px] bg-black z-20"></div>}
                   {!entry.trainNo && <div className="absolute top-1/2 left-[8%] w-[8%] h-[1.5px] bg-black z-20"></div>}
                   {/* We skip time/station usually as they might be blank for 'staying' entries, but let's strictly follow the prompt 'remaining columns get line' */}
                   {!entry.kms && <div className="absolute top-1/2 left-[44%] w-[5%] h-[1.5px] bg-black z-20"></div>}
                   {!entry.dayNightPercent && <div className="absolute top-1/2 left-[49%] w-[5%] h-[1.5px] bg-black z-20"></div>}
                   {!entry.distancePvt && <div className="absolute top-1/2 left-[78%] w-[12%] h-[1.5px] bg-black z-20"></div>}
                   {!entry.refItem20 && <div className="absolute top-1/2 left-[90%] w-[10%] h-[1.5px] bg-black z-20"></div>}
                 </>
              )}

              {/* Data Cells (With strict Blue Ink style) */}
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-1" style={INK_STYLE}>{entry.date}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-1" style={INK_STYLE}>{entry.trainNo}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-1" style={INK_STYLE}>{entry.departTime}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-1" style={INK_STYLE}>{entry.arriveTime}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap text-[9px] h-full pt-1" style={INK_STYLE}>{entry.stationFrom}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap text-[9px] h-full pt-1" style={INK_STYLE}>{entry.stationTo}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-1" style={INK_STYLE}>{entry.kms}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-1" style={INK_STYLE}>{entry.dayNightPercent}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap text-[8px] leading-tight px-0.5 h-full pt-1" style={INK_STYLE}>{entry.purpose}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-1" style={INK_STYLE}>{entry.rate}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-1" style={INK_STYLE}>{entry.distancePvt}</div>
              <div className="flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-1" style={INK_STYLE}>{entry.refItem20}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="print-only w-full mx-auto bg-white">
      
      {/* ================= PAGE 1 ================= */}
      <div className="page-break relative px-[10mm] pt-[5mm] box-border" style={{ width: '297mm', height: '209mm' }}>
        <PageHeader />
        
        {/* Main Table Border */}
        <div className="border-2 border-black mt-1">
           <TableHeader />
           <TableRows entries={page1Entries} />
        </div>
        
        <div className="absolute bottom-2 right-4 text-[9px]">Page 1 of 2</div>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div className="relative px-[10mm] pt-[5mm] box-border" style={{ width: '297mm', height: '209mm' }}>
        <PageHeader />
        
        <div className="border-2 border-black mt-1">
           <TableHeader />
           <TableRows entries={page2Entries} />
        </div>

        <PageFooter />
        <div className="absolute bottom-2 right-4 text-[9px]">Page 2 of 2</div>
      </div>

    </div>
  );
};