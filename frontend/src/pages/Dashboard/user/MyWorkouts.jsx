import React, { useEffect, useState } from 'react'
import useUser from '../../../hooks/useUser'
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import moment from 'moment'
import { MdDelete, MdUpdate } from 'react-icons/md';
import Swal from 'sweetalert2'
import { IoMdSearch } from "react-icons/io";
import { Link } from 'react-router-dom';

const MyWorkouts = () => {
  const {currentUser} = useUser();
  const [loading,setLoading] = useState(true);
  const [userWorkouts,setUserWorkouts] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [searchTerm,setSearchTerm] = useState("")
  const [workouts,setWorkouts] = useState([])
  const [hr,setHR] = useState([])

  useEffect(()=>{
    axiosSecure.get(`http://localhost:5000/userWorkout/${currentUser?.email}`)
    .then((res)=>{
      console.log(res.data)
      setUserWorkouts(res.data);
      setLoading(false)
    })
    .catch((error)=>{
      console.log(error);
      setLoading(false)
    })
  },[])

  useEffect(()=>{
    axiosSecure
      .get("http://localhost:5000/workout")
      .then((res)=>setWorkouts(res.data))
      .catch((err)=>console.log(err))
  },[])

  useEffect(()=>{
    axiosSecure
      .get(`http://localhost:5000/userHR/${currentUser?.email}`)
      .then((res)=>setHR(res.data))
      .catch((err)=>console.log(err))
  },[])

  const handleDelete=(id)=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`http://localhost:5000/userWorkout/${id}`)
        .then((res)=>{
            Swal.fire({
              title: "Deleted!",
              text: "Workout has been deleted from your list.",
              icon: "success",
              timer: 1500
            });
            const newUserWorkouts = userWorkouts.filter((item)=>item._id!==id);
            setUserWorkouts(newUserWorkouts);
          
          
        })
        .catch((error)=>{
          console.log(error)
        })
      }
    });
  }

  const handleUpdateDays = (id, currentDays) => {
    Swal.fire({
      title: 'Update Number of Finished Days',
      input: 'number',
      inputLabel: 'How many days have you finished?',
      inputValue: currentDays,
      showCancelButton: true,
      confirmButtonText: 'Update',
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return 'Please enter a valid number of days';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newDays = parseInt(result.value)
        axiosSecure.patch(`http://localhost:5000/userWorkout/${id}`, { finishedDays: newDays })
          .then((res) => {
            Swal.fire({
              title: 'Updated!',
              text: 'Number of days has been updated.',
              icon: 'success',
              timer: 1500
            });
            const updatedWorkouts = userWorkouts.map((item) =>
              item._id === id ? { ...item, finishedDays: result.value } : item
            );
            setUserWorkouts(updatedWorkouts);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };


  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div className='w-screen h-screen justify-top items-center'>
      <div className="bg-white p-8 w-[1000px] rounded-lg ">
        <div className='my-6 text-center'>
          <h1 className='text-4xl font-bold'>My <span className='text-secondary'>Workouts</span></h1>
        </div>
        <div className='flex'  style={{ display: 'flex', justifyContent: 'right', alignItems: 'right'}}>
          <input id='searchInput' type='text' placeholder='Search' 
          className='border-gray-300 border rounded-md py-2 px-4'
          onChange={(event)=>{
            setSearchTerm(event.target.value)
          }}
          />
          <IoMdSearch className='w-[40px] h-[40px]'/>
        </div>
        <div className='py-8'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='bg-white rounded-lg shadow-md p-6 mb-4 w-full'>
                <table className='w-full'>
                  <thead>
                    <tr>
                      <th className='text-left font-semibold'>#</th>
                      <th className='text-left font-semibold'>Workouts</th>
                      <th className='text-left font-semibold'>Finished Days</th>
                      <th className='text-left font-semibold'>Total Days</th>
                      <th className='text-left font-semibold'>Date</th>
                      <th className='text-left font-semibold'>Delete</th>
                      <th className='text-center font-semibold'>Update<br/> (Number of Days)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      userWorkouts.length === 0 ? <tr><td colSpan='7' className='text-center text-2xl'>No Workouts Found</td></tr>
                      :userWorkouts
                      .filter((item)=>{
                        const formattedDate = moment(item.data).format("MMMM Do YYYY").toLowerCase();
                        if(searchTerm ==""){
                          return item;
                        }else if(item.workoutName?.toLowerCase().includes(searchTerm.toLowerCase()) 
                        || formattedDate.includes(searchTerm.toLowerCase())
                        || item.finishedDays.toString().toLowerCase().includes(searchTerm.toLowerCase())
                        || item.totaldays.toString().toLowerCase().includes(searchTerm.toLowerCase())
                      ){
                          return item;
                        }
                      })
                      .map((item, index) => {
                        const finishedDays = item.finishedDays !== undefined ? item.finishedDays.toString() : 'N/A';
                        const totalDays = item.totaldays !== undefined ? item.totaldays.toString() : 'N/A';
                        const date = item.data ? moment(item.data).format("MMMM Do YYYY") : 'N/A';
                      
                        return (
                          <tr key={item._id}>
                            <td className='py-4'>{index + 1}</td>
                            <td className='py-4'>
                              <div className='flex items-center'>
                                <img src={item.workoutImg} className='h-16 w-16 mr-4 rounded-lg' alt='Workout' />
                                <span>{highlightText(item.workoutName, searchTerm)}</span>
                              </div>
                            </td>
                            <td className='py-4'>{highlightText(finishedDays, searchTerm)}</td>
                            <td className='py-4'>{highlightText(totalDays, searchTerm)}</td>
                            <td className='py-4'>
                              <p className='text-gray-500 text-sm'>
                                {highlightText(date, searchTerm)}
                              </p>  
                            </td>
                            <td>
                              <button onClick={() => handleDelete(item._id)} 
                                className='px-3 py-3 cursor-pointer bg-red-500 rounded-3xl text-white font-bold'>
                                <MdDelete />
                              </button>
                            </td>
                            <td className='text-center'>
                              <button onClick={() => handleUpdateDays(item._id, item.finishedDays)}
                                className='text-center px-12 py-3 cursor-pointer bg-green-500 rounded-3xl text-white font-bold'>
                                <MdUpdate />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                      
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className='my-6 text-center'>
          <h1 className='text-4xl font-bold'>Workout <span className='text-secondary'>reccomondations </span>for you</h1>
        </div>
        <div>
              {
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 '>
                  {
                    hr.documents? (
                      hr.documents[0].fitnessGoals && hr.documents[0].fitnessGoals.length > 0 ? (
                      workouts
                      .filter((workout)=>{
                        console.log(workout.forGoal)
                        console.log(hr.documents[0].fitnessGoals)
                        if (workout.forGoal.some(goal => hr.documents[0].fitnessGoals.includes(goal))) {
                          
                          return workout;
                        }                      
                      })
                      .map((workout)=>(
                        <div key={workout._id} className='shadow-lg rounded-lg p-3 flex flex-col justify-between border border-secondary overflow-hidden m-4'>
                          <div className='p-4 flex flex-col h-full'>
                            <h2 className='text-xl font-semibold mb-10 dark:text-white text-center'>{highlightText(workout.name, searchTerm)}</h2>
                            <div className='flex justify-center mb-4'>
                              <img className='shadow-lg rounded-lg' src={workout.workoutImg} alt="Workout Image" />
                            </div>
                            <div className='text-gray-600 mb-4 text-center'>
                              For: {workout.forGoal.map((goal, index) => (
                                <React.Fragment key={index}>
                                  {goal}
                                  {index !== workout.forGoal.length - 1 && <br />}
                                </React.Fragment>
                              ))}
                            </div>
                            <div className='mt-auto text-center'>
                              <Link to='/workouts'>
                                <button className='shadow-lg px-7 py-3 rounded-lg bg-secondary font-bold uppercase'>
                                  View Workouts
                                </button>
                              </Link>
                            </div>
                          </div>
                      </div>
                      ))
                      ) : (
                        <div className='col-span-1 md:col-span-2 lg:col-span-3 text-center text-lg text-black'>
                          To receive personalized recommendations, please provide your Fitness Goals
                          <br/>
                          <Link to='/dashboard/updateHealthdetails'>
                            <p className='underline'>Click Here to update Health Details</p>
                          </Link>
                          <br/>
                            <div className='mt-auto text-center'>
                              <Link to='/workouts'>
                                <button className='shadow-lg px-7 py-3 rounded-lg bg-secondary font-bold uppercase'>
                                  View All Workouts
                                </button>
                              </Link>
                            </div>
                        </div>
                      )
                    ) : (
                        <div className='col-span-1 md:col-span-2 lg:col-span-3 text-center text-lg text-black'>
                          To receive personalized recommendations, please provide your Fitness Goals
                          <br/>
                          <Link to='/dashboard/addHealthDetails'>
                            <p className='underline'>Click Here to add Health Details</p>
                          </Link>
                          <br/>
                          <div className='mt-auto text-center'>
                          <Link to='/workouts'>
                            <button className='shadow-lg px-7 py-3 rounded-lg bg-secondary font-bold uppercase'>
                              View All Workouts
                            </button>
                          </Link>
                        </div>
                        </div>
                    )
                  }
                </div>
              }
                <br/><br/>
                <br/>
        </div>
      </div>
    </div>
  )
}

export default MyWorkouts