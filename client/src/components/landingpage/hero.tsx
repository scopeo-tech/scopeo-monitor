import React from 'react'
import { IoMdSettings } from "react-icons/io";
import Image from 'next/image'
import device from "@/assets/device.svg"
import cloud from "@/assets/cloud.svg"
import dashboard from "@/assets/dahsboard.svg"
import notes from "@/assets/notes.svg"
import padlock from "@/assets/padlock.svg"
import piechart from "@/assets/piechart.svg"
import sheild from "@/assets/sheild.svg"
import blockchart from "@/assets/blockchart.svg"
import FloatingCircle from './floatingCircle';




function Hero() {
    return (
        <div className='w-full justify-between h-auto flex relative'>
                <FloatingCircle className='w-24 border-emerald-600 border-2 bottom-20 hover:w-28 hover:h-28 transition-all left-1/4 h-24'/>
            <div className='flex w-[35%] h-screen px-10 flex-col gap-7 justify-center relative'>
                <h1 className='text-6xl font-bold'>Website Monitoring & Analytics</h1>
                <p className='text-[#515151] text-xl font-semibold'>Monitor, analyze, and optimize your deployed projects witha fully integrated platform.
                    Our Project Monitoring Website helps you track uptime, response times, errors, and logs effortlessly.Detect issues faster,improve performance, and ensure seamless operations all from one powerful platform.</p>
                <button className='py-2 w-36 mt-5 hover:w-full hover:bg-emerald-600 transition-all duration-300 ease-out rounded-3xl bg-emerald-500 text-white'>Get Started</button>
            </div>
            <div className='w-[65%] h-[800px] rounded-bl-full bg-emerald-200 relative'>
                <Image src={cloud} alt='cloud' className='absolute top-[40px] left-[150px]' />
                <Image
                    src={device}
                    alt="device"
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 opacity-80"
                />
                <Image src={dashboard} alt='dashboard' className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3' height={350} width={350} />
                <IoMdSettings className='text-emerald-500 absolute top-[120px] left-[250px] text-6xl' />
                <IoMdSettings className='text-emerald-500 absolute top-[200px] right-[150px] text-7xl' />
                <Image src={padlock} alt='padlock' className='absolute top-[90px] right-[180px]' width={200} height={200} />
                <Image
                    src={piechart}
                    alt="piechart"
                    className="absolute top-[200px] left-[200px]"
                    style={{ transform: "rotate(150deg)" }}
                    width={100}
                    height={100}
                />
                <Image src={blockchart} alt='blockchart' className='absolute bottom-[300px] right-[80px]' width={250} height={250} />
                <Image src={sheild} alt='sheild' className='absolute top-[190px] left-[20px]' width={350} height={350} />
                <IoMdSettings className='text-emerald-600 absolute bottom-[300px] left-[300px] text-5xl' />
                <Image src={notes} alt='notes' className='absolute right-[250px] bottom-[250px]' width={200} height={200} />
            </div>
        </div>
    )
}

export default Hero
