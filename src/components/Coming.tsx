"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from '../assests/logo.png';
import { ArrowUpRight } from "lucide-react";

const launchDate = new Date("2026-06-01T00:00:00");

export default function EcotwistComingSoon() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const total = launchDate.getTime() - new Date().getTime();
    if (total <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }
    return {
      days: String(Math.floor(total / (1000 * 60 * 60 * 24))).padStart(2, "0"),
      hours: String(Math.floor((total / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
      minutes: String(Math.floor((total / 1000 / 60) % 60)).padStart(2, "0"),
      seconds: String(Math.floor((total / 1000) % 60)).padStart(2, "0"),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timerItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-brand-beige text-brand-dark-olive">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop"
          alt="Nature background"
          className="h-full w-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0f1115]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[250px] w-[250px] sm:h-[350px] sm:w-[350px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-300/10 blur-3xl"
        />
      </div>

      {/* Navbar — compact height, logo same size */}
      <header className="fixed top-0 z-50 w-full border-b border-[#b5a26a]/20 bg-brand-beige/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center"
          >
            <img
              src={logo}
              alt="Ecotwist"
              className="h-10 sm:h-12 md:h-14 lg:h-16 xl:h-18 w-auto object-contain"
            />
          </motion.div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-8 sm:px-6 sm:pt-24 sm:pb-10 md:px-8 md:pt-28 md:pb-12 lg:px-12 lg:pt-28 text-center">
        {/* Coming Soon */}
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-5 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-brand-olive"
        >
          Coming Soon
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-gradient-to-b from-brand-dark-olive to-brand-olive bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.1] sm:leading-tight text-transparent"
        >
          Launching a New Era of Conscious Luxury
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 sm:mt-6 md:mt-8 max-w-[85vw] sm:max-w-md md:max-w-lg lg:max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-zinc-400"
        >
          A curated collection of sustainable gifting and timeless craftsmanship is arriving soon.
        </motion.p>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 grid w-full max-w-[320px] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
        >
          {timerItems.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#b5a26a]/20 bg-white p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-olive/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <motion.div
                key={item.value}
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark-olive">
                  {item.value}
                </div>
                <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-zinc-400">
                  {item.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Early access */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm text-zinc-500"
        >
          Join 2,400+ people waiting for early access.
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-50 mt-10 sm:mt-14 md:mt-16 lg:mt-20 flex flex-wrap items-center justify-center gap-5 sm:gap-6 md:gap-8"
        >
          {[
            { name: "Instagram", link: "https://www.instagram.com/ecotwiststores" },
            { name: "LinkedIn", link: "https://www.linkedin.com/company/ecotwiststores/" },
            { name: "Journal", link: "#" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex cursor-pointer items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-zinc-400 transition hover:text-brand-olive"
            >
              <span>{item.name}</span>
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#b5a26a]/20 bg-brand-beige/20 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-semibold text-brand-olive">Ecotwist</h3>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-zinc-500">
              © 2026 Ecotwist. Sustainable luxury redefined.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-400">
            <a href="#" className="hover:text-brand-olive transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-olive transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-olive transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}