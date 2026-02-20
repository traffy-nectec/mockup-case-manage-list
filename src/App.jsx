import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Filter, MapPin, Calendar, Tag, 
  AlertCircle, CheckCircle2, Clock, MoreHorizontal,
  LayoutGrid, List as ListIcon, X, ChevronDown, Building2,
  Copy, MessageCircle, User, Users, ArrowRightLeft, Check,
  History, Navigation, XCircle, Star, BadgeAlert, ShieldCheck, Flame, 
  RotateCcw, Image as ImageIcon, Layers, FileImage, Bookmark, Save, Settings,
  Link as LinkIcon, Unlink, Group, QrCode, Plus, Trash2, Edit, Download, Scan, Type, AlignLeft, Map as MapIcon, Eye
} from 'lucide-react';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================
const DEFAULT_COVER_IMAGE = "https://images.unsplash.com/photo-1449824913929-2b3a6e3586dc?auto=format&fit=crop&q=80&w=400&h=300"; 
const APP_VERSION = "v1.3.0"; 

const STATUS_OPTIONS = [
  { value: "waiting", label: "รอรับเรื่อง" },
  { value: "in_progress", label: "กำลังดำเนินการ" },
  { value: "finish", label: "เสร็จสิ้น" },
  { value: "forwarded", label: "ส่งต่อหน่วยงานอื่น" },
];

const TYPE_OPTIONS = [
  { value: "ความปลอดภัย", label: "ความปลอดภัย" },
  { value: "ไฟฟ้า", label: "ไฟฟ้า" },
  { value: "ความสะอาด", label: "ความสะอาด" },
  { value: "ต้นไม้/สวน", label: "ต้นไม้/สวน" },
  { value: "จราจร", label: "จราจร" },
  { value: "ทางเท้า", label: "ทางเท้า" },
  { value: "น้ำท่วม", label: "น้ำท่วม/ระบายน้ำ" },
];

const OFFICER_OPTIONS = [
  { value: "STAFF_01", label: "สมชาย ใจดี (STAFF_01)" },
  { value: "STAFF_02", label: "วิชัย มุ่งมั่น (STAFF_02)" },
  { value: "STAFF_09", label: "สุชาติ งานไว (STAFF_09)" },
  { value: "STAFF_12", label: "อำนาจ สั่งการ (STAFF_12)" },
];

const VERIFICATION_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "verified", label: "รับรองแล้ว" },
  { value: "unverified", label: "รอการรับรอง" },
];

const RATING_OPTIONS = [
  { value: 0, label: "ยังไม่ประเมิน (0 ดาว)" },
  { value: 1, label: "1 ดาว" },
  { value: 2, label: "2 ดาว" },
  { value: 3, label: "3 ดาว" },
  { value: 4, label: "4 ดาว" },
  { value: 5, label: "5 ดาว" },
];

const SYSTEM_DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=100&h=100", // ฝาท่อ
  "https://images.unsplash.com/photo-1555685812-4b943f3db9f0?auto=format&fit=crop&q=80&w=100&h=100", // เสาไฟ
  "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=100&h=100", // ขยะ
  "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=100&h=100", // ต้นไม้
];

// ==========================================
// MOCK DATA
// ==========================================
const INITIAL_TICKETS = [
  {
    case_id: "2024-KK001", title: "ฝาท่อระบายน้ำชำรุด เสี่ยงเกิดอุบัติเหตุ", description: "ฝาท่อแตกเสียหาย บริเวณหน้าตลาดสดเทศบาล",
    images: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความปลอดภัย", status: "finish", timestamp: "2024-02-10T08:30:00Z", updated_at: "2024-02-12T10:00:00Z",
    address: { sub_district: "ในเมือง", district: "เมือง", province: "ขอนแก่น", detail: "หน้าตลาดสดเทศบาล 1" },
    agencies: [{ name: "เทศบาลนครขอนแก่น", role: "main" }], hashtags: ["#ฝาท่อ", "#ถนนชำรุด"],
    stats: { chat_total: 3 }, reopen_count: 0, rating: 5, is_verified: true, verified_by: "หน.สมชาย",
    related: { role: 'parent', children: ['2024-KK008'] }
  },
  {
    case_id: "2024-KK008", title: "ป้ายจราจรล้ม (แจ้งซ้ำจุดเดิม)", description: "ป้ายห้ามเลี้ยวขวาล้มลงไปกองกับพื้น",
    images: [], type: "จราจร", status: "finish", timestamp: "2024-02-14T08:00:00Z", updated_at: "2024-02-16T14:00:00Z",
    address: { sub_district: "ในเมือง", district: "เมือง", province: "ขอนแก่น", detail: "หน้าตลาดสดเทศบาล 1" },
    agencies: [{ name: "เทศบาลนครขอนแก่น", role: "main" }], hashtags: ["#จราจร"],
    stats: { chat_total: 1 }, reopen_count: 0, rating: null, is_verified: false,
    related: { role: 'child', parent_id: '2024-KK001' }
  },
  {
    case_id: "2024-KK002", title: "ไฟส่องสว่างดับทั้งซอย", description: "เคยแจ้งไปแล้วไฟติดได้ 2 วันก็ดับอีกครับ ซอยมืดมาก กลัวโจรขโมย",
    images: ["https://images.unsplash.com/photo-1555685812-4b943f3db9f0?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ไฟฟ้า", status: "in_progress", timestamp: "2024-02-05T18:45:00Z", updated_at: "2024-02-17T09:20:00Z",
    address: { sub_district: "ศิลา", district: "เมือง", province: "ขอนแก่น", detail: "ซอยมิตรภาพ 15" },
    agencies: [{ name: "การไฟฟ้าส่วนภูมิภาค", role: "main" }], hashtags: ["#ไฟดับ", "#ความปลอดภัย"],
    stats: { chat_total: 5 }, reopen_count: 2, rating: null, is_verified: false, related: { role: null }
  }
];

const INITIAL_QR_CODES = [
  {
    id: "qr-sys-01", name: "สแกนแจ้งเรื่องร้องเรียน (ทั่วไป)", description: "QR Code มาตรฐานสำหรับให้ประชาชนแจ้งปัญหาทั่วไป (ลบไม่ได้)",
    isSystem: true, purpose: "report", createdAt: "2023-01-01T00:00:00Z",
    config: { requireImage: true, defaultImage: null, requireType: true, defaultType: null, requireLocation: true, defaultLocation: {lat: "", lng: "", text: ""}, requireDesc: true, defaultDesc: null },
    frame: { style: 'default' }
  },
  {
    id: "qr-sys-02", name: "สแกนเพื่อลงทะเบียนเจ้าหน้าที่", description: "QR Code สำหรับเจ้าหน้าที่ใหม่สแกนเพื่อขอสิทธิ์เข้าระบบ (ลบไม่ได้)",
    isSystem: true, purpose: "register_officer", createdAt: "2023-01-01T00:00:00Z",
    config: {}, frame: { style: 'default' }
  },
  {
    id: "qr-custom-01", name: "แจ้งปัญหาหลอดไฟเสีย (เสาไฟ A12)", description: "QR แบบระบุพิกัดและประเภทไว้แล้ว สำหรับติดที่เสาไฟฟ้าอัจฉริยะ",
    isSystem: false, purpose: "report", createdAt: "2024-02-15T10:30:00Z",
    config: { requireImage: true, defaultImage: null, requireType: false, defaultType: "ไฟฟ้า", requireLocation: false, defaultLocation: { lat: 16.432, lng: 102.823, text: "เสาไฟอัจฉริยะ A12" }, requireDesc: true, defaultDesc: null },
    frame: { style: 'custom_red' }
  }
];

// ==========================================
// UTILITY FUNCTIONS & SHARED COMPONENTS
// ==========================================
const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " ปีที่แล้ว";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " เดือนที่แล้ว";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " วันที่แล้ว";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " ชม. ที่แล้ว";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " นาทีที่แล้ว";
  return "เมื่อสักครู่";
};

const getUniqueLocations = (data) => {
    const locations = new Map();
    data.forEach(item => {
        const { province, district, sub_district } = item.address;
        const key = `${province}>${district}>${sub_district}`;
        if (!locations.has(key)) locations.set(key, { province, district, sub_district });
    });
    return Array.from(locations.values());
};

const StatusBadge = ({ status }) => {
  const config = {
    finish: { color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2, label: "เสร็จสิ้น" },
    in_progress: { color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock, label: "กำลังดำเนินการ" },
    waiting: { color: "bg-rose-100 text-rose-800 border-rose-200", icon: AlertCircle, label: "รอรับเรื่อง" },
    forwarded: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: ArrowRightLeft, label: "ส่งต่อ" },
  };
  const { color, icon: Icon, label } = config[status] || config.waiting;
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${color} shadow-sm whitespace-nowrap`}>
      <Icon size={14} />{label}
    </span>
  );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => { e.stopPropagation(); navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return <button onClick={handleCopy} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600">{copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}</button>;
};

// ==========================================
// DASHBOARD VIEW COMPONENTS
// ==========================================
const QuickFilterBar = ({ currentFilter, onSelect }) => {
    const filters = [
        { id: 'all', label: 'ทั้งหมด', icon: null },
        { id: 'stagnant', label: 'ค้างนาน > 7 วัน', icon: Clock, color: 'text-rose-600 bg-rose-50 border-rose-200' },
        { id: 'reopened', label: 'มีการเปิดซ้ำ', icon: AlertCircle, color: 'text-orange-600 bg-orange-50 border-orange-200' },
        { id: 'parent', label: 'Case หลัก (Parent)', icon: Layers, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    ];
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {filters.map(f => {
                const Icon = f.icon;
                return (
                    <button key={f.id} onClick={() => onSelect(f.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${currentFilter === f.id ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                        {Icon && <Icon size={14} className={currentFilter === f.id ? 'text-white' : f.color.split(' ')[0]} />}
                        {f.label}
                    </button>
                );
            })}
        </div>
    );
};

const MultiSelectDropdown = ({ label, options, selectedValues, onChange, enableSearch = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const toggleOption = (value) => {
    const newValues = selectedValues.includes(value) ? selectedValues.filter(v => v !== value) : [...selectedValues, value];
    onChange(newValues);
  };
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 flex items-center justify-between text-sm shadow-sm transition-colors hover:border-indigo-300">
        <span className={`truncate ${selectedValues.length === 0 ? "text-slate-500" : "text-slate-900 font-medium"}`}>
          {selectedValues.length === 0 ? "เลือกทั้งหมด" : `เลือกแล้ว ${selectedValues.length} รายการ`}
        </span>
        <ChevronDown size={16} className="text-slate-400 shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {enableSearch && (
            <div className="sticky top-0 bg-white p-2 border-b border-slate-100">
               <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input type="text" className="w-full pl-9 pr-2 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors" placeholder="ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
               </div>
            </div>
          )}
          <div className="p-1">
            {filteredOptions.length > 0 ? (
               filteredOptions.map(option => (
                  <div key={option.value} onClick={() => toggleOption(option.value)} className="px-3 py-2 cursor-pointer hover:bg-indigo-50 rounded-md flex items-center gap-3 text-sm transition-colors">
                    <div className={`w-4 h-4 rounded border flex shrink-0 items-center justify-center transition-colors ${selectedValues.includes(option.value) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                      {selectedValues.includes(option.value) && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`truncate ${selectedValues.includes(option.value) ? 'text-indigo-800 font-medium' : 'text-slate-700'}`}>{option.label}</span>
                  </div>
                ))
            ) : <div className="p-4 text-center text-xs text-slate-400">ไม่พบข้อมูล</div>}
          </div>
        </div>
      )}
    </div>
  );
};

const LocationAutocomplete = ({ data, onSelect, selectedLocation }) => {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const availableLocations = useMemo(() => getUniqueLocations(data), [data]);
    const filteredLocations = availableLocations.filter(loc => {
        const searchStr = `${loc.province} ${loc.district} ${loc.sub_district}`.toLowerCase();
        return searchStr.includes(inputValue.toLowerCase());
    });

    useEffect(() => {
        function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">พื้นที่ (ค้นหาตามข้อมูลที่มี)</label>
            {!selectedLocation ? (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 shadow-sm text-sm transition-colors" placeholder="พิมพ์ชื่อตำบล อำเภอ หรือจังหวัด..." value={inputValue} onChange={(e) => { setInputValue(e.target.value); setIsOpen(true); }} onFocus={() => setIsOpen(true)} />
                </div>
            ) : (
                <div className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-medium shadow-sm">
                    <div className="flex items-center gap-2 truncate"><MapPin size={16} className="shrink-0" /><span className="truncate">{selectedLocation.province} › {selectedLocation.district} › {selectedLocation.sub_district}</span></div>
                    <button onClick={() => {onSelect(null); setInputValue("");}} className="text-indigo-500 hover:text-indigo-800 p-1 bg-indigo-100 hover:bg-indigo-200 rounded transition-colors"><X size={14} /></button>
                </div>
            )}
            {isOpen && inputValue.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto p-1">
                    {filteredLocations.length > 0 ? (
                        filteredLocations.map((loc, idx) => (
                            <div key={idx} onClick={() => { onSelect(loc); setIsOpen(false); setInputValue(""); }} className="px-3 py-2 cursor-pointer hover:bg-indigo-50 rounded-md text-sm group transition-colors">
                                <div className="font-medium text-slate-800 group-hover:text-indigo-800">{loc.province} <span className="text-slate-400 mx-1 font-normal">›</span> {loc.district} <span className="text-slate-400 mx-1 font-normal">›</span> {loc.sub_district}</div>
                            </div>
                        ))
                    ) : <div className="px-4 py-4 text-slate-500 text-sm text-center">ไม่พบพื้นที่ดังกล่าวในรายการแจ้งเหตุ</div>}
                </div>
            )}
        </div>
    );
};

const DashboardView = ({ tickets, setTickets }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [quickFilter, setQuickFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true); // Open by default based on requested mockup screenshot

  const [filters, setFilters] = useState({ 
      keyword: "", status: [], type: [], officerIds: [], rating: [], location: null, startDate: "", endDate: "", isReopened: false, verification: "all"
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const handleToggleSelect = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const filteredData = useMemo(() => {
      return tickets.filter(item => {
          if (quickFilter === 'parent' && item.related?.role !== 'parent') return false;
          if (quickFilter === 'reopened' && item.reopen_count === 0) return false;
          if (quickFilter === 'stagnant') {
              const daysInactive = (new Date() - new Date(item.updated_at)) / (1000 * 60 * 60 * 24);
              if (daysInactive <= 7 || item.status === 'finish') return false;
          }
          
          const searchLower = filters.keyword.toLowerCase();
          if (searchLower && !item.title.toLowerCase().includes(searchLower) && !item.case_id.toLowerCase().includes(searchLower) && !item.hashtags.some(tag => tag.toLowerCase().includes(searchLower))) return false;

          if (appliedFilters.status.length > 0 && !appliedFilters.status.includes(item.status)) return false;
          if (appliedFilters.type.length > 0 && !appliedFilters.type.includes(item.type)) return false;
          if (appliedFilters.isReopened && item.reopen_count === 0) return false;
          if (appliedFilters.rating.length > 0) {
             const currentRating = item.rating ?? 0;
             if (!appliedFilters.rating.includes(currentRating)) return false;
          }
          if (appliedFilters.location) {
              const { province, district, sub_district } = appliedFilters.location;
              if (item.address.province !== province || item.address.district !== district || item.address.sub_district !== sub_district) return false;
          }
          if (appliedFilters.verification === 'verified' && !item.is_verified) return false;
          if (appliedFilters.verification === 'unverified' && (item.is_verified || item.status !== 'finish')) return false;
          return true;
      });
  }, [tickets, filters.keyword, appliedFilters, quickFilter]);

  const stats = {
      total: tickets.length,
      done: tickets.filter(i => i.status === 'finish').length,
      waiting: tickets.filter(i => i.status === 'waiting').length,
      forwarded: tickets.filter(i => i.status === 'forwarded').length,
  };

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* Quick Filters Area */}
      <div className="bg-white pt-4 pb-2 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuickFilterBar currentFilter={quickFilter} onSelect={(id) => {setQuickFilter(id); setSelectedItems([]);}} />
        </div>
      </div>

      <div className="bg-white shadow-sm pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-col gap-4">
            
            {/* Search Bar & View Toggles */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type="text" placeholder="ค้นหา (Keyword, ID, Hashtag...)" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition-colors text-sm" value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
                </div>
                <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-bold text-sm transition-colors ${isFilterOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'}`}>
                  <Filter size={16} /> <span className="hidden sm:inline">ตัวกรองละเอียด</span> <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                 <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 shrink-0">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={18} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon size={18} /></button>
                </div>
            </div>

            {/* Detailed Filters (Grid Layout matching Mockup image_b5cda7) */}
            {isFilterOpen && (
              <div className="pt-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
                    
                    {/* Row 1 */}
                    <div className="col-span-1">
                        <MultiSelectDropdown label="สถานะ:" options={STATUS_OPTIONS} selectedValues={filters.status} onChange={(val) => setFilters({...filters, status: val})} />
                    </div>
                    <div className="col-span-1">
                        <MultiSelectDropdown label="ประเภทเรื่อง" options={TYPE_OPTIONS} selectedValues={filters.type} onChange={(val) => setFilters({...filters, type: val})} enableSearch={true} />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <LocationAutocomplete data={INITIAL_TICKETS} selectedLocation={filters.location} onSelect={(loc) => setFilters({...filters, location: loc})} />
                    </div>

                    {/* Row 2 */}
                    <div className="col-span-1">
                        <MultiSelectDropdown label="จนท. รับผิดชอบ" options={OFFICER_OPTIONS} selectedValues={filters.officerIds} onChange={(val) => setFilters({...filters, officerIds: val})} enableSearch={true} />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">การรับรอง</label>
                        <select className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm hover:border-indigo-300 transition-colors" value={filters.verification} onChange={(e) => setFilters({...filters, verification: e.target.value})}>
                            {VERIFICATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="col-span-1">
                        <MultiSelectDropdown label="คะแนนความพึงพอใจ" options={RATING_OPTIONS} selectedValues={filters.rating} onChange={(val) => setFilters({...filters, rating: val})} />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">ช่วงเวลาแจ้งเหตุ</label>
                        <div className="flex gap-2">
                            <input type="date" className="w-1/2 p-2.5 rounded-lg border border-slate-300 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
                            <input type="date" className="w-1/2 p-2.5 rounded-lg border border-slate-300 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="col-span-1 md:col-span-4 mt-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" checked={filters.isReopened} onChange={(e) => setFilters({...filters, isReopened: e.target.checked})} />
                            <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">เฉพาะที่มีการเปิดซ้ำ</span>
                        </label>
                    </div>

                </div>

                {/* Filter Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-5 border-t border-slate-200 gap-4">
                   <div className="flex gap-3 w-full sm:w-auto">
                       <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-lg transition-all border border-slate-300 hover:border-indigo-300 shadow-sm text-sm font-bold bg-white" onClick={() => alert('บันทึกสำเร็จ (Mockup)')}>
                          <Bookmark size={16} /> บันทึกเงื่อนไข
                       </button>
                       <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-lg transition-all border border-slate-300 hover:border-indigo-300 shadow-sm text-sm font-bold bg-white" onClick={() => alert('ตั้งค่าเริ่มต้นสำเร็จ (Mockup)')}>
                          <Settings size={16} /> ตั้งเป็นค่าเริ่มต้น
                       </button>
                   </div>
                   <div className="flex gap-4 w-full sm:w-auto justify-end items-center">
                       <button onClick={() => {setFilters({keyword: filters.keyword, status: [], type: [], officerIds: [], rating: [], location: null, startDate: "", endDate: "", isReopened: false, verification: "all"}); setAppliedFilters(filters); setQuickFilter('all');}} className="text-sm font-bold text-slate-500 hover:text-rose-600 underline underline-offset-2">
                           ล้างค่าทั้งหมด
                       </button>
                       <button onClick={() => setAppliedFilters(filters)} className="flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-bold px-8 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95">
                           <Search size={16} /> ค้นหา
                       </button>
                   </div>
                </div>
              </div>
            )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-4">
             <div className="text-sm text-slate-600">
                พบ <span className="font-bold text-slate-900">{filteredData.length}</span> รายการ 
                <span className="text-slate-300 mx-2">|</span> 
                จากทั้งหมด {stats.total} เรื่อง
             </div>
        </div>

        {filteredData.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl border-2 border-slate-200 border-dashed">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={28} />
             </div>
             <h3 className="text-lg font-bold text-slate-800">ไม่พบรายการที่ค้นหา</h3>
             <p className="text-slate-500 text-sm mt-1">ลองปรับเปลี่ยนตัวกรองหรือคำค้นหาใหม่อีกครั้ง</p>
           </div>
        ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredData.map((ticket) => {
                   const useDefaultImage = !ticket.images || ticket.images.length === 0;
                   return (
                      <div key={ticket.case_id} className={`group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 flex flex-col h-full transition-all duration-300 ${selectedItems.includes(ticket.case_id) ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}`}>
                        <div className={`absolute top-3 left-3 z-10 transition-opacity duration-200 ${selectedItems.includes(ticket.case_id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                           <input type="checkbox" className="w-5 h-5 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 shadow-sm" checked={selectedItems.includes(ticket.case_id)} onChange={() => handleToggleSelect(ticket.case_id)} />
                        </div>
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl pl-10">
                          <StatusBadge status={ticket.status} />
                          <span className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1">#{ticket.case_id}<CopyButton text={ticket.case_id} /></span>
                        </div>
                        <div className={`flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'} flex-1`}>
                          <div className={`relative bg-slate-100 shrink-0 overflow-hidden ${viewMode === 'list' ? 'w-64' : 'h-48'}`}>
                               <img src={useDefaultImage ? DEFAULT_COVER_IMAGE : ticket.images[0]} alt={ticket.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${useDefaultImage ? 'opacity-50 grayscale' : ''}`} />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-indigo-700 transition-colors">{ticket.title}</h3>
                            <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{ticket.description}</p>
                            <div className="mt-auto flex items-start gap-2 text-xs text-slate-600 pt-4">
                                <MapPin size={14} className="text-rose-500 mt-0.5 shrink-0" />
                                <span className="truncate">{ticket.address.sub_district}, {ticket.address.province}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                   );
                })}
            </div>
        )}
      </main>
    </div>
  );
};

// ==========================================
// QR MANAGER VIEW COMPONENTS
// ==========================================

const QrDetailModal = ({ qr, onClose }) => {
    if (!qr) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Scan className="text-indigo-600" /> ข้อมูล QR Code
                    </h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
                </div>
                
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Left: Info */}
                    <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-100">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                               {qr.isSystem && <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">System</span>}
                               <h3 className="text-2xl font-bold text-slate-900">{qr.name}</h3>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{qr.description || 'ไม่มีคำอธิบาย'}</p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">ตั้งค่าการรับข้อมูลจากผู้แจ้ง</h4>
                            
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><ImageIcon size={16} className="text-slate-400"/> รูปภาพ</div>
                                    <div className="text-sm">{qr.config.requireImage ? <span className="text-emerald-600 font-bold flex items-center gap-1"><Check size={14}/> ผู้แจ้งต้องถ่ายเอง</span> : <span className="text-slate-500">ใช้ภาพ Default ของระบบ</span>}</div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><Tag size={16} className="text-slate-400"/> ประเภทเรื่อง</div>
                                    <div className="text-sm">{qr.config.requireType ? <span className="text-emerald-600 font-bold flex items-center gap-1"><Check size={14}/> ผู้แจ้งเลือกเอง</span> : <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{qr.config.defaultType || 'ไม่ได้กำหนด'}</span>}</div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><MapPin size={16} className="text-slate-400"/> พิกัดที่ตั้ง</div>
                                    <div className="text-sm">{qr.config.requireLocation ? <span className="text-emerald-600 font-bold flex items-center gap-1"><Check size={14}/> ผู้แจ้งระบุเอง</span> : <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1"><MapPin size={12}/> ล็อกพิกัดไว้แล้ว</span>}</div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><AlignLeft size={16} className="text-slate-400"/> คำบรรยาย</div>
                                    <div className="text-sm">{qr.config.requireDesc ? <span className="text-emerald-600 font-bold flex items-center gap-1"><Check size={14}/> ผู้แจ้งพิมพ์เอง</span> : <span className="text-slate-500 truncate max-w-[150px] block">"{qr.config.defaultDesc || 'ไม่มี'}"</span>}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Images Preview */}
                    <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center overflow-y-auto">
                        <div className="w-full max-w-sm space-y-8">
                            
                            {/* Framed Version */}
                            <div className="flex flex-col items-center">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">แบบพร้อมพิมพ์ (มีกรอบ)</h4>
                                {qr.frame.style === 'default' ? (
                                    <div className="bg-white p-5 rounded-2xl shadow-lg border-2 border-indigo-100 flex flex-col items-center text-center w-full max-w-[240px]">
                                        <div className="flex items-center gap-1.5 text-indigo-800 font-bold mb-4 border-b border-slate-100 pb-3 w-full justify-center text-sm">
                                            <Building2 size={18} /> เทศบาลนครขอนแก่น
                                        </div>
                                        <div className="w-40 h-40 bg-slate-800 rounded-xl flex items-center justify-center text-white mb-4 shadow-inner">
                                            <QrCode size={90} strokeWidth={1.5} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 mb-1">สแกนเพื่อแจ้งเรื่อง</p>
                                        <p className="text-xs text-slate-500 line-clamp-2 break-words leading-snug w-full">{qr.name}</p>
                                    </div>
                                ) : (
                                    <div className="bg-rose-600 p-5 rounded-2xl shadow-lg border border-rose-700 flex flex-col items-center text-center w-full max-w-[240px] text-white">
                                        <div className="flex items-center gap-1.5 font-black mb-4 border-b border-rose-500/50 pb-3 w-full justify-center text-lg tracking-wide">
                                            <AlertCircle size={20} /> แจ้งเหตุด่วน!
                                        </div>
                                        <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center text-slate-900 mb-4 shadow-inner p-1.5">
                                            <div className="border-4 border-slate-900 rounded-lg w-full h-full flex items-center justify-center"><QrCode size={90} strokeWidth={1.5} /></div>
                                        </div>
                                        <p className="text-xs text-rose-100 line-clamp-2 break-words font-medium leading-snug w-full">{qr.name}</p>
                                    </div>
                                )}
                                <button className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow hover:bg-indigo-700 transition-colors">
                                    <Download size={16} /> ดาวน์โหลดแบบมีกรอบ
                                </button>
                            </div>

                            <div className="w-full h-px bg-slate-200"></div>

                            {/* Raw Version */}
                            <div className="flex flex-col items-center">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">แบบเฉพาะ QR Code (ไม่มีกรอบ)</h4>
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                                    <QrCode size={100} className="text-slate-800" />
                                </div>
                                <button className="mt-4 flex items-center gap-2 bg-white border-2 border-slate-300 text-slate-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors">
                                    <Download size={16} /> ดาวน์โหลดเฉพาะ QR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QrCodeFormModal = ({ isOpen, onClose, onSave, editingQr }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id: `qr-${Date.now()}`, name: "", description: "", isSystem: false, purpose: "report",
    config: { requireImage: true, defaultImage: null, requireType: true, defaultType: "ความปลอดภัย", requireLocation: true, defaultLocation: {lat: "", lng: "", text: ""}, requireDesc: true, defaultDesc: "" },
    frame: { style: 'default' }
  });

  useEffect(() => {
     if (isOpen) {
         setStep(1);
         if (editingQr) {
            setFormData(JSON.parse(JSON.stringify(editingQr)));
         } else {
            setFormData({
              id: `qr-custom-${Date.now()}`, name: "", description: "", isSystem: false, purpose: "report",
              config: { requireImage: true, defaultImage: null, requireType: true, defaultType: "ความปลอดภัย", requireLocation: true, defaultLocation: {lat: "", lng: "", text: ""}, requireDesc: true, defaultDesc: "" },
              frame: { style: 'default' }
            });
         }
     }
  }, [isOpen, editingQr]);

  if (!isOpen) return null;

  const handleConfigChange = (key, value) => setFormData(prev => ({ ...prev, config: { ...prev.config, [key]: value } }));
  const isStep1Valid = formData.name.trim().length > 0;
  
  const pickMockLocation = () => handleConfigChange('defaultLocation', { lat: 13.7563, lng: 100.5018, text: "อนุสาวรีย์ประชาธิปไตย (ดึงจากแผนที่)" });

  return (
    <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {editingQr ? <Edit className="text-indigo-600" /> : <Plus className="text-indigo-600" />}
            {editingQr ? "แก้ไข QR Code" : "สร้าง QR Code ใหม่"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
            {/* LEFT COLUMN: Form Steps */}
            <div className="w-full lg:w-3/5 flex flex-col border-r border-slate-200">
                {/* Clickable Stepper Indicator */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex gap-2 shrink-0">
                   {[1, 2, 3].map(s => (
                     <div key={s} onClick={() => { if(isStep1Valid || s === 1) setStep(s) }} className={`flex-1 flex items-center gap-2 group ${(!isStep1Valid && s > 1) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step === s ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200' : step > s ? 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200' : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500'}`}>
                          {step > s ? <Check size={16}/> : s}
                        </div>
                        <div className={`text-xs font-bold transition-colors ${step === s ? 'text-indigo-800' : 'text-slate-500 group-hover:text-indigo-600'}`}>
                          {s === 1 ? 'ข้อมูลทั่วไป' : s === 2 ? 'ตั้งค่ารับเรื่อง' : 'เลือกดีไซน์'}
                        </div>
                        {s < 3 && <div className="flex-1 h-0.5 bg-slate-200 ml-2"></div>}
                     </div>
                   ))}
                </div>

                {/* Step Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                  
                  {step === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">ชื่อ QR Code <span className="text-rose-500">*</span></label>
                        <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-base" placeholder="เช่น แจ้งปัญหาหน้าโรงเรียน (จุด A)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} autoFocus />
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><InfoIcon size={12}/> ชื่อนี้จะแสดงในหน้าจอผู้แจ้งและในกรอบรูป QR</p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">คำอธิบาย (สำหรับเจ้าหน้าที่)</label>
                        <textarea className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-sm leading-relaxed" rows="4" placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับจุดติดตั้ง เพื่อให้ค้นหาง่ายในอนาคต" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 pb-10">
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3 shadow-sm">
                         <div className="bg-indigo-100 p-2 rounded-lg shrink-0 h-fit text-indigo-600"><Settings size={20}/></div>
                         <div>
                             <h4 className="font-bold text-indigo-900 text-sm mb-1">ตั้งค่าฟอร์มรับแจ้ง (Custom Form)</h4>
                             <p className="text-xs text-indigo-700 leading-relaxed">
                                กำหนดว่าเมื่อผู้แจ้งสแกน QR นี้ จำเป็นต้องกรอกอะไรบ้าง หากคุณ <strong className="bg-white px-1 py-0.5 rounded border border-indigo-200">ปิด</strong> การให้ผู้แจ้งกรอก คุณจำเป็นต้องระบุ <strong>"ค่าเริ่มต้น (Default)"</strong> ไว้ให้ระบบบันทึกแทน
                             </p>
                         </div>
                      </div>

                      {/* Image Config */}
                      <div className={`border rounded-xl p-5 transition-all ${!formData.config.requireImage ? 'bg-slate-50 border-indigo-200 shadow-sm ring-1 ring-indigo-50' : 'border-slate-200'}`}>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 font-bold text-slate-800"><div className="p-2 bg-slate-100 rounded-lg"><ImageIcon size={18} className="text-slate-600"/></div> บังคับให้ผู้แจ้งถ่ายภาพ</div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={formData.config.requireImage} onChange={(e) => handleConfigChange('requireImage', e.target.checked)} />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                            </label>
                         </div>
                         {!formData.config.requireImage && (
                            <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in">
                               <label className="block text-xs font-bold text-slate-700 mb-3">เลือกภาพ Default จากระบบ หรืออัปโหลดใหม่</label>
                               <div className="grid grid-cols-5 gap-3">
                                  {SYSTEM_DEFAULT_IMAGES.map((img, idx) => (
                                      <div key={idx} onClick={() => handleConfigChange('defaultImage', img)} className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${formData.config.defaultImage === img ? 'ring-4 ring-indigo-600 shadow-md scale-105 z-10' : 'border border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'}`}>
                                          <img src={img} alt="default" className="w-full h-full object-cover" />
                                      </div>
                                  ))}
                                  <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 cursor-pointer transition-colors bg-white">
                                      <Plus size={20} />
                                      <span className="text-[10px] mt-1 font-bold">อัปโหลด</span>
                                  </div>
                               </div>
                            </div>
                         )}
                      </div>

                      {/* Location Config */}
                      <div className={`border rounded-xl p-5 transition-all ${!formData.config.requireLocation ? 'bg-slate-50 border-indigo-200 shadow-sm ring-1 ring-indigo-50' : 'border-slate-200'}`}>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 font-bold text-slate-800"><div className="p-2 bg-slate-100 rounded-lg"><MapPin size={18} className="text-slate-600"/></div> บังคับให้ผู้แจ้งระบุพิกัด</div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={formData.config.requireLocation} onChange={(e) => handleConfigChange('requireLocation', e.target.checked)} />
                              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
                            </label>
                         </div>
                         {!formData.config.requireLocation && (
                            <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in">
                               <label className="block text-xs font-bold text-slate-700 mb-3 flex justify-between items-end">
                                   <span>ระบุพิกัดที่ตั้งตายตัวของ QR Code นี้</span>
                                   <button onClick={pickMockLocation} className="shrink-0 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm">
                                      <MapIcon size={14} /> เลือกจากแผนที่
                                   </button>
                               </label>
                               <div className="flex flex-col gap-3">
                                  <div className="flex gap-3">
                                      <div className="flex-1">
                                          <label className="text-[10px] text-slate-500 mb-1 block font-medium uppercase tracking-wider">Latitude</label>
                                          <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono" placeholder="เช่น 13.7563" value={formData.config.defaultLocation?.lat || ''} onChange={(e) => handleConfigChange('defaultLocation', {...formData.config.defaultLocation, lat: e.target.value})} />
                                      </div>
                                      <div className="flex-1">
                                          <label className="text-[10px] text-slate-500 mb-1 block font-medium uppercase tracking-wider">Longitude</label>
                                          <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono" placeholder="เช่น 100.5018" value={formData.config.defaultLocation?.lng || ''} onChange={(e) => handleConfigChange('defaultLocation', {...formData.config.defaultLocation, lng: e.target.value})} />
                                      </div>
                                  </div>
                                  <div>
                                     <label className="text-[10px] text-slate-500 mb-1 block font-medium uppercase tracking-wider">ชื่อสถานที่ (คำอธิบายเพิ่มเติม)</label>
                                     <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm outline-none bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="เช่น เสาไฟอัจฉริยะต้นที่ 1" value={formData.config.defaultLocation?.text || ''} onChange={(e) => handleConfigChange('defaultLocation', {...formData.config.defaultLocation, text: e.target.value})} />
                                  </div>
                               </div>
                            </div>
                         )}
                      </div>

                      {/* Type Config */}
                      <div className={`border rounded-xl p-5 transition-all ${!formData.config.requireType ? 'bg-slate-50 border-indigo-200 shadow-sm ring-1 ring-indigo-50' : 'border-slate-200'}`}>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 font-bold text-slate-800"><div className="p-2 bg-slate-100 rounded-lg"><Tag size={18} className="text-slate-600"/></div> ให้ผู้แจ้งเลือกประเภทเรื่อง</div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={formData.config.requireType} onChange={(e) => handleConfigChange('requireType', e.target.checked)} />
                              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
                            </label>
                         </div>
                         {!formData.config.requireType && (
                            <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in">
                               <label className="block text-xs font-bold text-slate-700 mb-2">ล็อกประเภทเรื่องเป็น:</label>
                               <select className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm font-medium" value={formData.config.defaultType || ''} onChange={(e) => handleConfigChange('defaultType', e.target.value)}>
                                 <option value="" disabled>-- เลือกประเภท --</option>
                                 {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                               </select>
                            </div>
                         )}
                      </div>
                      
                      {/* Description Config */}
                      <div className={`border rounded-xl p-5 transition-all ${!formData.config.requireDesc ? 'bg-slate-50 border-indigo-200 shadow-sm ring-1 ring-indigo-50' : 'border-slate-200'}`}>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 font-bold text-slate-800"><div className="p-2 bg-slate-100 rounded-lg"><AlignLeft size={18} className="text-slate-600"/></div> บังคับให้ผู้แจ้งพิมพ์บรรยาย</div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={formData.config.requireDesc} onChange={(e) => handleConfigChange('requireDesc', e.target.checked)} />
                              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
                            </label>
                         </div>
                         {!formData.config.requireDesc && (
                            <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in">
                               <label className="block text-xs font-bold text-slate-700 mb-2">ข้อความบรรยายอัตโนมัติเมื่อสแกน:</label>
                               <textarea className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-500" rows="3" placeholder="เช่น ขอแจ้งเหตุไฟฟ้าส่องสว่างขัดข้องบริเวณ..." value={formData.config.defaultDesc || ''} onChange={(e) => handleConfigChange('defaultDesc', e.target.value)}></textarea>
                            </div>
                         )}
                      </div>

                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                       <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 shadow-sm">
                           <div className="text-amber-600 shrink-0"><ImageIcon size={20}/></div>
                           <div>
                               <h4 className="font-bold text-amber-900 text-sm mb-1">เลือกดีไซน์กรอบ (Frame Design)</h4>
                               <p className="text-xs text-amber-800 leading-relaxed">
                                  ระบบจะสร้าง QR Code ให้ทั้งแบบ <strong>"มีกรอบ"</strong> (สำหรับปริ้นติดป้าย) และ <strong>"ไม่มีกรอบ"</strong> (เพื่อนำไปออกแบบต่อเอง) คุณสามารถเลือกเทมเพลตกรอบที่คุณต้องการได้ที่นี่
                               </p>
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                           {/* Option 1: Default System Frame */}
                           <div 
                              onClick={() => setFormData({...formData, frame: { style: 'default' }})}
                              className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden ${formData.frame.style === 'default' ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                           >
                              {formData.frame.style === 'default' && <div className="absolute top-2 right-2 text-indigo-600"><Check size={20} strokeWidth={3}/></div>}
                              <div className="w-16 h-20 bg-white border border-slate-200 shadow-md flex flex-col items-center p-1.5 rounded-md">
                                  <div className="w-full h-1.5 bg-indigo-600 mb-1.5 rounded-sm"></div>
                                  <QrCode size={28} className="text-slate-800" />
                              </div>
                              <div className="text-center">
                                 <span className="text-sm font-bold text-slate-800 block mb-0.5">แบบมาตรฐาน</span>
                                 <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">โลโก้ + ชื่อเรื่อง</span>
                              </div>
                           </div>

                           {/* Option 2: Uploaded/Custom Frame */}
                           <div 
                              onClick={() => setFormData({...formData, frame: { style: 'custom_red' }})}
                              className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden ${formData.frame.style === 'custom_red' ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                           >
                              {formData.frame.style === 'custom_red' && <div className="absolute top-2 right-2 text-indigo-600"><Check size={20} strokeWidth={3}/></div>}
                              <div className="w-16 h-20 bg-rose-600 border border-rose-700 shadow-md flex flex-col items-center justify-center p-1.5 rounded-md">
                                  <div className="bg-white p-1 rounded-sm"><QrCode size={24} className="text-slate-900" /></div>
                              </div>
                              <div className="text-center">
                                 <span className="text-sm font-bold text-slate-800 block mb-0.5">กรอบสีแดง</span>
                                 <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">อัปโหลดไว้ก่อนหน้า</span>
                              </div>
                           </div>
                       </div>
                       
                       <div className="mt-4 pt-6 border-t border-slate-200 flex justify-center">
                           <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-bold px-6 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-dashed border-indigo-300 w-full justify-center shadow-sm">
                              <Plus size={18} /> อัปโหลด Template กรอบใหม่
                           </button>
                       </div>
                    </div>
                  )}
                </div>

                {/* Left Column Footer (Actions) */}
                <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-between shrink-0 items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                   {step > 1 ? (
                      <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">ย้อนกลับ</button>
                   ) : <div></div>}
                   
                   {step < 3 ? (
                      <button disabled={!isStep1Valid} onClick={() => setStep(step + 1)} className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2">ถัดไป</button>
                   ) : (
                      <button onClick={() => { onSave(formData); onClose(); }} className="px-8 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md flex items-center gap-2 transition-all active:scale-95">
                          <Save size={18}/> บันทึก QR Code
                      </button>
                   )}
                </div>
            </div>

            {/* RIGHT COLUMN: Persistent Live Preview */}
            <div className="hidden lg:flex w-2/5 bg-slate-800 p-8 flex-col items-center border-l border-slate-700 relative overflow-y-auto">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>

                <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 mb-8 flex items-center gap-2 shadow-xl">
                        <Eye size={16} className="text-indigo-400" />
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">Live Preview</span>
                    </div>
                    
                    {/* Simulated Preview Box based on selected frame style */}
                    <div className="w-full max-w-[260px] relative group perspective-1000">
                        {/* 3D hover effect container */}
                        <div className="w-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-12 group-hover:rotate-x-12">
                            {formData.frame.style === 'default' ? (
                                // Default Template Preview
                                <div className="bg-white p-5 rounded-[2rem] shadow-2xl border-4 border-slate-100 flex flex-col items-center text-center w-full relative overflow-hidden">
                                    <div className="absolute top-0 w-full h-2 bg-indigo-600"></div>
                                    <div className="flex items-center gap-2 text-indigo-900 font-black mb-4 border-b-2 border-slate-100 pb-3 w-full justify-center text-sm mt-2 tracking-wide">
                                        <Building2 size={18} className="text-indigo-600" /> เทศบาลนครขอนแก่น
                                    </div>
                                    <div className="w-40 h-40 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-inner relative">
                                        <QrCode size={100} strokeWidth={1.5} />
                                        {/* Scan corners */}
                                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400 rounded-tl"></div>
                                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400 rounded-tr"></div>
                                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400 rounded-bl"></div>
                                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400 rounded-br"></div>
                                    </div>
                                    <p className="text-sm font-black text-slate-800 mb-1 tracking-wide">สแกนเพื่อแจ้งเรื่อง</p>
                                    <p className="text-xs text-slate-500 font-medium line-clamp-2 break-words leading-snug w-full px-2">
                                        {formData.name || 'ชื่อ QR Code (ระบุในขั้นที่ 1)'}
                                    </p>
                                </div>
                            ) : (
                                // Custom Red Template Preview
                                <div className="bg-rose-600 p-5 rounded-[2rem] shadow-2xl border-4 border-rose-700 flex flex-col items-center text-center w-full text-white relative overflow-hidden">
                                    {/* Hazard stripes background */}
                                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]"></div>
                                    <div className="relative z-10 flex flex-col items-center w-full">
                                        <div className="flex items-center gap-2 font-black mb-4 border-b-2 border-rose-500/50 pb-3 w-full justify-center text-lg tracking-wider drop-shadow-md">
                                            <AlertCircle size={24} /> แจ้งเหตุด่วน!
                                        </div>
                                        <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-4 shadow-inner p-2">
                                            <div className="border-4 border-slate-900 rounded-xl w-full h-full flex items-center justify-center relative overflow-hidden">
                                                <QrCode size={100} strokeWidth={1.5} />
                                                <div className="absolute inset-0 bg-indigo-500/10 animate-scan"></div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-rose-50 font-bold line-clamp-2 break-words leading-snug w-full px-2 drop-shadow-md">
                                            {formData.name || 'ชื่อ QR Code (ระบุในขั้นที่ 1)'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-10 flex flex-col items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-700 w-full max-w-[260px] backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">เวอร์ชันไร้กรอบ (Transparent)</span>
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200">
                            <QrCode size={48} className="text-slate-800" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Tool component for small info text
const InfoIcon = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;

const QrManagerView = ({ qrCodes, setQrCodes }) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [editingQr, setEditingQr] = useState(null);
  const [qrSearch, setQrSearch] = useState("");
  const [viewingQr, setViewingQr] = useState(null); // State for detail modal

  const handleSaveQr = (qrData) => {
    if (editingQr) {
      setQrCodes(prev => prev.map(q => q.id === qrData.id ? qrData : q));
    } else {
      setQrCodes(prev => [qrData, ...prev]);
    }
  };

  const handleDeleteQr = (id) => {
    if(confirm('คุณแน่ใจหรือไม่ว่าต้องการลบ QR Code นี้?')) {
      setQrCodes(prev => prev.filter(q => q.id !== id));
    }
  };

  const openEditModal = (qr) => {
    setEditingQr(qr);
    setIsQrModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingQr(null);
    setIsQrModalOpen(true);
  };

  const filteredQRs = qrCodes.filter(q => q.name.toLowerCase().includes(qrSearch.toLowerCase()) || q.description.toLowerCase().includes(qrSearch.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white border-b border-slate-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div>
                   <h1 className="text-2xl font-bold text-slate-900">จัดการ QR Code ของหน่วยงาน</h1>
                   <p className="text-slate-500 text-sm mt-1">สร้างและจัดการจุดรับแจ้งเรื่องแบบออฟไลน์</p>
               </div>
               <button 
                  onClick={openCreateModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors active:scale-95"
               >
                  <Plus size={18} /> สร้าง QR สำหรับแจ้งเรื่อง
               </button>
            </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="mb-6 flex gap-4">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="ค้นหาชื่อ หรือคำอธิบาย QR..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-sm"
                    value={qrSearch}
                    onChange={(e) => setQrSearch(e.target.value)}
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredQRs.map(qr => (
                 <div 
                    key={qr.id} 
                    onClick={() => setViewingQr(qr)}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer flex flex-col relative group transform hover:-translate-y-1"
                 >
                    {qr.isSystem && (
                       <div className="absolute top-0 right-0 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-bl-lg z-10 font-bold tracking-wide">SYSTEM</div>
                    )}
                    <div className="h-36 bg-slate-100 flex items-center justify-center p-4 border-b border-slate-100 shrink-0 relative overflow-hidden group-hover:bg-slate-200 transition-colors">
                       <div className="absolute inset-0 bg-indigo-50 opacity-50 pattern-grid-lg"></div>
                       
                       {qr.frame.style === 'default' ? (
                           <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center relative z-10 scale-[0.8] group-hover:scale-90 transition-transform">
                               <div className="text-[6px] font-bold text-indigo-800 mb-1 border-b border-slate-100 pb-0.5 w-full text-center">เทศบาลนคร...</div>
                               <QrCode size={48} className="text-slate-800"/>
                           </div>
                       ) : qr.frame.style === 'custom_red' ? (
                           <div className="bg-rose-600 p-2 rounded-lg shadow-sm border border-rose-700 flex flex-col items-center relative z-10 scale-[0.8] group-hover:scale-90 transition-transform">
                               <div className="text-[6px] font-bold text-white mb-1 border-b border-rose-500/50 pb-0.5 w-full text-center">แจ้งเหตุด่วน!</div>
                               <div className="bg-white p-1 rounded-sm"><QrCode size={40} className="text-slate-900"/></div>
                           </div>
                       ) : (
                           <QrCode size={64} className="text-slate-800 relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform"/>
                       )}

                       {/* Hover Overlay for clicking detail */}
                       <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="bg-white/90 backdrop-blur-sm text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">ดูรายละเอียด</span>
                       </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                       <h3 className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-2 group-hover:text-indigo-700 transition-colors" title={qr.name}>{qr.name}</h3>
                       <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1" title={qr.description}>{qr.description || <span className="italic opacity-50">ไม่มีคำอธิบาย</span>}</p>
                       
                       {qr.purpose === 'report' && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                             {!qr.config?.requireImage && <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1 font-medium"><ImageIcon size={8}/> ภาพ Default</span>}
                             {!qr.config?.requireType && <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1 font-medium"><Tag size={8}/> {qr.config?.defaultType || 'ไม่ได้กำหนด'}</span>}
                             {!qr.config?.requireLocation && <span className="text-[9px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-100 flex items-center gap-1 font-medium"><MapPin size={8}/> ล็อกพิกัด</span>}
                          </div>
                       )}
                       <div className="text-[10px] font-medium text-slate-400 mt-auto flex items-center gap-1 bg-slate-50 w-fit px-2 py-1 rounded">
                          <Calendar size={10} /> สร้างเมื่อ {new Date(qr.createdAt).toLocaleDateString('th-TH')}
                       </div>
                    </div>

                    <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                        <button onClick={(e) => { e.stopPropagation(); alert('เริ่มดาวน์โหลดแล้ว'); }} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg shadow-sm transition-colors">
                           <Download size={14} /> โหลด QR
                        </button>
                        
                        <div className="flex gap-1.5">
                           <button onClick={(e) => { e.stopPropagation(); openEditModal(qr); }} className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg shadow-sm transition-colors" title="แก้ไข">
                              <Edit size={14} />
                           </button>
                           {!qr.isSystem && (
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteQr(qr.id); }} className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 rounded-lg shadow-sm transition-colors" title="ลบ">
                                 <Trash2 size={14} />
                              </button>
                           )}
                        </div>
                    </div>
                 </div>
              ))}

              <div 
                 onClick={openCreateModal}
                 className="bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center p-6 text-slate-400 hover:text-indigo-600 cursor-pointer min-h-[300px] group shadow-sm hover:shadow-md"
              >
                 <div className="w-14 h-14 bg-slate-100 group-hover:bg-white rounded-full flex items-center justify-center shadow-inner group-hover:shadow-md transition-all mb-4">
                    <Plus size={28} className="group-hover:scale-110 transition-transform" />
                 </div>
                 <span className="font-bold text-sm text-slate-700 group-hover:text-indigo-700">สร้าง QR Code ใหม่</span>
                 <span className="text-xs text-slate-500 text-center mt-2 leading-relaxed">คลิกเพื่อสร้าง QR สำหรับ<br/>จุดรับแจ้งเหตุเฉพาะพื้นที่</span>
              </div>
           </div>
        </main>

        <QrCodeFormModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} onSave={handleSaveQr} editingQr={editingQr} />
        <QrDetailModal qr={viewingQr} onClose={() => setViewingQr(null)} />
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'qrmanager'
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [qrCodes, setQrCodes] = useState(INITIAL_QR_CODES);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                 <div className="bg-indigo-600 p-1.5 rounded-lg shadow-inner"><Building2 size={20} className="text-white" /></div>
                 <span className="font-black text-xl tracking-tight text-slate-50">Traffy Office</span>
                 <span className="text-[10px] bg-slate-800 border border-slate-700 text-indigo-300 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ml-1">{APP_VERSION}</span>
              </div>
              <nav className="flex gap-2">
                 <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${currentPage === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                 >
                    <ListIcon size={16} /> <span className="hidden sm:inline">รายการเรื่องแจ้ง</span>
                 </button>
                 <button 
                    onClick={() => setCurrentPage('qrmanager')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${currentPage === 'qrmanager' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                 >
                    <QrCode size={16} /> <span className="hidden sm:inline">จัดการ QR Code</span>
                 </button>
              </nav>
           </div>
        </div>
      </header>

      {currentPage === 'dashboard' && <DashboardView tickets={tickets} setTickets={setTickets} />}
      {currentPage === 'qrmanager' && <QrManagerView qrCodes={qrCodes} setQrCodes={setQrCodes} />}

    </div>
  );
}