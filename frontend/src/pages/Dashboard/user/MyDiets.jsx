import React, { useEffect, useState } from 'react'
import useUser from '../../../hooks/useUser'
import { Link, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import moment from 'moment'
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2'
import { IoMdSearch } from "react-icons/io";

const MyDiets = () => {
  const {currentUser} = useUser();
  const [loading,setLoading] = useState(true);
  const [userDiets,setUserDiets] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [searchTerm,setSearchTerm] = useState("")
  const [diets,setDiets] = useState([])
  const text="No reccomondations"
  
  const [hr,setHR] = useState([])
  const role = currentUser?.role

  useEffect(()=>{
    axiosSecure.get(`http://localhost:5000/userDiet/${currentUser?.email}`)
    .then((res)=>{
      console.log(res.data)
      setUserDiets(res.data);
      setLoading(false)
    })
    .catch((error)=>{
      console.log(error);
      setLoading(false)
    })
  },[])

  useEffect(()=>{
    axiosSecure
      .get("http://localhost:5000/diet")
      .then((res)=>setDiets(res.data))
      .catch((err)=>console.log(err))
  },[])

  useEffect(()=>{
    axiosSecure
      .get(`http://localhost:5000/userHR/${currentUser?.email}`)
      .then((res)=>setHR(res.data))
      .catch((err)=>console.log(err))
  },[])

  console.log(hr)

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
        axiosSecure.delete(`http://localhost:5000/userDiet/${id}`)
        .then((res)=>{
            Swal.fire({
              title: "Deleted!",
              text: "Diet has been deleted from your list.",
              icon: "success",
              timer: 1500
            });
            const newUserDiets = userDiets.filter((item)=>item._id!==id);
            setUserDiets(newUserDiets);

        })
        .catch((error)=>{
          console.log(error)
        })
      }
    });
  }

  if(loading){
    return <div>Loading...</div>
  }
  
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

  return (
    <div className='w-screen h-screen justify-top items-center'>
        <div className="bg-white p-8 w-[1000px] rounded-lg ">
        <div className='my-6 text-center'>
          <h1 className='text-4xl font-bold'>My <span className='text-secondary'>Diets</span></h1>
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
                      <th className='text-left font-semibold'>Diet</th>
                      <th className='text-left font-semibold'>Date</th>
                      <th className='text-left font-semibold'>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      userDiets.length === 0 ? <tr><td colSpan='4' className='text-center text-2xl'>No Diets Found</td></tr>
                      :userDiets
                      .filter((item)=>{
                        const formattedDate = moment(item.data).format("MMMM Do YYYY").toLowerCase();
                        if(searchTerm ==""){
                          return item;
                        }else if(item.dietName?.toLowerCase().includes(searchTerm.toLowerCase()) 
                        || formattedDate.includes(searchTerm.toLowerCase())){
                          return item;
                        }
                      })
                      .map((item,index)=>{
                        const date = item.date ? moment(item.date).format("MMMM Do YYYY") : 'N/A';
                        return <tr key={item._id}>
                            <td className='py-4'>{index+1}</td>
                            <td className='py-4'>
                              <div className='flex items-center'>
                                <img src={item.dietImg} className='h-16 w-16 mr-4 rounded-lg'/>
                                <span>{highlightText(item.dietName, searchTerm)}</span>
                              </div></td>
                            <td className='py-4'>
                              <p className='text-gray-500 text-sm'>
                                {highlightText(date, searchTerm)}
                              </p>  
                            </td>
                            <td>
                              <button onClick={()=>handleDelete(item._id)} 
                              className='px-3 py-3 cursor-pointer bg-red-500 rounded-3xl text-white font-bold'>
                                <MdDelete/>
                              </button>
                              
                            </td>
                        </tr>
                        
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className='my-6 text-center'>
          <h1 className='text-4xl font-bold'>Diet <span className='text-secondary'>reccomondations </span>for you</h1>
        </div>
        <div>
          {
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 '>
              {
                hr.documents ? (
                  hr.documents[0].fitnessGoals && hr.documents[0].fitnessGoals.length > 0 ? (
                          diets
                          .filter((diet) => {
                            if (hr.documents) {
                              console.log(diet.forGoal);
                              console.log(hr.documents[0].fitnessGoals);
                              if (diet.forGoal.some(goal => hr.documents[0].fitnessGoals.includes(goal))) {
                                return diet;
                              }
                            }
                            return false;
                          })
                          .map((diet) => (
                              <div key={diet._id} className='shadow-lg rounded-lg p-3 flex flex-col justify-between border border-secondary overflow-hidden m-4'>
                                <div className='p-4 flex flex-col h-full'>
                                  <h2 className='text-xl font-semibold mb-10 dark:text-white text-center'>{highlightText(diet.name, searchTerm)}</h2>
                                  <div className='flex justify-center  mb-4'>
                                    <img className='shadow-lg rounded-lg' src={diet.dietImg} alt="Diet Image" />
                                  </div>
                                  <br />
                                  <div className='text-gray-600 mb-2 text-center'>
                                    For: {diet.forGoal.map((goal, index) => (
                                      <React.Fragment key={index}>
                                        {goal}
                                        {index !== diet.forGoal.length - 1 && <br />}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                  <div className='mt-auto text-center'>
                                    <Link to='/diets'>
                                      <button className='shadow-lg px-7 py-3 rounded-lg bg-secondary font-bold uppercase'>
                                        View Diets
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
                          <Link to='/diets'>
                            <button className='shadow-lg px-7 py-3 rounded-lg bg-secondary font-bold uppercase'>
                              View All Diets
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
                      <Link to='/diets'>
                        <button className='shadow-lg px-7 py-3 rounded-lg bg-secondary font-bold uppercase'>
                          View All Diets
                        </button>
                      </Link>
                    </div>
                    </div>
                )
              }
            </div>
          }
          <br/><br/><br/>
        </div>
      </div>
    </div>
  )
}

export default MyDiets
