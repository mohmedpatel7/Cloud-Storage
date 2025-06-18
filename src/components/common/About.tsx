"use client";

import {
  CloudIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: CloudIcon,
    title: "Cloud Storage",
    description:
      "Store and access your files securely from anywhere in the world with our advanced cloud infrastructure.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & Private",
    description:
      "Your data is protected with end-to-end encryption and advanced security measures.",
  },
  {
    icon: ClockIcon,
    title: "Real-time Sync",
    description:
      "Automatic synchronization ensures your files are always up to date across all your devices.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            About Our Cloud Storage
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A modern, secure, and efficient way to store and manage your files
            in the cloud.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="absolute -top-4 left-6">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">99.9%</p>
              <p className="mt-2 text-sm text-gray-500">Uptime Guarantee</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">256-bit</p>
              <p className="mt-2 text-sm text-gray-500">Encryption</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">24/7</p>
              <p className="mt-2 text-sm text-gray-500">Support</p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500">
            We&apos;re committed to providing a secure, reliable, and
            user-friendly cloud storage solution that helps individuals and
            businesses manage their digital assets with confidence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
