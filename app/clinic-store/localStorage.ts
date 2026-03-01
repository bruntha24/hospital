// ----------------------
// SLOT TYPES
// ----------------------
export interface Slot {
  id: string; // was number
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  maxPatients: number;
  bookedCount: number;
}

export const getSlots = (): Slot[] => {
  if (typeof window === "undefined") return [];
  // convert old number IDs to string just in case
  return JSON.parse(localStorage.getItem("clinicSlots") || "[]").map((s: any) => ({
    ...s,
    id: String(s.id),
  }));
};

export const saveSlots = (slots: Slot[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("clinicSlots", JSON.stringify(slots));
  }
};

// ----------------------
// APPOINTMENT TYPES
// ----------------------
export interface Appointment {
  id: string; // was number
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  reason: string;
  date: string;
  time: string;
  type: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  doctorNotes: string;
}

export const getAppointments = (): Appointment[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("clinicAppointments") || "[]").map((a: any) => ({
    ...a,
    id: String(a.id),
  }));
};

export const saveAppointments = (appointments: Appointment[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("clinicAppointments", JSON.stringify(appointments));
  }
};

// ----------------------
// DOCTOR AUTH
// ----------------------
export const setDoctorAuth = (value: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("isDoctorLoggedIn", JSON.stringify(value));
  }
};

export const getDoctorAuth = (): boolean => {
  if (typeof window === "undefined") return false;
  return JSON.parse(localStorage.getItem("isDoctorLoggedIn") || "false");
};

export const logoutDoctor = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isDoctorLoggedIn");
  }
};