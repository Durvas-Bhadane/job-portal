import { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ManageJobs = () => {

  const navigate = useNavigate()

  const [jobs, setJobs] = useState(false)

  const { backendUrl, companyToken } = useContext(AppContext)

  // Function to fetch company Job Applications data 
  const fetchCompanyJobs = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/company/list-jobs',
        { headers: { token: companyToken } }
      )

      if (data.success) {
        setJobs(data.jobsData.reverse())
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  // Function to change Job Visibility 
  const changeJobVisiblity = async (id) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/company/change-visiblity',
        { id },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchCompanyJobs()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs()
    }
  }, [companyToken])

  return jobs ? jobs.length === 0 ? (
    <div className='flex flex-col items-center justify-center h-[70vh]'>
      <div className='w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mb-4'>
        <svg className='w-8 h-8 text-navy-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
        </svg>
      </div>
      <p className='text-lg font-medium text-navy-700'>No jobs posted yet</p>
      <p className='text-sm text-navy-400 mt-1 mb-4'>Create your first job listing to get started</p>
      <button
        onClick={() => navigate('/dashboard/add-job')}
        className='inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors'
      >
        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
        </svg>
        Add New Job
      </button>
    </div>
  ) : (
    <div className='max-w-5xl'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-xl font-bold text-navy-900'>Manage Jobs</h1>
          <p className='text-sm text-navy-400 mt-1'>{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className='inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors'
        >
          <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Add New Job
        </button>
      </div>

      <div className='bg-white border border-navy-100 rounded-xl shadow-card overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-navy-50/50'>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider max-sm:hidden'>#</th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider'>Job Title</th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider max-sm:hidden'>Date</th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider max-sm:hidden'>Location</th>
                <th className='py-3 px-6 text-center text-xs font-semibold text-navy-500 uppercase tracking-wider'>Applicants</th>
                <th className='py-3 px-6 text-center text-xs font-semibold text-navy-500 uppercase tracking-wider'>Visible</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-navy-100'>
              {jobs.map((job, index) => (
                <tr key={index} className='hover:bg-navy-50/30 transition-colors'>
                  <td className='py-4 px-6 text-sm text-navy-400 max-sm:hidden'>{index + 1}</td>
                  <td className='py-4 px-6'>
                    <span className='text-sm font-medium text-navy-800'>{job.title}</span>
                  </td>
                  <td className='py-4 px-6 text-sm text-navy-500 max-sm:hidden'>{moment(job.date).format('ll')}</td>
                  <td className='py-4 px-6 text-sm text-navy-500 max-sm:hidden'>{job.location}</td>
                  <td className='py-4 px-6 text-center'>
                    <span className='inline-flex items-center justify-center bg-teal-50 text-teal-700 text-xs font-semibold w-8 h-8 rounded-full'>
                      {job.applicants}
                    </span>
                  </td>
                  <td className='py-4 px-6 text-center'>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        onChange={() => changeJobVisiblity(job._id)}
                        type="checkbox"
                        checked={job.visible}
                        className='w-4 h-4 rounded border-navy-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 cursor-pointer'
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default ManageJobs
