import React, { useState } from 'react'
import Dashboard from '../pages/Dashboard/Dashboard'
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import logoBlack from "/logo-black.png";
import {BiHomeAlt} from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import {  } from "react-icons/io";
import {  } from "react-icons/si";
import { CgGym } from "react-icons/cg";
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import Swal from 'sweetalert2'
import Scroll from '../hooks/useScroll';
import RotateLoader from 'react-spinners/RotateLoader';
import { IoMailUnreadSharp } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";

const adminNavItems=[
    {
        to:"/dashboard/adminHome", 
        icon: <BiHomeAlt className='text-4xl'/>, 
        label:"Dashboard Home"
    },
    {
        to:"/dashboard/manageUser", 
        icon: <FaUsers className='text-4xl'/>, 
        label:"Users"
    },
    {
        to:"/dashboard/manageDiets", 
        icon: <IoFastFoodSharp className='text-4xl'/>, 
        label:"Diets"
    },
    {
        to:"/dashboard/manageWorkouts", 
        icon: <CgGym className='text-4xl'/>, 
        label:"Workouts"
    },
    {
        to:"/dashboard/manageInstructors", 
        icon: <FaChalkboardTeacher className='text-4xl'/>, 
        label:"Instructors"
    },
    {
        to:"/dashboard/userRequests", 
        icon: <IoMailUnreadSharp className='text-4xl'/>, 
        label:"User Requests"
    },
    {
        to:"/dashboard/allFeedback", 
        icon: <VscFeedback className='text-4xl'/>, 
        label:"FeedBack"
    }
]

const userNavItems=[
    {
        to:"/dashboard/userP", 
        icon: <BiHomeAlt className='text-4xl'/>, 
        label:"Dashboard"
    },
    {
        to:"/dashboard/my-Diets", 
        icon: <IoFastFoodSharp className='text-4xl'/>, 
        label:" My Diets"
    },
    {
        to:"/dashboard/my-Workouts", 
        icon: <CgGym className='text-4xl'/>, 
        label:"My Workouts"
    },
    {
        to:"/dashboard/my-Instructors", 
        icon: <FaChalkboardTeacher className='text-4xl'/>, 
        label:"My Instructors"
    },
]

const lastMenuItems=[
    {
        to:"/",
        icon:<BiHomeAlt className='text-4xl'/>,
        label:"Main Home"

    },

]

const DashboardLayout = () => {
    const [open, setOpen] = useState(true);
    const {loader,logout} = useAuth();
    const {currentUser} = useUser();
    const role = currentUser?.role;
    const navigate = useNavigate();

    if(loader){
        return <div className='flex justify-center items-center h-screen'>
          <RotateLoader color="#C1A917" />
        </div>
    }

    const handleLogOut = ()=>{
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Log Out Me!"
          }).then((result) => {
            if (result.isConfirmed) {
                logout(currentUser.email, currentUser.password).then(Swal.fire({                
                title: "Loged Out!",
                text: "You have logged out from your acoount.",
                icon: "success",
                timer: 1500
              }) 
            ).catch((err)=>
                    console.log(err)
            );
            navigate("/");
              
            }
          });
    }

  return (
    <div className='flex fixed overflow-hidden' >
        <div className={`${open ? " w-60 overflow-y-auto":"w-[110px] overflow-auto"}  bg-[#e4c91b] h-screen p-5 
        md:block hidden pt-6  duration-300`}>
            <div className='flex gap-x-4 items-center'>
                <img onClick={()=>setOpen(!open)} src={logoBlack} alt='' className={`cursor-pointer h-[60px] duration-500 
                ${open && "rotate-[360deg] "}`}/> 
                <Link to="/">
                <h1 onClick={()=>setOpen(!open)} className={`text-dark-primary cursor-pointer font-bold origin-left 
                text-xl duration-200 ${!open && "scale-0"}`}>Active-Life</h1>  
                </Link> 
            </div>
            {
                role === "admin" && 
                <ul className='pt-6'>
                    <p className={`ml-3 text-gray-700 ${!open && "hidden"}`}><small>MENU</small></p>
                
                    {
                        role === "admin" && adminNavItems.map((menuItem, index) => (
                            <li className='mb-2' key={index}>
                                <NavLink to={menuItem.to}
                                    className={({ isActive }) =>
                                        `flex ${isActive ? "bg-[#f2e48d] text-black" : "text-[#413F44]"} "p-2 items-center gap-x-4 rounded-md 
                                        duration-150 cursor-pointer font-bold text-sm  hover:bg-secondary hover:text-black"`
                                    }>
                                    {menuItem.icon}
                                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                                        {menuItem.label}
                                    </span>
                                </NavLink>
                            </li>
                        ))
                    }

                </ul>
            }
            {
                role === "user" && 
                <ul className='pt-6'>
                    <p className={`ml-3 text-gray-700 ${!open && "hidden"}`}><small>MENU</small></p>
                
                    {
                        role === "user" && userNavItems.map((menuItem, index) => (
                            <li className='mb-2' key={index}>
                                <NavLink to={menuItem.to}
                                    className={({ isActive }) =>
                                        `flex ${isActive ? "bg-[#f2e48d] text-black" : "text-[#413F44]"} "p-1 items-center gap-x-4 rounded-md 
                                        duration-150 cursor-pointer font-bold text-sm  hover:bg-secondary hover:text-black"`
                                    }>
                                    {menuItem.icon}
                                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                                        {menuItem.label}
                                    </span>
                                </NavLink>
                            </li>
                        ))
                    }

                </ul>
            }
            {
                
                    <ul className='pt-6'>
                        <div className="flex items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
                            <div>
                            {lastMenuItems.map((menuItem, index) => (
                                <li className='mb-2 flex items-center' key={index}>
                                <NavLink to={menuItem.to}
                                    className={({ isActive }) =>
                                    `flex ${isActive ? "bg-[#f2e48d] text-black" : "text-[#413F44]"} p-1 items-center gap-x-4 rounded-md 
                                    duration-150 cursor-pointer font-bold text-sm hover:bg-secondary hover:text-black`
                                    }>
                                    {menuItem.icon}
                                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                                    {menuItem.label}
                                    </span>
                                </NavLink>
                                </li>
                            ))}
                            </div>
                            <div>
                                <li className='flex items-center'>
                                    <button
                                    onClick={() => handleLogOut()}
                                    className="p-1 flex items-center gap-x-4 rounded-md text-[#413F44]
                                        duration-150 cursor-pointer font-bold text-sm hover:bg-secondary hover:text-black">
                                    <IoMdLogOut className='text-2xl' />
                                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                                        LogOut
                                    </span>
                                    </button>
                                </li>
                    
                            </div>
                        </div>
                    </ul>
                
            }
        </div>
        <div className='overflow-x-auto overflow-y-auto flex-grow'>
            <Scroll/>
            <Outlet/>
        </div>
    </div>
    
  )
}

export default DashboardLayout