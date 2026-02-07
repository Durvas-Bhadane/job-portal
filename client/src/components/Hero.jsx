import { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {

    const { setSearchFilter, setIsSearched } = useContext(AppContext)

    const titleRef = useRef(null)
    const locationRef = useRef(null)

    const onSearch = () => {
        setSearchFilter({
            title: titleRef.current.value,
            location: locationRef.current.value
        })
        setIsSearched(true)
    }

    return (
        <div className='container 2xl:px-20 mx-auto pt-8 pb-4 px-4'>
            {/* Hero Banner */}
            <div className='relative overflow-hidden bg-navy-900 text-white py-16 md:py-20 text-center rounded-2xl'>
                {/* Background pattern */}
                <div className='absolute inset-0 opacity-10'>
                    <div className='absolute top-0 left-0 w-72 h-72 bg-teal-400 rounded-full -translate-x-1/2 -translate-y-1/2'></div>
                    <div className='absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full translate-x-1/3 translate-y-1/3'></div>
                </div>

                <div className='relative z-10'>
                    <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-teal-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6'>
                        <span className='w-1.5 h-1.5 bg-teal-400 rounded-full'></span>
                        Over 10,000+ active job listings
                    </div>

                    <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance max-w-3xl mx-auto px-4 leading-tight'>
                        Find Your Dream Career <br className='hidden sm:block' />
                        <span className='text-teal-400'>Start Here</span>
                    </h1>

                    <p className='mb-10 max-w-xl mx-auto text-sm md:text-base text-navy-200 px-6 leading-relaxed'>
                        Explore thousands of job opportunities from top companies. Your next big career move is just a search away.
                    </p>

                    {/* Search Bar */}
                    <div className='flex flex-col sm:flex-row items-stretch bg-white rounded-xl max-w-2xl mx-4 sm:mx-auto overflow-hidden shadow-lg'>
                        <div className='flex items-center flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-navy-100'>
                            <svg className='w-5 h-5 text-navy-300 mr-3 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                            <input
                                type="text"
                                placeholder='Job title or keyword'
                                className='w-full text-sm text-navy-800 placeholder:text-navy-300 outline-none bg-transparent'
                                ref={titleRef}
                            />
                        </div>
                        <div className='flex items-center flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-navy-100'>
                            <svg className='w-5 h-5 text-navy-300 mr-3 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                            <input
                                type="text"
                                placeholder='City or remote'
                                className='w-full text-sm text-navy-800 placeholder:text-navy-300 outline-none bg-transparent'
                                ref={locationRef}
                            />
                        </div>
                        <button
                            onClick={onSearch}
                            className='bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-3.5 transition-colors text-sm'
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Trusted By */}
            <div className='bg-white border border-navy-100 shadow-card mx-0 mt-6 px-8 py-5 rounded-xl'>
                <div className='flex items-center justify-center gap-8 lg:gap-14 flex-wrap'>
                    <p className='text-xs font-semibold text-navy-400 uppercase tracking-wider'>Trusted by</p>
                    <img className='h-5 opacity-40 hover:opacity-70 transition-opacity' src={assets.microsoft_logo} alt="Microsoft" />
                    <img className='h-5 opacity-40 hover:opacity-70 transition-opacity' src={assets.walmart_logo} alt="Walmart" />
                    <img className='h-5 opacity-40 hover:opacity-70 transition-opacity' src={assets.accenture_logo} alt="Accenture" />
                    <img className='h-5 opacity-40 hover:opacity-70 transition-opacity' src={assets.samsung_logo} alt="Samsung" />
                    <img className='h-5 opacity-40 hover:opacity-70 transition-opacity' src={assets.amazon_logo} alt="Amazon" />
                    <img className='h-5 opacity-40 hover:opacity-70 transition-opacity' src={assets.adobe_logo} alt="Adobe" />
                </div>
            </div>
        </div>
    )
}

export default Hero
