import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>ABOUT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to AYOS, your trusted partner in managing your home appliance repair needs conveniently and efficiently. At AYOS, we understand the frustrations of dealing with unexpected appliance breakdowns and the need for prompt solutions.</p>
          <p>AYOS is committed to excellence in repair services. We continuously enhance our platform to connect homeowners and appliance owners with certified technicians, ensuring timely and professional service. Whether it’s a minor fix or a major repair, AYOS is here to restore functionality and bring convenience back to your life.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Our vision at AYOS is to revolutionize appliance repair services by creating a seamless and transparent experience. We aim to eliminate costly delays by bridging the gap between appliance owners and certified technicians, ensuring affordable, reliable, and prompt solutions right at your fingertips.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY  <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>Quickly connect with certified technicians to minimize downtime and restore functionality.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE: </b>
          <p>Request appliance repair services directly from your smartphone, anytime, anywhere.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>TRANSPARENCY:</b>
          <p>Enjoy clear and affordable pricing, ensuring no surprises on repair costs.</p>
        </div>
      </div>

    </div>
  )
}

export default About
