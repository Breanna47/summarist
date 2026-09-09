"use client";

import { Suspense, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import AppLayout from "../components/AppLayout";
import AuthModal from "../components/AuthModal";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success === "true") {
      localStorage.setItem("summarist-premium", "true");
      setIsPremium(true);

      router.replace("/settings");
      return;
    }

    const savedPremiumStatus =
      localStorage.getItem("summarist-premium") === "true";

    setIsPremium(savedPremiumStatus);
  }, [searchParams, router]);

  if (loading) {
    return (
      <AppLayout>
        <div className="settings__loading">Loading settings...</div>
      </AppLayout>
    );
  }

  return (
    <>
      <AppLayout>
        <main className="settings">
          <h1 className="settings__title">Settings</h1>

          {!user ? (
            <div className="settings__logged-out">
              <img
                src="/assets/login.png"
                alt="Login"
                className="settings__login-image"
              />

              <h2>Log in to your account</h2>

              <p>Log in to view your subscription and account information.</p>

              <button
                className="settings__login-button"
                onClick={() => setIsAuthOpen(true)}
              >
                Login
              </button>
            </div>
          ) : (
            <div className="settings__account">
              <section className="settings__section">
                <h2>Your Subscription Plan</h2>

                <div className="settings__plan">
                  <div>
                    <p className="settings__label">Plan</p>

                    <p className="settings__value">
                      {isPremium ? "Premium" : "Basic"}
                    </p>
                  </div>

                  {!isPremium && (
                    <button
                      className="settings__upgrade"
                      onClick={() => router.push("/choose-plan")}
                    >
                      Upgrade to Premium
                    </button>
                  )}
                </div>
              </section>

              <section className="settings__section">
                <h2>Email</h2>

                <p className="settings__email">
                  {user.email || "Guest account"}
                </p>
              </section>
            </div>
          )}
        </main>
      </AppLayout>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="settings__loading">Loading settings...</div>
        </AppLayout>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
