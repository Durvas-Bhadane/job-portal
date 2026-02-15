import { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ViewApplications = () => {

  const { backendUrl, companyToken } = useContext(AppContext)

  const [applicants, setApplicants] = useState(false)

  // Function to fetch company Job Applications data 
  const fetchCompanyJobApplications = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/company/applicants',
        { headers: { token: companyToken } }
      )

      if (data.success) {
        setApplicants(data.applications.reverse())
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  // Function to Update Job Applications Status 
  const changeJobApplicationStatus = async (id, status) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/company/change-status',
        { id, status },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        fetchCompanyJobApplications()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications()
    }
  }, [companyToken])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return <span className='inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200'>Accepted</span>
      case 'Rejected':
        return <span className='inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200'>Rejected</span>
      default:
        return <span className='inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-navy-50 text-navy-600 border border-navy-200'>Pending</span>
    }
  }

  return applicants ? applicants.length === 0 ? (
    <div className='flex flex-col items-center justify-center h-[70vh]'>
      <div className='w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mb-4'>
        <svg className='w-8 h-8 text-navy-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
        </svg>
      </div>
      <p className='text-lg font-medium text-navy-700'>No applications yet</p>
      <p className='text-sm text-navy-400 mt-1'>Applications will appear here when candidates apply</p>
    </div>
  ) : (
    <div className='max-w-5xl'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold text-navy-900'>Applications</h1>
        <p className='text-sm text-navy-400 mt-1'>{applicants.filter(item => item.jobId && item.userId).length} total applications</p>
      </div>

      <div className='bg-white border border-navy-100 rounded-xl shadow-card overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-navy-50/50'>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider'>#</th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider'>Applicant</th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider max-sm:hidden'>Job Title</th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider max-sm:hidden'>Location</th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider'>Resume</th>
                <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-navy-100'>
              {applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
                <tr key={index} className='hover:bg-navy-50/30 transition-colors'>
                  <td className='py-4 px-6 text-sm text-navy-400'>{index + 1}</td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center gap-3'>
                      <img className='w-9 h-9 rounded-full object-cover border border-navy-100 max-sm:hidden' src={applicant.userId.image} alt={applicant.userId.name} />
                      <span className='text-sm font-medium text-navy-800'>{applicant.userId.name}</span>
                    </div>
                  </td>
                  <td className='py-4 px-6 text-sm text-navy-600 max-sm:hidden'>{applicant.jobId.title}</td>
                  <td className='py-4 px-6 text-sm text-navy-500 max-sm:hidden'>{applicant.jobId.location}</td>
                  <td className='py-4 px-6'>
                    <a
                      href={applicant.userId.resume}
                      target='_blank'
                      className='inline-flex items-center gap-1.5 bg-navy-50 hover:bg-navy-100 text-navy-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-navy-200 transition-colors'
                    >
                      <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      Resume
                    </a>
                  </td>
                  <td className='py-4 px-6'>
                    {applicant.status === "Pending"
                      ? <div className='flex items-center gap-2'>
                        <button
                          onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')}
                          className='inline-flex items-center gap-1 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-teal-200 transition-colors'
                        >
                          <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                          </svg>
                          Accept
                        </button>
                        <button
                          onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')}
                          className='inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 transition-colors'
                        >
                          <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                          </svg>
                          Reject
                        </button>
                      </div>
                      : getStatusBadge(applicant.status)
                    }
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

export default ViewApplications
