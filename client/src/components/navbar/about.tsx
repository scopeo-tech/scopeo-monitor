import React from "react";
import Image from "next/image";
import { IoMdContact } from "react-icons/io";
import about from "@/assets/about.svg"
import { FaShieldAlt, FaLock, FaEye, FaBolt } from "react-icons/fa";

const About: React.FC = () => {
  return (
    <div className="w-full">
      <div className="relative w-full py-10 flex items-center mt-2">
        <div className="container mx-auto px-4 md:px-20 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 md:pr-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-800">
              Proactive <span className="font-serif text-emerald-400">Monitoring </span>for Smarter Development
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              At <strong>Scopeo</strong>, we are dedicated to simplifying web application monitoring. Our goal is to provide developers with real-time insights into their projects, ensuring performance, security, and reliability.

              With a powerful monitoring dashboard and integrated backend libraries, we help teams track uptime, response times, security threats, and critical errors—all in one place.

              Our lightweight monitoring agent seamlessly integrates into any project, collecting essential data without compromising privacy or security. Built with cutting-edge technology, our solution ensures effortless monitoring, enhanced security, and better decision-making for developers and businesses alike.
            </p>
          </div>
          <div className="hidden md:w-1/2 md:flex justify-center">
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
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">Our Mission</h2>

        <div className="flex justify-center flex-wrap gap-8 px-4 md:px-10">
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

      <div className="flex flex-col md:flex-row justify-around gap-8 px-4 md:px-10">
        {[
          { name: "Muhammed Irfan", github: "https://github.com/mohammedirfan244" ,pfp:"https://avatars.githubusercontent.com/u/179564628?v=4" },
          { name: "Navaf", github: "https://github.com/Navaf-U" ,pfp:"https://avatars.githubusercontent.com/u/179564628?v=4" },
          { name: "Fathima Harsha", github: "https://github.com/harsha-63" ,pfp:"https://avatars.githubusercontent.com/u/179564628?v=4" },
          { name: "Mohammed Sabik", github: "https://github.com/sa7ik" ,pfp:"https://avatars.githubusercontent.com/u/179564628?v=4" },
        ].map((member, index) => (
            <div
              key={index}
              className={`relative w-full md:w-1/4 h-80 p-6 bg-gray-50 rounded-lg shadow-md flex flex-col justify-start ${
                index % 2 === 0 ? "mt-[-20px]" : "md:mt-[20px]"
              } border-4 border-green-500`}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500">
                <IoMdContact className="text-4xl text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mt-6 mb-2 text-black text-center">{member.name}</h3>
              <p className="text-black text-center text-sm">MERN Stack Intern Developer</p>
              <Image src={member.pfp} alt="Profile Picture" width={100} height={100} className="w-20 h-20 rounded-full mx-auto mt-4" ></Image>
              <a
                href={member?.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 font-medium mt-4 text-center hover:underline"
              >
                Visit GitHub
              </a>
            </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default About;