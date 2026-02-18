import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Filter, MapPin, Calendar, Tag, 
  AlertCircle, CheckCircle2, Clock, MoreHorizontal,
  LayoutGrid, List as ListIcon, X, ChevronDown, Building2,
  Copy, MessageCircle, User, Users, ArrowRightLeft, Check,
  History, Navigation, XCircle, Star, BadgeAlert, ShieldCheck, Flame, 
  RotateCcw, Image as ImageIcon, Layers, FileImage, Bookmark, Save, Settings,
  Link as LinkIcon, Unlink, Group
} from 'lucide-react';

// --- Configuration ---
const DEFAULT_COVER_IMAGE = "https://images.unsplash.com/photo-1449824913929-2b3a6e3586dc?auto=format&fit=crop&q=80&w=400&h=300"; 

// --- Initial Mock Data (20 Items with diverse scenarios) ---
const INITIAL_DATA = [
  // Group 1: KK Parent & Child
  {
    case_id: "2024-KK001",
    title: "ฝาท่อระบายน้ำชำรุด เสี่ยงเกิดอุบัติเหตุ",
    description: "ฝาท่อแตกเสียหาย บริเวณหน้าตลาดสดเทศบาล เดินผ่านไปมาอันตรายมากครับ รบกวนตรวจสอบด่วน",
    images: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความปลอดภัย",
    status: "finish",
    timestamp: "2024-02-10T08:30:00Z",
    updated_at: "2024-02-12T10:00:00Z",
    address: { sub_district: "ในเมือง", district: "เมือง", province: "ขอนแก่น", detail: "หน้าตลาดสดเทศบาล 1" },
    agencies: [{ name: "เทศบาลนครขอนแก่น", role: "main" }],
    hashtags: ["#ฝาท่อ", "#ถนนชำรุด", "#เร่งด่วน"],
    stats: { chat_total: 3 },
    reopen_count: 0, rating: 5, is_verified: true, verified_by: "หน.สมชาย",
    related: { role: 'parent', children: ['2024-KK008'] }
  },
  {
    case_id: "2024-KK008", // Child of KK001
    title: "ป้ายจราจรล้ม (แจ้งซ้ำจุดเดิม)",
    description: "ป้ายห้ามเลี้ยวขวาล้มลงไปกองกับพื้น ทำให้รถเลี้ยวผิดบ่อย ตรงจุดเดียวกับฝาท่อ",
    images: [],
    type: "จราจร",
    status: "finish",
    timestamp: "2024-02-14T08:00:00Z",
    updated_at: "2024-02-16T14:00:00Z",
    address: { sub_district: "ในเมือง", district: "เมือง", province: "ขอนแก่น", detail: "หน้าตลาดสดเทศบาล 1" },
    agencies: [{ name: "เทศบาลนครขอนแก่น", role: "main" }],
    hashtags: ["#จราจร", "#ป้ายชำรุด"],
    stats: { chat_total: 1 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: 'child', parent_id: '2024-KK001' }
  },

  // Independent Cases
  {
    case_id: "2024-KK002",
    title: "ไฟส่องสว่างดับทั้งซอย (แจ้งรอบที่ 2)",
    description: "เคยแจ้งไปแล้วไฟติดได้ 2 วันก็ดับอีกครับ ซอยมืดมาก กลัวโจรขโมย",
    images: [
        "https://images.unsplash.com/photo-1555685812-4b943f3db9f0?auto=format&fit=crop&q=80&w=400&h=300",
        "https://images.unsplash.com/photo-1544724569-5f546fd6dd2a?auto=format&fit=crop&q=80&w=400&h=300" 
    ],
    type: "ไฟฟ้า",
    status: "in_progress",
    timestamp: "2024-02-05T18:45:00Z",
    updated_at: "2024-02-17T09:20:00Z",
    address: { sub_district: "ศิลา", district: "เมือง", province: "ขอนแก่น", detail: "ซอยมิตรภาพ 15" },
    agencies: [{ name: "การไฟฟ้าส่วนภูมิภาค", role: "main" }],
    hashtags: ["#ไฟดับ", "#ความปลอดภัย"],
    stats: { chat_total: 5 },
    reopen_count: 2, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-UD003", 
    title: "น้ำประปาไม่ไหล หมู่ 3",
    description: "น้ำไม่ไหลมาตั้งแต่เช้าแล้วครับ รบกวนตรวจสอบ",
    images: [],
    type: "น้ำท่วม",
    status: "waiting",
    timestamp: "2024-02-08T07:15:00Z", 
    updated_at: "2024-02-08T07:15:00Z",
    address: { sub_district: "หมากแข้ง", district: "เมือง", province: "อุดรธานี", detail: "ซอยประชาสันติ" },
    agencies: [{ name: "การประปาส่วนภูมิภาค", role: "main" }],
    hashtags: ["#น้ำไม่ไหล", "#ประปา"],
    stats: { chat_total: 0 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  },
  // ... (Other existing data kept for brevity but assumed present) ...
  {
    case_id: "2024-BKK009",
    title: "ขยะมูลฝอยตกค้าง",
    description: "รถขยะไม่มาเก็บตามรอบ วันพุธแล้วยังกองเต็มหน้าบ้าน",
    images: ["https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความสะอาด",
    status: "waiting",
    timestamp: "2024-02-17T06:00:00Z",
    updated_at: "2024-02-17T06:00:00Z",
    address: { sub_district: "บางนา", district: "บางนา", province: "กรุงเทพมหานคร", detail: "หมู่บ้านไพลิน" },
    agencies: [{ name: "สำนักงานเขตบางนา", role: "main" }],
    hashtags: ["#ขยะ", "#ความสะอาด"],
    stats: { chat_total: 0 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-CM006",
    title: "เผาขยะควันโขมง",
    description: "มีการเผาขยะในที่โล่ง กลิ่นเหม็นมาก แสบจมูก",
    images: ["https://images.unsplash.com/photo-1611270418597-a6c77f4b7271?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความสะอาด",
    status: "forwarded",
    timestamp: "2024-02-15T09:30:00Z",
    updated_at: "2024-02-15T11:00:00Z",
    address: { sub_district: "สุเทพ", district: "เมือง", province: "เชียงใหม่", detail: "หลัง ม.เชียงใหม่" },
    agencies: [{ name: "เทศบาลนครเชียงใหม่", role: "forwarder" }, { name: "กรมควบคุมมลพิษ", role: "main" }],
    hashtags: ["#PM2.5", "#เผาขยะ"],
    stats: { chat_total: 2 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-PK007",
    title: "ท่อประปาแตก น้ำเจิ่งนอง",
    description: "ท่อเมนประปาแตก น้ำไหลทิ้งมหาศาล เสียดายน้ำครับ",
    images: ["https://images.unsplash.com/photo-1585938389612-a552a28d6914?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "น้ำท่วม",
    status: "finish",
    timestamp: "2024-02-12T15:20:00Z",
    updated_at: "2024-02-13T10:00:00Z",
    address: { sub_district: "ป่าตอง", district: "กะทู้", province: "ภูเก็ต", detail: "ซอยบางลา" },
    agencies: [{ name: "การประปาส่วนภูมิภาค", role: "main" }],
    hashtags: ["#ท่อแตก", "#น้ำรั่ว"],
    stats: { chat_total: 4 },
    reopen_count: 0, rating: 5, feedback: "ทีมงานมาไวมากครับ", is_verified: true, verified_by: "หน.ทีมซ่อม",
    related: { role: null }
  },
  {
    case_id: "2024-UD010",
    title: "สุนัขจรจัดดุร้าย",
    description: "มีกลุ่มสุนัขจรจัด 4-5 ตัว ไล่เห่ากัดคนเดินผ่านไปมา",
    images: ["https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความปลอดภัย",
    status: "finish",
    timestamp: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-03T16:00:00Z",
    address: { sub_district: "หนองขอนกว้าง", district: "เมือง", province: "อุดรธานี", detail: "สวนสาธารณะหนองประจักษ์" },
    agencies: [{ name: "ปศุสัตว์จังหวัด", role: "main" }],
    hashtags: ["#หมาจร", "#อันตราย"],
    stats: { chat_total: 2 },
    reopen_count: 0, rating: 4, feedback: "จับไปแล้วครับ ขอบคุณครับ", is_verified: true, verified_by: "น.สพ.วิชัย",
    related: { role: null }
  },
  {
    case_id: "2024-CM011",
    title: "สายไฟห้อยระโยงระยาง",
    description: "สายสื่อสารห้อยลงมาต่ำมาก เกี่ยวหัวคนเดินผ่าน",
    images: ["https://images.unsplash.com/photo-1544724569-5f546fd6dd2a?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ไฟฟ้า",
    status: "forwarded",
    timestamp: "2024-02-13T11:00:00Z",
    updated_at: "2024-02-13T15:00:00Z",
    address: { sub_district: "ช้างคลาน", district: "เมือง", province: "เชียงใหม่", detail: "ถนนไนท์บาซาร์" },
    agencies: [{ name: "การไฟฟ้าส่วนภูมิภาค", role: "forwarder" }, { name: "กสทช.", role: "main" }],
    hashtags: ["#สายไฟ", "#อันตราย"],
    stats: { chat_total: 0 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-PK012",
    title: "เสียงดังรบกวนยามวิกาล",
    description: "ร้านอาหารเปิดเพลงเสียงดังเกินเวลาที่กฎหมายกำหนด",
    images: ["https://images.unsplash.com/photo-1567536303378-2d85b7964724?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความปลอดภัย",
    status: "finish",
    timestamp: "2024-02-11T23:30:00Z",
    updated_at: "2024-02-12T01:00:00Z",
    address: { sub_district: "กะรน", district: "เมือง", province: "ภูเก็ต", detail: "หาดกะรน" },
    agencies: [{ name: "สภ.กะรน", role: "main" }],
    hashtags: ["#เสียงดัง", "#รบกวน"],
    stats: { chat_total: 6 },
    reopen_count: 3, rating: 1, feedback: "ตำรวจมาเตือนแล้วก็ดังอีก", is_verified: true, verified_by: "ร.ต.อ.สมศักดิ์",
    related: { role: null }
  },
  {
    case_id: "2024-KK013",
    title: "คลองส่งน้ำเน่าเสีย",
    description: "น้ำในคลองเป็นสีดำ มีกลิ่นเหม็นเน่า ปลาตายลอยเกลื่อน",
    images: ["https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความสะอาด",
    status: "waiting",
    timestamp: "2024-02-02T09:00:00Z",
    updated_at: "2024-02-02T09:00:00Z", 
    address: { sub_district: "ท่าพระ", district: "เมือง", province: "ขอนแก่น", detail: "คลองชลประทาน" },
    agencies: [{ name: "กรมชลประทาน", role: "main" }],
    hashtags: ["#น้ำเน่า", "#มลพิษ"],
    stats: { chat_total: 0 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-BKK014",
    title: "จอดรถกีดขวางทางเข้าออก",
    description: "มีรถมาจอดขวางหน้าบ้าน ออกไปทำงานไม่ได้",
    images: ["https://images.unsplash.com/photo-1605218427360-69643187b640?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "จราจร",
    status: "finish",
    timestamp: "2024-02-16T07:30:00Z",
    updated_at: "2024-02-16T08:15:00Z",
    address: { sub_district: "ดินแดง", district: "ดินแดง", province: "กรุงเทพมหานคร", detail: "ซอยประชาสงเคราะห์ 14" },
    agencies: [{ name: "สน.ดินแดง", role: "main" }],
    hashtags: ["#จอดขวาง", "#จราจร"],
    stats: { chat_total: 2 },
    reopen_count: 0, rating: 5, feedback: "ตร. มาไวมากครับ", is_verified: true, verified_by: "จ่าเฉย",
    related: { role: null }
  },
  {
    case_id: "2024-UD015",
    title: "ถนนเป็นหลุมเป็นบ่อขนาดใหญ่",
    description: "หลุมลึกมาก รถจักรยานยนต์ตกหลุมล้มไปหลายคันแล้ว",
    images: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความปลอดภัย",
    status: "in_progress",
    timestamp: "2024-02-13T16:00:00Z",
    updated_at: "2024-02-15T10:00:00Z",
    address: { sub_district: "นาดี", district: "เมือง", province: "อุดรธานี", detail: "ทางเข้าหมู่บ้านสินชัย" },
    agencies: [{ name: "อบต.นาดี", role: "main" }],
    hashtags: ["#ถนนพัง", "#อุบัติเหตุ"],
    stats: { chat_total: 8 },
    reopen_count: 1, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-KK016",
    title: "ต้นไม้บังวิสัยทัศน์",
    description: "กิ่งไม้ยื่นออกมาบังป้ายจราจร มองไม่เห็น",
    images: ["https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ต้นไม้/สวน",
    status: "waiting",
    timestamp: "2024-02-17T08:00:00Z",
    updated_at: "2024-02-17T08:00:00Z",
    address: { sub_district: "สาวะถี", district: "เมือง", province: "ขอนแก่น", detail: "ทางหลวงชนบท" },
    agencies: [{ name: "หมวดการทาง", role: "main" }],
    hashtags: ["#ต้นไม้", "#วิสัยทัศน์"],
    stats: { chat_total: 0 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-PK017",
    title: "หาบเร่แผงลอยกีดขวางทางเท้า",
    description: "ตั้งร้านขายของเต็มทางเท้า เดินผ่านไม่ได้ ต้องลงไปเดินบนถนน",
    images: [
        "https://images.unsplash.com/photo-1557161184-e8b234479904?auto=format&fit=crop&q=80&w=400&h=300",
        "https://images.unsplash.com/photo-1626262886733-47206126b83f?auto=format&fit=crop&q=80&w=400&h=300"
    ],
    type: "ทางเท้า",
    status: "finish",
    timestamp: "2024-02-10T17:00:00Z",
    updated_at: "2024-02-11T19:00:00Z",
    address: { sub_district: "ตลาดใหญ่", district: "เมือง", province: "ภูเก็ต", detail: "ถนนถลาง" },
    agencies: [{ name: "เทศบาลนครภูเก็ต", role: "main" }],
    hashtags: ["#ทางเท้า", "#หาบเร่"],
    stats: { chat_total: 3 },
    reopen_count: 0, rating: 4, feedback: "ดีขึ้นครับ แต่ยังมีแอบมาบ้าง", is_verified: true, verified_by: "เทศกิจ",
    related: { role: null }
  },
  {
    case_id: "2024-BKK019",
    title: "ไฟจราจรเสีย แยกอโศก",
    description: "ไฟเขียวไฟแดงดับทุกด้าน รถติดขัดมาก เกือบชนกัน",
    images: ["https://images.unsplash.com/photo-1569307767855-668045353163?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "จราจร",
    status: "in_progress",
    timestamp: "2024-02-17T11:00:00Z",
    updated_at: "2024-02-17T11:15:00Z",
    address: { sub_district: "คลองเตยเหนือ", district: "วัฒนา", province: "กรุงเทพมหานคร", detail: "แยกอโศกมนตรี" },
    agencies: [{ name: "บก.จร.", role: "main" }],
    hashtags: ["#ไฟเสีย", "#รถติด"],
    stats: { chat_total: 10 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-KK020",
    title: "ฝุ่นละอองจากการก่อสร้าง",
    description: "โครงการก่อสร้างคอนโดทำฝุ่นฟุ้งกระจาย ไม่มีการป้องกัน",
    images: ["https://images.unsplash.com/photo-1611270418597-a6c77f4b7271?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความสะอาด",
    status: "waiting",
    timestamp: "2024-02-16T09:00:00Z",
    updated_at: "2024-02-16T09:00:00Z",
    address: { sub_district: "ในเมือง", district: "เมือง", province: "ขอนแก่น", detail: "ถนนรื่นรมย์" },
    agencies: [{ name: "เทศบาลนครขอนแก่น", role: "main" }],
    hashtags: ["#ฝุ่น", "#ก่อสร้าง"],
    stats: { chat_total: 0 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-BKK021",
    title: "ขายของบนทางเท้า",
    description: "ร้านก๋วยเตี๋ยวตั้งโต๊ะกินข้าวบนทางเท้า เดินไม่ได้",
    images: [],
    type: "ทางเท้า",
    status: "waiting",
    timestamp: "2024-02-18T08:00:00Z",
    updated_at: "2024-02-18T08:00:00Z",
    address: { sub_district: "จตุจักร", district: "จตุจักร", province: "กรุงเทพมหานคร", detail: "หน้าสวนจตุจักร" },
    agencies: [{ name: "สำนักงานเขตจตุจักร", role: "main" }],
    hashtags: ["#ทางเท้า", "#กทม"],
    stats: { chat_total: 0 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  },
  {
    case_id: "2024-KK022",
    title: "น้ำเสียลงบึงแก่นนคร",
    description: "ท่อระบายน้ำปล่อยน้ำเสียลงบึงโดยตรง ส่งกลิ่นเหม็น",
    images: ["https://broken-link-example.com/image.jpg"], // Broken Link Test
    type: "ความสะอาด",
    status: "in_progress",
    timestamp: "2024-02-15T14:00:00Z",
    updated_at: "2024-02-16T10:00:00Z",
    address: { sub_district: "ในเมือง", district: "เมือง", province: "ขอนแก่น", detail: "บึงแก่นนคร ทิศใต้" },
    agencies: [{ name: "เทศบาลนครขอนแก่น", role: "main" }],
    hashtags: ["#น้ำเสีย", "#สิ่งแวดล้อม"],
    stats: { chat_total: 2 },
    reopen_count: 0, rating: null, is_verified: false,
    related: { role: null }
  }
];

// --- Dropdown Options ---
const OFFICER_OPTIONS = [
  { value: "STAFF_01", label: "สมชาย ใจดี (STAFF_01)" },
  { value: "STAFF_02", label: "วิชัย มุ่งมั่น (STAFF_02)" },
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

// --- Utility Functions ---
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

const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
};

const getUniqueLocations = (data) => {
    const locations = new Map();
    data.forEach(item => {
        const { province, district, sub_district } = item.address;
        const key = `${province}>${district}>${sub_district}`;
        if (!locations.has(key)) {
            locations.set(key, { province, district, sub_district });
        }
    });
    return Array.from(locations.values());
};

// --- Components ---

const CaseCard = ({ ticket, viewMode, isSelected, onToggleSelect, onUngroup }) => {
  const [imageError, setImageError] = useState(false);
  const hasImages = ticket.images && ticket.images.length > 0;
  const useDefaultImage = !hasImages || imageError;
  const displayImage = useDefaultImage ? DEFAULT_COVER_IMAGE : ticket.images[0];

  const isParent = ticket.related?.role === 'parent';
  const isChild = ticket.related?.role === 'child';
  const childCount = isParent ? ticket.related.children?.length || 0 : 0;

  return (
    <div 
      className={`group relative bg-white rounded-xl border transition-all duration-200 flex flex-col h-full 
        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-md' : 'border-slate-200 hover:shadow-lg hover:border-indigo-200'}
        ${isChild ? 'bg-slate-50/50' : ''}
      `}
    >
      <div className={`absolute top-3 left-3 z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
         <input 
            type="checkbox" 
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 shadow-sm cursor-pointer"
            checked={isSelected}
            onChange={() => onToggleSelect(ticket.case_id)}
         />
      </div>

      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl pl-10">
        <StatusBadge status={ticket.status} />
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1">
              #{ticket.case_id}
              <CopyButton text={ticket.case_id} />
            </span>
        </div>
      </div>

      {isParent && (
         <div className="bg-indigo-50 px-4 py-1.5 border-b border-indigo-100 flex items-center gap-2 text-xs font-medium text-indigo-700">
            <Layers size={14} />
            <span>Case หลัก ({childCount} เรื่องในกลุ่ม)</span>
         </div>
      )}
      {isChild && (
         <div className="bg-slate-100 px-4 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
               <LinkIcon size={14} />
               <span>รวมอยู่ใน #{ticket.related.parent_id}</span>
            </div>
            <button 
               onClick={(e) => { e.stopPropagation(); onUngroup(ticket.case_id); }}
               className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
               title="แยกออกจากกลุ่ม"
            >
               <Unlink size={14} />
            </button>
         </div>
      )}

      <div className={`flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'} flex-1`}>
        <div className={`relative bg-slate-100 shrink-0 overflow-hidden ${viewMode === 'list' ? 'w-64' : 'h-48'}`}>
             <img 
                src={displayImage} 
                alt={ticket.title} 
                className={`w-full h-full object-cover ${useDefaultImage ? 'opacity-80 grayscale-[30%]' : ''}`} 
                onError={() => setImageError(true)}
             />
             {!useDefaultImage && ticket.images.length > 1 && (
                 <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                     <Layers size={12} /> +{ticket.images.length - 1}
                 </div>
             )}
             
             {ticket.reopen_count > 0 && (
                <div className="absolute top-2 right-2">
                     <div className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm animate-pulse">
                        <BadgeAlert size={12} /> เปิดซ้ำ {ticket.reopen_count} ครั้ง
                     </div>
                </div>
             )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="mb-2">
            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 cursor-pointer hover:text-indigo-600">{ticket.title}</h3>
            <p className="text-slate-600 text-sm line-clamp-2 mt-1">{ticket.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3 py-2 border-y border-slate-50">
            <div>
                <span className="text-slate-500 block mb-0.5">แจ้งเมื่อ</span>
                <span className="text-slate-700 font-medium">{timeAgo(ticket.timestamp)}</span>
            </div>
            <div>
                <span className="text-slate-500 block mb-0.5">อัพเดทล่าสุด</span>
                <span className="text-indigo-700 font-medium">{timeAgo(ticket.updated_at)}</span>
            </div>
          </div>

          <div className="mt-auto flex items-start gap-2 text-xs text-slate-600">
              <MapPin size={14} className="text-rose-500 mt-0.5 shrink-0" />
              <span className="truncate">{ticket.address.sub_district}, {ticket.address.province}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 text-xs font-medium ${ticket.stats.chat_total > 0 ? 'text-indigo-700' : 'text-slate-500'}`}>
          <MessageCircle size={16} />
          <span>{ticket.stats.chat_total > 0 ? `${ticket.stats.chat_total} ข้อความ` : 'ไม่มีข้อความ'}</span>
        </div>
        <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1">
          จัดการ <ArrowRightLeft size={12} />
        </button>
      </div>
    </div>
  );
};

// ... Helper Components ...
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
      <Icon size={14} />
      {label}
    </span>
  );
};

const QuickFilterBar = ({ currentFilter, onSelect }) => {
    const filters = [
        { id: 'all', label: 'ทั้งหมด', icon: null },
        { id: 'stagnant', label: 'ค้างนาน > 7 วัน', icon: Clock, color: 'text-rose-600 bg-rose-50 border-rose-200' },
        { id: 'reopened', label: 'มีการเปิดซ้ำ', icon: AlertCircle, color: 'text-orange-600 bg-orange-50 border-orange-200' },
        { id: 'parent', label: 'Case หลัก (Parent)', icon: Layers, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    ];
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {filters.map(f => (
                <button key={f.id} onClick={() => onSelect(f.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${currentFilter === f.id ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                    {f.icon && <f.icon size={14} className={currentFilter === f.id ? 'text-white' : f.color.split(' ')[0]} />}
                    {f.label}
                </button>
            ))}
        </div>
    );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => { e.stopPropagation(); navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return <button onClick={handleCopy} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600">{copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}</button>;
};

const MultiSelectDropdown = ({ label, options, selectedValues, onChange, enableSearch = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const toggleOption = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-2 rounded-md border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none flex items-center justify-between text-sm shadow-sm"
      >
        <span className={`truncate ${selectedValues.length === 0 ? "text-slate-500" : "text-slate-900 font-medium"}`}>
          {selectedValues.length === 0 ? "เลือกทั้งหมด" : `เลือกแล้ว ${selectedValues.length} รายการ`}
        </span>
        <ChevronDown size={16} className="text-slate-400 shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
          {enableSearch && (
            <div className="sticky top-0 bg-white p-2 border-b border-slate-100">
               <div className="relative">
                  <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input 
                    type="text"
                    className="w-full pl-8 pr-2 py-1.5 text-sm border border-slate-200 rounded bg-slate-50 focus:outline-none focus:border-indigo-400"
                    placeholder="ค้นหา..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
               </div>
            </div>
          )}
          {filteredOptions.length > 0 ? (
             filteredOptions.map(option => (
                <div 
                  key={option.value} 
                  onClick={() => toggleOption(option.value)}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-50 flex items-center gap-2 text-sm border-b border-slate-50 last:border-0"
                >
                  <div className={`w-4 h-4 rounded border flex shrink-0 items-center justify-center transition-colors ${selectedValues.includes(option.value) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {selectedValues.includes(option.value) && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`truncate ${selectedValues.includes(option.value) ? 'text-indigo-700 font-medium' : 'text-slate-700'}`}>{option.label}</span>
                </div>
              ))
          ) : (
              <div className="p-3 text-center text-xs text-slate-400">ไม่พบข้อมูล</div>
          )}
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
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (loc) => {
        onSelect(loc);
        setIsOpen(false);
        setInputValue("");
    };

    const handleClear = () => {
        onSelect(null);
        setInputValue("");
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-slate-700 mb-1">พื้นที่ (ค้นหาตามข้อมูลที่มี)</label>
            {!selectedLocation ? (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm placeholder:text-slate-400"
                        placeholder="พิมพ์ชื่อตำบล อำเภอ หรือจังหวัด..."
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>
            ) : (
                <div className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-medium shadow-sm">
                    <div className="flex items-center gap-2 truncate">
                        <MapPin size={16} className="shrink-0" />
                        <span className="truncate">
                            {selectedLocation.province} › {selectedLocation.district} › {selectedLocation.sub_district}
                        </span>
                    </div>
                    <button onClick={handleClear} className="text-indigo-500 hover:text-indigo-700 p-1">
                        <X size={16} />
                    </button>
                </div>
            )}
            {isOpen && inputValue.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredLocations.length > 0 ? (
                        filteredLocations.map((loc, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleSelect(loc)}
                                className="px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 last:border-0 text-sm group"
                            >
                                <div className="font-medium text-slate-800 group-hover:text-indigo-700">
                                    {loc.province} 
                                    <span className="text-slate-400 mx-2">›</span> 
                                    {loc.district}
                                    <span className="text-slate-400 mx-2">›</span> 
                                    {loc.sub_district}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-slate-500 text-sm text-center">
                            ไม่พบพื้นที่ดังกล่าวในรายการแจ้งเหตุ
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Group Selection Modal ---
const GroupSelectionModal = ({ selectedCases, tickets, onClose, onConfirm }) => {
    // 1. Find implicit parents (parents of any selected children)
    const implicitParentIds = useMemo(() => {
        const ids = new Set();
        selectedCases.forEach(id => {
            const t = tickets.find(ticket => ticket.case_id === id);
            if (t?.related?.role === 'child' && t.related.parent_id) {
                ids.add(t.related.parent_id);
            }
        });
        return ids;
    }, [selectedCases, tickets]);

    // 2. Combine explicit selection with implicit parents
    const allInvolvedIds = useMemo(() => [...new Set([...selectedCases, ...Array.from(implicitParentIds)])], [selectedCases, implicitParentIds]);
    const allInvolvedTickets = useMemo(() => tickets.filter(t => allInvolvedIds.includes(t.case_id)), [tickets, allInvolvedIds]);

    // 3. Determine default parent: Prioritize existing parent, otherwise first selection
    const defaultParentId = useMemo(() => {
        const existingParent = allInvolvedTickets.find(t => t.related?.role === 'parent');
        return existingParent ? existingParent.case_id : selectedCases[0];
    }, [allInvolvedTickets, selectedCases]);

    const [selectedParentId, setSelectedParentId] = useState(defaultParentId);

    // Update state if default changes (e.g. initial load)
    useEffect(() => {
        setSelectedParentId(defaultParentId);
    }, [defaultParentId]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="text-indigo-600" /> รวมกลุ่มเรื่องแจ้ง
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="text-sm text-slate-600 mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <p className="font-semibold text-indigo-900 mb-1">ระบบดึงข้อมูลที่เกี่ยวข้องมาให้แล้ว</p>
                        คุณเลือก <strong>{selectedCases.length} รายการ</strong> แต่ระบบพบว่ามีเคสที่เกี่ยวข้อง (เช่น เคสแม่ของกลุ่มเดิม) จึงนำมารวมให้เลือกด้วย
                        <br/><br/>
                        กรุณาเลือก 1 รายการเพื่อเป็น <strong>"Case หลัก (Parent)"</strong> ของกลุ่มใหม่นี้
                    </div>
                    
                    <div className="space-y-2">
                        {allInvolvedTickets.map(ticket => (
                            <div 
                                key={ticket.case_id}
                                onClick={() => setSelectedParentId(ticket.case_id)}
                                className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${selectedParentId === ticket.case_id ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedParentId === ticket.case_id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                                    {selectedParentId === ticket.case_id && <Check size={12} className="text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-mono text-slate-500">#{ticket.case_id}</span>
                                        {ticket.related?.role === 'parent' && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 rounded font-medium">Main Case เดิม</span>}
                                        {implicitParentIds.has(ticket.case_id) && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded font-medium">เพิ่มโดยระบบ</span>}
                                    </div>
                                    <div className="text-sm font-medium text-slate-900 truncate">{ticket.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 mt-auto">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-colors">ยกเลิก</button>
                    <button onClick={() => onConfirm(selectedParentId, allInvolvedIds)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">ยืนยันรวมกลุ่ม ({allInvolvedIds.length} รายการ)</button>
                </div>
            </div>
        </div>
    );
};

// --- Main App ---

export default function App() {
  const [tickets, setTickets] = useState(INITIAL_DATA);
  const [viewMode, setViewMode] = useState('grid');
  const [quickFilter, setQuickFilter] = useState('all');
  
  // Selection State
  const [selectedItems, setSelectedItems] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({ 
      keyword: "",
      status: [], 
      type: [],   
      officerIds: [],
      rating: [], // New
      location: null,
      startDate: "",
      endDate: "",
      isReopened: false,
      verification: "all"
  });

  // State for Applied Filters (The logic uses this)
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // --- Handlers ---

  const handleToggleSelect = (id) => {
      setSelectedItems(prev => 
          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
  };

  const handleGroupConfirm = (parentId, allMemberIds) => {
      // Logic: Detach everyone from old relationships FIRST, then re-attach to new parent.
      
      const childIds = allMemberIds.filter(id => id !== parentId);
      
      setTickets(prevTickets => {
          // 1. Clean Slate: Remove children from old parents
          const cleanTickets = prevTickets.map(ticket => {
              if (ticket.related?.role === 'parent') {
                  // Keep children ONLY if they are NOT in the new group (allMemberIds)
                  // AND if the parent itself is NOT part of the new group (it might become a child)
                  
                  if (allMemberIds.includes(ticket.case_id)) {
                      // This parent is being moved/regrouped, so it loses its old status for now
                      return { ...ticket, related: { role: null } }; 
                  }

                  const remainingChildren = ticket.related.children.filter(childId => !allMemberIds.includes(childId));
                  
                  if (remainingChildren.length === 0) {
                      return { ...ticket, related: { role: null } }; // No kids left, back to independent
                  }
                  return { ...ticket, related: { ...ticket.related, children: remainingChildren } };
              }
              
              if (ticket.related?.role === 'child' && allMemberIds.includes(ticket.case_id)) {
                  // This child is being moved, strip it
                  return { ...ticket, related: { role: null } };
              }

              return ticket;
          });

          // 2. Establish New Group
          return cleanTickets.map(ticket => {
              if (ticket.case_id === parentId) {
                  // New Parent
                  return { ...ticket, related: { role: 'parent', children: childIds } };
              } else if (childIds.includes(ticket.case_id)) {
                  // New Children
                  return { ...ticket, related: { role: 'child', parent_id: parentId } };
              }
              return ticket;
          });
      });

      setSelectedItems([]);
      setShowGroupModal(false);
  };

  const handleUngroup = (childId) => {
      setTickets(prev => {
          let parentId = null;
          const step1 = prev.map(t => {
              if (t.case_id === childId) {
                  parentId = t.related?.parent_id;
                  return { ...t, related: { role: null } };
              }
              return t;
          });

          if (!parentId) return step1;

          return step1.map(t => {
              if (t.case_id === parentId) {
                  const newChildren = t.related.children.filter(id => id !== childId);
                  if (newChildren.length === 0) {
                      return { ...t, related: { role: null } };
                  }
                  return { ...t, related: { ...t.related, children: newChildren } };
              }
              return t;
          });
      });
  };

  const handleQuickFilter = (id) => {
      setQuickFilter(id);
      setSelectedItems([]);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyAdvancedFilters = () => {
    setAppliedFilters(filters);
    if (quickFilter !== 'all') setQuickFilter('custom');
  };

  const resetFilters = () => {
    const emptyFilters = {
      keyword: filters.keyword,
      status: [], 
      type: [],   
      officerIds: [], 
      rating: [], // Reset new filter
      location: null,
      startDate: "",
      endDate: "",
      isReopened: false,
      verification: "all"
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setQuickFilter('all');
  };

  const statusOptions = [
    { value: "waiting", label: "รอรับเรื่อง" },
    { value: "in_progress", label: "กำลังดำเนินการ" },
    { value: "finish", label: "เสร็จสิ้น" },
    { value: "forwarded", label: "ส่งต่อหน่วยงานอื่น" },
  ];

  const typeOptions = [
    { value: "ความปลอดภัย", label: "ความปลอดภัย" },
    { value: "ไฟฟ้า", label: "ไฟฟ้า" },
    { value: "ความสะอาด", label: "ความสะอาด" },
    { value: "ต้นไม้/สวน", label: "ต้นไม้/สวน" },
    { value: "จราจร", label: "จราจร" },
    { value: "ทางเท้า", label: "ทางเท้า" },
    { value: "น้ำท่วม", label: "น้ำท่วม/ระบายน้ำ" },
  ];

  // Filter Logic
  const filteredData = useMemo(() => {
      return tickets.filter(item => {
          // Quick Filters
          if (quickFilter === 'parent' && item.related?.role !== 'parent') return false;
          if (quickFilter === 'reopened' && item.reopen_count === 0) return false;
          if (quickFilter === 'stagnant') {
              const daysInactive = (new Date() - new Date(item.updated_at)) / (1000 * 60 * 60 * 24);
              if (daysInactive <= 7 || item.status === 'finish') return false;
          }
          
          // Keyword (from filters state for real-time)
          const searchLower = filters.keyword.toLowerCase();
          if (searchLower && 
              !item.title.toLowerCase().includes(searchLower) && 
              !item.case_id.toLowerCase().includes(searchLower) &&
              !item.hashtags.some(tag => tag.toLowerCase().includes(searchLower))
          ) return false;

          // Advanced Filters (from appliedFilters)
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="text-indigo-600" />
                ระบบจัดการเรื่องแจ้ง
              </h1>
              <p className="text-slate-500 text-sm">Operational Dashboard (Mockup V9)</p>
            </div>
            
            {/* Selection Action Bar */}
            {selectedItems.length > 0 ? (
                <div className="flex items-center gap-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
                    <span className="font-bold text-sm whitespace-nowrap">{selectedItems.length} รายการที่เลือก</span>
                    <div className="h-6 w-px bg-indigo-400"></div>
                    <button 
                        onClick={() => setShowGroupModal(true)}
                        className="flex items-center gap-2 hover:bg-indigo-500 px-3 py-1.5 rounded transition-colors text-sm font-medium"
                    >
                        <Group size={16} />
                        รวมกลุ่ม
                    </button>
                    <button 
                        onClick={() => setSelectedItems([])}
                        className="p-1 hover:bg-indigo-500 rounded"
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : (
               <div className="text-right text-xs text-slate-400 hidden sm:block">
                   กด checkbox ที่มุมการ์ดเพื่อรวมกลุ่ม
               </div>
            )}
        </div>
      </header>

      {/* Filter Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-4 flex flex-col">
            <QuickFilterBar currentFilter={quickFilter} onSelect={handleQuickFilter} />
            
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="text"
                      placeholder="ค้นหา (Keyword, ID...)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      value={filters.keyword}
                      onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    />
                </div>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors ${isFilterOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">ตัวกรองละเอียด</span>
                  <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                 <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}><LayoutGrid size={18} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}><ListIcon size={18} /></button>
                </div>
            </div>

            {/* Expanded Filters */}
            {isFilterOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                
                <MultiSelectDropdown 
                  label="สถานะ"
                  options={statusOptions}
                  selectedValues={filters.status}
                  onChange={(val) => handleFilterChange('status', val)}
                />
                
                <MultiSelectDropdown 
                  label="ประเภทเรื่อง"
                  options={typeOptions}
                  selectedValues={filters.type}
                  onChange={(val) => handleFilterChange('type', val)}
                  enableSearch={true}
                />

                <div className="lg:col-span-2">
                   <LocationAutocomplete 
                      data={INITIAL_DATA}
                      selectedLocation={filters.location}
                      onSelect={(loc) => handleFilterChange('location', loc)}
                   />
                </div>

                <MultiSelectDropdown 
                  label="จนท. รับผิดชอบ"
                  options={OFFICER_OPTIONS}
                  selectedValues={filters.officerIds}
                  onChange={(val) => handleFilterChange('officerIds', val)}
                  enableSearch={true}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">การรับรอง</label>
                  <select
                     className="w-full p-2 rounded-md border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                     value={filters.verification}
                     onChange={(e) => handleFilterChange('verification', e.target.value)}
                  >
                     {VERIFICATION_OPTIONS.map(opt => (
                         <option key={opt.value} value={opt.value}>{opt.label}</option>
                     ))}
                  </select>
                </div>

                <MultiSelectDropdown 
                  label="คะแนนความพึงพอใจ"
                  options={RATING_OPTIONS}
                  selectedValues={filters.rating}
                  onChange={(val) => handleFilterChange('rating', val)}
                />

                <div className="lg:col-span-1"> {/* Adjusted span to fit rating */}
                   <label className="block text-sm font-medium text-slate-700 mb-1">ช่วงเวลาแจ้งเหตุ</label>
                   <div className="flex gap-2">
                      <input 
                        type="date" 
                        className="w-1/2 p-2 rounded-md border border-slate-300 text-sm shadow-sm"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      />
                      <input 
                        type="date" 
                        className="w-1/2 p-2 rounded-md border border-slate-300 text-sm shadow-sm"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      />
                   </div>
                </div>

                <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                           type="checkbox" 
                           className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                           checked={filters.isReopened}
                           onChange={(e) => handleFilterChange('isReopened', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-slate-700">เฉพาะที่มีการเปิดซ้ำ</span>
                    </label>
                </div>

                {/* Filter Actions (Restored Buttons) */}
                <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-4 mt-2 gap-4">
                   <div className="flex gap-2 w-full sm:w-auto">
                       {/* Save Search Button */}
                       <button 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 hover:border-indigo-100 text-sm font-medium" 
                          onClick={() => alert('ฟีเจอร์บันทึกตัวกรองจะเปิดใช้งานเร็วๆ นี้')}
                       >
                          <Bookmark size={16} />
                          บันทึกเงื่อนไข
                       </button>
                       {/* Set Default Button */}
                       <button 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 hover:border-indigo-100 text-sm font-medium" 
                          onClick={() => alert('ฟีเจอร์ตั้งค่าเริ่มต้นจะเปิดใช้งานเร็วๆ นี้')}
                       >
                          <Settings size={16} />
                          ตั้งเป็นค่าเริ่มต้น
                       </button>
                   </div>

                   <div className="flex gap-3 w-full sm:w-auto justify-end">
                       <button 
                          onClick={resetFilters} 
                          className="text-sm text-slate-500 hover:text-rose-700 underline px-3 py-2"
                       >
                         ล้างค่าทั้งหมด
                       </button>
                       <button 
                          onClick={applyAdvancedFilters} 
                          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition-colors"
                       >
                         <Search size={16} />
                         ค้นหา
                       </button>
                   </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4 text-sm text-slate-600">พบ {filteredData.length} รายการ</div>
        
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredData.map((ticket) => (
              <CaseCard 
                  key={ticket.case_id} 
                  ticket={ticket} 
                  viewMode={viewMode}
                  isSelected={selectedItems.includes(ticket.case_id)}
                  onToggleSelect={handleToggleSelect}
                  onUngroup={handleUngroup}
              />
            ))}
        </div>
      </main>

      {/* Group Modal */}
      {showGroupModal && (
          <GroupSelectionModal 
              selectedCases={selectedItems} 
              tickets={tickets}
              onClose={() => setShowGroupModal(false)}
              onConfirm={handleGroupConfirm}
          />
      )}
    </div>
  );
}