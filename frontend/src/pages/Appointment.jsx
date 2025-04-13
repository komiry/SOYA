import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, backendUrl, token, getDoctosData } = useContext(AppContext)
    const currencySymbol = '₱' // Changed from using AppContext currency symbol to peso symbol
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    
    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {
        setDocSlots([])
        
        // Create base date for calculations
        let baseDate = new Date()
        baseDate.setDate(baseDate.getDate() + (currentPage * 7))
        
        for (let i = 0; i < 7; i++) {
            // Create new date object for each day
            let currentDate = new Date(baseDate)
            currentDate.setDate(baseDate.getDate() + i)
            
            let endTime = new Date(currentDate)
            endTime.setHours(21, 0, 0, 0)
            
            // Check if it's today
            let today = new Date()
            if (currentDate.getDate() === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // Use the actual date object values for slot date
                const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`
                
                const isBooked = docInfo.slots_booked[slotDate]?.includes(formattedTime) || false
                const isPastTime = currentDate < new Date()
                
                if (!isBooked && !isPastTime) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }
                
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            
            if (timeSlots.length > 0) {
                setDocSlots(prev => ([...prev, timeSlots]))
            }
        }
    }

    // Add pagination controls
    const handleNextWeek = () => {
        if (currentPage < 51) { // 52 weeks in a year
            setCurrentPage(prev => prev + 1)
            setSlotIndex(0)
            setSlotTime('')
        }
    }

    const handlePrevWeek = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1)
            setSlotIndex(0)
            setSlotTime('')
        }
    }

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo, currentPage]) // Add currentPage as dependency

    const bookAppointment = async () => {

        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        const date = docSlots[slotIndex][0].datetime

        // Fix: Use the correct date from the datetime object
        let day = date.getDate()
        let month = date.getMonth()  // Months are 0-based in JavaScript
        let year = date.getFullYear()

        const slotDate = `${day}_${month}_${year}`

        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', 
                { docId, slotDate, slotTime }, 
                { headers: { token } }
            )
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    return docInfo ? (
        <div>

            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.degree}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    {/* ----- Doc Info section ----- */}
                    <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span> </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                <div className='flex justify-between items-center'>
                    <p>Booking slots</p>
                    <div className='flex gap-2'>
                        <button 
                            onClick={handlePrevWeek}
                            disabled={currentPage === 0}
                            className={`px-4 py-2 rounded ${currentPage === 0 ? 'bg-gray-200' : 'bg-primary text-white'}`}
                        >
                            Previous Week
                        </button>
                        <button 
                            onClick={handleNextWeek}
                            disabled={currentPage >= 51}
                            className={`px-4 py-2 rounded ${currentPage >= 51 ? 'bg-gray-200' : 'bg-primary text-white'}`}
                        >
                            Next Week
                        </button>
                    </div>
                </div>

                {/* Month Title */}
                {docSlots.length > 0 && docSlots[0][0] && (
                    <div className='text-xl font-semibold mt-6 mb-4'>
                        {months[docSlots[0][0].datetime.getMonth()]} {docSlots[0][0].datetime.getFullYear()}
                    </div>
                )}

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}>
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                            <p className="text-xs">{item[0] && months[item[0].datetime.getMonth()]}</p>
                        </div>
                    ))}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-light  flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}>{item.time.toLowerCase()}</p>
                    ))}
                </div>

                <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'>Book an appointment</button>
            </div>
        </div>
    ) : null
}

export default Appointment