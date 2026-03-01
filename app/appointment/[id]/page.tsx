"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { doctors, timeSlots } from "@/lib/mock-data";
import { DAYS, MONTHS } from "@/lib/constants";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Slot {
  time: string;
  period: "morning" | "afternoon" | "evening";
  availableCount: number;
}

export default function AppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const doctor = doctors.find((d) => d.id.toString() === id);

  if (!doctor)
    return (
      <div className="p-10 text-center text-black text-lg font-semibold">
        Doctor not found
      </div>
    );

  const today = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [favoriteSlot, setFavoriteSlot] = useState<string | null>(null);

  // Slot availability state per doctor per date
  const [slotAvailability, setSlotAvailability] = useState<Record<string, Slot[]>>({});

  // Generate unique key for doctor + date
  const getDateKey = () => `${doctor.id}-${currentYear}-${currentMonth + 1}-${selectedDate}`;

  // Load saved slot availability from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("slotAvailability");
    if (saved) {
      setSlotAvailability(JSON.parse(saved));
    }
  }, []);

  // Initialize currentSlots for selected date
  const getSlotsForDate = (): Slot[] => {
    const key = getDateKey();
    if (!slotAvailability[key]) {
      // Default 2 slots per time
      const newSlots = timeSlots.map((s) => ({ ...s, availableCount: 2 }));
      setSlotAvailability((prev) => ({ ...prev, [key]: newSlots }));
      return newSlots;
    }
    return slotAvailability[key];
  };

  const [currentSlots, setCurrentSlots] = useState<Slot[]>(getSlotsForDate());

  // Update currentSlots when date/month/year changes
  useEffect(() => {
    setCurrentSlots(getSlotsForDate());
    setSelectedSlot(null);
  }, [selectedDate, currentMonth, currentYear, slotAvailability]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isPastDate = (day: number) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    return dateToCheck < todayStart;
  };

  const getDayOfWeek = (day: number) => new Date(currentYear, currentMonth, day).getDay();

  // Split slots
  const morningSlots = currentSlots.filter((s) => s.period === "morning");
  const afternoonSlots = currentSlots.filter((s) => s.period === "afternoon");
  const eveningSlots = currentSlots.filter((s) => s.period === "evening");

  // Generate a random token between 1–24 that is not already used for this doctor+date
  const generateToken = (doctorId: string, date: string) => {
    const existingAppts = JSON.parse(localStorage.getItem("appointments") || "[]") as any[];
    const usedTokens = existingAppts
      .filter((a) => a.doctorId === doctorId && a.date === date)
      .map((a) => a.token);
    const availableTokens = Array.from({ length: 24 }, (_, i) => i + 1).filter((t) => !usedTokens.includes(t));
    if (availableTokens.length === 0) return Math.floor(Math.random() * 24) + 1; // fallback
    return availableTokens[Math.floor(Math.random() * availableTokens.length)];
  };

  const handleBook = () => {
    if (!selectedSlot) return;

    const key = getDateKey();
    const slotIndex = slotAvailability[key].findIndex((s) => s.time === selectedSlot);
    if (slotIndex === -1) return;

    // Reduce count
    const updatedSlots = [...slotAvailability[key]];
    updatedSlots[slotIndex].availableCount = Math.max(updatedSlots[slotIndex].availableCount - 1, 0);

    // Save updated slots to state & localStorage
    const updatedAvailability = { ...slotAvailability, [key]: updatedSlots };
    setSlotAvailability(updatedAvailability);
    localStorage.setItem("slotAvailability", JSON.stringify(updatedAvailability));

    setCurrentSlots(updatedSlots);

    // Save appointment with token < 25
    const formattedDate = `${MONTHS[currentMonth]} ${selectedDate}, ${currentYear}`;
    const token = generateToken(doctor.id, formattedDate);

    const existing = localStorage.getItem("appointments");
    const updatedAppts = existing
      ? [...JSON.parse(existing), { doctorId: doctor.id, date: formattedDate, time: selectedSlot, status: "Active", token }]
      : [{ doctorId: doctor.id, date: formattedDate, time: selectedSlot, status: "Active", token }];
    localStorage.setItem("appointments", JSON.stringify(updatedAppts));

    setSelectedSlot(null);

    // Navigate to success
    router.push(
      `/appointment/success?id=${doctor.id}&date=${encodeURIComponent(
        formattedDate
      )}&time=${encodeURIComponent(selectedSlot)}`
    );
  };

  const SlotGroup = ({ title, slots }: { title: string; slots: Slot[] }) => {
    return (
      <div className="mb-10">
        <h3 className="text-lg font-bold text-black mb-5 tracking-wide">{title}</h3>
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot) => (
            <div key={slot.time} className="flex flex-col items-center w-full">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={slot.availableCount === 0}
                onClick={() => setSelectedSlot(slot.time)}
                title={slot.availableCount === 0 ? "Fully booked" : ""}
                className={`relative py-3 rounded-xl text-sm font-semibold border w-full transition
                  ${
                    slot.availableCount === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:cursor-not-allowed"
                      : selectedSlot === slot.time
                      ? "bg-teal-600 text-white border-teal-600 shadow-md"
                      : "bg-white text-black border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {slot.time}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavoriteSlot(favoriteSlot === slot.time ? null : slot.time);
                  }}
                  className="absolute top-1 right-1 cursor-pointer"
                >
                  <Star
                    size={14}
                    className={`transition ${favoriteSlot === slot.time ? "text-teal-600 fill-teal-600" : "text-gray-300"}`}
                  />
                </span>
              </motion.button>
              <span className="mt-1 text-xs text-gray-600 font-medium">
                {slot.availableCount > 0 ? `${slot.availableCount} slots left` : "Fully booked"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col pb-28 max-w-6xl mx-auto relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-white shadow-md hover:shadow-lg transition font-semibold text-black"
        >
          Back
        </button>
      </div>

      {/* Doctor Header */}
      <div className="relative">
        <div className="h-64 rounded-b-[3rem] shadow-2xl bg-cover bg-center" style={{ backgroundImage: `url('/clinic.avif')` }} />
        <div className="flex justify-center -mt-28 relative z-10">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-52 h-52 rounded-3xl object-cover shadow-xl border-4 border-white"
          />
        </div>
        <div className="px-6 sm:px-12 mt-6 text-center">
          <h1 className="text-3xl font-extrabold text-black">{doctor.name}</h1>
          <p className="text-blue-700 mt-2 text-lg font-semibold">{doctor.specialty}</p>
        </div>
      </div>

      {/* Calendar + Slots */}
      <div className="px-4 sm:px-12 mt-12 rounded-3xl relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/clinic.avif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.9)",
            zIndex: 0,
          }}
        />
        <div className="relative z-10 space-y-8">
          {/* Calendar */}
          <div className="bg-white/80 p-6 rounded-3xl shadow-lg border border-gray-100 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">
                <ChevronLeft className="text-blue-700 w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-black">{MONTHS[currentMonth]} {currentYear}</h2>
              <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">
                <ChevronRight className="text-blue-700 w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center mb-4 text-sm font-bold">
              {DAYS.map((d, idx) => (
                <div key={d} className={idx === 0 || idx === 6 ? "text-red-500" : "text-gray-700"}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
              {dates.map((day) => {
                const past = isPastDate(day);
                const dayOfWeek = getDayOfWeek(day);
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                return (
                  <button
                    key={day}
                    disabled={past}
                    onClick={() => !past && setSelectedDate(day)}
                    className={`py-3 rounded-xl border font-bold transition ${
                      past
                        ? "bg-gray-100 text-gray-400 border-gray-200"
                        : selectedDate === day
                        ? "bg-teal-600 text-white border-teal-600 shadow-md"
                        : isWeekend
                        ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                        : "bg-white text-black border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots */}
          <div className="bg-white/80 p-6 rounded-3xl shadow-lg border border-gray-100 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-8 text-black">Available Slots</h2>
            <SlotGroup title="Morning" slots={morningSlots} />
            <SlotGroup title="Afternoon" slots={afternoonSlots} />
            <SlotGroup title="Evening" slots={eveningSlots} />
          </div>
        </div>
      </div>

      {/* Book Button */}
      <div className="px-4 sm:px-12 mt-6 flex justify-center">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleBook}
          disabled={!selectedSlot}
          className={`w-full max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-3rem)] py-4 rounded-xl font-bold text-lg transition
            ${selectedSlot ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
        >
          Book Appointment
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}