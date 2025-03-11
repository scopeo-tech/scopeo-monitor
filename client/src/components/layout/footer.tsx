import React from "react";
import { FaNpm } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="w-full">
      <div className="bg-white h-auto flex flex-row items-center justify-around py-10 ">
  {/* Left Side - Heading Section */}
  <div className="flex flex-col items-start space-y-5">
    <h1 className="text-8xl font-bold text-emerald-500">
      GET IN <br /> TOUCH
    </h1>
    <h1 className="text-3xl font-bold text-emerald-500">Scopeo</h1>
  </div>

  {/* Right Side - Form */}
  <div className="flex flex-col space-y-5 w-80">
    <input
      type="text"
      placeholder="Your Name"
      className="border-2 border-emerald-500 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
    <input
      type="email"
      placeholder="Your Email"
      className="border-2 border-emerald-500 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
    <textarea
      placeholder="Your Message"
      className="border-2 border-emerald-500 p-3 rounded-lg w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
    ></textarea>

    {/* Submit Button */}
    <button className="bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 transition self-start">
      Send Message
    </button>
  </div>
</div>





      <div className="bg-emerald-500 text-white py-6 px-6 flex flex-col">
  <div className="flex items-center space-x-3 mb-4">
    <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-7 h-7"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 3.59 8 8 8-3.59 8-8 8z" />
      </svg>
    </div>
    <h1 className="text-3xl font-bold text-white">Scopeo</h1>
  </div>

  {/* Main Content Below */}
  <div className="flex">
    <div className="mr-10">
      <p className="text-lg">Effortless project tracking and</p>
      <p className="text-lg">monitoring for seamless growth</p>
      <p className="text-lg">and success.</p>
    </div>

    <div className="flex flex-col space-y-2 ml-24">
      <a href="#" className="text-lg font-semibold hover:underline">Developers</a>
      <a href="#" className="text-lg font-semibold hover:underline">Documentation</a>
      <a href="#" className="text-lg font-semibold hover:underline">About Us</a>
      <a href="#" className="text-lg font-semibold hover:underline">Contact</a>
    </div>

    <div className="max-w-sm ml-24">
      <p className="text-white text-lg max-w-sm">
        Stay ahead with smart project <br /> monitoring—insights and <br /> updates, right at your fingertips.
      </p>
    </div>

    <div className="ml-24">
      <h1 className="text-white text-xl font-semibold mb-2">FOLLOW US</h1>
      <div className="flex space-x-4">
        <a href=""><FaNpm className="text-white text-2xl hover:text-gray-300 transition" /></a>
        <a href=""><AiOutlineInstagram className="text-white text-2xl hover:text-gray-300 transition" /></a>
        <a href=""><FaGithub className="text-white text-2xl hover:text-gray-300 transition" /></a>
      </div>
    </div>

    <div className="ml-24">
      <h1 className="text-white text-xl font-semibold mb-2">CONTACT US</h1>
      <p className="text-white">zemdevwork@gmail.com</p>
    </div>
  </div>

  {/* Copyright Section */}
  <div className="bg-emerald-500 text-white text-center py-3 text-sm mt-4">
    © {new Date().getFullYear()} Scopeo. All rights reserved.
  </div>
</div>

    </footer>
  );
};

export default Footer;
