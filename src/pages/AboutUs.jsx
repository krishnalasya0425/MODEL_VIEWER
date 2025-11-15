import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "About Us", href: "/about" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Articles", href: "/#articles" },
];

export default function AboutUs() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "bg-gray-950" : "bg-white"} min-h-screen transition-colors duration-500`}>
      {/* Header (same as LandingPage) */}
      <header className="absolute inset-x-0 top-0 z-50 supports-[backdrop-filter]:bg-white/20 dark:supports-[backdrop-filter]:bg-transparent backdrop-blur">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-12">
          <div className="flex lg:flex-1 items-center gap-2">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-indigo-600 grid place-items-center shadow-sm">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true">
                  <path d="M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-10h6v6h-6V4zm0 10h6v6h-6v-6z"/>
                </svg>
              </span>
              <span className={`text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-white'}`}>EdgeVR</span>
            </a>
          </div>

          {/* Mobile Buttons */}
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

          {/* Desktop Nav */}
          <div className="hidden lg:flex lg:gap-x-10">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold ${darkMode ? 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] hover:text-indigo-300' : 'text-white hover:text-indigo-200'}`}
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

        {/* Mobile Menu */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel
            className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            } p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10`}
          >
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-indigo-600 grid place-items-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-10h6v6h-6V4zm0 10h6v6h-6v-6z"/>
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
                  {navItems.map((item) => (
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

      {/* Hero Section for About Us */}
      <section
        className="min-h-screen flex items-center text-center bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-800 dark:text-white"
      >
        <div className="container mx-auto px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">About Us</h1>

          <div className="w-full h-72 md:h-96 mb-10 mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
            <img
              src="https://edgeforce.in/assets/images/sliders/3.jpg"
              alt="EdgeVR - About Us"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="max-w-4xl mx-auto text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
            EdgeVR has been conceived with the singular objective of bringing cutting edge smart and disruptive technology to the country's security forces. As the threat from enemies both within and outside the country increases by the day, it is imperative that a technology differential is created which can help us win future wars.
          </p>
        </div>
      </section>

      {/* Footer (simple) */}
      <footer className={`${darkMode ? 'bg-gray-950' : 'bg-white'} border-t border-gray-200 dark:border-gray-800`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 EdgeVR. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Privacy</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}