import { Link } from "react-router-dom";
import { Calendar, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Event Hub</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Discover, book, and manage tickets for the best events happening around you.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 transition-colors hover:border-indigo-500 hover:text-indigo-600">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Explore</h4>
            <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/events" className="hover:text-indigo-600">All Events</Link></li>
              <li><Link to="/events?sort=-bookedSeats" className="hover:text-indigo-600">Popular Events</Link></li>
              <li><Link to="/events" className="hover:text-indigo-600">Upcoming Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/" className="hover:text-indigo-600">About Us</Link></li>
              <li><Link to="/" className="hover:text-indigo-600">Careers</Link></li>
              <li><Link to="/" className="hover:text-indigo-600">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-indigo-600">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0" /> support@eventhub.com</li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 shrink-0" /> San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Event Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
