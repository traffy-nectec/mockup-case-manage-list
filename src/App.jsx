import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Filter, MapPin, Calendar, Tag, 
  AlertCircle, CheckCircle2, Clock, MoreHorizontal,
  LayoutGrid, List as ListIcon, X, ChevronDown, Building2,
  Copy, MessageCircle, User, Users, ArrowRightLeft, Check,
  History, Navigation, XCircle, Star, BadgeAlert, ShieldCheck, Flame, 
  RotateCcw, Image as ImageIcon, Layers, FileImage, Bookmark, Save, Settings
} from 'lucide-react';

// --- Configuration ---
// รูปภาพ Default สำหรับเคสที่ไม่มีรูป หรือโหลดรูปไม่สำเร็จ
const DEFAULT_COVER_IMAGE = "https://images.unsplash.com/photo-1449824913929-2b3a6e3586dc?auto=format&fit=crop&q=80&w=400&h=300"; 

// --- Mock Data ---
const MOCK_DATA = [
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
    reopen_count: 0, rating: 5, feedback: "แก้ไขรวดเร็วมากครับ", is_verified: true, verified_by: "หน.สมชาย (โยธา)"
  },
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
    reopen_count: 2, rating: null, is_verified: false
  },
  {
    case_id: "2024-UD003", 
    title: "น้ำประปาไม่ไหล หมู่ 3",
    description: "น้ำไม่ไหลมาตั้งแต่เช้าแล้วครับ รบกวนตรวจสอบ",
    images: [], // No Image Case -> Will show DEFAULT_COVER_IMAGE
    type: "น้ำท่วม",
    status: "waiting",
    timestamp: "2024-02-08T07:15:00Z", 
    updated_at: "2024-02-08T07:15:00Z",
    address: { sub_district: "หมากแข้ง", district: "เมือง", province: "อุดรธานี", detail: "ซอยประชาสันติ" },
    agencies: [{ name: "การประปาส่วนภูมิภาค", role: "main" }],
    hashtags: ["#น้ำไม่ไหล", "#ประปา"],
    stats: { chat_total: 0 },
    reopen_count: 0, rating: null, is_verified: false
  },
  {
    case_id: "2024-KK004",
    title: "ต้นไม้ล้มขวางถนน",
    description: "พายุเข้าเมื่อคืน ต้นไม้ใหญ่ล้มขวางการจราจร รถผ่านไม่ได้",
    images: ["https://broken-link-example.com/image.jpg"], // Broken Link Case -> Will show DEFAULT_COVER_IMAGE
    type: "ต้นไม้/สวน",
    status: "finish",
    timestamp: "2024-02-14T06:00:00Z",
    updated_at: "2024-02-14T14:30:00Z",
    address: { sub_district: "ในเมือง", district: "เมือง", province: "ขอนแก่น", detail: "ถนนหน้าโรงเรียนกัลยาณวัตร" },
    agencies: [{ name: "อบจ. ขอนแก่น", role: "main" }],
    hashtags: ["#ต้นไม้ล้ม", "#กีดขวาง"],
    stats: { chat_total: 7 },
    reopen_count: 0, rating: 3, feedback: "มาช้าไปหน่อยครับ", is_verified: true, verified_by: "จนท. ภาคสนาม"
  },
  {
    case_id: "2024-BKK005",
    title: "ทางเท้าชำรุด กระเบื้องกระดก",
    description: "เดินสะดุดเกือบล้มครับ กระเบื้องปูพื้นหลุดร่อนหลายแผ่น",
    images: ["https://images.unsplash.com/photo-1626262886733-47206126b83f?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ทางเท้า",
    status: "waiting",
    timestamp: "2024-02-16T12:00:00Z",
    updated_at: "2024-02-16T12:00:00Z",
    address: { sub_district: "ปทุมวัน", district: "ปทุมวัน", province: "กรุงเทพมหานคร", detail: "หน้าห้างสรรพสินค้า MBK" },
    agencies: [{ name: "สำนักงานเขตปทุมวัน", role: "main" }],
    hashtags: ["#ทางเท้า", "#กทม"],
    stats: { chat_total: 1 },
    reopen_count: 0, rating: null, is_verified: false
  },
  {
    case_id: "2024-CM006",
    title: "เผาขยะควันโขมง",
    description: "มีการเผาขยะในที่โล่ง กลิ่นเหม็นมาก แสบจมูก",
    images: [
        "https://images.unsplash.com/photo-1611270418597-a6c77f4b7271?auto=format&fit=crop&q=80&w=400&h=300",
        "https://images.unsplash.com/photo-1605218427360-69643187b640?auto=format&fit=crop&q=80&w=400&h=300",
        "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400&h=300"
    ],
    type: "ความสะอาด",
    status: "forwarded",
    timestamp: "2024-02-15T09:30:00Z",
    updated_at: "2024-02-15T11:00:00Z",
    address: { sub_district: "สุเทพ", district: "เมือง", province: "เชียงใหม่", detail: "หลัง ม.เชียงใหม่" },
    agencies: [{ name: "เทศบาลนครเชียงใหม่", role: "forwarder" }, { name: "กรมควบคุมมลพิษ", role: "main" }],
    hashtags: ["#PM2.5", "#เผาขยะ"],
    stats: { chat_total: 2 },
    reopen_count: 0, rating: null, is_verified: false
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
    reopen_count: 0, rating: 5, feedback: "ทีมงานมาไวมากครับ", is_verified: true, verified_by: "หน.ทีมซ่อม"
  },
  {
    case_id: "2024-KK008",
    title: "ป้ายจราจรล้ม",
    description: "ป้ายห้ามเลี้ยวขวาล้มลงไปกองกับพื้น ทำให้รถเลี้ยวผิดบ่อย",
    images: [],
    type: "จราจร",
    status: "in_progress",
    timestamp: "2024-02-14T08:00:00Z",
    updated_at: "2024-02-16T14:00:00Z",
    address: { sub_district: "เมืองเก่า", district: "เมือง", province: "ขอนแก่น", detail: "แยกไฟแดงบึงแก่นนคร" },
    agencies: [{ name: "เทศบาลนครขอนแก่น", role: "main" }],
    hashtags: ["#จราจร", "#ป้ายชำรุด"],
    stats: { chat_total: 1 },
    reopen_count: 1, rating: null, is_verified: false
  },
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
    reopen_count: 0, rating: null, is_verified: false
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
    reopen_count: 0, rating: 4, feedback: "จับไปแล้วครับ ขอบคุณครับ", is_verified: true, verified_by: "น.สพ.วิชัย"
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
    reopen_count: 0, rating: null, is_verified: false
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
    reopen_count: 3, rating: 1, feedback: "ตำรวจมาเตือนแล้วก็ดังอีก", is_verified: true, verified_by: "ร.ต.อ.สมศักดิ์"
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
    reopen_count: 0, rating: null, is_verified: false
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
    reopen_count: 0, rating: 5, feedback: "ตร. มาไวมากครับ", is_verified: true, verified_by: "จ่าเฉย"
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
    reopen_count: 1, rating: null, is_verified: false
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
    reopen_count: 0, rating: null, is_verified: false
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
    reopen_count: 0, rating: 4, feedback: "ดีขึ้นครับ แต่ยังมีแอบมาบ้าง", is_verified: true, verified_by: "เทศกิจ"
  },
  {
    case_id: "2024-CM018",
    title: "ขอเพิ่มจุดทิ้งขยะอันตราย",
    description: "ในชุมชนไม่มีถังขยะสำหรับทิ้งหลอดไฟและถ่านไฟฉาย",
    images: ["https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400&h=300"],
    type: "ความสะอาด",
    status: "forwarded",
    timestamp: "2024-02-09T10:00:00Z",
    updated_at: "2024-02-09T14:00:00Z",
    address: { sub_district: "แม่เหียะ", district: "เมือง", province: "เชียงใหม่", detail: "ตลาดแม่เหียะ" },
    agencies: [{ name: "อบต.แม่เหียะ", role: "forwarder" }, { name: "สนง.สิ่งแวดล้อม", role: "main" }],
    hashtags: ["#ขยะอันตราย", "#สิ่งแวดล้อม"],
    stats: { chat_total: 1 },
    reopen_count: 0, rating: null, is_verified: false
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
    reopen_count: 0, rating: null, is_verified: false
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
    reopen_count: 0, rating: null, is_verified: false
  }
];

// --- Dropdown Options ---
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

// --- Utility Functions ---

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

// --- Components ---

const CaseCard = ({ ticket, viewMode }) => {
  // State for image handling per card
  const [imageError, setImageError] = useState(false);
  const hasImages = ticket.images && ticket.images.length > 0;
  
  // Logic: Show Default Cover if no images exist OR if the image failed to load
  const useDefaultImage = !hasImages || imageError;
  const displayImage = useDefaultImage ? DEFAULT_COVER_IMAGE : ticket.images[0];

  return (
    <div className={`group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col h-full`}>
      {/* Header: Status & ID */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
        <StatusBadge status={ticket.status} />
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors">
              #{ticket.case_id}
              <CopyButton text={ticket.case_id} />
            </span>
        </div>
      </div>

      {/* Body */}
      <div className={`flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'} flex-1`}>
        
        {/* Image Section - Always rendered for consistency */}
        <div className={`relative bg-slate-100 shrink-0 overflow-hidden ${viewMode === 'list' ? 'w-64' : 'h-48'}`}>
             
             {/* Main Image (Or Default) */}
             <img 
                src={displayImage} 
                alt={ticket.title} 
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${useDefaultImage ? 'opacity-80' : ''}`} 
                onError={() => setImageError(true)}
             />
             
             {/* Multiple Images Counter (Only if not using default) */}
             {!useDefaultImage && ticket.images.length > 1 && (
                 <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                     <Layers size={12} /> +{ticket.images.length - 1}
                 </div>
             )}
             
             {/* Gradient Overlay */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            
            {/* Location Badge (Overlay) */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <div className="bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 truncate max-w-full">
                    <MapPin size={10} /> {ticket.address.sub_district}, {ticket.address.province}
                 </div>
            </div>

            {/* Re-open Badge (Overlay) */}
            {ticket.reopen_count > 0 && (
                <div className="absolute top-2 left-2">
                     <div className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm animate-pulse">
                        <BadgeAlert size={12} /> เปิดซ้ำ {ticket.reopen_count} ครั้ง
                     </div>
                </div>
            )}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <div className="mb-2">
            <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors cursor-pointer line-clamp-1 mb-1" title={ticket.title}>
              {ticket.title}
            </h3>
            <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{ticket.description}</p>
          </div>

          {/* Meta Info Grid */}
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

          {/* Rating & Verification Section */}
          {ticket.status === 'finish' && (
              <div className="mb-3 bg-slate-50 p-2 rounded border border-slate-100 text-xs">
                  {ticket.rating ? (
                      <div className="flex items-center gap-1 mb-1">
                          <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} fill={i < ticket.rating ? "currentColor" : "none"} className={i < ticket.rating ? "" : "text-slate-300"} />
                              ))}
                          </div>
                          <span className="text-slate-600">({ticket.rating}/5)</span>
                      </div>
                  ) : (
                      <div className="text-slate-400 italic mb-1">รอการประเมิน</div>
                  )}
                  
                  {ticket.is_verified ? (
                      <div className="flex items-center gap-1 text-emerald-600 font-medium">
                          <ShieldCheck size={12} /> รับรองโดย: {ticket.verified_by}
                      </div>
                  ) : (
                      <div className="flex items-center gap-1 text-orange-500 font-medium">
                          <Clock size={12} /> รอการรับรองการแก้ไข
                      </div>
                  )}
              </div>
          )}

          {/* Location (Priority: Detail > Full Path) */}
          <div className="mt-auto">
            <div className="flex items-start gap-2 mb-2">
              <MapPin size={16} className="text-rose-500 mt-0.5 shrink-0" aria-hidden="true" />
              <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-800 truncate block" title={ticket.address.detail}>
                    {ticket.address.detail}
                  </span>
                  <span className="text-xs text-slate-500 truncate block">
                    {ticket.address.sub_district} › {ticket.address.district} › {ticket.address.province}
                  </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer: Actions */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        {/* Chat Indicator */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${ticket.stats.chat_total > 0 ? 'text-indigo-700' : 'text-slate-500'}`}>
          <MessageCircle size={16} />
          <span>{ticket.stats.chat_total > 0 ? `${ticket.stats.chat_total} ข้อความ` : 'ไม่มีข้อความ'}</span>
        </div>

        {/* Primary CTA Button */}
        <button 
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          aria-label={`จัดการเรื่องแจ้ง ${ticket.title}`}
        >
          จัดการเรื่องแจ้ง
          <ArrowRightLeft size={12} aria-hidden="true" />
        </button>
      </div>

    </div>
  );
};

const QuickFilterBar = ({ currentFilter, onSelect }) => {
    const filters = [
        { id: 'all', label: 'ทั้งหมด', icon: null },
        { id: 'stagnant', label: 'ค้างนาน > 7 วัน', icon: Clock, color: 'text-rose-600 bg-rose-50 border-rose-200' },
        { id: 'reopened', label: 'มีการเปิดซ้ำ', icon: AlertCircle, color: 'text-orange-600 bg-orange-50 border-orange-200' },
        { id: 'unverified', label: 'รอการรับรอง', icon: ShieldCheck, color: 'text-blue-600 bg-blue-50 border-blue-200' },
        { id: 'active', label: 'มีความเคลื่อนไหว', icon: Flame, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {filters.map(f => {
                const Icon = f.icon;
                const isActive = currentFilter === f.id;
                return (
                    <button
                        key={f.id}
                        onClick={() => onSelect(f.id)}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap
                            ${isActive 
                                ? 'bg-slate-800 text-white border-slate-800 shadow-md ring-2 ring-slate-200' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }
                        `}
                        aria-pressed={isActive}
                    >
                        {Icon && <Icon size={14} className={isActive ? 'text-white' : f.color.split(' ')[0]} />}
                        {f.label}
                    </button>
                );
            })}
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
                        aria-label="ค้นหาพื้นที่"
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
                    <button onClick={handleClear} className="text-indigo-500 hover:text-indigo-700 p-1" aria-label="ลบพื้นที่ที่เลือก">
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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
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
                  role="option"
                  aria-selected={selectedValues.includes(option.value)}
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

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-indigo-600 relative group"
      title="คลิกเพื่อคัดลอก Case ID"
      aria-label="คัดลอกรหัสเรื่อง"
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
};

// --- Main Application ---

export default function App() {
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState('all'); 
  
  // State for Filters Form (Controlled Inputs)
  const [filters, setFilters] = useState({
    keyword: "",
    status: [], 
    type: [],   
    officerIds: [], 
    location: null,
    startDate: "",
    endDate: "",
    isReopened: false, // New: Reopened Checkbox
    verification: "all" // New: Verification Status (all, verified, unverified)
  });

  // State for Applied Filters (The logic uses this)
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Sync Quick Filter clicks to Detailed Form
  const handleQuickFilterSelect = (id) => {
      setQuickFilter(id);
      
      const today = new Date();
      let newFilters = { ...filters };

      // Reset specific fields first to clean slate logic
      newFilters.startDate = "";
      newFilters.endDate = "";
      newFilters.status = [];
      newFilters.isReopened = false;
      newFilters.verification = "all";

      if (id === 'stagnant') {
          // Stagnant > 7 days (Exclude finished)
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          newFilters.endDate = formatDateForInput(sevenDaysAgo);
          newFilters.status = ['waiting', 'in_progress', 'forwarded'];
      } else if (id === 'reopened') {
          newFilters.isReopened = true;
      } else if (id === 'unverified') {
          newFilters.status = ['finish'];
          newFilters.verification = "unverified";
      } else if (id === 'active') {
          // Active within 24h
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          newFilters.startDate = formatDateForInput(yesterday);
      }

      setFilters(newFilters);
      setAppliedFilters(newFilters);
      // Auto-open detailed filter if user wants to see what happened? 
      // setIsFilterOpen(true); // Optional: Uncomment if you want to show the filled form immediately
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
    return MOCK_DATA.filter(item => {
      // 1. Keyword (Real-time)
      const searchLower = filters.keyword.toLowerCase();
      const matchKeyword = 
        !filters.keyword ||
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.case_id.toLowerCase().includes(searchLower) ||
        item.hashtags.some(tag => tag.toLowerCase().includes(searchLower));

      // 2. Advanced Filters
      const matchStatus = appliedFilters.status.length === 0 || appliedFilters.status.includes(item.status);
      const matchType = appliedFilters.type.length === 0 || appliedFilters.type.includes(item.type);
      const matchOfficer = appliedFilters.officerIds.length === 0 || item.officer_ids.some(id => appliedFilters.officerIds.includes(id));
      
      const matchLocation = !appliedFilters.location || (
          item.address.province === appliedFilters.location.province &&
          item.address.district === appliedFilters.location.district &&
          item.address.sub_district === appliedFilters.location.sub_district
      );

      let matchDate = true;
      const itemDate = new Date(item.timestamp).getTime();
      
      if (appliedFilters.startDate) matchDate = matchDate && itemDate >= new Date(appliedFilters.startDate).getTime();
      if (appliedFilters.endDate) matchDate = matchDate && itemDate <= new Date(appliedFilters.endDate).setHours(23,59,59);

      // New Filters Logic
      const matchReopen = !appliedFilters.isReopened || item.reopen_count > 0;
      
      let matchVerification = true;
      if (appliedFilters.verification === 'verified') matchVerification = item.is_verified === true;
      if (appliedFilters.verification === 'unverified') matchVerification = item.is_verified === false;

      return matchKeyword && matchStatus && matchType && matchOfficer && matchLocation && matchDate && matchReopen && matchVerification;
    });
  }, [filters.keyword, appliedFilters]);

  const stats = {
    total: MOCK_DATA.length,
    filtered: filteredData.length,
    waiting: filteredData.filter(i => i.status === 'waiting').length,
    forwarded: filteredData.filter(i => i.status === 'forwarded').length,
    done: filteredData.filter(i => i.status === 'finish').length,
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="text-indigo-600" aria-hidden="true" />
                ระบบจัดการเรื่องแจ้ง
              </h1>
              <p className="text-slate-500 text-sm mt-1">Operational Dashboard</p>
            </div>
            
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 sm:pb-0">
               {[
                 { label: "ทั้งหมด", val: stats.total, color: "text-slate-900" },
                 { label: "เสร็จสิ้น", val: stats.done, color: "text-emerald-700" },
                 { label: "รอรับเรื่อง", val: stats.waiting, color: "text-rose-700" },
                 { label: "ส่งต่อ", val: stats.forwarded, color: "text-blue-700" },
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center px-2 sm:px-0 min-w-[60px]">
                    <span className="text-[10px] text-slate-500 uppercase font-medium">{stat.label}</span>
                    <span className={`text-xl font-bold ${stat.color}`}>{stat.val}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            
            {/* Quick Filter Bar (Now populates form) */}
            <QuickFilterBar currentFilter={quickFilter} onSelect={handleQuickFilterSelect} />

            {/* Main Search & Toggles */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} aria-hidden="true" />
                <input 
                  type="text"
                  placeholder="ค้นหา (Keyword, ID, Hashtag...)"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm placeholder:text-slate-400"
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  aria-label="ค้นหาเรื่องแจ้ง"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors ${isFilterOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                  aria-expanded={isFilterOpen}
                >
                  <Filter size={18} aria-hidden="true" />
                  <span>ตัวกรองละเอียด</span>
                  <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                
                 <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`} aria-label="มุมมองตาราง"><LayoutGrid size={18} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`} aria-label="มุมมองรายการ"><ListIcon size={18} /></button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            {isFilterOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                
                {/* Status */}
                <MultiSelectDropdown 
                  label="สถานะ"
                  options={statusOptions}
                  selectedValues={filters.status}
                  onChange={(val) => handleFilterChange('status', val)}
                />
                
                {/* Type */}
                <MultiSelectDropdown 
                  label="ประเภทเรื่อง"
                  options={typeOptions}
                  selectedValues={filters.type}
                  onChange={(val) => handleFilterChange('type', val)}
                  enableSearch={true}
                />

                {/* Location */}
                <div className="lg:col-span-2">
                   <LocationAutocomplete 
                      data={MOCK_DATA}
                      selectedLocation={filters.location}
                      onSelect={(loc) => handleFilterChange('location', loc)}
                   />
                </div>

                {/* Officer */}
                <MultiSelectDropdown 
                  label="จนท. รับผิดชอบ"
                  options={OFFICER_OPTIONS}
                  selectedValues={filters.officerIds}
                  onChange={(val) => handleFilterChange('officerIds', val)}
                  enableSearch={true}
                />

                {/* Verification (New) */}
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

                {/* Date Range */}
                <div className="lg:col-span-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1">ช่วงเวลาแจ้งเหตุ</label>
                   <div className="flex gap-2">
                      <input 
                        type="date" 
                        className="w-1/2 p-2 rounded-md border border-slate-300 text-sm shadow-sm"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        aria-label="วันเริ่มต้น"
                      />
                      <input 
                        type="date" 
                        className="w-1/2 p-2 rounded-md border border-slate-300 text-sm shadow-sm"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                         aria-label="วันสิ้นสุด"
                      />
                   </div>
                </div>

                {/* Reopen Checkbox (New) */}
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

                {/* Filter Actions */}
                <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                   <div className="flex gap-2">
                       {/* Save Search Button (Labeled) */}
                       <button 
                          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 hover:border-indigo-100 text-sm font-medium" 
                          onClick={() => alert('ฟีเจอร์บันทึกตัวกรองจะเปิดใช้งานเร็วๆ นี้')}
                       >
                          <Bookmark size={16} />
                          บันทึกเงื่อนไข
                       </button>
                       {/* Set Default Button (Labeled) */}
                       <button 
                          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 hover:border-indigo-100 text-sm font-medium" 
                          onClick={() => alert('ฟีเจอร์ตั้งค่าเริ่มต้นจะเปิดใช้งานเร็วๆ นี้')}
                       >
                          <Settings size={16} />
                          ตั้งเป็นค่าเริ่มต้น
                       </button>
                   </div>

                   <div className="flex gap-3">
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
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-4">
             <div className="text-sm text-slate-600">
                พบ <span className="font-bold text-slate-900">{filteredData.length}</span> รายการ 
                <span className="text-slate-400 mx-1">|</span> 
                จากทั้งหมด {stats.total}
             </div>
        </div>

        {filteredData.length === 0 ? (
           <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={28} />
             </div>
             <h3 className="text-lg font-medium text-slate-900">ไม่พบรายการที่ค้นหา</h3>
             <p className="text-slate-500">ลองปรับเปลี่ยนตัวกรองหรือเลือกตัวกรองด่วนอื่น</p>
             <button onClick={resetFilters} className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">ล้างตัวกรองทั้งหมด</button>
           </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredData.map((ticket) => (
              <CaseCard key={ticket.case_id} ticket={ticket} viewMode={viewMode} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}