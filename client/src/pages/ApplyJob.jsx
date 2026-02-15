import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import kconvert from 'k-convert';
import moment from 'moment';
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/clerk-react'

const ApplyJob = () => {

  const { id } = useParams()

  const { getToken } = useAuth()

  const navigate = useNavigate()

  const [JobData, setJobData] = useState(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)

  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } = useContext(AppContext)

  const fetchJob = async () => {

    try {

      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`)

      if (data.success) {
        setJobData(data.job)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  const applyHandler = async () => {
    try {

      if (!userData) {
        return toast.error('Login to apply for jobs')
      }

      if (!userData.resume) {
        navigate('/applications')
        return toast.error('Upload resume to apply')
      }

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/users/apply',
        { jobId: JobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchUserApplications()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const checkAlreadyApplied = () => {

    const hasApplied = userApplications.some(item => item.jobId._id === JobData._id)
    setIsAlreadyApplied(hasApplied)

  }

  useEffect(() => {
    fetchJob()
  }, [id])

  useEffect(() => {
    if (userApplications.length > 0 && JobData) {
      checkAlreadyApplied()
    }
  }, [JobData, userApplications, id])

  return JobData ? (
    <>
      <Navbar />

      <div className='min-h-screen flex flex-col py-8 container px-4 2xl:px-20 mx-auto'>
        <div className='w-full'>
          {/* Job Header Card */}
          <div className='bg-white border border-navy-100 rounded-2xl shadow-card overflow-hidden mb-8'>
            <div className='bg-navy-900 px-6 sm:px-10 py-8 sm:py-10'>
              <div className='flex flex-col md:flex-row justify-between items-start gap-6'>
                <div className='flex flex-col sm:flex-row items-start gap-5'>
                  <div className='w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm'>
                    <img className='w-10 h-10 object-contain' src={JobData.companyId.image} alt={JobData.companyId.name} />
                  </div>
                  <div>
                    <h1 className='text-2xl sm:text-3xl font-bold text-white'>{JobData.title}</h1>
                    <div className='flex flex-wrap gap-4 items-center text-navy-200 mt-3 text-sm'>
                      <span className='flex items-center gap-1.5'>
                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' /></svg>
                        {JobData.companyId.name}
                      </span>
                      <span className='flex items-center gap-1.5'>
                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' /></svg>
                        {JobData.location}
                      </span>
                      <span className='flex items-center gap-1.5'>
                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /></svg>
                        {JobData.level}
                      </span>
                      <span className='flex items-center gap-1.5'>
                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
                        CTC: {kconvert.convertTo(JobData.salary)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col items-start sm:items-end gap-2 flex-shrink-0'>
                  <button
                    onClick={applyHandler}
                    className={`font-medium py-2.5 px-8 rounded-lg text-sm transition-colors ${
                      isAlreadyApplied
                        ? 'bg-navy-700 text-navy-300 cursor-default'
                        : 'bg-teal-500 hover:bg-teal-600 text-white'
                    }`}
                  >
                    {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
                  </button>
                  <p className='text-xs text-navy-400'>Posted {moment(JobData.date).fromNow()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Job Description */}
            <div className='flex-1 min-w-0'>
              <div className='bg-white border border-navy-100 rounded-2xl shadow-card p-6 sm:p-8'>
                <h2 className='font-bold text-xl text-navy-900 mb-6'>Job Description</h2>
                <div className='rich-text' dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
                <div className='mt-8 pt-6 border-t border-navy-100'>
                  <button
                    onClick={applyHandler}
                    className={`font-medium py-3 px-10 rounded-lg text-sm transition-colors ${
                      isAlreadyApplied
                        ? 'bg-navy-100 text-navy-400 cursor-default'
                        : 'bg-navy-900 hover:bg-navy-800 text-white'
                    }`}
                  >
                    {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section More Jobs */}
            <div className='w-full lg:w-80 flex-shrink-0'>
              <div className='sticky top-20'>
                <h3 className='font-semibold text-navy-900 mb-4'>More jobs from {JobData.companyId.name}</h3>
                <div className='flex flex-col gap-4'>
                  {jobs.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                    .filter(job => {
                      const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))
                      return !appliedJobsIds.has(job._id)
                    }).slice(0, 3)
                    .map((job, index) => <JobCard key={index} job={job} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  )
}

export default ApplyJob
