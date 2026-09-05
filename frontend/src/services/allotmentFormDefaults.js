/**
 * Master data models, constants, inventory items, and verbatim official rules
 * for Tejus Boys PG Room Allotment & Student Undertaking Form.
 * 
 * SOURCE OF TRUTH: Original Official Document
 */

export const INVENTORY_ITEMS = [
  { id: 1, name: 'Room Keys & Keychain' },
  { id: 2, name: 'Main Door Handle & Lock' },
  { id: 3, name: 'Bed Frame / Cot' },
  { id: 4, name: 'Mattress & Cover' },
  { id: 5, name: 'Study Table & Drawers' },
  { id: 6, name: 'Study Chair' },
  { id: 7, name: 'Wardrobe / Almirah & Lock' },
  { id: 8, name: 'Ceiling Fan & Regulator' },
  { id: 9, name: 'LED Tube Light / Batten' },
  { id: 10, name: 'Electrical Switchboards' },
  { id: 11, name: 'Charging Sockets & Switches' },
  { id: 12, name: 'Window Curtains & Rods' },
  { id: 13, name: 'Window Panes & Glasses' },
  { id: 14, name: 'Dressing / Bathroom Mirror' },
  { id: 15, name: 'Bathroom Door & Latch' },
  { id: 16, name: 'Wash Basin & Tap Fittings' },
  { id: 17, name: 'Western Toilet Seat & Jet' },
  { id: 18, name: 'Shower Head & Valves' },
  { id: 19, name: 'Water Geyser (25L)' },
  { id: 20, name: 'Bathroom Exhaust Fan' },
  { id: 21, name: 'Air Conditioner Unit (1.5T)' },
  { id: 22, name: 'AC Remote Controller' },
  { id: 23, name: 'Dustbin (Room & Bath)' },
  { id: 24, name: 'Other Fixtures / Painting' },
];

export const DOCUMENT_CHECKLIST = [
  { id: 'aadhaarCopy', label: 'Aadhaar Card Copy', icon: '🪪' },
  { id: 'collegeId', label: 'College / Student ID', icon: '🎓' },
  { id: 'parentIdProof', label: 'Parent ID Proof', icon: '👨‍👩‍👦' },
  { id: 'policeVerification', label: 'Police Verification Form', icon: '👮‍♂️' },
  { id: 'twoPhotos', label: '2 Photos Submitted', icon: '📷' },
];

export const PG_RULES_CATEGORIES = [
  {
    category: 'I. ROOM HANDOVER & STRUCTURAL DAMAGE POLICY',
    rules: [
      {
        num: 1,
        title: 'Exact Handover Mandate (Jaisa Mila Waisa Hi Dena Hoga)',
        text: 'Room and fitted items are handed over in good condition. Upon vacating, the resident must return the room in the EXACT SAME CONDITION. Any loss, damage, or wear beyond normal use must be borne entirely by the student.',
      },
      {
        num: 2,
        title: 'Damage Cost Recovery & Extra Billing',
        text: 'Cost of repair/replacement for damaged furniture, doors, locks, switches, bathroom fittings, or appliances will be deducted from the deposit. If damage exceeds the deposit, the remaining balance must be paid immediately by the student/parent.',
      },
      {
        num: 3,
        title: 'Wall Protection & Alteration Ban',
        text: 'Nails, screws, drilling, double-sided tapes, stickers, or writing on walls, doors, or wardrobes is strictly prohibited. Wall repairs and repainting will be billed at actual repair costs.',
      },
      {
        num: 4,
        title: 'Shared Common Area Damage',
        text: 'Unidentified damage in corridors, staircases, or shared washrooms will be equally billed to all residents of that floor/section.',
      },
    ],
  },
  {
    category: 'II. PROHIBITED ITEMS & SUBSTANCE BAN',
    rules: [
      {
        num: 5,
        title: 'Zero-Tolerance Substance Ban',
        text: 'Possession or consumption of liquor/alcohol, cigarettes, hookah, e-cigarettes, vaping devices, or narcotics is strictly banned anywhere on PG premises. Immediate eviction and deposit forfeiture apply.',
      },
      {
        num: 6,
        title: 'Heavy Electrical Appliances Ban',
        text: 'Electric Heaters, Inductions, Microwaves, Kettles, Irons, Refrigerators, Toasters, or Air Fryers are forbidden due to fire hazards and power load constraints.',
      },
      {
        num: 7,
        title: 'Fire Safety',
        text: 'Candles, incense sticks (agarbatti), gas cylinders, or open flames are strictly banned.',
      },
    ],
  },
  {
    category: 'III. TIMINGS, CURFEW & VISITOR SECURITY',
    rules: [
      {
        num: 8,
        title: 'Main Gate Curfew',
        text: 'Outer PG gates strictly close at 10:00 PM. Entry post-curfew requires prior written permission from warden/management.',
      },
      {
        num: 9,
        title: 'Visiting Rules & Female Guest Ban',
        text: 'Visitors/Parents are allowed only in reception (10:00 AM – 7:00 PM). Overnight guest stay is prohibited. Female visitors are strictly banned from resident rooms.',
      },
      {
        num: 10,
        title: 'Personal Valuables & Key Safety',
        text: 'Residents must lock rooms when leaving. Management is not responsible for lost cash or valuables. Lost keys require full lock replacement charges.',
      },
    ],
  },
  {
    category: 'IV. CYBER SAFETY & WI-FI POLICY',
    rules: [
      {
        num: 11,
        title: 'Legal Internet Usage',
        text: 'Wi-Fi is for educational/lawful use. Torrenting, illegal downloads, or cyber offences are prohibited. Router/AP tampering carries a ₹2,000 fine + repair costs.',
      },
      {
        num: 12,
        title: 'No Credential Sharing',
        text: 'Sharing Wi-Fi login credentials with outsiders or non-residents is strictly forbidden.',
      },
    ],
  },
  {
    category: 'V. ENERGY & WATER CONSERVATION',
    rules: [
      {
        num: 13,
        title: 'Mandatory Appliance Shut-Off',
        text: 'Lights, fans, geyser, and AC must be turned off when leaving the room. Water leakage must be reported immediately to prevent wastage.',
      },
    ],
  },
  {
    category: 'VI. RENT, SUB-METER & NOTICE TERMS',
    rules: [
      {
        num: 14,
        title: 'Payment Schedule & Late Fee',
        text: 'Monthly rent is due in advance by the 5th of every month. A late fee of ₹100/day applies from the 6th onwards.',
      },
      {
        num: 15,
        title: 'Sub-Meter Utility Billing',
        text: 'Room AC/power consumption will be billed monthly based on actual sub-meter unit readings at commercial rates.',
      },
      {
        num: 16,
        title: 'Mandatory 30-Day Notice & Lock-In',
        text: 'Minimum stay is 3 months. A 30-day written notice is required before vacating; failure results in full deposit forfeiture.',
      },
    ],
  },
  {
    category: 'VII. CLEANLINESS, HYGIENE & DEEP CLEANING',
    rules: [
      {
        num: 17,
        title: 'Hygiene Maintenance',
        text: 'Residents must maintain clean rooms and washrooms. Room dustbins must be emptied into central bins daily.',
      },
      {
        num: 18,
        title: 'Vacating Deep Cleaning Fee',
        text: 'If a room is handed over in an excessively dirty or stained condition upon vacating, a professional deep cleaning fee (₹1,000 – ₹2,500) will be deducted from the security deposit.',
      },
      {
        num: 19,
        title: 'Laundry Policy',
        text: 'Drying clothes on windows, balcony railings, curtain rods, or AC units is forbidden. Use designated drying stands.',
      },
    ],
  },
  {
    category: 'VIII. VEHICLE PARKING & TRAFFIC RULES',
    rules: [
      {
        num: 20,
        title: 'Registered Vehicle Parking',
        text: "Only vehicles registered during admission may be parked inside premises at Owner's Risk. Parking in front of gates or passages is forbidden.",
      },
    ],
  },
  {
    category: 'IX. COMMON DECORUM, ANTI-SUBLETTING & HEALTH',
    rules: [
      {
        num: 21,
        title: 'Common Area Decorum & Dress Code',
        text: 'Decent attire is mandatory in reception and corridors. Leaving shoes, slippers, or trash bags in corridors is prohibited.',
      },
      {
        num: 22,
        title: 'Anti-Subletting & Card Misuse',
        text: 'Subletting allotted beds or misuse of entrance cards/biometrics for outsiders will result in immediate expulsion.',
      },
      {
        num: 23,
        title: 'Health & Emergency Reporting',
        text: 'Illness or injuries must be reported to the warden immediately. Medical/ambulance expenses shall be borne by parents/student.',
      },
    ],
  },
  {
    category: 'X. DISCIPLINE, PEACE & INSPECTION RIGHTS',
    rules: [
      {
        num: 24,
        title: 'Quiet Hours (10:30 PM - 6:00 AM)',
        text: 'Loud music, shouting, or disturbance is prohibited during quiet hours. Fights or misconduct trigger instant expulsion.',
      },
      {
        num: 25,
        title: 'Management Inspection Rights',
        text: 'Management/Warden reserves the right to inspect any room at reasonable times for safety checks, cleanliness, maintenance, or policy adherence.',
      },
    ],
  },
];

export const UNDERTAKING_TEXT =
  'UNDERTAKING STATEMENT: I hereby declare that all information provided in this form is true and accurate. I have read, understood, and unreservedly agree to abide by all 25 rules, policies, vehicle regulations, cyber guidelines, and safety rules of Tejus Boys PG. I specifically acknowledge that I must return the room in the exact same condition as received upon joining. I accept full financial responsibility for any physical damage, broken items, wall stains, or alterations caused during my stay, and agree that repair/cleaning costs will be deducted from my security deposit or billed extra if required. I also understand that prohibited activities (alcohol, smoking, drugs, fights, subletting) will lead to immediate eviction.';

export const CLEARANCE_INSPECTION_AREAS = [
  'Furniture, Walls, Doors & Painting Condition',
  'Electrical Fittings, Lights, Fan & AC Unit',
  'Bathroom Fixtures, Geyser & Plumbing',
  'Key Handover & Rent / Electricity Dues Clear',
];

export const generateFormNumber = () => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `TBPG-2026-${randomSuffix}`;
};

export const getInitialFormData = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  // Initialize all 24 inventory items
  const initialInventory = {};
  INVENTORY_ITEMS.forEach((item) => {
    initialInventory[item.id] = {
      status: true,
      condition: 'Ex', // Default Excellent
    };
  });

  // Initialize document checklist
  const initialDocs = {};
  DOCUMENT_CHECKLIST.forEach((doc) => {
    initialDocs[doc.id] = false;
  });

  // Initialize clearance items
  const initialClearance = {};
  CLEARANCE_INSPECTION_AREAS.forEach((area, idx) => {
    initialClearance[idx] = {
      area,
      goodClean: true,
      damagedMissing: false,
      deductionAmount: '',
      remarks: '',
    };
  });

  return {
    formNo: generateFormNumber(),
    dateOfAdmission: `${dd} / ${mm} / ${yyyy}`,
    photoUrl: '', // Data URL of passport photo

    // Section 1: Personal & Academic Details
    personal: {
      fullName: '',
      dob: '',
      fatherName: '',
      motherName: '',
      studentMobile: '',
      parentMobile: '',
      email: '',
      aadhaarNo: '',
      bloodGroup: '',
      occupation: '',
      college: '',
      courseBranch: '',
      yearSemester: '',
      emergencyMobile: '',
      permanentAddress: '',
      localGuardian: '',
      relationshipContact: '',
    },

    // Section 2: Room Allotment & Financial Terms
    room: {
      buildingName: 'Main Building',
      floorRoomNo: '',
      bedNumber: '',
      keyNumberIssued: '',
      occupancy: 'Double', // Single, Double, Triple
      category: 'Air Conditioned (AC)', // Air Conditioned (AC), Non-AC
      joiningDate: `${yyyy}-${mm}-${dd}`,
      agreedVacatingDate: '',
      monthlyRent: '8500',
      securityDeposit: '8500',
      subMeterReading: '0.0',
      rentDueDate: '5th of every month',
      wifiUsername: '',
      wifiPassword: '',
    },

    // Section 3: Payment Record
    payment: {
      securityDepositPaid: '8500',
      advanceRentPaid: '8500',
      paymentMode: 'UPI / GPay', // UPI / GPay, Cash, Bank Transfer
      transactionNo: '',
    },

    // Section 4: Document Checklist
    documents: initialDocs,

    // Section 5: Inventory
    inventory: initialInventory,

    // Section 6: Rules Acknowledgement
    rulesAccepted: false,

    // Section 7: Clearance (Office Use Only)
    clearance: initialClearance,

    // Section 8: Declaration
    declarationAccepted: false,

    // Section 9: Signatures
    signatures: {
      resident: '', // data URL
      parent: '', // data URL
      staff: '', // data URL
      managerStamp: '', // data URL or text
    },
  };
};

export const getSampleFormData = () => {
  const base = getInitialFormData();
  // Standard sample avatar image data URL
  base.photoUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  base.personal = {
    fullName: 'Rahul Sharma',
    dob: '2004-08-15',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    studentMobile: '9876543210',
    parentMobile: '9812345678',
    email: 'rahul.sharma@example.com',
    aadhaarNo: '4512 8796 3214',
    bloodGroup: 'B+ Positive',
    occupation: 'Student',
    college: 'Graphic Era University, Dehradun',
    courseBranch: 'B.Tech Computer Science & Engineering',
    yearSemester: '3rd Year / 5th Sem',
    emergencyMobile: '9812345678',
    permanentAddress: 'House No. 142, Sector 14, Urban Estate, Karnal, Haryana - 132001',
    localGuardian: 'Vikram Singh (Uncle)',
    relationshipContact: 'Paternal Uncle | +91 94160 12345',
  };

  base.room = {
    buildingName: 'Tejus Boys PG Block A',
    floorRoomNo: '2nd Floor, Room 204',
    bedNumber: 'Bed A-1',
    keyNumberIssued: 'K-204-A',
    occupancy: 'Double',
    category: 'Air Conditioned (AC)',
    joiningDate: '2026-09-10',
    agreedVacatingDate: '2027-06-30',
    monthlyRent: '8800',
    securityDeposit: '8800',
    subMeterReading: '1240.5',
    rentDueDate: '5th of every month',
    wifiUsername: 'tejus_204',
    wifiPassword: 'TejusSecure#2026',
  };

  base.payment = {
    securityDepositPaid: '8800',
    advanceRentPaid: '8800',
    paymentMode: 'UPI / GPay',
    transactionNo: 'UPI/20260905/7418529630',
  };

  base.documents = {
    aadhaarCopy: true,
    collegeId: true,
    parentIdProof: true,
    policeVerification: true,
    twoPhotos: true,
  };

  base.rulesAccepted = true;
  base.declarationAccepted = true;

  return base;
};
