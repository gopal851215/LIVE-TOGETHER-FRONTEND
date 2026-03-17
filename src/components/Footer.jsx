import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Project Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">LiveTogether</h2>
          <p className="text-sm text-slate-400">
            A modern student housing platform where students can easily find
            rooms and hosts can list their properties.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/properties" className="hover:text-white transition">
                Properties
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-white transition">
                Register
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-white transition">
                Login

              </a>

            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
          <div className="flex justify-center md:justify-start space-x-4 text-xl">
            <a href="#" className="hover:text-white transition">



              <FaGithub />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaLinkedin />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaTwitter />
            </a>

          </div>
          
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-slate-700 text-center text-sm py-4 text-slate-400">
        © {new Date().getFullYear()} LiveTogether • Built with React + Node
      </div>
    </footer>
  );
};

export default Footer;