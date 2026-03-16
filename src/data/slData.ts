// ── Static Senior Leadership data ─────────────────────────────────────────
// Ported from MedSave_Platform_v4_SouthYorkshire.html (SL_DATA + OPPS constants)

export interface Practice {
  id: string
  nm: string
  pts: number
  sav: number
  pot: number
  sw: number
  done: number
  rag: 'g' | 'a' | 'r'
  ppu: number
  trend: number
}

export interface SubICB {
  name: string
  code: string
  population: number
  registered: number
  spend: number
  budget: number
  savDelivered: number
  savPotential: number
  switches: number
  switchesDone: number
  ppu_index: number
  concessionCost: number
  practices: Practice[]
}

export interface ConcessionMonth {
  month: string
  count: number
  totalImpact: number
  topDrugs: { name: string; tariffPrice: number; concessionPrice: number; monthlyItems: number }[]
}

export interface PatentExpiry {
  drug: string
  bnf: string
  indication: string
  expiryDate: string
  monthsToExpiry: number
  status: string
  annualSaving: number
  practicesAffected: number
}

export interface PPUEntry {
  drug: string
  bnf: string
  unit: string
  avgPPU: number
  minPPU: number
  maxPPU: number
  icbPPU: number
  worstPrac: string
  worstPPU: number
  bestPrac: string
  bestPPU: number
  annualSaving: number
  items: number
  category: string
}

export interface ExpenditureEntry {
  category: string
  bnfChapter: string
  prevYear: number
  currentYear: number
  yoyChange: number
  driver: string
  monthlyTrend: number[]
}

export interface ImplementedSwitch {
  drug: string
  switchType: string
  subicb: string
  implementedDate: string
  expectedSaving: number
  actualSaving: number
  epdStatus: 'Verified' | 'Partial' | 'In progress'
}

export interface MonthlyTrend {
  month: string
  spend: number
  budget: number
  saving: number
  cumSaving: number
}

export interface Opp {
  id: number
  rank: number
  fr: string
  to: string
  bnf: string
  ch: string
  sav: number
  pp: number
  pts: number
  ease: number
  eL: string
  cat: string
  inc: boolean
}

// ── SL_DATA ────────────────────────────────────────────────────────────────

export const SL_DATA: {
  subICBs: Record<string, SubICB>
  concessions: ConcessionMonth[]
  patentExpiry: PatentExpiry[]
  ppu: PPUEntry[]
  expenditure: ExpenditureEntry[]
  implementedSwitches: ImplementedSwitch[]
  monthlyTrend: MonthlyTrend[]
} = {
  subICBs: {
    barnsley: {
      name: 'Barnsley', code: '14F1', population: 244000, registered: 183000,
      spend: 48200000, budget: 49000000,
      savDelivered: 312400, savPotential: 820000,
      switches: 14, switchesDone: 6,
      ppu_index: 112, concessionCost: 28400,
      practices: [
        { id: 'B81001', nm: 'Barnsley Central Practice', pts: 7120, sav: 42800, pot: 98000, sw: 7, done: 3, rag: 'r', ppu: 118, trend: -2 },
        { id: 'B81002', nm: 'Penistone Group Practice', pts: 5840, sav: 38200, pot: 82000, sw: 6, done: 4, rag: 'a', ppu: 108, trend: 3 },
        { id: 'B81003', nm: 'Keresforth Medical Centre', pts: 6200, sav: 51200, pot: 88000, sw: 8, done: 6, rag: 'g', ppu: 104, trend: 5 },
        { id: 'B81004', nm: 'Church View Surgery', pts: 4980, sav: 29400, pot: 71000, sw: 5, done: 2, rag: 'r', ppu: 124, trend: -4 },
        { id: 'B81005', nm: 'Darton Medical Centre', pts: 5600, sav: 44800, pot: 79000, sw: 6, done: 4, rag: 'a', ppu: 111, trend: 1 },
        { id: 'B81006', nm: 'Wombwell Health Centre', pts: 4320, sav: 33200, pot: 68000, sw: 5, done: 3, rag: 'a', ppu: 115, trend: -1 },
        { id: 'B81007', nm: 'Goldthorpe Surgery', pts: 3890, sav: 22400, pot: 58000, sw: 4, done: 1, rag: 'r', ppu: 128, trend: -6 },
        { id: 'B81008', nm: 'Royston Surgery', pts: 4100, sav: 50600, pot: 76000, sw: 7, done: 6, rag: 'g', ppu: 98, trend: 8 },
      ],
    },
    sheffield: {
      name: 'Sheffield', code: '14F2', population: 584000, registered: 428000,
      spend: 112800000, budget: 115000000,
      savDelivered: 748200, savPotential: 1820000,
      switches: 28, switchesDone: 18,
      ppu_index: 96, concessionCost: 62400,
      practices: [
        { id: 'C84001', nm: 'Darnall Health Centre', pts: 6840, sav: 68400, pot: 142000, sw: 11, done: 7, rag: 'g', ppu: 92, trend: 6 },
        { id: 'C84002', nm: 'Manor Park Medical', pts: 5210, sav: 54800, pot: 118000, sw: 8, done: 5, rag: 'a', ppu: 98, trend: 2 },
        { id: 'C84003', nm: 'Crystal Peaks Surgery', pts: 4980, sav: 72200, pot: 108000, sw: 9, done: 8, rag: 'g', ppu: 88, trend: 9 },
        { id: 'C84004', nm: 'Hillsborough Group Practice', pts: 5920, sav: 61400, pot: 128000, sw: 9, done: 6, rag: 'g', ppu: 94, trend: 4 },
        { id: 'C84005', nm: 'Crookes Valley Medical', pts: 6180, sav: 48200, pot: 112000, sw: 8, done: 4, rag: 'a', ppu: 101, trend: -1 },
        { id: 'C84006', nm: 'Burngreave Surgery', pts: 7240, sav: 42800, pot: 138000, sw: 10, done: 3, rag: 'r', ppu: 116, trend: -5 },
        { id: 'C84007', nm: 'Sharrow Health Centre', pts: 5640, sav: 38400, pot: 102000, sw: 7, done: 3, rag: 'r', ppu: 119, trend: -3 },
        { id: 'C84008', nm: 'Nether Edge Medical', pts: 4820, sav: 66200, pot: 96000, sw: 8, done: 7, rag: 'g', ppu: 86, trend: 11 },
        { id: 'C84009', nm: 'Gleadless Valley Surgery', pts: 5100, sav: 71800, pot: 104000, sw: 9, done: 8, rag: 'g', ppu: 90, trend: 7 },
        { id: 'C84010', nm: 'Firth Park Surgery', pts: 6420, sav: 34200, pot: 118000, sw: 8, done: 2, rag: 'r', ppu: 122, trend: -8 },
        { id: 'C84011', nm: 'Stannington Surgery', pts: 3980, sav: 55400, pot: 84000, sw: 6, done: 5, rag: 'g', ppu: 93, trend: 4 },
        { id: 'C84012', nm: 'Woodhouse Surgery', pts: 4560, sav: 32800, pot: 86000, sw: 6, done: 2, rag: 'r', ppu: 121, trend: -4 },
      ],
    },
    doncaster: {
      name: 'Doncaster', code: '14F3', population: 310000, registered: 228000,
      spend: 58400000, budget: 60000000,
      savDelivered: 418600, savPotential: 940000,
      switches: 18, switchesDone: 11,
      ppu_index: 108, concessionCost: 38200,
      practices: [
        { id: 'D82001', nm: 'Doncaster Gate Medical', pts: 6180, sav: 62400, pot: 118000, sw: 10, done: 7, rag: 'g', ppu: 102, trend: 3 },
        { id: 'D82002', nm: 'Balby Medical Centre', pts: 3890, sav: 38200, pot: 72000, sw: 5, done: 4, rag: 'a', ppu: 108, trend: 0 },
        { id: 'D82003', nm: 'Mexborough Surgery', pts: 4320, sav: 28400, pot: 84000, sw: 8, done: 2, rag: 'r', ppu: 124, trend: -7 },
        { id: 'D82004', nm: 'Thorne Road Medical', pts: 5640, sav: 54800, pot: 104000, sw: 8, done: 6, rag: 'g', ppu: 98, trend: 5 },
        { id: 'D82005', nm: 'Hatfield Medical Centre', pts: 4820, sav: 44200, pot: 88000, sw: 7, done: 5, rag: 'g', ppu: 104, trend: 2 },
        { id: 'D82006', nm: 'Armthorpe Surgery', pts: 5100, sav: 32400, pot: 92000, sw: 6, done: 2, rag: 'r', ppu: 118, trend: -5 },
        { id: 'D82007', nm: 'Conisborough Surgery', pts: 3760, sav: 48600, pot: 78000, sw: 6, done: 5, rag: 'g', ppu: 96, trend: 6 },
        { id: 'D82008', nm: 'Edlington Health Centre', pts: 4240, sav: 29200, pot: 68000, sw: 5, done: 2, rag: 'r', ppu: 126, trend: -4 },
        { id: 'D82009', nm: 'Adwick Medical Centre', pts: 5420, sav: 58400, pot: 102000, sw: 8, done: 6, rag: 'g', ppu: 100, trend: 4 },
      ],
    },
    rotherham: {
      name: 'Rotherham', code: '14F4', population: 264000, registered: 196000,
      spend: 52600000, budget: 54000000,
      savDelivered: 362800, savPotential: 780000,
      switches: 16, switchesDone: 9,
      ppu_index: 104, concessionCost: 32800,
      practices: [
        { id: 'E83001', nm: 'Rotherham Town Centre', pts: 5640, sav: 52400, pot: 102000, sw: 6, done: 5, rag: 'g', ppu: 98, trend: 4 },
        { id: 'E83002', nm: 'Rawmarsh Surgery', pts: 4820, sav: 38800, pot: 86000, sw: 7, done: 4, rag: 'a', ppu: 106, trend: 1 },
        { id: 'E83003', nm: 'Wath-upon-Dearne Surgery', pts: 3240, sav: 22400, pot: 62000, sw: 4, done: 2, rag: 'r', ppu: 118, trend: -3 },
        { id: 'E83004', nm: 'Maltby Surgery', pts: 4560, sav: 48200, pot: 88000, sw: 7, done: 5, rag: 'g', ppu: 102, trend: 3 },
        { id: 'E83005', nm: 'Wickersley Medical', pts: 5100, sav: 44800, pot: 94000, sw: 7, done: 4, rag: 'a', ppu: 108, trend: -1 },
        { id: 'E83006', nm: 'Brinsworth Surgery', pts: 3980, sav: 32400, pot: 72000, sw: 5, done: 2, rag: 'r', ppu: 116, trend: -4 },
        { id: 'E83007', nm: 'Swinton Medical Centre', pts: 4420, sav: 54800, pot: 84000, sw: 7, done: 5, rag: 'g', ppu: 96, trend: 5 },
        { id: 'E83008', nm: 'Thurcroft Surgery', pts: 3680, sav: 28400, pot: 66000, sw: 4, done: 2, rag: 'r', ppu: 120, trend: -6 },
        { id: 'E83009', nm: 'Clifton Medical Practice', pts: 5240, sav: 40600, pot: 92000, sw: 6, done: 3, rag: 'a', ppu: 110, trend: 0 },
      ],
    },
  },

  concessions: [
    {
      month: 'Oct 2025', count: 12, totalImpact: 38200,
      topDrugs: [
        { name: 'Metformin 500mg SR tabs', tariffPrice: 142, concessionPrice: 384, monthlyItems: 3420 },
        { name: 'Pregabalin 25mg caps', tariffPrice: 168, concessionPrice: 412, monthlyItems: 2840 },
        { name: 'Omeprazole 20mg caps', tariffPrice: 51, concessionPrice: 118, monthlyItems: 4820 },
        { name: 'Amoxicillin 500mg caps', tariffPrice: 84, concessionPrice: 196, monthlyItems: 3200 },
        { name: 'Flucloxacillin 250mg caps', tariffPrice: 72, concessionPrice: 198, monthlyItems: 2600 },
      ],
    },
    {
      month: 'Nov 2025', count: 14, totalImpact: 42800,
      topDrugs: [
        { name: 'Amoxicillin 500mg caps', tariffPrice: 84, concessionPrice: 228, monthlyItems: 4200 },
        { name: 'Pregabalin 75mg caps', tariffPrice: 864, concessionPrice: 1840, monthlyItems: 2100 },
        { name: 'Metformin 500mg SR tabs', tariffPrice: 142, concessionPrice: 396, monthlyItems: 3600 },
        { name: 'Flucloxacillin 500mg caps', tariffPrice: 148, concessionPrice: 362, monthlyItems: 2800 },
        { name: 'Lansoprazole 30mg caps', tariffPrice: 50, concessionPrice: 124, monthlyItems: 5100 },
      ],
    },
    {
      month: 'Dec 2025', count: 18, totalImpact: 56400,
      topDrugs: [
        { name: 'Pregabalin 75mg caps', tariffPrice: 864, concessionPrice: 2120, monthlyItems: 2800 },
        { name: 'Metformin 500mg SR tabs', tariffPrice: 142, concessionPrice: 420, monthlyItems: 3840 },
        { name: 'Amoxicillin 500mg caps', tariffPrice: 84, concessionPrice: 242, monthlyItems: 4600 },
        { name: 'Flucloxacillin 500mg caps', tariffPrice: 148, concessionPrice: 384, monthlyItems: 3200 },
        { name: 'Citalopram 20mg tabs', tariffPrice: 38, concessionPrice: 112, monthlyItems: 6400 },
      ],
    },
    {
      month: 'Jan 2026', count: 16, totalImpact: 61200,
      topDrugs: [
        { name: 'Pregabalin 75mg caps', tariffPrice: 864, concessionPrice: 2280, monthlyItems: 3100 },
        { name: 'Pregabalin 150mg caps', tariffPrice: 1152, concessionPrice: 2640, monthlyItems: 1840 },
        { name: 'Metformin 500mg SR tabs', tariffPrice: 142, concessionPrice: 388, monthlyItems: 3900 },
        { name: 'Flucloxacillin 500mg caps', tariffPrice: 148, concessionPrice: 376, monthlyItems: 3400 },
        { name: 'Omeprazole 20mg caps', tariffPrice: 51, concessionPrice: 132, monthlyItems: 5200 },
      ],
    },
    {
      month: 'Feb 2026', count: 13, totalImpact: 48800,
      topDrugs: [
        { name: 'Flucloxacillin 500mg caps', tariffPrice: 148, concessionPrice: 396, monthlyItems: 3800 },
        { name: 'Pregabalin 75mg caps', tariffPrice: 864, concessionPrice: 1980, monthlyItems: 2200 },
        { name: 'Amoxicillin 500mg caps', tariffPrice: 84, concessionPrice: 210, monthlyItems: 4100 },
        { name: 'Metformin 500mg SR tabs', tariffPrice: 142, concessionPrice: 368, monthlyItems: 3600 },
        { name: 'Citalopram 20mg tabs', tariffPrice: 38, concessionPrice: 108, monthlyItems: 6200 },
      ],
    },
    {
      month: 'Mar 2026', count: 11, totalImpact: 44600,
      topDrugs: [
        { name: 'Omeprazole 20mg caps', tariffPrice: 51, concessionPrice: 148, monthlyItems: 5800 },
        { name: 'Pregabalin 75mg caps', tariffPrice: 864, concessionPrice: 1920, monthlyItems: 2000 },
        { name: 'Amoxicillin 500mg caps', tariffPrice: 84, concessionPrice: 214, monthlyItems: 3900 },
        { name: 'Flucloxacillin 500mg caps', tariffPrice: 148, concessionPrice: 360, monthlyItems: 3100 },
        { name: 'Metformin 500mg SR tabs', tariffPrice: 142, concessionPrice: 358, monthlyItems: 3400 },
      ],
    },
  ],

  patentExpiry: [
    { drug: 'Tofacitinib (Xeljanz)', bnf: '1001040AC0', indication: 'Rheumatoid arthritis — JAK inhibitor', expiryDate: 'Jan 2026', monthsToExpiry: -2, status: 'Generic available now', annualSaving: 132192, practicesAffected: 12 },
    { drug: 'Sacubitril/valsartan (Entresto)', bnf: '0205080A0', indication: 'Heart failure — ARNi', expiryDate: 'Mar 2026', monthsToExpiry: 0, status: 'Generic imminent — Q2 2026', annualSaving: 479491, practicesAffected: 38 },
    { drug: 'Apremilast (Otezla)', bnf: '1301050AH0', indication: 'Psoriasis — PDE4 inhibitor', expiryDate: 'Dec 2025', monthsToExpiry: -3, status: 'Generic available now', annualSaving: 802032, practicesAffected: 9 },
    { drug: 'Umeclidinium/vilanterol (Anoro)', bnf: '0301040S0', indication: 'COPD — LAMA/LABA inhaler', expiryDate: 'Jun 2026', monthsToExpiry: 3, status: 'Patent expires Jun 2026 — prepare now', annualSaving: 629244, practicesAffected: 42 },
    { drug: 'Dapagliflozin 5mg (Forxiga)', bnf: '0601022Q0', indication: 'Diabetes/heart failure — SGLT-2', expiryDate: 'Oct 2025', monthsToExpiry: -5, status: 'Generic available now', annualSaving: 1112832, practicesAffected: 38 },
    { drug: 'Tiotropium/olodaterol (Spiolto)', bnf: '0301040T0', indication: 'COPD — LAMA/LABA inhaler', expiryDate: 'Sep 2026', monthsToExpiry: 6, status: 'Patent expires Sep 2026 — prepare now', annualSaving: 552960, practicesAffected: 36 },
    { drug: 'Cangrelor (Kengrexal) IV', bnf: '0208020AH0', indication: 'ACS — P2Y12 inhibitor IV', expiryDate: 'Already expired', monthsToExpiry: -8, status: 'Generic now available', annualSaving: 33600, practicesAffected: 2 },
    { drug: 'Baricitinib (Olumiant)', bnf: '1001040AJ0', indication: 'Rheumatoid arthritis — JAK inhibitor', expiryDate: 'Apr 2026', monthsToExpiry: 1, status: 'Patent expires Apr 2026 — imminent', annualSaving: 1138560, practicesAffected: 11 },
  ],

  ppu: [
    { drug: 'Omeprazole 20mg caps', bnf: '0103050P0', unit: 'capsule', avgPPU: 5.1, minPPU: 4.2, maxPPU: 8.9, icbPPU: 5.8, worstPrac: 'Goldthorpe Surgery', worstPPU: 8.9, bestPrac: 'Nether Edge Medical', bestPPU: 4.2, annualSaving: 28400, items: 182000, category: 'PPI' },
    { drug: 'Atorvastatin 20mg tabs', bnf: '0212000B0', unit: 'tablet', avgPPU: 17.1, minPPU: 17.1, maxPPU: 187.1, icbPPU: 42.8, worstPrac: 'Church View Surgery', worstPPU: 187.1, bestPrac: 'Crystal Peaks Surgery', bestPPU: 17.1, annualSaving: 124800, items: 284000, category: 'Statin' },
    { drug: 'Salbutamol 100mcg MDI', bnf: '0301011R0', unit: 'inhaler', avgPPU: 134, minPPU: 134, maxPPU: 197, icbPPU: 158, worstPrac: 'Burngreave Surgery', worstPPU: 197, bestPrac: 'Darnall Health Centre', bestPPU: 134, annualSaving: 42000, items: 148000, category: 'SABA' },
    { drug: 'Metformin 500mg tabs', bnf: '0601022B0', unit: 'tablet', avgPPU: 3.2, minPPU: 3.2, maxPPU: 15.0, icbPPU: 4.1, worstPrac: 'Armthorpe Surgery', worstPPU: 15.0, bestPrac: 'Gleadless Valley Surgery', bestPPU: 3.2, annualSaving: 18200, items: 624000, category: 'Antidiabetic' },
    { drug: 'Amlodipine 5mg tabs', bnf: '0206020A0', unit: 'tablet', avgPPU: 5.7, minPPU: 5.7, maxPPU: 29.3, icbPPU: 8.2, worstPrac: 'Firth Park Surgery', worstPPU: 29.3, bestPrac: 'Hillsborough Group Practice', bestPPU: 5.7, annualSaving: 68400, items: 442000, category: 'CCB' },
    { drug: 'Lansoprazole 30mg caps', bnf: '0103050E0', unit: 'capsule', avgPPU: 5.0, minPPU: 5.0, maxPPU: 22.1, icbPPU: 6.8, worstPrac: 'Edlington Health Centre', worstPPU: 22.1, bestPrac: 'Doncaster Gate Medical', bestPPU: 5.0, annualSaving: 38800, items: 218000, category: 'PPI' },
    { drug: 'Apixaban 5mg tabs', bnf: '0208020V0', unit: 'tablet', avgPPU: 20.0, minPPU: 20.0, maxPPU: 175.7, icbPPU: 38.2, worstPrac: 'Conisborough Surgery', worstPPU: 175.7, bestPrac: 'Gleadless Valley Surgery', bestPPU: 20.0, annualSaving: 94200, items: 168000, category: 'DOAC' },
    { drug: 'Bisoprolol 5mg tabs', bnf: '0205051R0', unit: 'tablet', avgPPU: 2.6, minPPU: 2.6, maxPPU: 24.3, icbPPU: 3.8, worstPrac: 'Thurcroft Surgery', worstPPU: 24.3, bestPrac: 'Crookes Valley Medical', bestPPU: 2.6, annualSaving: 44200, items: 258000, category: 'Beta-blocker' },
    { drug: 'Pregabalin 75mg caps', bnf: '0408010AF0', unit: 'capsule', avgPPU: 86.4, minPPU: 86.4, maxPPU: 172.8, icbPPU: 96.2, worstPrac: 'Wombwell Health Centre', worstPPU: 172.8, bestPrac: 'Nether Edge Medical', bestPPU: 86.4, annualSaving: 82400, items: 164000, category: 'Neuropathic' },
    { drug: 'Ramipril 5mg caps', bnf: '0205040D0', unit: 'capsule', avgPPU: 2.9, minPPU: 2.9, maxPPU: 30.0, icbPPU: 4.2, worstPrac: 'Church View Surgery', worstPPU: 30.0, bestPrac: 'Crystal Peaks Surgery', bestPPU: 2.9, annualSaving: 52000, items: 318000, category: 'ACE inhibitor' },
  ],

  expenditure: [
    { category: 'GLP-1 agonists (semaglutide/liraglutide)', bnfChapter: '0601023AD', prevYear: 2840000, currentYear: 4820000, yoyChange: 1980000, driver: 'NICE NG28 expansion, weight management demand', monthlyTrend: [210000,218000,228000,234000,242000,248000,354000,378000,398000,412000,424000,474000] },
    { category: 'Dapagliflozin (all doses — Forxiga)', bnfChapter: '0601022Q', prevYear: 1240000, currentYear: 2180000, yoyChange: 940000, driver: 'NICE NG28 HF/CKD indication, T2DM uptake', monthlyTrend: [86000,92000,98000,108000,118000,124000,168000,178000,188000,196000,206000,218000] },
    { category: 'Empagliflozin (all doses — Jardiance)', bnfChapter: '0601022S', prevYear: 980000, currentYear: 1640000, yoyChange: 660000, driver: 'HF and CKD indication expansion per NICE TA775', monthlyTrend: [68000,72000,78000,84000,90000,96000,124000,132000,140000,148000,156000,152000] },
    { category: 'Pregabalin (all doses)', bnfChapter: '0408010AF', prevYear: 3840000, currentYear: 4200000, yoyChange: 360000, driver: 'Chronic pain demand, neuropathy, anxiety off-label', monthlyTrend: [312000,318000,322000,326000,330000,334000,342000,346000,350000,354000,358000,408000] },
    { category: 'Adalimumab (all biosimilar forms)', bnfChapter: '1002020C', prevYear: 1820000, currentYear: 1640000, yoyChange: -180000, driver: 'Biosimilar switch programme reducing brand cost', monthlyTrend: [168000,164000,158000,152000,148000,144000,136000,132000,128000,126000,124000,120000] },
    { category: 'Rivaroxaban (Xarelto → generic)', bnfChapter: '0208020T', prevYear: 1480000, currentYear: 1380000, yoyChange: -100000, driver: 'Generic switch from Xarelto brand achieving savings', monthlyTrend: [128000,126000,124000,120000,116000,114000,112000,110000,108000,108000,106000,108000] },
    { category: 'Apixaban (Eliquis → generic)', bnfChapter: '0208020V', prevYear: 2240000, currentYear: 2180000, yoyChange: -60000, driver: 'Partial generic switch — 42% still on brand', monthlyTrend: [192000,190000,188000,184000,182000,180000,178000,178000,176000,176000,178000,178000] },
    { category: 'Inhalers (LABA/ICS all)', bnfChapter: '0301022', prevYear: 6840000, currentYear: 7240000, yoyChange: 400000, driver: 'Increased COPD/asthma prevalence, branded prescribing', monthlyTrend: [556000,564000,568000,572000,578000,582000,594000,598000,604000,610000,618000,796000] },
    { category: 'PCSK9 inhibitors (inclisiran/evolocumab)', bnfChapter: '0212000AH', prevYear: 380000, currentYear: 840000, yoyChange: 460000, driver: 'NICE TA733 expansion, CVD prevention push', monthlyTrend: [28000,32000,36000,40000,48000,56000,64000,72000,80000,88000,96000,200000] },
    { category: 'Tezepelumab (Tezspire) — severe asthma', bnfChapter: '0301020AB', prevYear: 0, currentYear: 420000, yoyChange: 420000, driver: 'New NICE TA838 — severe asthma, rapid uptake', monthlyTrend: [0,0,0,12000,24000,36000,42000,46000,52000,56000,82000,70000] },
  ],

  implementedSwitches: [
    { drug: 'Simvastatin → Atorvastatin generic', switchType: 'Ghost generic elimination', subicb: 'Sheffield', implementedDate: 'Sep 2024', expectedSaving: 98400, actualSaving: 92800, epdStatus: 'Verified' },
    { drug: 'Omeprazole liquid → capsule', switchType: 'Formulation switch', subicb: 'Barnsley', implementedDate: 'Oct 2024', expectedSaving: 54600, actualSaving: 51200, epdStatus: 'Verified' },
    { drug: 'Metformin MR → standard tablet', switchType: 'Formulation switch', subicb: 'Doncaster', implementedDate: 'Nov 2024', expectedSaving: 41600, actualSaving: 38400, epdStatus: 'Verified' },
    { drug: 'Apixaban Eliquis → generic', switchType: 'Ghost generic elimination', subicb: 'Rotherham', implementedDate: 'Dec 2024', expectedSaving: 74800, actualSaving: 71200, epdStatus: 'Verified' },
    { drug: 'Lansoprazole → omeprazole', switchType: 'Therapeutic switch', subicb: 'All', implementedDate: 'Jan 2025', expectedSaving: 88200, actualSaving: 84600, epdStatus: 'Verified' },
    { drug: 'Seretide 250 → generic MDI', switchType: 'Ghost generic elimination', subicb: 'Sheffield', implementedDate: 'Feb 2025', expectedSaving: 154800, actualSaving: 142400, epdStatus: 'Partial' },
    { drug: 'Atorvastatin Lipitor → generic', switchType: 'Ghost generic elimination', subicb: 'All', implementedDate: 'Mar 2025', expectedSaving: 228400, actualSaving: 214800, epdStatus: 'Verified' },
    { drug: 'Bisoprolol brand → generic', switchType: 'Ghost generic elimination', subicb: 'Doncaster', implementedDate: 'Jun 2025', expectedSaving: 38200, actualSaving: 0, epdStatus: 'In progress' },
  ],

  monthlyTrend: [
    { month: 'Apr 2025', spend: 21840000, budget: 22000000, saving: 42800, cumSaving: 42800 },
    { month: 'May 2025', spend: 21620000, budget: 22000000, saving: 58400, cumSaving: 101200 },
    { month: 'Jun 2025', spend: 21480000, budget: 22000000, saving: 62800, cumSaving: 164000 },
    { month: 'Jul 2025', spend: 21340000, budget: 22000000, saving: 71200, cumSaving: 235200 },
    { month: 'Aug 2025', spend: 21240000, budget: 22000000, saving: 68400, cumSaving: 303600 },
    { month: 'Sep 2025', spend: 21180000, budget: 22000000, saving: 82400, cumSaving: 386000 },
    { month: 'Oct 2025', spend: 21080000, budget: 22000000, saving: 88200, cumSaving: 474200 },
    { month: 'Nov 2025', spend: 20980000, budget: 22000000, saving: 76400, cumSaving: 550600 },
    { month: 'Dec 2025', spend: 20840000, budget: 22000000, saving: 94800, cumSaving: 645400 },
    { month: 'Jan 2026', spend: 20720000, budget: 22000000, saving: 102400, cumSaving: 747800 },
    { month: 'Feb 2026', spend: 20640000, budget: 22000000, saving: 98400, cumSaving: 846200 },
    { month: 'Mar 2026', spend: 20520000, budget: 22000000, saving: 112400, cumSaving: 958600 },
  ],
}

// ── Top 10 opportunities by saving ─────────────────────────────────────────
export const TOP_OPPS: Opp[] = [
  { id: 1, rank: 1, fr: 'Atorvastatin 20mg (Lipitor brand)', to: 'Generic atorvastatin 20mg', bnf: '0212000B0', ch: 'Ch.2.12 Statins', sav: 225792, pp: 88, pts: 8400, ease: 5, eL: 'Simple', cat: 'Ghost generic', inc: true },
  { id: 2, rank: 2, fr: 'Seretide 250 Evohaler', to: 'Generic salmeterol/fluticasone 25/250 MDI', bnf: '0301022R0', ch: 'Ch.3.1 LABA/ICS', sav: 191520, pp: 180, pts: 3800, ease: 3, eL: 'Moderate', cat: 'Ghost generic', inc: true },
  { id: 3, rank: 3, fr: 'Symbicort 200/6 Turbuhaler', to: 'Generic budesonide/formoterol 200/6', bnf: '0301022K0', ch: 'Ch.3.1 LABA/ICS', sav: 181440, pp: 180, pts: 4200, ease: 3, eL: 'Moderate', cat: 'Ghost generic', inc: true },
  { id: 4, rank: 4, fr: 'Atorvastatin 40mg (Lipitor brand)', to: 'Generic atorvastatin 40mg', bnf: '0212000B0', ch: 'Ch.2.12 Statins', sav: 180648, pp: 88, pts: 6200, ease: 5, eL: 'Simple', cat: 'Ghost generic', inc: true },
  { id: 5, rank: 5, fr: 'Pregabalin 75mg capsules', to: 'Gabapentin 300mg capsules', bnf: '0408010AF0', ch: 'Ch.4.8 Neuropathic', sav: 141696, pp: 60, pts: 8200, ease: 2, eL: 'Complex', cat: 'Therapeutic switch', inc: false },
  { id: 6, rank: 6, fr: 'Adalimumab (Humira brand)', to: 'Biosimilar adalimumab', bnf: '1002020C0', ch: 'Ch.10.1 Biologics', sav: 141120, pp: 7560, pts: 280, ease: 2, eL: 'Complex', cat: 'Biosimilar switch', inc: false },
  { id: 7, rank: 7, fr: 'Seretide 125 Evohaler', to: 'Generic salmeterol/fluticasone 25/125 MDI', bnf: '0301022R0', ch: 'Ch.3.1 LABA/ICS', sav: 132240, pp: 160, pts: 2900, ease: 3, eL: 'Moderate', cat: 'Ghost generic', inc: true },
  { id: 8, rank: 8, fr: 'Pregabalin 150mg capsules', to: 'Gabapentin 400mg capsules', bnf: '0408010AF0', ch: 'Ch.4.8 Neuropathic', sav: 118080, pp: 72, pts: 5400, ease: 2, eL: 'Complex', cat: 'Therapeutic switch', inc: false },
  { id: 9, rank: 9, fr: 'Amlodipine 10mg (Istin brand)', to: 'Generic amlodipine 10mg', bnf: '0206020A0', ch: 'Ch.2.6 CCBs', sav: 101136, pp: 51, pts: 9800, ease: 5, eL: 'Simple', cat: 'Ghost generic', inc: true },
  { id: 10, rank: 10, fr: 'Tiotropium 18mcg (Spiriva HandiHaler)', to: 'Generic tiotropium 18mcg HandiHaler', bnf: '0301020L0', ch: 'Ch.3.1 LAMA', sav: 99360, pp: 148, pts: 4600, ease: 3, eL: 'Moderate', cat: 'Ghost generic', inc: true },
]

// ── ICB benchmark data ──────────────────────────────────────────────────────
export const ICB_DATA: Record<string, {
  nm: string; code: string; items: number; nic: number; opps: number;
  ghostPct: number; doac_gen: number; statin_best: number; ppi_best: number;
  inh_gen: number; sav_pot: number
}> = {
  SY: { nm: 'South Yorkshire ICB', code: '15F', items: 2840000, nic: 168000000, opps: 35, ghostPct: 3.2, doac_gen: 42, statin_best: 78, ppi_best: 82, inh_gen: 65, sav_pot: 4300000 },
  WY: { nm: 'West Yorkshire ICB', code: '15F', items: 3100000, nic: 188000000, opps: 231, ghostPct: 2.8, doac_gen: 51, statin_best: 82, ppi_best: 88, inh_gen: 71, sav_pot: 3900000 },
  HY: { nm: 'Humber & North Yorkshire ICB', code: '42D', items: 2200000, nic: 132000000, opps: 198, ghostPct: 4.1, doac_gen: 38, statin_best: 74, ppi_best: 79, inh_gen: 58, sav_pot: 3100000 },
  NE: { nm: 'NHS North East & North Cumbria ICB', code: '13T', items: 4100000, nic: 245000000, opps: 312, ghostPct: 2.4, doac_gen: 58, statin_best: 86, ppi_best: 90, inh_gen: 75, sav_pot: 5800000 },
  GM: { nm: 'Greater Manchester ICB', code: '14L', items: 5200000, nic: 318000000, opps: 389, ghostPct: 1.8, doac_gen: 64, statin_best: 89, ppi_best: 92, inh_gen: 79, sav_pot: 7200000 },
  EL: { nm: 'East London ICB', code: '07Q', items: 4800000, nic: 285000000, opps: 356, ghostPct: 1.5, doac_gen: 69, statin_best: 91, ppi_best: 94, inh_gen: 83, sav_pot: 6500000 },
  BN: { nm: 'Bristol, North Somerset & South Gloucestershire ICB', code: '11H', items: 2600000, nic: 158000000, opps: 215, ghostPct: 3.5, doac_gen: 44, statin_best: 76, ppi_best: 81, inh_gen: 62, sav_pot: 3400000 },
}

// ── Helper functions ────────────────────────────────────────────────────────
export const fm = (n: number) => '£' + (n || 0).toLocaleString()
export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)
