import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  
  // State for date filter
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showFilterResults, setShowFilterResults] = useState(false)
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [totalSales, setTotalSales] = useState(0)

  // Function to handle filter
  const handleFilter = () => {
    if (!startDate || !endDate || !dashData) {
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59) // Set to end of day

    // Filter appointments by date range
    const filtered = dashData.latestAppointments.filter(appointment => {
      // Convert slotDate (format: DD_MM_YYYY) to Date object
      const dateParts = appointment.slotDate.split('_')
      const appointmentDate = new Date(
        parseInt(dateParts[2]), // Year
        parseInt(dateParts[1]) - 1, // Month (0-indexed)
        parseInt(dateParts[0]) // Day
      )
      
      return appointmentDate >= start && appointmentDate <= end
    })

    // Calculate total sales from filtered appointments
    const sales = filtered.reduce((total, appointment) => {
      // Only count completed or paid appointments
      if (appointment.isCompleted || appointment.payment) {
        return total + appointment.amount
      }
      return total
    }, 0)

    setFilteredAppointments(filtered)
    setTotalSales(sales)
    setShowFilterResults(true)
  }

  // Function to close filter results
  const closeFilterResults = () => {
    setShowFilterResults(false)
  }

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  // Only render the component when dashData is available
  return dashData ? (
    <div className='m-5'>

      <div className='flex flex-wrap justify-between items-center mb-3'>
        <div className='flex flex-wrap gap-3'>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.doctor_icon} alt="" />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
              <p className='text-gray-400'>Technician</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.appointments_icon} alt="" />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
              <p className='text-gray-400'>Appointments</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.patients_icon} alt="" />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
              <p className='text-gray-400'>Customers</p></div>
          </div>
        </div>
        
        {/* Date Range Filter */}
        <div className='flex items-center gap-2 mt-3 sm:mt-0'>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='border rounded px-2 py-1 text-sm'
          />
          <span>to</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='border rounded px-2 py-1 text-sm'
          />
          <button 
            onClick={handleFilter}
            className='bg-primary text-white px-3 py-1 rounded text-sm'
          >
            Filter
          </button>
        </div>
      </div>

      {/* Filter Results */}
      {showFilterResults && (
        <div className='bg-white p-4 mb-4 rounded border'>
          <div className='flex justify-between items-center mb-2'>
            <h3 className='font-medium'>Filter Results</h3>
            <button 
              onClick={closeFilterResults}
              className='text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          </div>
          <p>Period: {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}</p>
          <p>Appointments: {filteredAppointments.length}</p>
          <p>Total Sales: {currency}{totalSales}</p>
          
          <div className='mt-3'>
            <h4 className='font-medium mb-2'>Appointments in this period:</h4>
            <div className='max-h-60 overflow-y-auto'>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <div key={index} className='border-b py-2 flex justify-between'>
                    <div>
                      <p className='font-medium'>{appointment.userData.name}</p>
                      <p className='text-sm text-gray-600'>{slotDateFormat(appointment.slotDate)}, {appointment.slotTime}</p>
                    </div>
                    <div className='text-right'>
                      <p>{currency}{appointment.amount}</p>
                      <p className='text-sm'>
                        {appointment.cancelled ? (
                          <span className='text-red-500'>Cancelled</span>
                        ) : appointment.isCompleted ? (
                          <span className='text-green-500'>Completed</span>
                        ) : (
                          <span className='text-blue-500'>Pending</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-500'>No appointments found in this period.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Latest Appointments Section */}
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 10).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-10' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-600 '>Technician</p>
              </div>
              <p className='text-gray-600 font-medium'>{currency}{item.amount}</p>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
              }
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'>
        <div className='bg-white p-4 rounded border'>
          <h3 className='font-medium mb-2'>Total Revenue</h3>
          <p className='text-2xl font-bold'>{currency}{dashData.totalSales || 0}</p>
          <p className='text-sm text-gray-500 mt-1'>From all appointments</p>
        </div>
        
        <div className='bg-white p-4 rounded border'>
          <h3 className='font-medium mb-2'>Completion Rate</h3>
          <p className='text-2xl font-bold'>
            {dashData.appointments > 0 
              ? Math.round((dashData.completedAppointments / dashData.appointments) * 100) 
              : 0}%
          </p>
          <p className='text-sm text-gray-500 mt-1'>
            {dashData.completedAppointments || 0} completed out of {dashData.appointments || 0}
          </p>
        </div>
        
        <div className='bg-white p-4 rounded border'>
          <h3 className='font-medium mb-2'>Active Technicians</h3>
          <p className='text-2xl font-bold'>
            {dashData.activeDoctor || 0} / {dashData.doctors || 0}
          </p>
          <p className='text-sm text-gray-500 mt-1'>Currently available technicians</p>
        </div>
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-[80vh]'>
      <div className='w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin'></div>
    </div>
  )
}

export default Dashboard

// Prepare data for technician availability pie chart
const getTechnicianChartData = () => {
  console.log("Dashboard Data:", dashData);
  
  // Create hardcoded data for demonstration
  return {
    labels: ['Available', 'Unavailable'],
    datasets: [
      {
        data: [3, 2],  // Hardcoded values for demonstration
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#388E3C', '#D32F2F'],
        borderWidth: 1,
      },
    ],
  };
}

// Prepare data for sales quota pie chart
const getSalesChartData = () => {
  // Create hardcoded data for demonstration
  const quota = 20000;
  const currentSales = 8500;  // Hardcoded value for demonstration
  const remainingQuota = quota - currentSales;
  
  return {
    labels: ['Current Sales', 'Remaining Quota'],
    datasets: [
      {
        data: [currentSales, remainingQuota],
        backgroundColor: ['#2196F3', '#E0E0E0'],
        borderColor: ['#1976D2', '#9E9E9E'],
        borderWidth: 1,
      },
    ],
  };
}