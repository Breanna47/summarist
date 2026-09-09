"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheck } from "react-icons/fi";

type Plan = "monthly" | "yearly";

export default function ChoosePlanPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("yearly");

  const handleSubscribe = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <main className="choose-plan">
      <section className="choose-plan__hero">
        <button className="choose-plan__back" onClick={() => router.back()}>
          ← Back
        </button>

        <div className="choose-plan__content">
          <h1 className="choose-plan__title">
            Get unlimited access to many amazing books to read
          </h1>

          <p className="choose-plan__subtitle">
            Turn ordinary moments into amazing learning opportunities.
          </p>

          <div className="choose-plan__benefits">
            <div className="choose-plan__benefit">
              <FiCheck />
              <span>Key ideas in just a few minutes</span>
            </div>

            <div className="choose-plan__benefit">
              <FiCheck />
              <span>Unlimited reading and listening</span>
            </div>

            <div className="choose-plan__benefit">
              <FiCheck />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <section className="choose-plan__plans">
        <h2 className="choose-plan__plans-title">
          Choose the plan that fits you
        </h2>

        <div className="plans__wrapper">
          <button
            className={`plan__card ${
              selectedPlan === "yearly" ? "plan__card--selected" : ""
            }`}
            onClick={() => setSelectedPlan("yearly")}
          >
            <div className="plan__badge">Most popular</div>

            <div>
              <h3>Premium Plus Yearly</h3>
              <p className="plan__price">$99.99/year</p>
              <p className="plan__description">7-day free trial included</p>
            </div>

            <div className="plan__radio">
              {selectedPlan === "yearly" && (
                <div className="plan__radio-inner" />
              )}
            </div>
          </button>

          <div className="plan__divider">
            <span />
            <p>or</p>
            <span />
          </div>

          <button
            className={`plan__card ${
              selectedPlan === "monthly" ? "plan__card--selected" : ""
            }`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <div>
              <h3>Premium Monthly</h3>
              <p className="plan__price">$9.99/month</p>
              <p className="plan__description">Unlimited access to all books</p>
            </div>

            <div className="plan__radio">
              {selectedPlan === "monthly" && (
                <div className="plan__radio-inner" />
              )}
            </div>
          </button>

          <button className="choose-plan__subscribe" onClick={handleSubscribe}>
            {selectedPlan === "yearly"
              ? "Start your free 7-day trial"
              : "Subscribe"}
          </button>

          <p className="choose-plan__fine-print">
            Cancel your subscription at any time.
          </p>
        </div>
      </section>

      <section className="choose-plan__faq">
        <h2>Frequently asked questions</h2>

        <details>
          <summary>How does the free trial work?</summary>
          <p>
            The yearly plan includes a 7-day free trial. You can cancel before
            the trial ends if you do not want to continue.
          </p>
        </details>

        <details>
          <summary>Can I cancel my subscription?</summary>
          <p>Yes. You can cancel your subscription at any time.</p>
        </details>

        <details>
          <summary>What do I get with Premium?</summary>
          <p>
            Premium gives you access to Summarist&apos;s premium books,
            summaries, and audio content.
          </p>
        </details>
      </section>
    </main>
  );
}
