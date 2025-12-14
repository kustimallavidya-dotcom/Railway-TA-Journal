import React from 'react';
import { UserProfile, TAEntry, MonthJournal } from '../types';

interface PrintLayoutProps {
  journal: MonthJournal;
  profile: UserProfile;
}

// Fixed Constants for Exact Print Layout
const TOTAL_ROWS_FIXED = 26;
const ROWS_PER_PAGE = 13;

export const PrintLayout: React.FC<PrintLayoutProps> = ({ journal, profile }) => {
  // 1. Prepare exact 26 entries (fill with empty objects if needed)
  const fullJournal: TAEntry[] = [...journal.entries];
  
  // Fill up to 26 rows
  while (fullJournal.length < TOTAL_ROWS_FIXED) {
    fullJournal.push({ 
      id: `empty-${Math.random()}`, 
      date: "", trainNo: "", departTime: "", arriveTime: "", 
      stationFrom: "", stationTo: "", kms: "", dayNightPercent: "", 
      purpose: "", rate: "", distancePvt: "", refItem20: "" 
    });
  }

  // Slice strictly into Page 1 (0-12) and Page 2 (13-25)
  const page1Entries = fullJournal.slice(0, ROWS_PER_PAGE);
  const page2Entries = fullJournal.slice(ROWS_PER_PAGE, TOTAL_ROWS_FIXED);

  // Helper to check if a row is effectively empty (for the strikethrough logic)
  const isRowEmpty = (entry: TAEntry) => {
    return !entry.date && !entry.trainNo && !entry.stationFrom;
  };

  // Header Component (Repeats on both pages)
  const PageHeader = () => (
    <div className="mb-1 text-black leading-none font-sans">
      <div className="flex justify-between items-start font-bold text-[10px] uppercase border-b border-black pb-1 mb-1">
        <span>मध्य रेल/CENTRAL RAILWAY</span>
        <div className="text-right">
            <div>जी. ए. ३१ एस आर सी / जी 1677</div>
            <div>GA 31 SRC/G 1677</div>
        </div>
      </div>
      
      <div className="text-center font-bold text-lg underline uppercase mb-1">
        यात्रा भत्ता जर्नल / TRAVELLING ALLOWANCE JOURNAL
      </div>

      <div className="flex justify-between text-[10px] font-medium mb-1 px-1">
        <div>नियम जिससे शासित है / Rule by which governed <span className="handwriting border-b border-dotted border-black px-2 text-blue-900">New Rule</span></div>
      </div>

      <div className="flex flex-wrap justify-between text-[10px] px-1 mb-1 gap-y-1">
        <div className="w-1/3">शाखा/Branch: <span className="handwriting uppercase font-bold border-b border-black px-2 text-blue-900">{profile.branch}</span></div>
        <div className="w-1/3 text-center">मंडल/जिला/Division/Distt.: <span className="handwriting uppercase font-bold border-b border-black px-2 text-blue-900">{profile.division}</span></div>
        <div className="w-1/3 text-right">मुख्यालय/Headquarters at: <span className="handwriting uppercase font-bold border-b border-black px-2 text-blue-900">{profile.headquarters}</span></div>
      </div>

      <div className="text-[10px] px-1 mb-1">
        <span className="mr-2">द्वारा किये गये कार्यो का जर्नल, जिनके बारे में</span>
        <span className="handwriting font-bold border-b border-black w-8 inline-block text-center text-blue-900">20</span>
        <span className="ml-2">के लिये भत्ता मांगा गया है ।</span>
      </div>
      
      <div className="text-[10px] px-1 mb-1 flex justify-between items-end">
        <div className="flex-1">
          Journal of duties performed by <span className="handwriting font-bold text-[11px] border-b border-black px-2 uppercase text-blue-900">{profile.name}</span>
          for which allowance for <span className="handwriting font-bold border-b border-black px-2 uppercase text-blue-900">{journal.month}/{journal.year}</span> is claimed.
        </div>
      </div>

      <div className="flex justify-between text-[10px] px-1 pb-1 border-b border-black">
        <div>पदनाम/Designation: <span className="handwriting font-bold border-b border-black px-2 uppercase text-blue-900">{profile.designation}</span></div>
        <div>वेतन/Pay: <span className="handwriting font-bold border-b border-black px-2 text-blue-900">{profile.pay}</span></div>
        <div>Level: <span className="handwriting font-bold border-b border-black px-2 text-blue-900">{profile.level}</span></div>
        <div>P.F. NO: <span className="handwriting font-bold border-b border-black px-2 text-blue-900">{profile.pfNumber}</span></div>
      </div>
    </div>
  );

  // Footer Component (Only for Page 2)
  const PageFooter = () => (
    <div className="mt-2 text-[10px] leading-snug font-sans">
      <div className="flex gap-2">
        <p>मैं प्रमाणित करता हूँ कि उपर्युक्त <span className="border-b border-black w-24 inline-block"></span> उस अवधि के दौरान, जिसके लिये इस बिल में भत्ता मांगा गया है रेलवे के कार्य से ड्यूटी पर मुख्यालय स्टेशन से बाहर गया था ।</p>
      </div>
      <p className="mt-1">I hereby certify that the above mentioned <span className="border-b border-black w-24 inline-block"></span> was absent on duty from his headquarter's station during the period charged for in this bill on railway business.</p>
      
      <div className="flex justify-between items-end mt-4 px-4">
        <div className="text-center">
           <div className="border-t border-black w-40 pt-1">परिवहन निरीक्षक<br/>Transportation Inspector</div>
        </div>
        <div className="text-center">
           <div className="border-t border-black w-40 pt-1">नियंत्रक अधिकारी<br/>Controlling Officer</div>
        </div>
        <div className="text-center">
           <div className="border-t border-black w-40 pt-1">हस्ताक्षर<br/>Signature</div>
        </div>
      </div>
    </div>
  );

  // Table Row Component
  const TableRows = ({ entries }: { entries: TAEntry[] }) => {
    return (
      <>
        {entries.map((entry, idx) => {
          const empty = isRowEmpty(entry);
          return (
            <div key={idx} className="grid grid-cols-[8%_8%_6%_6%_10%_10%_5%_6%_15%_6%_10%_10%] text-[10px] text-center border-b border-black last:border-b-0 relative h-[10mm]">
              
              {/* STRIKETHROUGH LOGIC */}
              {/* 1. If row is completely empty: Full line across */}
              {empty && (
                  <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-black z-20 pointer-events-none print:block"></div>
              )}
              
              {/* 2. If row has data, strike empty cells individually? 
                 The prompt says: "If partial TA is filled, remaining columns in that row must still get black horizontal line"
              */}
              {!empty && !entry.date && <div className="absolute top-1/2 left-0 w-[8%] h-[1.5px] bg-black z-20"></div>}
              {/* We apply a generic line for empty cells inside the columns below if needed, but the visual "Whole Row" strikethrough is most critical. 
                  Let's stick to the visual provided: The big line crosses empty space. 
              */}

              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-blue-900 h-full">{entry.date}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-blue-900 h-full">{entry.trainNo}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-blue-900 h-full">{entry.departTime}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-blue-900 h-full">{entry.arriveTime}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-[9px] text-blue-900 h-full leading-none">{entry.stationFrom}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-[9px] text-blue-900 h-full leading-none">{entry.stationTo}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-blue-900 h-full">{entry.kms}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-blue-900 h-full">{entry.dayNightPercent}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-[9px] px-1 leading-none text-blue-900 h-full">{entry.purpose}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-blue-900 h-full">{entry.rate}</div>
              <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-blue-900 h-full">{!entry.distancePvt && !empty ? <div className="w-full h-[1px] bg-black"></div> : entry.distancePvt}</div>
              <div className="flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-blue-900 h-full">{!entry.refItem20 && !empty ? <div className="w-full h-[1px] bg-black"></div> : entry.refItem20}</div>
            </div>
          );
        })}
      </>
    );
  };

  // Table Header
  const TableHeader = () => (
    <>
        <div className="grid grid-cols-[8%_8%_6%_6%_10%_10%_5%_6%_15%_6%_10%_10%] text-[9px] leading-tight font-bold text-center border-b border-black bg-gray-50 print:bg-transparent h-[15mm]">
            <div className="border-r border-black p-1 flex items-center justify-center">माह और तारीख<br/>Month & Date</div>
            <div className="border-r border-black p-1 flex items-center justify-center">गाड़ी का<br/>क्रमांक<br/>Train No.</div>
            <div className="border-r border-black p-1 flex items-center justify-center">प्रस्थान समय<br/>Time left</div>
            <div className="border-r border-black p-1 flex items-center justify-center">आगमन समय<br/>Time arrived</div>
            <div className="col-span-2 border-r border-black">
                <div className="border-b border-black h-[50%] flex items-center justify-center">स्टेशन/Station</div>
                <div className="grid grid-cols-2 h-[50%]">
                    <div className="border-r border-black flex items-center justify-center">से/From</div>
                    <div className="flex items-center justify-center">तक/To</div>
                </div>
            </div>
            <div className="border-r border-black p-1 flex items-center justify-center">कि. मी.<br/>Kms.</div>
            <div className="border-r border-black p-1 flex items-center justify-center">दिन/रात<br/>Day/Night</div>
            <div className="border-r border-black p-1 flex items-center justify-center">यात्रा का उद्देश्य<br/>Object of journey</div>
            <div className="border-r border-black p-1 flex items-center justify-center">दर<br/>Rate</div>
            <div className="border-r border-black p-1 flex items-center justify-center">दूरी जिसके लिये<br/>प्राइवेट/सार्वजनिक<br/>सवारी का उपयोग<br/>किया गया</div>
            <div className="p-1 flex items-center justify-center">दूरी-अनुसूची के<br/>मद 20 का संदर्भ</div>
        </div>
        {/* Column Numbers */}
        <div className="grid grid-cols-[8%_8%_6%_6%_10%_10%_5%_6%_15%_6%_10%_10%] text-[9px] text-center border-b border-black font-bold h-[4mm] items-center">
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
    </>
  );

  return (
    <div className="print-only w-full max-w-[297mm] mx-auto text-black">
      
      {/* --- PAGE 1 (Rows 1-13) --- */}
      <div className="page-break w-[297mm] h-[210mm] relative px-[10mm] pt-[5mm]">
        <PageHeader />
        <div className="border-2 border-black mt-2">
            <TableHeader />
            <TableRows entries={page1Entries} />
        </div>
        <div className="absolute bottom-2 right-4 text-[10px]">Page 1 of 2</div>
      </div>

      {/* --- PAGE 2 (Rows 14-26) --- */}
      <div className="w-[297mm] h-[210mm] relative px-[10mm] pt-[5mm]">
        <PageHeader />
        <div className="border-2 border-black mt-2">
            <TableHeader />
            <TableRows entries={page2Entries} />
        </div>
        <PageFooter />
        <div className="absolute bottom-2 right-4 text-[10px]">Page 2 of 2</div>
      </div>

    </div>
  );
};