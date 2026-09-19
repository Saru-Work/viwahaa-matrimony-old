import React from "react";
import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import Logo from "../assets/Logo/logo.jpg";

function Footer() {
  return (
    <footer className="bg-primary text-white pt-8 pb-4 px-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto"  style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
        {/* Grid layout for different screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-sm">
          {/* Logo & Description - Full width on mobile, 2 cols on tablet */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-center gap-3 mb-4">
            <img
              src={Logo}
              alt="Viwahaa Matrimony Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded shadow-lg object-cover"
            />
            <h2 className="font-bold text-xl sm:text-2xl text-white mb-1 text-center">
              Viwahaa Matrimony
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-2 text-center">
              Find your Tamil soul mate here!
            </p>
            <div className="flex gap-2 sm:gap-3 mt-1">
              {/* <a
                href="https://twitter.com/viwahaamatrimony"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-[#8D1C21] bg-[#edbec4] p-2 rounded-full"
              >
                <FaTwitter size={18} className="sm:w-5 sm:h-5" />
              </a> */}
              <a
                href="https://www.facebook.com/share/19EpxvNNid/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <FaFacebookF size={18} className="sm:w-5 sm:h-5" />
              </a>
              {/* <a
                href="https://linkedin.com/company/viwahaamatrimony"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[#8D1C21] bg-[#edbec4] p-2 rounded-full"
              >
                <FaLinkedinIn size={18} className="sm:w-5 sm:h-5" />
              </a> */}
              <a
                href="https://www.instagram.com/viwahaamatrimony?igsh=Z2JlZ204OHk4OGIy&utm_source=ig_contact_invite"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <FaInstagram size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Useful Links - Full width on mobile, 1 col on tablet */}
          <div className="flex flex-col gap-2 mb-4">
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-white">
              Useful Links
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
              <a href="/" className="text-white/80 hover:text-white py-1 transition-colors">
                Home
              </a>
              <a
                href="/about"
                className="text-white/80 hover:text-white py-1 transition-colors"
              >
                About Us
              </a>
              <a
                href="/services"
                className="text-white/80 hover:text-white py-1 transition-colors"
              >
                Services
              </a>
              <a
                href="/pricing"
                className="text-white/80 hover:text-white py-1 transition-colors"
              >
                Pricing
              </a>
              <a href="/" className="text-white/80 hover:text-white py-1 transition-colors">
                Terms of Service
              </a>
              <a href="/" className="text-white/80 hover:text-white py-1 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Our Services - Full width on mobile, 1 col on tablet */}
          <div className="flex flex-col gap-2 mb-4">
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-white">
              Our Services
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
              <a href="#" className="text-white/80 hover:text-white py-1 transition-colors">
                Verified Profiles
              </a>
              <a href="#" className="text-white/80 hover:text-white py-1 transition-colors">
                Manual Profile Matching
              </a>
              <a href="#" className="text-white/80 hover:text-white py-1 transition-colors">
                Expert Horoscope Matching
              </a>
              <a href="#" className="text-white/80 hover:text-white py-1 transition-colors">
                Cultural Resonance
              </a>
              <a href="#" className="text-white/80 hover:text-white py-1 transition-colors">
                Tailored Relationship Guidance
              </a>
              <a href="#" className="text-white/80 hover:text-white py-1 transition-colors">
                Local Expertise in Jaffna
              </a>
            </div>
          </div>

          {/* Contact - Full width on mobile, 2 cols on tablet */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-2 mb-4">
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-white">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-white/80">
                {/* Location icon */}
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="mt-0.5 flex-shrink-0"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-sm sm:text-base">
                  No.222, 2nd Cross Street,
                  <br />
                  Jaffna, Sri Lanka
                </span>
              </div>

              <div className="flex items-center gap-3 text-white/80">
                {/* Phone icon */}
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0"
                >
                  <path
                    d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.68 3.48.68a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 21 3 16.39 3 11a1 1 0 011-1h3.5a1 1 0 011 1c0 1.15.23 2.36.68 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-sm sm:text-base">
                  <b className="text-white">Mobile:</b> +94 74 174 4952
                </span>
              </div>

              <div className="flex items-center gap-3 text-white/80">
                {/* Phone icon again for landline */}
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0"
                >
                  <path
                    d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.68 3.48.68a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 21 3 16.39 3 11a1 1 0 011-1h3.5a1 1 0 011 1c0 1.15.23 2.36.68 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-sm sm:text-base">
                  <b className="text-white">Landline:</b> +94 21 728 4036
                </span>
              </div>

              <div className="flex items-center gap-3 text-white/80">
                {/* Email icon */}
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0"
                >
                  <path
                    d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0l8 7 8-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="12"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <a
                  href="mailto:viwahaamatrimony@gmail.com"
                  className="hover:text-white text-sm sm:text-base break-all transition-colors"
                >
                  viwahaamatrimony@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 sm:my-8 border-white/20" />

        {/* Copyright - Centered on mobile, normal on tablet and above */}
        <div className="text-center sm:text-left text-white/50 text-xs sm:text-sm px-2">
          <span>© 2024 Viwahaa Matrimony. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
