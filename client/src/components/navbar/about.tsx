import Image from "next/image";
import { IoMdContact } from "react-icons/io";
import Navbar from "../layout/navbar/navbar";
import Aboutus from '@/assets/Aboutus.svg'

const About: React.FC = () => {
  return (
    
    <div className="w-full">
        <Navbar/>
      {/* First Section: Split Layout */}
      <div className="flex h-screen w-full">
        {/* Left Side: Text Content */}
        <div className="w-1/2 flex flex-col justify-center p-10 bg-gray-100">
          <h1 className="text-4xl font-bold mb-4">Empowering Teams,
Simplifying Project Management
</h1>
          <p className="text-lg text-gray-600">
          Managing projects can be complex, but our platform makes it effortless. Our Project Management Website helps teams plan, collaborate, and track progress seamlessly. With features like task management, real-time collaboration, and analytics, we simplify workflows and boost productivity. Stay organized, meet deadlines, and manage projects with ease!
Designed for teams of all sizes, our platform adapts to your workflow and scales with your needs.Experience smarter project management with intuitive tools and seamless integrations.

          </p>
        </div>

        {/* Right Side: Image */}
        <div className="w-1/2 relative h-full">
          <Image
            src={Aboutus}
            alt="website"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Second Section: Our Missions */}
      <div className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-10">Our Missions</h2>

        <div className="flex justify-around gap-8 px-10">
  <div className="w-1/4 h-64 p-6 bg-emerald-500 rounded-lg shadow-md flex flex-col justify-center items-center">
    <h3 className="text-xl font-semibold mb-2 text-white">Improving Collaboration</h3>
    <p className="text-gray-100 text-center">
    Foster seamless teamwork with real-time
 communication, task assignments
, and shared workspaces.
    </p>
  </div>

  <div className="w-1/4 h-64 p-6 bg-emerald-500 rounded-lg shadow-md flex flex-col justify-center items-center">
    <h3 className="text-xl font-semibold mb-2 text-white">Tracking Progress</h3>
    <p className="text-gray-100 text-center">
    Keep projects on track with detailed
 timelines, milestones, and performance
 insights.
    </p>
  </div>

  <div className="w-1/4 h-64 p-6 bg-emerald-500 rounded-lg shadow-md flex flex-col justify-center items-center">
    <h3 className="text-xl font-semibold mb-2 text-white">Enhancing Productivity</h3>
    <p className="text-gray-100 text-center">
    Automate workflows, streamline tasks, 
and optimize efficiency to achieve better
 results faster.
    </p>
  </div>
</div>
<div className="py-20 text-center bg-white">

  <h2 className="text-3xl font-bold mb-10">Who Are We</h2>

  <div className="flex justify-around gap-8 px-10">
  <div className="relative w-1/4 h-80 p-6 bg-gray-50 rounded-lg shadow-md flex flex-col justify-start mt-[-20px] border-4 border-green-500">

  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500">
    <IoMdContact className="text-4xl text-green-500" />
  </div>

  {/* Name */}
  <h3 className="text-xl font-semibold mt-6 mb-2 text-black text-center">   Muhammed Irfan</h3>
  
  {/* Position */}
  <p className="text-black text-center">Founder</p>

  {/* Description */}
  <p className="text-black mt-4">
    Irfan is responsible for company strategy and business development. 
    With 10+ years of experience, he leads innovation and growth.
  </p>
</div>

  <div className="relative w-1/4 h-80 p-6 bg-gray-50 rounded-lg shadow-md flex flex-col justify-start mt-[20px] border-4 border-green-500">

  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500">
    <IoMdContact className="text-4xl text-green-500" />
  </div>

  {/* Name */}
  <h3 className="text-xl font-semibold mt-6 mb-2 text-black text-center">Navaf</h3>
  
  {/* Position */}
  <p className="text-black text-center">CTO</p>

  {/* Description */}
  <p className="text-black mt-4">
    Navaf drives the tech vision, ensuring cutting-edge solutions and 
    technical excellence across all projects.
  </p>
</div>

  <div className="relative w-1/4 h-80 p-6 bg-gray-50 rounded-lg shadow-md flex flex-col justify-start mt-[-20px] border-4 border-green-500">

  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500">
    <IoMdContact className="text-4xl text-green-500" />
  </div>

  {/* Name */}
  <h3 className="text-xl font-semibold mt-6 mb-2 text-black text-center">Fathima Harsha</h3>
  
  {/* Position */}
  <p className="text-black text-center">Lead Designer</p>

  {/* Description */}
  <p className="text-black mt-4">
    Harsha oversees UI/UX design, creating intuitive and visually 
    stunning experiences for users worldwide.
  </p>
</div>

<div className="relative w-1/4 h-80 p-6 bg-gray-50 rounded-lg shadow-md flex flex-col justify-start mt-[20px] border-4 border-green-500">

  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500">
    <IoMdContact className="text-4xl text-green-500" />
  </div>

  {/* Name */}
  <h3 className="text-xl font-semibold mt-6 mb-2 text-black text-center">Mohammed Sabik</h3>
  
  {/* Position */}
  <p className="text-black text-center">Developer</p>

  {/* Description */}
  <p className="text-black mt-4">
  Sabik is a passionate software developer with expertise in building scalable web applications
  </p>
</div>

</div>


</div>


      </div>
    </div>
  );
};

export default About;
