
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import API from "../utils/api";
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import {
  X, Paperclip,
  Send,
  CheckCircle,
  Mail,FileText,
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';



export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme(); 
  const [helpForm, setHelpForm] = useState({
    from: "",
    subject: "",
    message: "",
    attachments: [],
  });


  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const navigation = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'About Us', href: '/about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Articles', href: '#articles' },
    { name: 'Contact', href: '#', onClick: () => setShowHelpPopup(true) },
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-950' : 'bg-white'} min-h-screen transition-colors duration-500`} style={!darkMode ? { backgroundColor: '#ffffff' } : undefined}>
      {/* ===== Header ===== */}
      <header className="absolute inset-x-0 top-0 z-50 supports-[backdrop-filter]:bg-white/20 dark:supports-[backdrop-filter]:bg-transparent backdrop-blur">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-12">
          <div className="flex lg:flex-1 items-center gap-2">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-indigo-600 grid place-items-center shadow-sm">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true">
                  <path d="M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-10h6v6h-6V4zm0 10h6v6h-6v-6z" />
                </svg>
              </span>
              <span className={`text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-white'}`}>EdgeVR</span>
            </a>
          </div>

          {/* ===== Mobile Buttons ===== */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${darkMode ? 'text-gray-200' : 'text-white'}`}
            >
              {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${darkMode ? 'text-gray-200' : 'text-white'}`}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* ===== Desktop Nav ===== */}
          <div className="hidden lg:flex lg:gap-x-10">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                className={`text-sm font-semibold ${darkMode
                  ? 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] hover:text-indigo-300'
                  : 'text-white hover:text-indigo-200'
                  }`}
              >
                {item.name}
              </a>

            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 lg:flex-1 lg:justify-end">
            <button
              onClick={toggleDarkMode}
              className={`rounded-md p-2 ${darkMode ? 'text-gray-200' : 'text-white'} hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            <Link
              to="/login"
              className={`text-sm font-semibold ${darkMode ? 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]' : 'text-white hover:text-indigo-200'}`}
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>

        {/* ===== Mobile Menu ===== */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel
            className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-white'
              } p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10`}
          >
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-indigo-600 grid place-items-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-10h6v6h-6V4zm0 10h6v6h-6v-6z" />
                  </svg>
                </span>
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>EdgeVR</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-300 dark:divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* ===== Hero Section ===== */}
      <section
        id="hero"
        className="relative isolate px-6 lg:px-12 overflow-hidden min-h-screen flex items-center"
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(${darkMode ? 'rgba(5,12,30,0.35), rgba(5,12,30,0.15)' : 'rgba(5,12,30,0.20), rgba(5,12,30,0.35)'}), url(https://images.pexels.com/photos/6498312/pexels-photo-6498312.jpeg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            ...(darkMode ? { filter: 'brightness(1.08) contrast(1.06)' } : {}),
          }}
        />

        <div className="mx-auto max-w-7xl py-10 sm:py-12 lg:py-14 grid lg:grid-cols-2 gap-6 items-center">
          <div className="text-left">
            <p className="uppercase tracking-widest text-indigo-300 text-xs sm:text-sm">Welcome to Vaery</p>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-4xl font-extrabold text-white leading-tight">
              Elevate Your Business with VR Solutions
            </h1>
            <p className="mt-4 text-sm sm:text-base text-indigo-100 max-w-xl">
              Learn powerful ideas about immersive modeling, 3D, & AR. Build future-ready experiences with modern workflows.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Get Started
              </Link>
              <a href="#services" className="text-white/90 text-sm sm:text-base font-semibold">Explore Services →</a>
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      </section>

      {/* ===== Trusted Logos (temporarily disabled) ===== */}
      {false && (
        <section className="bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-6 lg:px-12 py-6 sm:py-10">
            <p className="text-center text-xs tracking-widest text-gray-500 dark:text-gray-400">TRUSTED BY 250+ COMPANIES</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center text-gray-600 dark:text-gray-300">
              {['Logop ipsum', 'Logop ipsum', 'Logop ipsum', 'Logop ipsum'].map((l, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm9-3.5a1 1 0 10-2 0V10a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414L11 9.586V6.5z" /></svg>
                  <span className="font-semibold">Logopipsum</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Feature Video/Image Card (removed per request) ===== */}
      {false && (
        <section className="bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-xl px-6 lg:px-8 pb-4">
            <div className="rounded-2xl overflow-hidden shadow-lg relative">
              <img
                src="https://images.pexels.com/photos/7776873/pexels-photo-7776873.jpeg"
                alt="Feature"
                className="w-full h-16 sm:h-20 md:h-24 object-cover"
              />
              <button className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white h-6 w-6 rounded-full grid place-items-center shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M8 5v14l11-7z" /></svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===== Services Grid ===== */}
      <section id="services" className={`${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10 sm:py-14">
          <p className="text-indigo-600 font-semibold tracking-widest text-xs">OUR SERVICES</p>
          <h2 className={`mt-2 text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Immersive Solutions Tailored to Your Needs</h2>

          <div className="mt-8 grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
              {[
                { title: 'Technology VR' },
                { title: 'Game VR' },
                { title: 'Entertainment VR' },
                { title: 'VR Office' },
              ].map((card, i) => (
                <div key={i} className={`${darkMode ? 'bg-gray-900' : 'bg-white'} border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm`}>
                  <div className="h-10 w-10 rounded-xl grid place-items-center bg-indigo-50 text-indigo-600">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.93A8.001 8.001 0 0019.93 13H13v3.93zM4.07 13A8.001 8.001 0 0011 18.93V13H4.07zM11 5.07A8.001 8.001 0 004.07 11H11V5.07zM13 11h6.93A8.001 8.001 0 0013 5.07V11z" /></svg>
                  </div>
                  <h3 className={`mt-4 text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus.</p>
                  <a href="#" className="inline-flex mt-4 items-center gap-2 rounded-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-4 py-2 text-xs font-semibold">Get Started</a>
                </div>
              ))}
            </div>

            <div className="lg:pl-6">
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-2xl grid place-items-center h-40 sm:h-48 md:h-56`}>
                <span className="text-xl sm:text-2xl font-extrabold tracking-widest text-indigo-600">EDGEVR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why Choose Us ===== */}
      <section id="why-us" className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10 sm:py-14 grid lg:grid-cols-3 gap-8 items-start">
          <div className="bg-gradient-to-br from-indigo-900 to-gray-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg">
            <p className="text-sm opacity-80">WHY CHOOSE US</p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold">Unlocking Your VR Potential</h3>
            <div className="mt-6 overflow-hidden rounded-2xl">
              <img src="https://images.pexels.com/photos/7562353/pexels-photo-7562353.jpeg" alt="Why us" className="w-full h-48 sm:h-56 md:h-64 object-cover" />
            </div>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex gap-5 items-start">
                <div className="text-indigo-600 text-2xl font-bold">{String(n).padStart(2, '0')}</div>
                <div>
                  <h4 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {n === 1 && 'Professional Team'}
                    {n === 2 && 'Affordable Package'}
                    {n === 3 && 'Comprehensive Services'}
                    {n === 4 && 'Satisfied Client'}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper.</p>
                  <div className="mt-3 h-1.5 w-24 bg-indigo-600 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section id="testimonials" className="relative">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              `linear-gradient(${darkMode ? 'rgba(14,23,54,0.90), rgba(14,23,54,0.90)' : 'rgba(14,23,54,0.30), rgba(14,23,54,0.50)'}), url(https://images.pexels.com/photos/5207612/pexels-photo-5207612.jpeg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12 sm:py-20">
          <p className="text-center text-sm tracking-widest text-indigo-300">TESTIMONIAL</p>
          <h3 className="text-center mt-2 text-3xl sm:text-4xl font-bold text-white">What Our Client Say</h3>

          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="relative bg-white/95 rounded-2xl p-6 shadow-xl">
                <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-b-xl rounded-tr-xl">99</div>
                <div className="flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/80?img=${i + 10}`} alt="Avatar" className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <h5 className="font-semibold text-gray-900">{i === 1 ? 'Harper Russo' : 'Reese Miller'}</h5>
                    <p className="text-xs text-gray-500">Product Designer</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Articles ===== */}
      <section id="articles" className={`${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-xs tracking-widest text-indigo-600 font-semibold">NEWS & ARTICLES</p>
              <h3 className={`mt-2 text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Articles About VR & AR</h3>
            </div>
            <a href="#" className="self-start sm:self-auto rounded-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-4 py-2 text-sm font-semibold">Learn More</a>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Tips for Creating Immersive VR Experiences' },
              { title: 'Exploring Virtual Worlds: The Rise of Social VR' },
              { title: 'The Future of VR Gaming: What to Expect' },
            ].map((a, idx) => (
              <article key={idx} className={`${darkMode ? 'bg-gray-900' : 'bg-white'} border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden`}>
                <div className="h-44 w-full overflow-hidden">
                  <img src={`https://picsum.photos/seed/vr${idx}/600/400`} alt="Article" className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="text-xs text-gray-500">02 minutes read</div>
                  <h4 className={`mt-1 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{a.title}</h4>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter removed as requested */}
        </div>
      </section>

      {/* ===== Footer (simple) ===== */}
      <footer className={`${darkMode ? 'bg-gray-950' : 'bg-white'} border-t border-gray-200 dark:border-gray-800`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400"> {new Date().getFullYear()} EdgeVR. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Privacy</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Terms</a>
          </div>
        </div>
      </footer>

 {showHelpPopup && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-xl p-4 animate-fadeIn">
    <div
      className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border
        ${darkMode 
          ? 'bg-gray-900/90 border-white/10' 
          : 'bg-white/95 border-black/10'
        } backdrop-blur-2xl animate-slideUp`}
      style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Get Help</h2>
              <p className="text-sm opacity-90">We're here to assist you 24/7</p>
            </div>
          </div>
          <button
            onClick={() => setShowHelpPopup(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-all hover:scale-110"
          >
            X
          </button>
        </div>
      </div>

      {/* Form Body */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData();
          formData.append("to", "defaultadmin@example.com");
          formData.append("from", helpForm.from);
          formData.append("subject", helpForm.subject);
          formData.append("message", helpForm.message);
          helpForm.attachments?.forEach((file) => formData.append("attachments", file));

          try {
            await API.post("/help/create", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Help request sent successfully!");
            setShowHelpPopup(false);
          } catch (err) {
            alert("Failed to send. Please try again.");
          }
        }}
        className="p-6 space-y-6"
      >
        {/* Email Field - Floating Label */}
        <div className="relative">
          <input
            type="email"
            required
            value={helpForm.from}
            onChange={(e) => setHelpForm(prev => ({ ...prev, from: e.target.value }))}
            className={`peer w-full px-4 py-4 rounded-xl border-2 text-base transition-all duration-300
              ${darkMode 
                ? 'bg-gray-800/50 border-gray-700 focus:border-[#3b82f6] text-white' 
                : 'bg-gray-50 border-gray-300 focus:border-[#2563eb] text-gray-900'
              } outline-none`}
            placeholder=" "
          />
          <label className={`absolute left-4 top-4 text-sm pointer-events-none transition-all duration-300
            peer-focus:-translate-y-6 peer-focus:text-[#2563eb] peer-focus:scale-90
            ${helpForm.from ? '-translate-y-6 scale-90 text-[#2563eb]' : ''}
            ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Your Email
          </label>
        </div>


        <div className="relative">
          <input
            type="text"
            required
            value={helpForm.subject}
            onChange={(e) => setHelpForm(prev => ({ ...prev, subject: e.target.value }))}
            className={`peer w-full px-4 py-4 rounded-xl border-2 text-base transition-all duration-300
              ${darkMode 
                ? 'bg-gray-800/50 border-gray-700 focus:border-[#3b82f6] text-white' 
                : 'bg-gray-50 border-gray-300 focus:border-[#2563eb] text-gray-900'
              } outline-none`}
            placeholder=" "
          />
          <label className={`absolute left-4 top-4 text-sm pointer-events-none transition-all duration-300
            peer-focus:-translate-y-6 peer-focus:text-[#2563eb] peer-focus:scale-90
            ${helpForm.subject ? '-translate-y-6 scale-90 text-[#2563eb]' : ''}
            ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Subject
          </label>
        </div>

        {/* Message Field */}
        <div className="relative">
          <textarea
            required
            rows={5}
            value={helpForm.message}
            onChange={(e) => setHelpForm(prev => ({ ...prev, message: e.target.value }))}
            className={`peer w-full px-4 py-4 rounded-xl border-2 text-base transition-all duration-300 resize-none
              ${darkMode 
                ? 'bg-gray-800/50 border-gray-700 focus:border-[#3b82f6] text-white' 
                : 'bg-gray-50 border-gray-300 focus:border-[#2563eb] text-gray-900'
              } outline-none`}
            placeholder=" "
          />
          <label className={`absolute left-4 top-4 text-sm pointer-events-none transition-all duration-300
            peer-focus:-translate-y-8 peer-focus:text-[#2563eb] peer-focus:scale-90
            ${helpForm.message ? '-translate-y-8 scale-90 text-[#2563eb]' : ''}
            ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Describe your issue...
          </label>
        </div>

        {/* File Upload */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer text-[#2563eb] hover:text-[#1e40af] transition-all">
            <div className="p-3 bg-[#2563eb]/10 rounded-xl">
              <Paperclip className="w-5 h-5" />
            </div>
            <span className="font-medium">Attach files (screenshots, logs, etc.)</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setHelpForm(prev => ({
                ...prev,
                attachments: [...(prev.attachments || []), ...Array.from(e.target.files)]
              }))}
            />
          </label>

          {/* Attached Files */}
          {helpForm.attachments?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {helpForm.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-[#2563eb]/10 text-[#2563eb] px-4 py-2 rounded-full text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  <span className="max-w-32 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setHelpForm(prev => ({
                      ...prev,
                      attachments: prev.attachments.filter((_, i) => i !== idx)
                    }))}
                    className="hover:text-red-500 transition"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white font-bold text-lg
                     hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Send className="w-5 h-5" />
          Send Message
        </button>
      </form>
    </div>
  </div>
)}


    </div>
  );
}