import React from 'react';
import { UserProfile, TAEntry, MonthJournal } from '../types';

interface PrintLayoutProps {
  journal: MonthJournal;
  profile: UserProfile;
}

// CONSTANTS FOR PRINT GEOMETRY
const ROWS_PER_PAGE = 13;
const ROWS_PER_FORM = 26;

// INK STYLES (User Input) - Bolder and Larger as requested
const INK_STYLE = {
  fontFamily: '"Courier New", Courier, monospace',
  fontWeight: '800', // Extra Bold
  color: '#1d4ed8', // Blue-700
  textTransform: 'uppercase' as const,
  fontSize: '11px', // Larger font
  letterSpacing: '0.5px'
};

export const PrintLayout: React.FC<PrintLayoutProps> = ({ journal, profile }) => {
  // 1. Chunk entries into groups of 26 (Each group = 1 Physical Form = 2 Pages)
  const rawEntries = [...journal.entries];
  const totalForms = Math.max(1, Math.ceil(rawEntries.length / ROWS_PER_FORM));
  
  const formsToPrint = [];

  for (let i = 0; i < totalForms; i++) {
    const startIdx = i * ROWS_PER_FORM;
    const formEntries = rawEntries.slice(startIdx, startIdx + ROWS_PER_FORM);
    
    // Fill to strictly 26 rows per form
    while (formEntries.length < ROWS_PER_FORM) {
      formEntries.push({ 
        id: `empty-${i}-${Math.random()}`, 
        date: "", trainNo: "", departTime: "", arriveTime: "", 
        stationFrom: "", stationTo: "", kms: "", dayNightPercent: "", 
        purpose: "", rate: "", distancePvt: "", refItem20: "" 
      });
    }
    
    // Split into Page 1 and Page 2
    formsToPrint.push({
      formIndex: i + 1,
      totalForms: totalForms,
      page1: formEntries.slice(0, ROWS_PER_PAGE),
      page2: formEntries.slice(ROWS_PER_PAGE, ROWS_PER_FORM)
    });
  }

  // --- HEADER SECTION (Compact) ---
  const PageHeader = ({ pageNum, totalPages }: { pageNum: number, totalPages: number }) => (
    <div className="text-black font-sans leading-none select-none relative mb-1">
      {/* Top Line */}
      <div className="flex justify-between items-start border-b border-black pb-0.5 mb-0.5">
        <div className="text-[10px] font-bold uppercase tracking-wide">मध्य रेल / CENTRAL RAILWAY</div>
        <div className="text-[8px] font-bold text-right leading-tight">
            <div>जी. ए. ३१ एस आर सी / जी 1677 | GA 31 SRC/G 1677</div>
            <div className="font-normal">G 69 F/G 69 F/A</div>
        </div>
      </div>
      
      {/* Title */}
      <div className="text-center mb-0.5">
        <span className="font-bold text-base underline uppercase tracking-wider">यात्रा भत्ता जर्नल / TRAVELLING ALLOWANCE JOURNAL</span>
      </div>

      {/* Rule Line */}
      <div className="flex justify-center text-[10px] mb-0.5">
        <span className="mr-2">नियम जिससे शासित है / Rule by which governed</span>
        <span className="border-b border-dotted border-black px-4 min-w-[80px] text-center" style={INK_STYLE}>New Rule</span>
      </div>

      {/* Info Grid 1 */}
      <div className="flex justify-between text-[10px] px-1 mb-0.5 leading-tight">
        <div className="flex">
           <span className="mr-1">शाखा/Branch</span>
           <span className="border-b border-black px-2 min-w-[80px] font-bold" style={INK_STYLE}>{profile.branch}</span>
        </div>
        <div className="flex">
           <span className="mr-1">मंडल/जिला/Division/Distt.</span>
           <span className="border-b border-black px-2 min-w-[60px] text-center font-bold" style={INK_STYLE}>{profile.division}</span>
        </div>
        <div className="flex">
           <span className="mr-1">मुख्यालय/Headquarters at</span>
           <span className="border-b border-black px-2 min-w-[80px] text-right font-bold" style={INK_STYLE}>{profile.headquarters}</span>
        </div>
      </div>

      {/* Info Grid 2 (Journal Of Duties) */}
      <div className="flex items-end text-[10px] px-1 mb-0.5 leading-tight whitespace-nowrap">
         <span className="mr-1">द्वारा किये गये कार्यो का जर्नल, जिनके बारे में</span>
         <span className="border-b border-black px-2 min-w-[30px] text-center font-bold" style={INK_STYLE}>20</span>
         <span className="ml-1 mr-4">के लिये भत्ता मांगा गया है ।</span>
      </div>
      
      <div className="flex items-end text-[10px] px-1 mb-0.5 leading-tight">
        <span className="mr-1">Journal of duties performed by</span>
        <span className="border-b border-black px-2 min-w-[150px] text-center font-bold uppercase" style={INK_STYLE}>{profile.name}</span>
        <span className="mx-1">for which allowance for</span>
        <span className="border-b border-black px-2 min-w-[80px] text-center font-bold uppercase" style={INK_STYLE}>{journal.month}/{journal.year}</span>
        <span className="ml-1">is claimed.</span>
      </div>

      {/* Info Grid 3 (Designation etc) */}
      <div className="flex justify-between text-[10px] px-1 pb-0.5 border-b border-black leading-tight">
        <div className="flex">
           <span className="mr-1">पदनाम/Designation</span>
           <span className="border-b border-black px-2 min-w-[60px] font-bold" style={INK_STYLE}>{profile.designation}</span>
        </div>
        <div className="flex">
           <span className="mr-1">वेतन/Pay</span>
           <span className="border-b border-black px-2 min-w-[50px] font-bold" style={INK_STYLE}>{profile.pay}</span>
        </div>
        <div className="flex">
           <span className="mr-1">Level</span>
           <span className="border-b border-black px-2 min-w-[30px] font-bold" style={INK_STYLE}>{profile.level}</span>
        </div>
        <div className="flex">
           <span className="mr-1">P.F. NO:</span>
           <span className="border-b border-black px-2 min-w-[80px] font-bold" style={INK_STYLE}>{profile.pfNumber}</span>
        </div>
      </div>
    </div>
  );

  // --- FOOTER SECTION (Expanded to match Scan) ---
  const PageFooter = () => (
    <div className="mt-1 text-[9px] leading-snug font-sans text-black select-none">
      <div className="flex gap-1 items-end mb-0.5">
        <span>मैं प्रमाणित करता हूँ कि उपर्युक्त</span>
        <span className="border-b border-black w-24 inline-block h-2"></span>
        <span>उस अवधि के दौरान, जिसके लिये इस बिल में भत्ता मांगा गया है रेलवे के कार्य से ड्यूटी पर मुख्यालय स्टेशन से बाहर गया था ।</span>
      </div>
      <div className="flex gap-1 items-end border-b border-black pb-1 mb-1">
         <span>I hereby certify that the above mentioned</span>
         <span className="border-b border-black w-24 inline-block h-2"></span>
         <span>was absent on duty from his headquarter's station during the period charged for in this bill on railway business.</span>
      </div>

      <div className="mb-2 text-justify leading-tight">
        I certify that no TA/DA or any other remuneration has been drawn from any other source in respect of the journeys performed duty pass and also for the halts for which TA/DA has been claimed in this bill.
      </div>
      
      {/* Signature Grid */}
      <div className="grid grid-cols-3 gap-2 mt-4 px-2">
        <div className="text-center flex flex-col items-center justify-end h-16">
           <div className="font-bold mb-0.5 w-full"></div>
           <div className="border-t border-black w-3/4 pt-0.5 font-bold text-[8px]">परिवहन निरीक्षक<br/>Transportation Inspector</div>
        </div>
        <div className="text-center flex flex-col items-center justify-end h-16">
           <div className="font-bold mb-0.5 w-full"></div>
           <div className="border-t border-black w-3/4 pt-0.5 font-bold text-[8px]">नियंत्रक अधिकारी<br/>Controlling Officer</div>
        </div>
        <div className="text-center flex flex-col items-center justify-end h-16">
           <div className="font-bold mb-0.5 w-full font-serif italic text-base"></div>
           <div className="border-t border-black w-3/4 pt-0.5 font-bold text-[8px]">हस्ताक्षर<br/>Signature</div>
           <div className="text-[7px] text-right w-full mt-1 font-bold uppercase">Forms-04-06</div>
        </div>
      </div>

      {/* Final Note */}
      <div className="mt-1 pt-1 border-t border-black text-[8px] font-medium italic">
        <span className="font-bold">Note :-</span> On transfer from one Railway to another, certificate whether or not a free pass or Locomotion at Government expenses was allowed or not should be recorded on T.A. Bills.
      </div>
    </div>
  );

  // --- TABLE HEADER (Compact Heights) ---
  const TableHeader = () => (
    <div className="grid grid-cols-[8%_8%_6%_6%_16%_5%_5%_18%_6%_12%_10%] text-[8px] leading-none font-bold text-center border-b border-black bg-white select-none">
        {/* Row 1 Headers */}
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]"><span>माह और तारीख</span><span className="mt-0.5">Month & Date</span></div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]"><span>गाड़ी का क्रमांक</span><span className="mt-0.5">Train No.</span></div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]"><span>प्रस्थान समय</span><span className="mt-0.5">Time left</span></div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]"><span>आगमन समय</span><span className="mt-0.5">Time arrived</span></div>
        
        {/* Station Combined */}
        <div className="border-r border-black h-[12mm]">
            <div className="border-b border-black h-[50%] flex items-center justify-center">स्टेशन / Station</div>
            <div className="grid grid-cols-2 h-[50%]">
                <div className="border-r border-black flex items-center justify-center h-full">से/From</div>
                <div className="flex items-center justify-center h-full">तक/To</div>
            </div>
        </div>

        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]"><span>कि. मी.</span><span className="mt-0.5">Kms.</span></div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]"><span>दिन/रात</span><span className="mt-0.5">Day/Night</span></div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]"><span>यात्रा का उद्देश्य</span><span className="mt-0.5">Object of journey</span></div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]"><span>दर</span><span className="mt-0.5">Rate</span></div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]"><span className="leading-tight">दूरी जिसके लिये<br/>प्राइवेट/सार्वजनिक<br/>सवारी का उपयोग</span></div>
        <div className="p-0.5 flex flex-col justify-center h-[12mm]"><span className="leading-tight">दूरी-अनुसूची के<br/>मद 20 का संदर्भ</span></div>

        {/* Column Numbers Row */}
        <div className="col-span-11 grid grid-cols-[8%_8%_6%_6%_8%_8%_5%_5%_18%_6%_12%_10%] border-t border-black h-[3mm] items-center text-[7px]">
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

  // --- DATA ROWS (Height Reduced to 8mm) ---
  const TableRows = ({ entries }: { entries: TAEntry[] }) => {
    return (
      <div className="font-mono text-[9px]">
        {entries.map((entry, idx) => {
          return (
            <div key={idx} className="grid grid-cols-[8%_8%_6%_6%_8%_8%_5%_5%_18%_6%_12%_10%] text-center border-b border-black last:border-b-0 relative h-[8mm]">
              
              {/* Data Cells (With strict Blue Ink style) */}
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.date}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.trainNo}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.departTime}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.arriveTime}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.stationFrom}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.stationTo}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.kms}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.dayNightPercent}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap text-[7px] leading-tight px-0.5 h-full pt-0.5" style={INK_STYLE}>{entry.purpose}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.rate}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.distancePvt}</div>
              <div className="flex items-center justify-center overflow-hidden whitespace-nowrap h-full pt-0.5" style={INK_STYLE}>{entry.refItem20}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // The ID "print-content" is crucial for html2pdf
  return (
    <div id="print-content" className="w-full mx-auto bg-white">
      {formsToPrint.map((form, index) => (
        <React.Fragment key={index}>
            {/* ================= FORM {index+1} PAGE 1 ================= */}
            <div className="page-break relative px-[5mm] pt-[5mm] box-border" style={{ width: '297mm', height: '209mm' }}>
                <PageHeader pageNum={1} totalPages={2} />
                <div className="border-2 border-black mt-0.5">
                    <TableHeader />
                    <TableRows entries={form.page1} />
                </div>
                <div className="absolute bottom-1 right-4 text-[8px]">
                    Form {form.formIndex}/{form.totalForms} - Page 1 of 2
                </div>
            </div>

            {/* ================= FORM {index+1} PAGE 2 ================= */}
            <div className={`relative px-[5mm] pt-[5mm] box-border ${index < formsToPrint.length - 1 ? 'page-break' : ''}`} style={{ width: '297mm', height: '209mm' }}>
                <PageHeader pageNum={2} totalPages={2} />
                <div className="border-2 border-black mt-0.5">
                    <TableHeader />
                    <TableRows entries={form.page2} />
                </div>
                <PageFooter />
                <div className="absolute bottom-1 right-4 text-[8px]">
                    Form {form.formIndex}/{form.totalForms} - Page 2 of 2
                </div>
            </div>
        </React.Fragment>
      ))}
    </div>
  );
};