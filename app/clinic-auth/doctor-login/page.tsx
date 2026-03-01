"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setDoctorAuth, getDoctorAuth } from "@/app/clinic-store/localStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Stethoscope, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const DOCTOR_USERNAME = "doctor";
const DOCTOR_PASSWORD = "clinic123";

export default function DoctorLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getDoctorAuth()) router.push("/clinic-doctor/manage-schedule");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (username === DOCTOR_USERNAME && password === DOCTOR_PASSWORD) {
        setDoctorAuth(true);
        toast.success("Welcome back, Doctor!", { description: "Redirecting to dashboard..." });
        router.push("/clinic-doctor/manage-schedule");
      } else {
        toast.error("Invalid credentials", { description: "Please try again." });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating bubbles */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 animate-float" />
      <div className="absolute bottom-32 right-24 w-24 h-24 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white/10 animate-float" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-3">
            <motion.div
              className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Stethoscope className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Doctor Portal</h1>
            <p className="text-white/70 text-sm">Sign in to manage your clinic</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="space-y-2"
            >
              <Label className="text-white/80 text-sm font-medium">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-white/50 focus:ring-white/20"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-2"
            >
              <Label className="text-white/80 text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-white/50 focus:ring-white/20"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white/80 text-teal-700 font-semibold hover:bg-white/90 h-11 text-base active:scale-95 transition-all duration-200 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-center"
          >
            <p className="text-white/50 text-xs">
              Demo: username <span className="font-mono text-white/80">doctor</span> / password <span className="font-mono text-white/80">clinic123</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}