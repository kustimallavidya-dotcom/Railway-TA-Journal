export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  station: string;
  pay: string;
  level: string;
  pfNumber: string;
  headquarters: string;
  branch: string;
  division: string;
}

export interface TAEntry {
  id: string;
  date: string; // Col 1
  trainNo: string; // Col 2
  departTime: string; // Col 3
  arriveTime: string; // Col 4
  stationFrom: string; // Col 5
  stationTo: string; // Col 6
  kms: string; // Col 7
  dayNightPercent: string; // Col 8
  purpose: string; // Col 9
  rate: string; // Col 10
  distancePvt: string; // Col 11
  refItem20: string; // Col 12
}

export interface MonthJournal {
  id: string; // Format: YYYY-MM-PROFILEID
  profileId: string;
  month: string; // MM
  year: string; // YYYY
  entries: TAEntry[];
  isLocked?: boolean;
}

export const COLUMNS_HINDI = [
  "माह और तारीख", "गाड़ी का क्रमांक", "प्रस्थान समय", "आगमन समय", "से / From", "तक / To",
  "कि. मी.", "दिन/रात %", "यात्रा का उद्देश्य", "दर", 
  "दूरी जिसके लिये प्राइवेट/सार्वजनिक सवारी का उपयोग किया गया", "दूरी-अनुसूची के मद 20 का संदर्भ"
];

export const COLUMNS_ENGLISH = [
  "Month & Date", "Train No.", "Time left", "Time arrived", "Station", "Station",
  "Kms.", "Day/Night", "Object of journey", "Rate",
  "Distance for which private/public conveyance is used", "Reference to Item 20 In Schedul of distance"
];