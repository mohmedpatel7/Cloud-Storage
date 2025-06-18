"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ArrowUpTrayIcon,
  FolderIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md lg:hidden bg-white shadow-md"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Cloud Storage</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-2">
          {/* Home Link */}
          <Link
            href="/"
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <HomeIcon className="h-6 w-6 mr-3" />
            <span className="text-sm font-medium">Home</span>
          </Link>

          {/* Upload Link */}
          {isSignedIn && (
            <Link
              href="/uploadFile"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <ArrowUpTrayIcon className="h-6 w-6 mr-3" />
              <span className="text-sm font-medium">Upload</span>
            </Link>
          )}

          {/* Stored Files Link */}
          {isSignedIn && (
            <Link
              href="/myfiles"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <FolderIcon className="h-6 w-6 mr-3" />
              <span className="text-sm font-medium">My Files</span>
            </Link>
          )}

          {/* About Link */}
          <Link
            href="/about"
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <HomeIcon className="h-6 w-6 mr-3 rotate-90" />
            <span className="text-sm font-medium">About</span>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="absolute bottom-6 w-full px-4 space-y-2">
          {isSignedIn ? (
            <div className="flex items-center justify-center space-x-2">
              <UserButton afterSignOutUrl="/" />
              <div className="text-sm text-gray-700">
                <p className="font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
