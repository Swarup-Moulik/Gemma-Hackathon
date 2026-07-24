import React, { useEffect, useRef } from "react";
import LandingHero from "../components/landing/LandingHero";
import SystemArchitecture from "../components/landing/SystemArchitecture";
import FieldTools from "../components/landing/FieldTools";
import SiteLedger from "../components/landing/SiteLedger";
import AboutTeam from "../components/landing/AboutTeam";
import LandingFooter from "../components/landing/LandingFooter";

export default function Landing() {
  const ringRef = useRef(null);

  useEffect(() => {
    // Add active body class for dark theme styling override
    document.body.classList.add("landing-page-active");

    // Scroll reveal animation observer
    const revealEls = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    revealEls.forEach((el) => io.observe(el));

    // Animate ticket progress ring on intersection
    const circumference = 2 * Math.PI * 32;
    const target = 0.72; // 72%
    let animated = false;

    const ringObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !animated && ringRef.current) {
            animated = true;
            ringRef.current.style.transition =
              "stroke-dashoffset 1.4s cubic-bezier(.22,.61,.36,1)";
            ringRef.current.style.strokeDashoffset = String(
              circumference * (1 - target),
            );
            ringObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    const ticketEl = document.querySelector(".ticket");
    if (ticketEl) {
      ringObserver.observe(ticketEl);
    }

    return () => {
      document.body.classList.remove("landing-page-active");
      io.disconnect();
      ringObserver.disconnect();
    };
  }, []);

  return (
    <div className="landing-container relative overflow-hidden">
      <main id="top">
        <LandingHero ringRef={ringRef} />
        <SystemArchitecture />
        <FieldTools />
        <SiteLedger />
        <AboutTeam />
        <LandingFooter />
      </main>
    </div>
  );
}
