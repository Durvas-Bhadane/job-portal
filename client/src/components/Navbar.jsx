import { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

    const { openSignIn } = useClerk()
    const { user } = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const { setShowRecruiterLogin } = useContext(AppContext)

    const isActive = (path) => location.pathname === path

    return (
        <nav className='sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-nav'>
            <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center h-16'>
                {/* Logo */}
                <div className='flex items-center gap-8'>
                    <img
                        onClick={() => navigate('/')}
                        className='cursor-pointer h-8'
                        src={assets.logo}
                        alt="Job Portal"
                    />
                    {/* Nav Links - Desktop */}
                    <div className='hidden md:flex items-center gap-1'>
                        <Link
                            to='/'
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'text-teal-700 bg-teal-50' : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'}`}
                        >
                            Home
                        </Link>
                        {user && (
                            <Link
                                to='/applications'
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/applications') ? 'text-teal-700 bg-teal-50' : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'}`}
                            >
                                Applied Jobs
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                {user ? (
                    <div className='flex items-center gap-4'>
                        <Link
                            to='/applications'
                            className='md:hidden text-sm font-medium text-navy-600 hover:text-navy-900'
                        >
                            Applied Jobs
                        </Link>
                        <div className='hidden sm:flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-teal-400'></div>
                            <p className='text-sm text-navy-600'>
                                {user.firstName} {user.lastName}
                            </p>
                        </div>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: 'w-9 h-9 ring-2 ring-teal-100'
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={() => setShowRecruiterLogin(true)}
                            className='hidden sm:inline-flex text-sm font-medium text-navy-600 hover:text-navy-900 px-4 py-2 rounded-lg hover:bg-navy-50 transition-colors'
                        >
                            Recruiter Login
                        </button>
                        <button
                            onClick={() => openSignIn()}
                            className='inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors'
                        >
                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                            </svg>
                            Sign In
                        </button>
                        {/* Mobile recruiter link */}
                        <button
                            onClick={() => setShowRecruiterLogin(true)}
                            className='sm:hidden text-xs font-medium text-navy-500 underline underline-offset-2'
                        >
                            Recruiter
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
