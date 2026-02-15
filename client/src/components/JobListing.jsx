import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {

    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)

    const [showFilter, setShowFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedLocations, setSelectedLocations] = useState([])

    const [filteredJobs, setFilteredJobs] = useState(jobs)

    const handleCategoryChange = (category) => {
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    const handleLocationChange = (location) => {
        setSelectedLocations(
            prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
        )
    }

    useEffect(() => {

        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)

        const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)

        const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())

        const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
        )

        setFilteredJobs(newFilteredJobs)
        setCurrentPage(1)
    }, [jobs, selectedCategories, selectedLocations, searchFilter])

    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4'>

            {/* Sidebar */}
            <div className='w-full lg:w-72 flex-shrink-0'>
                <div className='bg-white rounded-xl border border-navy-100 shadow-card p-5 sticky top-20'>

                    {/* Search Filter from Hero Component */}
                    {
                        isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                            <div className='mb-5 pb-5 border-b border-navy-100'>
                                <h3 className='text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3'>Active Filters</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {searchFilter.title && (
                                        <span className='inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1 rounded-lg text-xs font-medium'>
                                            {searchFilter.title}
                                            <button onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))} className='hover:text-teal-900 ml-0.5'>
                                                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                                            </button>
                                        </span>
                                    )}
                                    {searchFilter.location && (
                                        <span className='inline-flex items-center gap-1.5 bg-navy-50 border border-navy-200 text-navy-700 px-3 py-1 rounded-lg text-xs font-medium'>
                                            {searchFilter.location}
                                            <button onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))} className='hover:text-navy-900 ml-0.5'>
                                                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    <button
                        onClick={() => setShowFilter(prev => !prev)}
                        className='flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-navy-200 text-navy-600 font-medium text-sm hover:bg-navy-50 transition-colors lg:hidden mb-4'
                    >
                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
                        </svg>
                        {showFilter ? "Hide Filters" : "Show Filters"}
                    </button>

                    {/* Category Filter */}
                    <div className={showFilter ? "" : "max-lg:hidden"}>
                        <h4 className='text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3'>Categories</h4>
                        <ul className='flex flex-col gap-2'>
                            {
                                JobCategories.map((category, index) => (
                                    <li key={index}>
                                        <label className='flex items-center gap-2.5 cursor-pointer group'>
                                            <input
                                                className='w-4 h-4 rounded border-navy-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 cursor-pointer'
                                                type="checkbox"
                                                onChange={() => handleCategoryChange(category)}
                                                checked={selectedCategories.includes(category)}
                                            />
                                            <span className='text-sm text-navy-600 group-hover:text-navy-900 transition-colors'>{category}</span>
                                        </label>
                                    </li>
                                ))
                            }
                        </ul>

                        {/* Location Filter */}
                        <h4 className='text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3 mt-6'>Locations</h4>
                        <ul className='flex flex-col gap-2'>
                            {
                                JobLocations.map((location, index) => (
                                    <li key={index}>
                                        <label className='flex items-center gap-2.5 cursor-pointer group'>
                                            <input
                                                className='w-4 h-4 rounded border-navy-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 cursor-pointer'
                                                type="checkbox"
                                                onChange={() => handleLocationChange(location)}
                                                checked={selectedLocations.includes(location)}
                                            />
                                            <span className='text-sm text-navy-600 group-hover:text-navy-900 transition-colors'>{location}</span>
                                        </label>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>

            {/* Job listings */}
            <section className='flex-1 min-w-0'>
                <div className='flex items-end justify-between mb-6' id='job-list'>
                    <div>
                        <h3 className='font-bold text-2xl text-navy-900'>Latest Jobs</h3>
                        <p className='text-sm text-navy-400 mt-1'>
                            {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} found
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
                        <JobCard key={index} job={job} />
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className='text-center py-16'>
                        <div className='w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-8 h-8 text-navy-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </div>
                        <p className='text-navy-500 font-medium'>No jobs found</p>
                        <p className='text-navy-400 text-sm mt-1'>Try adjusting your filters or search terms</p>
                    </div>
                )}

                {/* Pagination */}
                {filteredJobs.length > 0 && (
                    <div className='flex items-center justify-center gap-2 mt-10'>
                        <a href="#job-list">
                            <button
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className='w-10 h-10 flex items-center justify-center rounded-lg border border-navy-200 text-navy-500 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                            >
                                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                                </svg>
                            </button>
                        </a>
                        {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                            <a key={index} href="#job-list">
                                <button
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === index + 1 ? 'bg-navy-900 text-white' : 'border border-navy-200 text-navy-500 hover:bg-navy-50'}`}
                                >
                                    {index + 1}
                                </button>
                            </a>
                        ))}
                        <a href="#job-list">
                            <button
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))}
                                disabled={currentPage === Math.ceil(filteredJobs.length / 6)}
                                className='w-10 h-10 flex items-center justify-center rounded-lg border border-navy-200 text-navy-500 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                            >
                                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                </svg>
                            </button>
                        </a>
                    </div>
                )}
            </section>
        </div>
    )
}

export default JobListing
