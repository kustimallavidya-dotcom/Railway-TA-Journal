import React from 'react';
import { UserProfile, TAEntry, MonthJournal } from '../types';

interface PrintLayoutProps {
  journal: MonthJournal;
  profile: UserProfile;
}

// CONSTANTS FOR PRINT GEOMETRY
const ROWS_PER_PAGE = 13;
const ROWS_PER_FORM = 26;

// INK STYLES (User Input) - Max Boldness and Larger Size
const INK_STYLE = {
  fontFamily: '"Courier New", Courier, monospace',
  fontWeight: '900', // Maximum Boldness
  color: '#1d4ed8', // Blue-700
  textTransform: 'uppercase' as const,
  fontSize: '14px', // Increased from 12px
  letterSpacing: '0.5px'
};

// HELPER: Number to Words (Indian/Simple Format)
const numberToWords = (num: number): string => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const nString = num.toString();
  if (nString.length > 9) return 'Overflow';

  const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/;
  const parts = ('000000000' + nString).substr(-9).match(regex);
  if (!parts) return '';

  let str = '';
  str += (Number(parts[1]) !== 0) ? (a[Number(parts[1])] || b[Number(parts[1][0])] + ' ' + a[Number(parts[1][1])]) + 'Crore ' : '';
  str += (Number(parts[2]) !== 0) ? (a[Number(parts[2])] || b[Number(parts[2][0])] + ' ' + a[Number(parts[2][1])]) + 'Lakh ' : '';
  str += (Number(parts[3]) !== 0) ? (a[Number(parts[3])] || b[Number(parts[3][0])] + ' ' + a[Number(parts[3][1])]) + 'Thousand ' : '';
  str += (Number(parts[4]) !== 0) ? (a[Number(parts[4])] || b[Number(parts[4][0])] + ' ' + a[Number(parts[4][1])]) + 'Hundred ' : '';
  str += (Number(parts[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(parts[5])] || b[Number(parts[5][0])] + ' ' + a[Number(parts[5][1])]) : '';

  return str.trim();
};

export const PrintLayout: React.FC<PrintLayoutProps> = ({ journal, profile }) => {
  // 1. Chunk entries into groups of 26 (Each group = 1 Physical Form = 2 Pages)
  const rawEntries = [...journal.entries];
  const totalForms = Math.max(1, Math.ceil(rawEntries.length / ROWS_PER_FORM));
  
  const formsToPrint = [];

  // Helper to calc total of a slice
  const calcTotal = (slice: TAEntry[]) => slice.reduce((acc, curr) => acc + (parseFloat(curr.rate) || 0), 0);

  for (let i = 0; i < totalForms; i++) {
    const startIdx = i * ROWS_PER_FORM;
    const formEntriesRaw = rawEntries.slice(startIdx, startIdx + ROWS_PER_FORM);
    
    // Calculate actual totals before filling empty rows
    const page1Raw = formEntriesRaw.slice(0, ROWS_PER_PAGE);
    const page2Raw = formEntriesRaw.slice(ROWS_PER_PAGE, ROWS_PER_FORM);
    
    const page1Total = calcTotal(page1Raw);
    const page2Total = calcTotal(page2Raw); // Just page 2 specific
    const grandTotal = page1Total + page2Total;

    // Fill to strictly 26 rows per form for rendering
    const formEntries = [...formEntriesRaw];
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
      page2: formEntries.slice(ROWS_PER_PAGE, ROWS_PER_FORM),
      page1Total,
      grandTotal,
      grandTotalWords: numberToWords(Math.round(grandTotal))
    });
  }

  // --- HEADER SECTION (Page 1 Only) ---
  const PageHeader = () => (
    <div className="text-black font-sans leading-none select-none relative mb-1">
      {/* Top Line */}
      <div className="flex justify-between items-start border-b border-black pb-0.5 mb-1">
        <div className="text-[10px] font-bold uppercase tracking-wide mt-1">मध्य रेल / CENTRAL RAILWAY</div>
        
        {/* Updated Right Side Codes */}
        <div className="text-[9px] font-bold text-right leading-tight">
            <div>जी. ए. ३१ एस आर सी/जी 1677</div>
            <div>जी 69 एफ/जी 69 एफ/ए</div>
            <div className="border-t border-black mt-0.5 pt-0.5">GA 31 SRC/G 1677 G 69 F/G 69 F/A</div>
        </div>
      </div>
      
      {/* Title - Corrected Layout */}
      <div className="text-center mb-2 mt-3 flex flex-col items-center">
        <h1 className="font-black text-3xl uppercase tracking-widest scale-y-110 mb-1">
          यात्रा भत्ता जर्नल
        </h1>
        <h2 className="font-bold text-xl uppercase tracking-widest border-b-2 border-black inline-block pb-0.5">
          TRAVELLING ALLOWANCE JOURNAL
        </h2>
      </div>

      {/* Rule Line */}
      <div className="flex justify-center text-[10px] mb-1">
        <span className="mr-2 font-medium">नियम जिससे शासित है / Rule by which governed</span>
        <span className="border-b border-dotted border-black px-4 min-w-[100px] text-center" style={INK_STYLE}>New Rule</span>
      </div>

      {/* Info Grid 1 */}
      <div className="flex justify-between text-[10px] px-1 mb-1 leading-tight">
        <div className="flex items-end">
           <span className="mr-1">शाखा/Branch</span>
           <span className="border-b border-black px-2 min-w-[120px] font-bold" style={INK_STYLE}>{profile.branch}</span>
        </div>
        <div className="flex items-end">
           <span className="mr-1">मंडल/जिला/Division/Distt.</span>
           <span className="border-b border-black px-2 min-w-[100px] text-center font-bold" style={INK_STYLE}>{profile.division}</span>
        </div>
        <div className="flex items-end">
           <span className="mr-1">मुख्यालय/Headquarters at</span>
           <span className="border-b border-black px-2 min-w-[120px] text-right font-bold" style={INK_STYLE}>{profile.headquarters}</span>
        </div>
      </div>

      {/* Info Grid 2 (Journal Of Duties) */}
      <div className="flex items-end text-[10px] px-1 mb-1 leading-tight whitespace-nowrap">
         <span className="mr-1">द्वारा किये गये कार्यो का जर्नल, जिनके बारे में</span>
         <span className="border-b border-black px-2 min-w-[40px] text-center font-bold" style={INK_STYLE}>20</span>
         <span className="ml-1 mr-4">के लिये भत्ता मांगा गया है ।</span>
      </div>
      
      <div className="flex items-end text-[10px] px-1 mb-1 leading-tight">
        <span className="mr-1">Journal of duties performed by</span>
        <span className="border-b border-black px-2 min-w-[200px] text-center font-bold uppercase" style={INK_STYLE}>{profile.name}</span>
        <span className="mx-1">for which allowance for</span>
        <span className="border-b border-black px-2 min-w-[100px] text-center font-bold uppercase" style={INK_STYLE}>{journal.month}/{journal.year}</span>
        <span className="ml-1">is claimed.</span>
      </div>

      {/* Info Grid 3 (Designation etc) */}
      <div className="flex justify-between text-[10px] px-1 pb-1 border-b border-black leading-tight mt-1">
        <div className="flex items-end">
           <span className="mr-1">पदनाम/Designation</span>
           <span className="border-b border-black px-2 min-w-[80px] font-bold" style={INK_STYLE}>{profile.designation}</span>
        </div>
        <div className="flex items-end">
           <span className="mr-1">वेतन/Pay</span>
           <span className="border-b border-black px-2 min-w-[60px] font-bold" style={INK_STYLE}>{profile.pay}</span>
        </div>
        <div className="flex items-end">
           <span className="mr-1">Level</span>
           <span className="border-b border-black px-2 min-w-[40px] font-bold" style={INK_STYLE}>{profile.level}</span>
        </div>
        <div className="flex items-end">
           <span className="mr-1">P.F. NO:</span>
           <span className="border-b border-black px-2 min-w-[100px] font-bold" style={INK_STYLE}>{profile.pfNumber}</span>
        </div>
      </div>
    </div>
  );

  // --- FOOTER SECTION (Page 2 Only) ---
  const Page2Footer = ({ grandTotalWords }: { grandTotalWords: string }) => (
    <div className="mt-2 font-sans text-black select-none">
      
      {/* BOXED TOTAL IN WORDS */}
      <div className="border border-black p-2 mb-4 text-[10px] font-bold bg-gray-50 flex items-center shadow-sm">
        <span className="mr-2 uppercase">Grand Total (in words) :</span>
        <span className="flex-1 border-b border-dotted border-black" style={INK_STYLE}>
            {grandTotalWords} ONLY
        </span>
      </div>

      {/* CERTIFICATE TEXT */}
      <div className="text-[9px] leading-tight text-justify font-medium mb-4">
        <div className="mb-2">
            मैं प्रमाणित करता हूं कि उपर्युक्त <span className="border-b border-black inline-block w-32"></span> उस अवधि के दौरान, जिसके लिये इस बिल में भत्ता मांगा गया है रेलवे के कार्य से ड्यूटी पर मुख्यालय स्टेशन से बाहर गया था । इस अधिकारी ने रेलमार्ग /समुद्रमार्ग /सडक-वाहन /वायुमार्ग से यात्रा की और इसे मुफ्त पास या सरकारी स्थानीय निधि या भारत सरकार के खर्च पर यात्रा करने की सुविधा दी गयी/ नही दी गयी थी ।
            <br/>
            मैं प्रमाणित करता हूं कि ड्यूटी पास पर की गयी यात्रा तथा विराम के बारे में जिसके लिये इस बिल में यात्रा भत्ता /दैनिक भत्ता मांगा गया है, किसी भी स्रोत से कोई यात्रा भत्ता/दैनिक भत्ता या पारिश्रमिक नहीं लिया गया है ।
        </div>
        <div>
            I hereby certify that the above mentioned <span className="border-b border-black inline-block w-32"></span> was absent on duty from his headquarter's station during the period charged for in this bill on railway business and that the officer performed the journey by Rail/Sea/Road/Air and was allowed/not allowed free pass or locomotion at the expenses of Government local fund or Gov. of India.
            <br/>
            I certify that no TA/DA or any other remuneration has been drawn from any other source in respect of the journeys performed duty pass and also for the halts for which TA/DA has been claimed in this bill.
        </div>
      </div>
      
      {/* Signature Grid - 4 Columns */}
      <div className="grid grid-cols-4 gap-2 mt-12 px-1 items-start font-bold text-[8px] text-center leading-tight">
        
        {/* 1. Countersigned */}
        <div className="flex flex-col items-center">
           <div className="border-t border-black w-full pt-1">
             प्रति हस्ताक्षरीत<br/>Countersigned
           </div>
        </div>
        
        {/* 2. Controlling Officer */}
        <div className="flex flex-col items-center">
           <div className="border-t border-black w-full pt-1">
             नियंत्रक अधिकारी<br/>Controlling Officer
           </div>
        </div>

        {/* 3. Head of Office */}
        <div className="flex flex-col items-center">
           <div className="border-t border-black w-full pt-1">
             कार्यालय प्रमुख<br/>Head of Office
           </div>
        </div>

        {/* 4. Claimant */}
        <div className="flex flex-col items-center">
           <div className="border-t border-black w-full pt-1">
             भत्ता मांगने वाले अधिकारी का हस्ताक्षर<br/>
             Signature of Officer/Claiming T.A.
           </div>
        </div>
      </div>

      {/* Final Note */}
      <div className="mt-4 pt-1 border-t border-black text-[8px] leading-tight text-justify">
        <span className="font-bold">टिप्पणी :</span> किसी एक रेलवे से दूसरी रेलवे पर स्थानांतरण होने पर यात्रा भत्ता बिल पर यह प्रमाणित किया जाना चाहिए कि मुक्त पास या सरकारी खर्च पर यात्रा करने की सुविधा दी गई थी या नहीं |
        <br/>
        <span className="font-bold">Note :-</span> On transfer from one Railway to another, certificate whether or not a free pass or Locomotion at Government expenses was allowed or not should be recorded on T.A. Bills.
      </div>
    </div>
  );

  // --- TABLE HEADER (Compact Heights) ---
  const TableHeader = ({ showLabels = true }: { showLabels?: boolean }) => (
    <div className="grid grid-cols-[8%_8%_6%_6%_16%_5%_5%_18%_6%_12%_10%] text-[8px] leading-none font-bold text-center border-b border-black bg-white select-none">
        {/* Row 1 Headers */}
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]">
           {showLabels && <><span>माह और तारीख</span><span className="mt-0.5">Month & Date</span></>}
        </div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]">
           {showLabels && <><span>गाड़ी का क्रमांक</span><span className="mt-0.5">Train No.</span></>}
        </div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]">
           {showLabels && <><span>प्रस्थान समय</span><span className="mt-0.5">Time left</span></>}
        </div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]">
           {showLabels && <><span>आगमन समय</span><span className="mt-0.5">Time arrived</span></>}
        </div>
        
        {/* Station Combined */}
        {showLabels ? (
            <div className="border-r border-black h-[12mm]">
                <div className="border-b border-black h-[50%] flex items-center justify-center">
                   स्टेशन / Station
                </div>
                <div className="grid grid-cols-2 h-[50%]">
                    <div className="border-r border-black flex items-center justify-center h-full">
                      से/From
                    </div>
                    <div className="flex items-center justify-center h-full">
                      तक/To
                    </div>
                </div>
            </div>
        ) : (
            <div className="border-r border-black h-[12mm] grid grid-cols-2">
                <div className="border-r border-black h-full"></div>
                <div className="h-full"></div>
            </div>
        )}

        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]">
           {showLabels && <><span>कि. मी.</span><span className="mt-0.5">Kms.</span></>}
        </div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]">
           {showLabels && <><span>दिन/रात</span><span className="mt-0.5">Day/Night</span></>}
        </div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]">
           {showLabels && <><span>यात्रा का उद्देश्य</span><span className="mt-0.5">Object of journey</span></>}
        </div>
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]">
           {showLabels && <><span>दर</span><span className="mt-0.5">Rate</span></>}
        </div>
        
        {/* Column 11 & 12 */}
        <div className="border-r border-black p-0.5 flex flex-col justify-center h-[12mm]">
            {showLabels && <span className="leading-tight">दूरी जिसके लिये प्राईवेट / सार्वजनिक<br/>सवारी का उपयोग किया गया<br/><span className="font-normal text-[7px] block mt-0.5">Distance for which private/public conveyance is used</span></span>}
        </div>
        <div className="p-0.5 flex flex-col justify-center h-[12mm]">
            {showLabels && <span className="leading-tight">दूरी अनुसूची के मद 20 का संदर्भ<br/><span className="font-normal text-[7px] block mt-0.5">Reference to Item 20 In Schedule of distance</span></span>}
        </div>

        {/* Column Numbers */}
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

  // --- TOTAL ROW COMPONENT ---
  const TotalRow = ({ label, amount }: { label: string, amount: number }) => (
    <div className="grid grid-cols-[8%_8%_6%_6%_8%_8%_5%_5%_18%_6%_12%_10%] border-t border-black h-[8mm] text-[9px] font-bold leading-none bg-gray-50/50">
        {/* Label spanning columns 1-9 (72%) */}
        <div className="col-span-9 border-r border-black flex items-center justify-end px-2 uppercase tracking-wider">
            {label}
        </div>
        {/* Rate Column (6%) */}
        <div className="border-r border-black flex items-center justify-center pt-0.5" style={INK_STYLE}>
            {amount > 0 ? amount : ''}
        </div>
        {/* Empty cols */}
        <div className="border-r border-black"></div>
        <div></div>
    </div>
  );

  // The ID "print-content" is crucial for html2pdf
  return (
    <div id="print-content" className="w-full mx-auto bg-white">
      {formsToPrint.map((form, index) => (
        <React.Fragment key={index}>
            {/* ================= FORM {index+1} PAGE 1 ================= */}
            <div className="page-break relative px-[5mm] pt-[5mm] box-border" style={{ width: '297mm', height: '209mm' }}>
                <PageHeader />
                <div className="border-2 border-black mt-0.5">
                    <TableHeader showLabels={true} />
                    <TableRows entries={form.page1} />
                    <TotalRow label="Total (Carried Over)" amount={form.page1Total} />
                </div>
                
                {/* Page 1 Footer */}
                <div className="flex justify-between items-end mt-1 px-1">
                   <div className="text-[9px] font-bold">C.R.P. 00-06-0006-13,00,000 Forms-04-06</div>
                   <div className="text-[9px] font-bold">कृ. पु.प./P.T.O.</div>
                </div>
                
                <div className="absolute bottom-1 right-4 text-[8px]">
                    Form {form.formIndex}/{form.totalForms} - Page 1 of 2
                </div>
            </div>

            {/* ================= FORM {index+1} PAGE 2 ================= */}
            <div className={`relative px-[5mm] pt-[15mm] box-border ${index < formsToPrint.length - 1 ? 'page-break' : ''}`} style={{ width: '297mm', height: '209mm' }}>
                <div className="border-2 border-black">
                    <TableHeader showLabels={false} />
                    <TableRows entries={form.page2} />
                    <TotalRow label="Grand Total" amount={form.grandTotal} />
                </div>
                
                <Page2Footer grandTotalWords={form.grandTotalWords} />
                
                <div className="absolute bottom-1 right-4 text-[8px]">
                    Form {form.formIndex}/{form.totalForms} - Page 2 of 2
                </div>
            </div>
        </React.Fragment>
      ))}
    </div>
  );
};