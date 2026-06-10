import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
      setLocation("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-16 left-16 text-5xl float">🍔</div>
        <div className="absolute top-32 right-20 text-4xl float-slow">🌮</div>
        <div className="absolute bottom-20 left-24 text-3xl float">🍟</div>
        <div className="absolute bottom-32 right-16 text-4xl float-slow">☕</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground font-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to MacroCutie
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-pink-100 border border-border p-8"
        >
          <div className="text-center mb-7">
            <div className="w-14 h-14 gradient-pink rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200 mx-auto mb-4">
              <span className="text-2xl">🍓</span>
            </div>
            <h1 className="text-2xl font-900 text-foreground">
              {mode === "login" ? "Welcome back!" : "Join MacroCutie"}
            </h1>
            <p className="text-foreground/50 font-500 text-sm mt-1">
              {mode === "login"
                ? "Sign in to track your meals and history"
                : "Create a free account to save your meals"}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-muted rounded-2xl p-1 mb-6">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-700 transition-all ${
                  mode === m
                    ? "bg-white shadow-sm text-foreground"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-700 text-foreground mb-1.5">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="What should we call you?"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-border focus:border-primary focus:outline-none font-500 text-sm transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-700 text-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-border focus:border-primary focus:outline-none font-500 text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-700 text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-2xl border-2 border-border focus:border-primary focus:outline-none font-500 text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl px-4 py-3 text-sm font-600"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-pink text-white py-3.5 rounded-2xl font-800 shadow-lg shadow-pink-200 hover:scale-105 transition-transform disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {mode === "login" ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5 font-500">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-primary font-700 hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
        </motion.div>

        <p className="text-center text-xs text-foreground/40 mt-4 font-500">
          Your meal data stays private and belongs to you.
        </p>
      </div>
    </div>
  );
}
