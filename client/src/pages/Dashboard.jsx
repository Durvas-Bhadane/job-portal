import { useContext, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Dashboard = () => {

    const navigate = useNavigate()

    const { companyData, setCompanyData, setCompanyToken } = useContext(AppContext)

    // Function to logout for company
    const logout = () => {
        setCompanyToken(null)
        localStorage.removeItem('companyToken')
        setCompanyData(null)
        navigate('/')
    }

    useEffect(() => {
        if (companyData) {
            navigate('/dashboard/manage-jobs')
        }
    }, [companyData])

    return (
        <div className='min-h-screen bg-navy-50/50'>

            {/* Navbar for Recruiter Panel */}
            <nav className='sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-nav'>
                <div className='px-4 sm:px-6 flex justify-between items-center h-16'>
                    <img onClick={() => navigate('/')} className='h-8 cursor-pointer' src={assets.logo} alt="Job Portal" />
                    {companyData && (
                        <div className='flex items-center gap-4'>
                            <p className='hidden sm:block text-sm text-navy-600'>
                                Welcome, <span className='font-semibold text-navy-800'>{companyData.name}</span>
                            </p>
                            <div className='relative group'>
                                <button className='flex items-center gap-2'>
                                    <img className='w-9 h-9 rounded-full object-cover border-2 border-navy-100' src={companyData.image} alt={companyData.name} />
                                    <svg className='w-4 h-4 text-navy-400 hidden sm:block' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                    </svg>
                                </button>
                                <div className='absolute hidden group-hover:block top-full right-0 z-10 pt-2'>
                                    <div className='bg-white rounded-lg border border-navy-100 shadow-lg py-1 min-w-[140px]'>
                                        <button
                                            onClick={logout}
                                            className='flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 hover:text-red-600 transition-colors'
                                        >
                                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className='flex'>
                {/* Left Sidebar */}
                <aside className='w-16 sm:w-56 flex-shrink-0 bg-white border-r border-navy-100 min-h-[calc(100vh-64px)] sticky top-16'>
                    <div className='py-4'>
                        <p className='hidden sm:block px-5 text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3'>Menu</p>
                        <nav className='flex flex-col gap-1 px-2 sm:px-3'>
                            <NavLink
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'}`}
                                to='/dashboard/add-job'
                            >
                                <svg className='w-5 h-5 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                                </svg>
                                <span className='hidden sm:block'>Add Job</span>
                            </NavLink>

                            <NavLink
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'}`}
                                to='/dashboard/manage-jobs'
                            >
                                <svg className='w-5 h-5 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                                </svg>
                                <span className='hidden sm:block'>Manage Jobs</span>
                            </NavLink>

                            <NavLink
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'}`}
                                to='/dashboard/view-applications'
                            >
                                <svg className='w-5 h-5 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                                </svg>
                                <span className='hidden sm:block'>View Applications</span>
                            </NavLink>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className='flex-1 p-4 sm:p-6 lg:p-8 min-w-0'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Dashboard
