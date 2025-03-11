import React from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { MdSecurity, MdErrorOutline, MdSpeed, MdStorage } from "react-icons/md";
import Image from "next/image";
import login from "@/assets/login.svg";
import server from "@/assets/server.svg";
import sheildtwo from "@/assets/sheildtwo.svg";

function Features() {
  const features = [
    {
      img: <MdSecurity className="text-3xl text-emerald-700" />,
      title: "Access Monitoring",
      desc: "Monitor all login attempts, detect unusual activity, and prevent unauthorized access in real-time.",
    },
    {
      img: <MdErrorOutline className="text-3xl text-emerald-700" />,
      title: "Error Tracker",
      desc: "Automatically track server errors, identify root causes, and provide insights to help you resolve issues quickly.",
    },
    {
      img: <MdSpeed className="text-3xl text-emerald-700" />,
      title: "Performance & Health",
      desc: "Analyze server performance with real-time metrics on CPU, memory, uptime, and response times.",
    },
    {
      img: <MdStorage className="text-3xl text-emerald-700" />,
      title: "Logger",
      desc: "Store detailed logs of server activities for tracking changes, debugging, and ensuring compliance.",
    },
  ];

  return (
    <div className="w-full flex px-10 justify-between">
      {/* Left Section */}
      <div className="flex flex-col w-1/2 justify-between gap-5">
        <div>
          <h1 className="text-5xl font-bold text-black">Features our service</h1>
          <h1 className="text-5xl text-emerald-500 font-bold">provides you</h1>
        </div>
        <p className="font-semibold text-[#515151] w-2/3">
          Our platform provides powerful monitoring tools to help you secure your system, track errors, and optimize performance efficiently.
        </p>

        {/* Background Design Elements */}
        <div className="w-full h-[600px] relative flex items-center justify-center overflow-hidden">
          <IoSettingsSharp className="absolute text-[100px] text-emerald-700 top-5 left-[250px]" />
          <Image src={login} alt="login" className="bottom-[120px] absolute right-[80px] -z-10" width={250} height={250} />
          <div className="w-20 h-20 bg-emerald-200 rounded-md absolute top-20 right-40" />
          <div className="w-20 h-20 bg-emerald-700 rounded-md absolute top-52 left-[250px]" />
          <div className="w-36 h-14 bg-emerald-600 rounded-md absolute top-70 left-[250px]" />
          <div className="w-28 h-28 bg-emerald-300 shadow-md rounded-md absolute top-36 right-20" />
          <IoSettingsSharp className="absolute text-7xl text-emerald-700 bottom-[130px] right-[130px]" />
          <IoSettingsSharp className="absolute text-3xl text-emerald-400 bottom-[140px] right-[100px]" />
          <Image src={server} alt="server" className="bottom-[200px] left-[0px] absolute" width={250} height={250} />
          <Image src={sheildtwo} alt="sheildtwo" className="-bottom-[250px] absolute right-[150px]" width={600} height={600} />
          <div className="h-20 w-20 rounded-full bg-green-300 absolute bottom-[150px] right-[250px]" />
          <div className="w-[200px] rounded-xl p-5 h-[350px] bg-emerald-500">
            <div className="w-full h-full bg-green-200" />
          </div>
        </div>
      </div>

      {/* Right Section (Updated Layout) */}
      <div className="flex gap-10 py-36 w-auto">
        {/* Vertical Line with Nodes on the Left */}
        <div className="w-l flex flex-col justify-between py-10 h-full border-l-2 border-[#515151] relative">
          {features.map((_, index) => (
            <div key={index} className="relative w-20 border-b-2 border-[#515151]">
              {/* Node on the Left */}
              <div className="absolute -right-2 w-3 h-3 bg-[#515151] rounded-full" />
            </div>
          ))}
        </div>

        {/* Details Section on the Right */}
        <div className="flex flex-col justify-between h-full">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-emerald-100 rounded-lg shadow-md">
              {/* Circular Icon Container */}
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-200">
                {feature.img}
              </div>
              <div className="max-w-xs">
                <h2 className="text-lg font-bold text-black">{feature.title}</h2>
                <p className="text-sm font-semibold text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
