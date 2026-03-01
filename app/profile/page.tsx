"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Edit3,
  Heart,
  Activity,
  Pill,
  Droplets,
  LogOut,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

// Framer Motion variants
const container: Variants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { staggerChildren: 0.07, delayChildren: 0.15 } 
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 200, damping: 25 } 
  },
};

// Typed health stats
interface HealthStat {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  color: string;
  bg: string;
}

const healthStats: HealthStat[] = [
  { icon: Heart, label: "Heart Rate", value: "72 bpm", color: "text-red-500", bg: "bg-red-100" },
  { icon: Droplets, label: "Blood Type", value: "O+", color: "text-blue-500", bg: "bg-blue-100" },
  { icon: Activity, label: "BP", value: "120/80", color: "text-indigo-500", bg: "bg-indigo-100" },
  { icon: Pill, label: "Allergies", value: "None", color: "text-amber-500", bg: "bg-amber-100" },
];

// Typed user object
interface User {
  name: string;
  email: string;
  mobile: string;
  image?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      const parsed: User = JSON.parse(storedUser);
      setUser(parsed);
      setTempUser(parsed);
      setImagePreview(parsed.image || null);
    }
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && tempUser) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setTempUser({ ...tempUser, image: url });
    }
  };

  const saveEdits = () => {
    if (tempUser) {
      setUser(tempUser);
      localStorage.setItem("userProfile", JSON.stringify(tempUser));
      setEditing(false);
    }
  };

  const cancelEdits = () => {
    if (user) {
      setTempUser(user);
      setEditing(false);
      setImagePreview(user.image || null);
    }
  };

  if (!user || !tempUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        No user found. Please log in.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-24">
      {/* HEADER */}
      <motion.div
        className="relative h-72 md:h-96 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-white" />

        {/* Slow ECG Pulse */}
        <motion.svg
          viewBox="0 0 800 100"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[300%] opacity-20"
          initial={{ x: "-50%" }}
          animate={{ x: "0%" }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        >
          <polyline
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            points="
              0,50 40,50 60,30 80,70 100,50 140,50 160,35 180,65
              200,50 240,50 260,25 280,75 300,50 340,50 360,30
              380,70 400,50 440,50 460,25 480,75 500,50 540,50
              560,35 580,65 600,50 640,50 660,30 680,70 700,50
              740,50 760,25 780,75 800,50
            "
          />
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </motion.svg>

        {/* Back button */}
        <div className="absolute top-0 left-0 p-4 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-blue-700" />
          </motion.button>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="relative max-w-xl mx-auto px-4">
        {/* Avatar */}
        <motion.div
          className="absolute -top-24 left-1/2 -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="relative cursor-pointer">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white"
              onClick={() => editing && document.getElementById("avatarInput")?.click()}
            >
              <img
                src={
                  imagePreview ||
                  tempUser.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    tempUser.name
                  )}&background=60a5fa&color=ffffff&size=256`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Camera overlay */}
            {editing && (
              <label
                htmlFor="avatarInput"
                className="absolute bottom-1 right-1 cursor-pointer w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
              >
                <Camera size={18} />
              </label>
            )}
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </motion.div>

        {/* User Info */}
        <div className="pt-28 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 relative">
            {editing ? (
              <input
                value={tempUser.name}
                onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                className="border-b border-blue-300 text-xl font-bold text-blue-900 text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            ) : (
              <h1 className="text-3xl font-bold text-blue-900">{user.name}</h1>
            )}

            <Edit3
              size={18}
              className="text-blue-700 cursor-pointer absolute right-0 -top-1"
              onClick={() => setEditing(!editing)}
            />
          </div>

          {/* Email & Mobile */}
          {editing ? (
            <div className="space-y-2 mt-2">
              <input
                value={tempUser.email}
                onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                className="w-full text-center border-b border-blue-300 text-sm text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <input
                value={tempUser.mobile}
                onChange={(e) => setTempUser({ ...tempUser, mobile: e.target.value })}
                className="w-full text-center border-b border-blue-300 text-sm text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          ) : (
            <div className="space-y-1 mt-1">
              <p className="text-blue-800 text-sm">{user.email}</p>
              <p className="text-blue-800 text-sm">📱 {user.mobile}</p>
            </div>
          )}

          {/* Save / Cancel buttons */}
          {editing && (
            <div className="flex justify-center gap-2 mt-2">
              <Button
                onClick={saveEdits}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm h-9 px-3 rounded-md"
              >
                <Check size={14} /> Save
              </Button>
              <Button
                onClick={cancelEdits}
                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm h-9 px-3 rounded-md"
              >
                <X size={14} /> Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Health Stats */}
        <motion.div
          className="grid grid-cols-4 gap-3 mt-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {healthStats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-3 text-center shadow"
            >
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}
              >
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className="text-xs text-blue-800">{stat.label}</p>
              <p className="text-sm font-bold mt-0.5 text-blue-900">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* View Appointments */}
        <div className="mt-6">
          <Button
            onClick={() => router.push("/view-appointment")}
            className="w-full rounded-2xl h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            View Appointments
          </Button>
        </div>

        {/* Logout */}
        <div className="mt-4 mb-4">
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("userProfile");
              router.push("/login");
            }}
            className="w-full rounded-2xl h-14 border-red-400/40 text-red-500 hover:bg-red-50 font-semibold gap-2"
          >
            <LogOut size={20} />
            Sign Out
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}