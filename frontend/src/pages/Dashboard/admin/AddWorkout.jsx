import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUser from "../../../hooks/useUser";
import { useState } from "react";
import Swal from 'sweetalert2'

const AddWorkout = () => {
    const [formData, setFormData] = useState({
        forGoal: []
    });
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prevState => {
                if (checked) {
                    return {
                        ...prevState,
                        forGoal: [...prevState.forGoal, value]
                    };
                } else {
                    return {
                        ...prevState,
                        forGoal: prevState.forGoal.filter(goal => goal !== value)
                    };
                }
            });
        } else {
            setFormData({
            ...formData,
            [name]: value,
            });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            numberOfDays: parseInt(formData.numberOfDays, 10)
          };
            axiosSecure.post('http://localhost:5000/workout', updatedFormData)
                .then((res) => {
                    Swal.fire({
                    title: 'Success!',
                    text: 'Successfully Added a Workout.',
                    icon: 'success',
                    });
                    navigate('/dashboard/manageWorkouts');
                })
                .catch((error) => {
                    console.log(error);
                    Swal.fire({
                    title: 'Error!',
                    text: 'There was an error adding a Workout.',
                    icon: 'error',
                    });
                });
            
        
    };

  return (
    <div className='w-[1100px] h-screen justify-center items-top bg-white dark:bg-black flex'>
        <div className="bg-white p-3 rounded-lg text-center"><br/>
        <h2 className="text-3xl font-bold text-center mb-6 text-secondary">Add Workout</h2>
            <form onSubmit={handleSubmit} className="text-center">
                <div className="flex items-center ">
                    <div className="flex items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
                        <div>
                            <div className="mb-4">
                                <label htmlFor="name" className='block text-gray-700 font-bold mb-2'>
                                    Name of the Workout
                                </label>
                                <input 
                                type='text' 
                                name="name"
                                placeholder="Enter the Name of the Workout" 
                                onChange={handleChange}
                                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring
                                focus:border-blue-300"/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="workoutImg" className='block text-gray-700 font-bold mb-2'>
                                Workout Image
                                </label>
                                <input 
                                type='text' 
                                name="workoutImg"
                                placeholder="Enter the Image URL" 
                                onChange={handleChange}
                                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring
                                focus:border-blue-300"/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="numberOfDays" className='block text-gray-700 font-bold mb-2'>
                                Number Of Days
                                </label>
                                <input 
                                type='text' 
                                name="numberOfDays"
                                placeholder="Enter the Number Of Days" 
                                onChange={handleChange}
                                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring
                                focus:border-blue-300"/>
                            </div>
                        </div>
                        <div>
                            {/**howtodo */}
                            <div className="mb-4">
                                <label htmlFor="howToDo" className='block text-gray-700 font-bold mb-2'>
                                    How to Do:
                                </label>
                                <textarea 
                                    onChange={handleChange}
                                    name="howToDo"
                                    rows="9"
                                    className="border-gray-300 w-full
                                    border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
                                    placeholder="eg:-
    Step 1: ...
    Step 2: ...
    Step 3: ...">
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                            <label htmlFor="forGoal" className='block text-gray-700 font-bold mb-2'>
                                Goals that can achieve from Workout <br/>
                            </label>
                            <div className="flex items-center gap-2 md:grid-cols-3 lg:grid-cols-3">
                                <div>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Weight Loss"/> Weight Loss<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="General fitness"/> General fitness<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Overall Health"/> Overall Health<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Muscle Toning"/> Muscle Toning<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Cardiovascular Health"/> Cardiovascular Health<br/>
                                </div>
                                <div>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Improve Endurance"/> Improve Endurance<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Muscle Building"/> Muscle Building<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Improve Strength"/> Improve Strength<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Flexibility"/> Flexibility<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Stress Reduction"/> Stress Reduction<br/>
                                </div>
                                <div>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Injury Prevention"/> Injury Prevention<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Athletic performance"/> Athletic performance<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Improve Speed"/> Improve Speed<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Improve Speed"/> Improve Core strength<br/>
                                    <input className='w-full' type="checkbox" name="forGoal" onChange={handleChange} value="Improve Speed"/> Improve Stability
                                </div>
                            </div>
                    </div>
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-[#f2e48d] justify-center hover:bg-secondary text-black font-bold py-2 px-4 
                    rounded focus:outline-none focus:shadow-outline">
                        Submit Details
                    </button>
                </div>
                <br/>
            </form>
            <div className="text-center">
                <Link to="/dashboard/manageWorkouts">
                    <button className="bg-red-300 justify-center hover:bg-red-500 text-black font-bold py-2 px-4 
                      rounded focus:outline-none focus:shadow-outline">
                        Cancle
                    </button>
                </Link>
            </div>

        </div>
    </div>
  )
}

export default AddWorkout