import { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const Applications = () => {

  const { user } = useUser()
  const { getToken } = useAuth()

  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext)

  const updateResume = async () => {

    try {

      const formData = new FormData()
      formData.append('resume', resume)

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/users/update-resume',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        await fetchUserData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

    setIsEdit(false)
    setResume(null)
  }

  useEffect(() => {
    if (user) {
      fetchUserApplications()
    }
  }, [user])

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-teal-50 text-teal-700 border border-teal-200'
      case 'Rejected':
        return 'bg-red-50 text-red-600 border border-red-200'
      default:
        return 'bg-navy-50 text-navy-600 border border-navy-200'
    }
  }

  return userData ? (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto py-8'>
        {/* Resume Section */}
        <div className='bg-white border border-navy-100 rounded-xl shadow-card p-6 mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center'>
              <svg className='w-5 h-5 text-navy-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <div>
              <h2 className='text-lg font-semibold text-navy-900'>Your Resume</h2>
              <p className='text-sm text-navy-400'>Upload or update your resume for job applications</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {isEdit || (userData && userData.resume === "")
              ? <>
                <label className='flex items-center gap-2 cursor-pointer' htmlFor="resumeUpload">
                  <span className='inline-flex items-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-700 text-sm font-medium px-4 py-2.5 rounded-lg border border-navy-200 transition-colors'>
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
                    </svg>
                    {resume ? resume.name : "Select Resume"}
                  </span>
                  <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
                </label>
                <button
                  onClick={updateResume}
                  className='bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors'
                >
                  Save
                </button>
              </>
              : <div className='flex gap-3'>
                <a target='_blank' href={userData.resume} className='inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors'>
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                  </svg>
                  View Resume
                </a>
                <button
                  onClick={() => setIsEdit(true)}
                  className='inline-flex items-center gap-2 text-navy-600 border border-navy-200 hover:bg-navy-50 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors'
                >
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                  </svg>
                  Edit
                </button>
              </div>
            }
          </div>
        </div>

        {/* Applications Section */}
        <div className='bg-white border border-navy-100 rounded-xl shadow-card overflow-hidden'>
          <div className='px-6 py-5 border-b border-navy-100'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center'>
                  <svg className='w-5 h-5 text-teal-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                </div>
                <div>
                  <h2 className='text-lg font-semibold text-navy-900'>Jobs Applied</h2>
                  <p className='text-sm text-navy-400'>{userApplications.length} application{userApplications.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-navy-50/50'>
                  <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider'>Company</th>
                  <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider'>Job Title</th>
                  <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider max-sm:hidden'>Location</th>
                  <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider max-sm:hidden'>Date</th>
                  <th className='py-3 px-6 text-left text-xs font-semibold text-navy-500 uppercase tracking-wider'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-navy-100'>
                {userApplications.map((job, index) => (
                  <tr key={index} className='hover:bg-navy-50/30 transition-colors'>
                    <td className='py-4 px-6'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-navy-100'>
                          <img className='w-5 h-5 object-contain' src={job.companyId.image} alt={job.companyId.name} />
                        </div>
                        <span className='text-sm font-medium text-navy-700'>{job.companyId.name}</span>
                      </div>
                    </td>
                    <td className='py-4 px-6 text-sm text-navy-600'>{job.jobId.title}</td>
                    <td className='py-4 px-6 text-sm text-navy-500 max-sm:hidden'>{job.jobId.location}</td>
                    <td className='py-4 px-6 text-sm text-navy-500 max-sm:hidden'>{moment(job.date).format('ll')}</td>
                    <td className='py-4 px-6'>
                      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg ${getStatusStyles(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {userApplications.length === 0 && (
            <div className='text-center py-12'>
              <div className='w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-navy-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              </div>
              <p className='text-navy-500 font-medium'>No applications yet</p>
              <p className='text-navy-400 text-sm mt-1'>Start applying to see your applications here</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default Applications
