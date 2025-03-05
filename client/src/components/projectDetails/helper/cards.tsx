"use client"
import React from 'react'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { MdErrorOutline, MdOutlineReportGmailerrorred, MdGppBad } from "react-icons/md";

export interface ISecurity {
    totalLogins: number;
    successLogins: number;
    failedLogins: number;
    totalUnusual: number;
    unusualHighFreq: number;
    unusualConsecSuccess: number;
    bruteForce: number;
}

const Cards = ({ stats = { totalLogins: 0, successLogins: 0, failedLogins: 0, totalUnusual: 0, unusualHighFreq: 0, unusualConsecSuccess: 0, bruteForce: 0 }, isLoading }: { stats : ISecurity, isLoading: boolean }) => {
    
    return (
        <div className='w-full flex items-center justify-between h-20'>
            <div className='w-52 flex p-1 h-full bg-white rounded-lg'>
                <div>
                    <p className='text-gray-400 font-semibold text-sm'>Total logins</p>
                    {isLoading ? <p className='text-[#16C47F] text-3xl font-bold'>00</p> : <p className='text-[#16C47F] text-3xl font-bold'>{stats.totalLogins}</p>}
                    <p className='text-[#16C47F] text-xs'>Total attempts</p>
                </div>
                <div className='h-full flex items-center flex-grow justify-center'>
                    <AiOutlineCheckCircle className='text-[#16C47F] text-5xl' />
                </div>
            </div>
            <div className='w-52 flex p-1 h-full bg-white rounded-lg'>
                <div>
                    <p className='text-gray-400 font-semibold text-sm'>Failed logins</p>
                    {isLoading ? <p className='text-[#16C47F] text-3xl font-bold'>00</p> : <p className='text-red-400 text-3xl font-bold'>{stats.failedLogins}</p>}
                    <p className='text-red-400 text-xs'>failed attempts</p>
                </div>
                <div className='h-full flex items-center flex-grow justify-center'>
                    <MdErrorOutline className='text-[#16C47F] text-5xl' />
                </div>
            </div>
            <div className='w-52 flex p-1 h-full bg-white rounded-lg'>
                <div>
                    <p className='text-gray-400 font-semibold text-sm'>Unusual logins</p>
                    {isLoading? <p className='text-[#16C47F] text-3xl font-bold'>00</p> : <p className='text-yellow-300 text-3xl font-bold'>{stats.totalUnusual}</p>}
                    <p className='text-yellow-300 text-xs'>unusual login attempts</p>
                </div>
                <div className='h-full flex items-center flex-grow justify-center'>
                    <MdOutlineReportGmailerrorred className='text-[#16C47F] text-5xl' />
                </div>
            </div>
            <div className='w-52 flex p-1 h-full bg-white rounded-lg'>
                <div>
                    <p className='text-gray-400 font-semibold text-sm'>Brute force attacks</p>
                    {isLoading ? <p className='text-[#16C47F] text-3xl font-bold'>00</p> : <p className='text-orange-400 text-3xl font-bold'>{stats.bruteForce}</p>}
                    <p className='text-orange-400 text-xs'>brute force attempts</p>
                </div>
                <div className='h-full flex items-center flex-grow justify-center'>
                    <MdGppBad className='text-[#16C47F] text-5xl' />
                </div>
            </div>
        </div>
    )
}

export default Cards