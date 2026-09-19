import React from "react";
import {
  Heart,
  Share2,
  Facebook,
  Instagram,
} from "lucide-react";

const NewFooter = () => {
  return (
    <footer className="bg-primary text-white pt-12 sm:pt-16 lg:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
          <div>
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <Heart className="text-accent w-6 h-6 sm:w-8 sm:h-8 fill-accent" />
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Viwahaa
              </h1>
            </div>
            <p className="text-white/70 leading-relaxed mb-6 text-sm sm:text-base">
              World&apos;s most trusted Tamil matrimony platform. Helping
              thousands find their perfect life partner for over a decade.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-all group"
                href="https://www.facebook.com/share/19EpxvNNid/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-all group"
                href="https://www.instagram.com/viwahaamatrimony?igsh=Z2JlZ204OHk4OGIy&utm_source=ig_contact_invite"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-all group"
                href="#"
              >
                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          <div>
            <h5 className="text-base sm:text-lg font-bold mb-4 sm:mb-8 text-accent">
              Quick Links
            </h5>
            <ul className="space-y-4 text-white/70">
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Search Profiles
                </a>
              </li>
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Premium Membership
                </a>
              </li>
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Customer Support
                </a>
              </li>
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Elite Matrimony
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-base sm:text-lg font-bold mb-4 sm:mb-8 text-accent">
              Privacy & Help
            </h5>
            <ul className="space-y-4 text-white/70">
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Safe Matrimony
                </a>
              </li>
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  className="hover:text-accent transition-colors block"
                  href="#"
                >
                  Report Issues
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-base sm:text-lg font-bold mb-4 sm:mb-8 text-accent">
              Subscribe
            </h5>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Get the latest match suggestions directly in your inbox.
            </p>
            <div className="relative group">
              <input
                className="w-full bg-white/5 border border-white/20 rounded-full px-6 py-4 outline-none focus:border-accent/50 focus:bg-white/10 transition-all text-sm pr-24"
                placeholder="Email address"
                type="email"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-accent text-primary px-6 rounded-full font-bold hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 text-sm">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            © 2024 EternalUnion Tamil Matrimony. All rights reserved.{" "}
            <br className="sm:hidden" />
            Connecting hearts with tradition.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
