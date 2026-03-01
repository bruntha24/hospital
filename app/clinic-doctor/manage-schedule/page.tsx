"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  getDoctorAuth,
  logoutDoctor,
  getSlots,
  saveSlots,
  getAppointments,
  saveAppointments,
  Slot,
  Appointment,
} from "@/app/clinic-store/localStorage";
import { toast } from "sonner";
import { Plus, X, LogOut, CalendarDays, Clock, Check, CheckCircle2, Stethoscope } from "lucide-react";

export default function ManageSchedule() {
  const router = useRouter();

  const [online, setOnline] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Slot form
  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [consultType, setConsultType] = useState("In-Person");
  const [maxPatients, setMaxPatients] = useState("5");

  // Redirect if doctor is not logged in
  useEffect(() => {
    if (!getDoctorAuth()) {
      router.push("/clinic-auth/doctor-login");
      return;
    }
    setSlots(getSlots());
    setAppointments(getAppointments());
  }, [router]);

  const refreshData = () => {
    setSlots(getSlots());
    setAppointments(getAppointments());
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppts = appointments.filter((a) => a.date === today);
    return {
      totalToday: todayAppts.length,
      pending: appointments.filter((a) => a.status === "Pending").length,
      confirmed: appointments.filter((a) => a.status === "Confirmed").length,
      completed: appointments.filter((a) => a.status === "Completed").length,
    };
  }, [appointments]);

  // --- Slot functions ---
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    if (slotDate < today) {
      toast.error("Cannot add slots for past dates");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    const duplicate = slots.find(
      (s) => s.date === slotDate && s.startTime === startTime && s.endTime === endTime
    );
    if (duplicate) {
      toast.error("Duplicate time slot already exists");
      return;
    }

    const newSlot: Slot = {
      id: crypto.randomUUID(), // unique id
      date: slotDate,
      startTime,
      endTime,
      type: consultType,
      maxPatients: parseInt(maxPatients),
      bookedCount: 0,
    };

    const updated = [...slots, newSlot].sort(
      (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
    );

    saveSlots(updated);
    setSlots(updated);
    setSlotDate("");
    setStartTime("");
    setEndTime("");
    toast.success("Slot added successfully!");
  };

  const handleDeleteSlot = (id: string) => {
    const updated = slots.filter((s) => s.id !== id);
    saveSlots(updated);
    setSlots(updated);
    toast.success("Slot removed");
  };

  const handleLogout = () => {
    logoutDoctor();
    router.push("/clinic-auth/doctor-login");
  };

  const statusBadge = (status: string) => {
    const cls =
      status === "Pending"
        ? "px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 text-xs"
        : status === "Confirmed"
        ? "px-2 py-0.5 rounded bg-blue-200 text-blue-800 text-xs"
        : status === "Completed"
        ? "px-2 py-0.5 rounded bg-green-200 text-green-800 text-xs"
        : "px-2 py-0.5 rounded bg-red-200 text-red-800 text-xs";
    return <span className={cls}>{status}</span>;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-600 to-blue-400 text-white flex flex-col min-h-screen p-6">
        {/* Doctor Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Dr. John Smith</h2>
            <p className="text-xs text-white/70">Cardiologist</p>
          </div>
        </div>

        {/* Online Toggle */}
        <div className="flex items-center justify-between bg-white/20 rounded-lg px-4 py-3 mb-6">
          <span className="text-sm">{online ? "Online" : "Offline"}</span>
          <input
            type="checkbox"
            checked={online}
            onChange={(e) => setOnline(e.target.checked)}
            className="h-4 w-4 accent-white"
          />
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {[{ label: "Today", value: stats.totalToday, icon: CalendarDays },
            { label: "Pending", value: stats.pending, icon: Clock },
            { label: "Confirmed", value: stats.confirmed, icon: Check },
            { label: "Completed", value: stats.completed, icon: CheckCircle2 }].map((s, i) => (
            <div
              key={s.label}
              className="flex items-center gap-3 bg-white/20 rounded-lg px-4 py-3 cursor-default"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <s.icon className="w-4 h-4 text-white/80" />
              <span className="text-sm flex-1">{s.label}</span>
              <span className="font-bold text-lg">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-start px-4 py-2 rounded bg-white/20 hover:bg-white/30"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Slots</h1>

        {/* Add Slot Form */}
        <form className="space-y-4 max-w-md mb-8" onSubmit={handleAddSlot}>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Consultation Type</label>
            <select value={consultType} onChange={(e) => setConsultType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Patients</label>
            <input type="number" min={1} value={maxPatients} onChange={(e) => setMaxPatients(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Slot
          </button>
        </form>

        {/* Slots List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Slots</h2>
          {slots.length === 0 ? (
            <p>No slots added yet.</p>
          ) : (
            <ul className="space-y-2">
              {slots.map((s) => (
                <li
                  key={s.id}
                  className="flex justify-between items-center border p-2 rounded-md bg-white/20"
                >
                  <div>{s.date} | {s.startTime}-{s.endTime} | {s.type} | Max: {s.maxPatients}</div>
                  <button onClick={() => handleDeleteSlot(s.id)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}