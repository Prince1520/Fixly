"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  TvIcon,
  BoltIcon,
  ScissorsIcon,
  ShoppingCartIcon,
  SquaresPlusIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,

} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const products = [
  {
    name: "AC Repair",
    description: "Professional air conditioning services",
    href: "#",
    icon: WrenchScrewdriverIcon,
  },
  {
    name: "TV Mounting",
    description: "Expert wall-mounted TV installation",
    href: "#",
    icon: TvIcon,
  },
  {
    name: "Electrician",
    description: "Comprehensive electrical solutions",
    href: "#",
    icon: BoltIcon,
  },
  {
    name: "Window Cleaning",
    description: "Thorough and safe window cleaning",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Gardening",
    description: "Professional landscaping and plant care",
    href: "#",
    icon: ScissorsIcon,
  },
];

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-50">
      {/* Desktop Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Home</span>
            <img
              alt="Company Logo"
              src={logo}
              className="h-12 w-auto transition transform hover:scale-105"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-8 w-8" />
          </button>
        </div>

        {/* Desktop Menu */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-300 hover:text-white transition"
          >
            Home
          </Link>
          <Popover className="relative">
            <PopoverButton className="group flex items-center gap-x-1 text-sm font-semibold text-gray-300 hover:text-white transition">
              Features
              <ChevronDownIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute top-full left-0 z-10 mt-4 w-96 rounded-xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-4 rounded-lg p-3 hover:bg-gray-100 transition"
                  >
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200">
                      <item.icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition" />
                    </div>
                    <div className="flex-auto">
                      <p
                        className="block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </p>
                      <p className="mt-1 text-gray-500 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Link
            to="/services"
            className="text-sm font-semibold text-gray-300 hover:text-white transition"
          >
            Services
          </Link>
          <Link
            to="/feedback"
            className="text-sm font-semibold text-gray-300 hover:text-white transition"
          >
            Feedback
          </Link>
        </PopoverGroup>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center space-x-4">
          {/* Shopping Cart */}
          <Link to="/cart" className="relative group">
            <ShoppingCartIcon className="h-7 w-7 text-gray-300 group-hover:text-white transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile or Login */}
          {user ? (
            <Link
              to="/profile"
              className="text-sm font-semibold text-gray-300 hover:text-white flex items-center transition"
            >
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-300 group-hover:text-white transition" />
                <span className="text-sm font-semibold text-gray-300 hover:text-white transition">
                  {user.fullName || user.username}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-300 hover:text-white flex items-center transition"
            >
              Log in <span className="ml-1">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Dialog */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 " />
        <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <img src={logo} alt="Company Logo" className="h-10 w-auto" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* User Section in Mobile Menu */}
            {user && (
              <div className="mb-4 flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-600" />
                <span className="text-gray-900 font-semibold">
                  {user.fullName || user.username}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <Link
                to="/"
                className="block py-2 text-gray-900 hover:bg-gray-100 rounded"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-2 text-gray-900 hover:bg-gray-100 rounded"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block py-2 text-gray-900 hover:bg-gray-100 rounded"
              >
                Services
              </Link>

              {/* Conditional Login/Logout for Mobile */}
              {user ? (
                <Link
                  to="/profile"
                  className="block py-2 text-gray-900 hover:bg-gray-100 rounded"
                >
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 text-gray-900 hover:bg-gray-100 rounded"
                >
                  Log in
                </Link>
              )}
            </div>

            {/* Mobile Bottom Actions */}
            <div className="mt-6 flex items-center justify-between">
              <Link to="/cart" className="relative">
                <ShoppingCartIcon className="h-7 w-7 text-gray-600" />
              </Link>

              {/* User Profile in Mobile Menu */}
              {user ? (
                <Link to="/profile">
                  <UserCircleIcon className="h-8 w-8 text-gray-600" />
                </Link>
              ) : null}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
