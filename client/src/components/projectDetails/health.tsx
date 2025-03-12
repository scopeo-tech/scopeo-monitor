import React from 'react'
import HealthGraph from './helper/healthGraph'


const Health = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* First row */}
      <div className="bg-gray-200 p-4 col-span-1">
      </div>
      <div className="bg-gray-300 p-4 col-span-2">
        <HealthGraph />
      </div>

      {/* Second row */}
      <div className="bg-gray-400 p-4 col-span-1">Part 3</div>
      <div className="bg-gray-500 p-4 col-span-1">Part 4</div>
      <div className="bg-gray-600 p-4 col-span-1">Part 5</div>
    </div>
  )
}

export default Health
