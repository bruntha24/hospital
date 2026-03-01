"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getSlots,
  saveSlots,
  getAppointments,
  saveAppointments,
  Slot,
  Appointment,
} from "@/app/clinic-store/localStorage";
import { toast } from "sonner";

const BookAppointment = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [consultType, setConsultType] = useState("In-Person");

  // View
  const [activeView, setActiveView] = useState<"book" | "my">("book");
  const [patientEmail, setPatientEmail] = useState("");

  useEffect(() => {
    setSlots(getSlots());
    setAppointments(getAppointments());
  }, []);

  const groupedSlots = useMemo(() => {
    const groups: Record<string, Slot[]> = {};
    slots.forEach((s) => {
      if (!groups[s.date]) groups[s.date] = [];
      groups[s.date].push(s);
    });
    return groups;
  }, [slots]);

  const myAppointments = useMemo(() => {
    if (!patientEmail) return [];
    return appointments.filter((a) => a.email.toLowerCase() === patientEmail.toLowerCase());
  }, [appointments, patientEmail]);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return toast.error("Please select a time slot");
    if (phone.length < 10) return toast.error("Please enter a valid phone number");
    if (!email.includes("@")) return toast.error("Please enter a valid email");
    if (selectedSlot.bookedCount >= selectedSlot.maxPatients) return toast.error("Slot fully booked");

    const newAppt: Appointment = {
      id: crypto.randomUUID(), // string id
      patientName: name,
      age,
      gender,
      phone,
      email,
      reason: symptoms,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      type: consultType,
      status: "Pending",
      doctorNotes: "",
    };

    const updatedSlots = slots.map((s) =>
      s.id === selectedSlot.id ? { ...s, bookedCount: s.bookedCount + 1 } : s
    );
    const updatedAppts = [...appointments, newAppt];

    saveSlots(updatedSlots);
    saveAppointments(updatedAppts);
    setSlots(updatedSlots);
    setAppointments(updatedAppts);

    // Reset form
    setName("");
    setAge("");
    setGender("");
    setPhone("");
    setEmail("");
    setSymptoms("");
    setSelectedSlot(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    toast.success("Appointment booked successfully!");
  };

  const handleCancelAppointment = (id: string) => {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    const updatedAppts = appointments.map((a) =>
      a.id === id ? { ...a, status: "Cancelled" as const } : a
    );
    const updatedSlots = slots.map((s) => {
      if (s.date === appt.date && appt.time >= s.startTime && appt.time <= s.endTime) {
        return { ...s, bookedCount: Math.max(0, s.bookedCount - 1) };
      }
      return s;
    });

    saveAppointments(updatedAppts);
    saveSlots(updatedSlots);
    setAppointments(updatedAppts);
    setSlots(updatedSlots);
    toast.success("Appointment cancelled");
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "orange",
      Confirmed: "green",
      Completed: "blue",
      Cancelled: "red",
    };
    return (
      <span
        style={{
          backgroundColor: colors[status] || "gray",
          color: "white",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "12px",
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "1rem" }}>
      {/* Success Modal */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "320px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Booked Successfully!</h3>
            <p style={{ fontSize: "0.85rem", color: "#555" }}>
              Your appointment request has been submitted.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Book Appointment</h1>
        <div style={{ marginTop: "0.5rem" }}>
          <button
            onClick={() => setActiveView("book")}
            style={{
              marginRight: "0.5rem",
              padding: "0.5rem 1rem",
              background: activeView === "book" ? "#4ade80" : "#ddd",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Book
          </button>
          <button
            onClick={() => setActiveView("my")}
            style={{
              padding: "0.5rem 1rem",
              background: activeView === "my" ? "#4ade80" : "#ddd",
              border: "none",
              borderRadius: "8px",
            }}
          >
            My Appointments
          </button>
        </div>
      </header>

      {activeView === "book" && (
        <>
          {/* Available Slots */}
          <div style={{ marginBottom: "1rem" }}>
            <h2>Available Slots</h2>
            {Object.keys(groupedSlots).length === 0 ? (
              <p>No slots available.</p>
            ) : (
              Object.entries(groupedSlots).map(([date, dateSlots]) => (
                <div key={date} style={{ marginBottom: "0.5rem" }}>
                  <p style={{ fontWeight: "bold" }}>{date}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {dateSlots.map((slot) => {
                      const full = slot.bookedCount >= slot.maxPatients;
                      const selected = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          disabled={full}
                          onClick={() => setSelectedSlot(selected ? null : slot)}
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            background: selected ? "#4ade80" : "#fff",
                            opacity: full ? 0.5 : 1,
                            cursor: full ? "not-allowed" : "pointer",
                          }}
                        >
                          {slot.startTime} – {slot.endTime} ({slot.type})
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBook} style={{ maxWidth: "600px" }}>
            {/* Name, Age, Gender, Phone, Email, Symptoms */}
            {/* ... (same as before, no changes needed) */}
          </form>
        </>
      )}

      {/* My Appointments */}
      {activeView === "my" && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", width: "250px" }}
            />
            <button
              onClick={() => setAppointments(getAppointments())}
              style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", background: "#4ade80" }}
            >
              Search
            </button>
          </div>
          {patientEmail && (
            <div>
              {myAppointments.length === 0 ? (
                <p>No appointments found for this email</p>
              ) : (
                myAppointments.map((appt) => (
                  <div key={appt.id} style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div>
                          <strong>Appointment #{appt.id}</strong> {statusBadge(appt.status)}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#555" }}>
                          {appt.date} • {appt.time} • {appt.type}
                        </div>
                      </div>
                      {(appt.status === "Pending" || appt.status === "Confirmed") && (
                        <button
                          onClick={() => handleCancelAppointment(appt.id)}
                          style={{ padding: "0.25rem 0.5rem", background: "red", color: "#fff", border: "none", borderRadius: "6px" }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookAppointment;