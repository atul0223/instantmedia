import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHome, FaSearch, FaBell, FaUser, FaPlus } from 'react-icons/fa'
import UserContext from '../context/UserContext'
export default function Nav() {

    const {currentUserName} =useContext(UserContext)
    const navigate =useNavigate()
  return (
     <div className="sticky bottom-4 w-82 bg-zinc-100 shadow-lg z-50 rounded-full m-auto">
      <div className="flex justify-between items-center px-10 py-6 relative">
        {/* Navigation Icons */}
        <FaHome className="text-xl text-gray-600 hover:text-black" onClick={()=>(navigate("/home"))}/>
        <FaSearch className="text-xl text-gray-600 hover:text-black mr-15" />
        
        {/* Floating Action Button */}
        <div className="absolute left-1/2 transform -translate-x-1/2 rounded-full overflow-hidden bg-black">
          <button className=" text-white p-4  rounded-full shadow-xl hover:bg-blue-600 ">
            <FaPlus />
          </button>
        </div>

        <FaBell className="text-xl text-gray-600 hover:text-black" />
        <FaUser className="text-xl text-gray-600 hover:text-black" onClick={()=>(navigate( `/profile?user=${currentUserName}`))}/>
      </div>
    </div>
  )
}
