import React from 'react';
import { UserProfile, TAEntry, MonthJournal, COLUMNS_HINDI, COLUMNS_ENGLISH } from '../types';
import { ROWS_PER_PAGE } from '../constants';

interface PrintLayoutProps {
  journal: MonthJournal;
  profile: UserProfile;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ journal, profile }) => {
  // We need to split entries into pages of 13
  const pages: TAEntry[][] = [];
  const totalEntries = journal.entries.length;
  
  // Ensure we have at least one page even if empty
  const pageCount = Math.max(1, Math.ceil(totalEntries / ROWS_PER_PAGE));
  
  for (let i = 0; i < pageCount; i++) {
    const pageEntries = journal.entries.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE);
    // Fill the rest with empty objects to ensure we render exactly 13 rows
    while (pageEntries.length < ROWS_PER_PAGE) {
      pageEntries.push({ id: `empty-${Math.random()}`, ...({} as any) });
    }
    pages.push(pageEntries);
  }

  const renderHeader = () => (
    <div className="mb-2 text-black leading-tight">
      <div className="flex justify-between items-start font-bold text-xs uppercase border-b-2 border-black pb-1 mb-1">
        <span>मध्य रेल/CENTRAL RAILWAY</span>
        <div className="text-right">
            <div>जी. ए. ३१ एस आर सी / जी 1677</div>
            <div>GA 31 SRC/G 1677</div>
        </div>
      </div>
      
      <div className="text-center font-bold text-lg underline uppercase mb-2">
        यात्रा भत्ता जर्नल / TRAVELLING ALLOWANCE JOURNAL
      </div>

      <div className="flex justify-between text-xs font-medium mb-1 px-2">
        <div>नियम जिससे शासित है / Rule by which governed <span className="handwriting border-b border-dotted border-black px-2">New Rule</span></div>
      </div>

      <div className="flex flex-wrap justify-between text-xs px-2 mb-1 gap-y-1">
        <div className="w-1/3">शाखा/Branch: <span className="handwriting uppercase font-bold border-b border-black px-2">{profile.branch}</span></div>
        <div className="w-1/3 text-center">मंडल/जिला/Division/Distt.: <span className="handwriting uppercase font-bold border-b border-black px-2">{profile.division}</span></div>
        <div className="w-1/3 text-right">मुख्यालय/Headquarters at: <span className="handwriting uppercase font-bold border-b border-black px-2">{profile.headquarters}</span></div>
      </div>

      <div className="text-xs px-2 mb-1">
        <span className="mr-2">द्वारा किये गये कार्यो का जर्नल, जिनके बारे में</span>
        <span className="handwriting font-bold border-b border-black w-8 inline-block text-center">20</span>
        <span className="ml-2">के लिये भत्ता मांगा गया है ।</span>
      </div>
      
      <div className="text-xs px-2 mb-2 flex justify-between items-end">
        <div className="flex-1">
          Journal of duties performed by <span className="handwriting font-bold text-sm border-b border-black px-2 uppercase">{profile.name}</span>
          for which allowance for <span className="handwriting font-bold border-b border-black px-2 uppercase">{journal.month}/{journal.year}</span> is claimed.
        </div>
      </div>

      <div className="flex justify-between text-xs px-2 pb-2 border-b-2 border-black">
        <div>पदनाम/Designation: <span className="handwriting font-bold border-b border-black px-2 uppercase">{profile.designation}</span></div>
        <div>वेतन/Pay: <span className="handwriting font-bold border-b border-black px-2">{profile.pay}</span></div>
        <div>Level: <span className="handwriting font-bold border-b border-black px-2">{profile.level}</span></div>
        <div>P.F. NO: <span className="handwriting font-bold border-b border-black px-2">{profile.pfNumber}</span></div>
      </div>
    </div>
  );

  return (
    <div className="print-only w-full max-w-[297mm] mx-auto text-black">
      {pages.map((pageEntries, pageIndex) => (
        <div key={pageIndex} className="page-break min-h-[190mm] relative">
          {renderHeader()}

          {/* TABLE START */}
          <div className="border-2 border-black">
            {/* Table Header */}
            <div className="grid grid-cols-[8%_8%_6%_6%_10%_10%_5%_6%_15%_6%_10%_10%] text-[10px] leading-tight font-bold text-center border-b border-black bg-gray-50 print:bg-transparent">
                {/* Row 1 Headers */}
                <div className="border-r border-black p-1 flex items-center justify-center">माह और तारीख<br/>Month & Date</div>
                <div className="border-r border-black p-1 flex items-center justify-center">गाड़ी का<br/>क्रमांक<br/>Train No.</div>
                <div className="border-r border-black p-1 flex items-center justify-center">प्रस्थान समय<br/>Time left</div>
                <div className="border-r border-black p-1 flex items-center justify-center">आगमन समय<br/>Time arrived</div>
                
                {/* Station Group */}
                <div className="col-span-2 border-r border-black">
                    <div className="border-b border-black p-1">स्टेशन/Station</div>
                    <div className="grid grid-cols-2 h-full">
                        <div className="border-r border-black p-1 flex items-center justify-center">से/From</div>
                        <div className="p-1 flex items-center justify-center">तक/To</div>
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
            <div className="grid grid-cols-[8%_8%_6%_6%_10%_10%_5%_6%_15%_6%_10%_10%] text-[10px] text-center border-b border-black font-bold">
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

            {/* Data Rows */}
            {pageEntries.map((entry, idx) => {
              const isEmpty = !entry.date && !entry.trainNo;
              
              return (
                <div key={idx} className="grid grid-cols-[8%_8%_6%_6%_10%_10%_5%_6%_15%_6%_10%_10%] text-[11px] text-center border-b border-black last:border-b-0 relative h-[9mm]">
                  
                  {/* The Black Line Strikethrough for empty rows - made thicker (2px) and z-index adjusted */}
                  {isEmpty && (
                     <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-black z-20 pointer-events-none print:block"></div>
                  )}

                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase">{entry.date}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase">{entry.trainNo}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase">{entry.departTime}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase">{entry.arriveTime}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-[10px]">{entry.stationFrom}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-[10px]">{entry.stationTo}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase">{entry.kms}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase">{entry.dayNightPercent}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase text-[9px] px-1 leading-none">{entry.purpose}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase">{entry.rate}</div>
                  <div className="border-r border-black flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase">{entry.distancePvt}</div>
                  <div className="flex items-center justify-center overflow-hidden whitespace-nowrap handwriting uppercase">{entry.refItem20}</div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {pageIndex === pages.length - 1 && (
             <div className="mt-2 text-[10px] leading-snug">
               <div className="flex gap-2">
                 <p>मैं प्रमाणित करता हूँ कि उपर्युक्त <span className="border-b border-black w-24 inline-block"></span> उस अवधि के दौरान, जिसके लिये इस बिल में भत्ता मांगा गया है रेलवे के कार्य से ड्यूटी पर मुख्यालय स्टेशन से बाहर गया था ।</p>
               </div>
               <p className="mt-1">I hereby certify that the above mentioned <span className="border-b border-black w-24 inline-block"></span> was absent on duty from his headquarter's station during the period charged for in this bill on railway business.</p>
               
               <div className="flex justify-between items-end mt-8 px-4">
                 <div className="text-center">
                    <div className="border-t border-black w-48 pt-1">परिवहन निरीक्षक/Transportation Inspector</div>
                 </div>
                 <div className="text-center">
                    <div className="border-t border-black w-48 pt-1">नियंत्रक अधिकारी / Controlling Officer</div>
                 </div>
                 <div className="text-center">
                    <div className="border-t border-black w-48 pt-1">हस्ताक्षर / Signature</div>
                 </div>
               </div>
             </div>
          )}

          {/* Page Numbering if multiple */}
          <div className="absolute bottom-0 right-0 text-[10px]">
            Page {pageIndex + 1} of {pages.length}
          </div>
        </div>
      ))}
    </div>
  );
};