import React from "react";
import Image from "next/image";
import { IoMdContact } from "react-icons/io";
import about from "@/assets/about.svg"
import { FaShieldAlt, FaLock, FaEye, FaBolt } from "react-icons/fa";

const About: React.FC = () => {
  return (
    <div className="w-full">
      <div className="relative w-full h-[500px] flex items-center mt-9">
        <div className="container mx-auto px-20 flex items-center">
          <div className="w-1/2 pr-10">
            <h1 className="text-5xl font-semibold mb-6 text-gray-800">
            Proactive <span className="font-serif  text-emerald-400" >Monitoring </span>for Smarter Development
            </h1>
            <p className="text-lg text-gray-600">
            At <strong>Scopeo</strong>, we are dedicated to simplifying web application monitoring. Our goal is to provide developers with real-time insights into their projects, ensuring performance, security, and reliability.

With a powerful monitoring dashboard and integrated backend libraries, we help teams track uptime, response times, security threats, and critical errors—all in one place.

Our lightweight monitoring agent seamlessly integrates into any project, collecting essential data without compromising privacy or security. Built with cutting-edge technology, our solution ensures effortless monitoring, enhanced security, and better decision-making for developers and businesses alike.
            </p>
          </div>
          <div className="w-1/2 flex justify-center">
            <div className="w-full max-w-[1000px] h-[600px] relative">
              <Image
                src={about}
                alt="Project Management Team"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Missions Section */}
      <div className="py-20 text-center bg-white mt-2">
  <h2 className="text-4xl font-bold mb-12 text-gray-800">Our Mission</h2>

  <div className="flex justify-center flex-wrap gap-8 px-10">
    <div className="w-72 h-64 p-6 bg-emerald-500 rounded-xl shadow-lg flex flex-col justify-center items-center text-white overflow-hidden group transition-transform duration-300 hover:scale-105">
      <FaShieldAlt className="text-3xl mb-3" />
      <h3 className="text-xl font-semibold mb-3">Empowering Developers</h3>
      <p className="text-center text-sm text-gray-200">
        Provide real-time insights to help teams maintain high-performance web applications.
      </p>
    </div>

    <div className="w-72 h-64 p-6 bg-emerald-500 rounded-xl shadow-lg flex flex-col justify-center items-center text-white overflow-hidden group transition-transform duration-300 hover:scale-105">
      <FaLock className="text-3xl mb-3" />
      <h3 className="text-xl font-semibold mb-3">Enhancing Security</h3>
      <p className="text-center text-sm text-gray-200">
        Offer robust logging and tracking to detect vulnerabilities and prevent security breaches.
      </p>
    </div>

    <div className="w-72 h-64 p-6 bg-emerald-500 rounded-xl shadow-lg flex flex-col justify-center items-center text-white overflow-hidden group transition-transform duration-300 hover:scale-105">
      <FaEye className="text-3xl mb-3" />
      <h3 className="text-xl font-semibold mb-3">Simplifying Monitoring</h3>
      <p className="text-center text-sm text-gray-200">
        Create an intuitive and seamless monitoring solution that integrates effortlessly into any project.
      </p>
    </div>

    <div className="w-72 h-64 p-6 bg-emerald-500 rounded-xl shadow-lg flex flex-col justify-center items-center text-white overflow-hidden group transition-transform duration-300 hover:scale-105">
      <FaBolt className="text-3xl mb-3" />
      <h3 className="text-xl font-semibold mb-3">Prioritizing Privacy</h3>
      <p className="text-center text-sm text-gray-200">
        Ensure all tracking is privacy-friendly, collecting only essential performance and security data—never personal information.
      </p>
    </div>
  </div>
</div>


      {/* Who Are We Section */}
      <div className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-10">Who Are We</h2>

        <div className="flex justify-around gap-8 px-10">
          <div className="relative w-1/4 h-80 p-6 bg-gray-50 rounded-lg shadow-md flex flex-col justify-start mt-[-20px] border-4 border-green-500">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500">
              <IoMdContact className="text-4xl text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-2 text-black text-center">Muhammed Irfan</h3>
            <p className="text-black text-center">Founder</p>
            <p className="text-black mt-4">
              Irfan is responsible for company strategy and business development. 
              With 10+ years of experience, he leads innovation and growth.
            </p>
          </div>

          <div className="relative w-1/4 h-80 p-6 bg-gray-50 rounded-lg shadow-md flex flex-col justify-start mt-[20px] border-4 border-green-500">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500">
              <IoMdContact className="text-4xl text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-2 text-black text-center">Navaf</h3>
            <p className="text-black text-center">CTO</p>
            <p className="text-black mt-4">
              Navaf drives the tech vision, ensuring cutting-edge solutions and 
              technical excellence across all projects.
            </p>
          </div>

          <div className="relative w-1/4 h-80 p-6 bg-gray-50 rounded-lg shadow-md flex flex-col justify-start mt-[-20px] border-4 border-green-500">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500">
              <IoMdContact className="text-4xl text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-2 text-black text-center">Fathima Harsha</h3>
            <p className="text-black text-center">Lead Designer</p>
            <p className="text-black mt-4">
              Harsha oversees UI/UX design, creating intuitive and visually 
              stunning experiences for users worldwide.
            </p>
          </div>

          <div className="relative w-1/4 h-80 p-6 bg-gray-50 rounded-lg shadow-md flex flex-col justify-start mt-[20px] border-4 border-green-500">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500">
              <IoMdContact className="text-4xl text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-2 text-black text-center">Mohammed Sabik</h3>
            <p className="text-black text-center">Developer</p>
            <p className="text-black mt-4">
              Sabik is a passionate software developer with expertise in building scalable web applications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;