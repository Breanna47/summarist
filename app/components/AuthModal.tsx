"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onClose();
      setEmail("");
      setPassword("");
      router.push("/for-you");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, "guest@summarist.com", "guest123");

      onClose();
      router.push("/for-you");
    } catch {
      setError("Guest account is not set up yet. We will create it next.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__overlay" onClick={onClose}>
      <div className="auth__modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth__close" onClick={onClose}>
          ×
        </button>

        <h2 className="auth__title">
          {mode === "login" ? "Log in to Summarist" : "Create your account"}
        </h2>

        <button
          className="auth__guest"
          onClick={handleGuestLogin}
          disabled={loading}
        >
          Login as a Guest
        </button>

        <div className="auth__divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="auth__input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth__error">{error}</p>}

          <button className="auth__submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Register"}
          </button>
        </form>

        <button
          className="auth__switch"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
