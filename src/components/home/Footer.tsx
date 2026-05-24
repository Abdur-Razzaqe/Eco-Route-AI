"use client";

import Link from "next/link";
import { Leaf, ExternalLink, Share2, Mail, Heart } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Dashboard", href: "/dashboard" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#privacy" },
        { label: "Terms", href: "#terms" },
        { label: "Contact", href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center font-bold text-white">
                🌱
              </div>
              <span className="text-xl font-bold text-white">EcoRoute AI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering sustainable futures through intelligent carbon tracking
              and routing technology.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="#github"
                className="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all duration-300 border border-slate-800 hover:border-emerald-500/40"
              >
                <ExternalLink size={18} />
              </a>
              <a
                href="#social"
                className="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all duration-300 border border-slate-800 hover:border-emerald-500/40"
              >
                <Share2 size={18} />
              </a>
              <a
                href="mailto:support@ecoroute.ai"
                className="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all duration-300 border border-slate-800 hover:border-emerald-500/40"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

        {/* Bottom footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-400 text-xs sm:text-sm">
          <p>© 2024 EcoRoute AI. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Made with <Heart size={14} className="text-emerald-400 fill-emerald-400" /> for a sustainable future
          </div>
        </div>
      </div>
    </footer>
  );
}
