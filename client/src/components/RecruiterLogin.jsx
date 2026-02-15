import { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RecruiterLogin = () => {

    const navigate = useNavigate()

    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const [image, setImage] = useState(false)

    const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)

    const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (state == "Sign Up" && !isTextDataSubmited) {
            return setIsTextDataSubmited(true)
        }

        try {

            if (state === "Login") {

                const { data } = await axios.post(backendUrl + '/api/company/login', { email, password })

                if (data.success) {
                    setCompanyData(data.company)
                    setCompanyToken(data.token)
                    localStorage.setItem('companyToken', data.token)
                    setShowRecruiterLogin(false)
                    navigate('/dashboard')
                } else {
                    toast.error(data.message)
                }

            } else {

                const formData = new FormData()
                formData.append('name', name)
                formData.append('password', password)
                formData.append('email', email)
                formData.append('image', image)

                const { data } = await axios.post(backendUrl + '/api/company/register', formData)

                if (data.success) {
                    setCompanyData(data.company)
                    setCompanyToken(data.token)
                    localStorage.setItem('companyToken', data.token)
                    setShowRecruiterLogin(false)
                    navigate('/dashboard')
                } else {
                    toast.error(data.message)
                }

            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className='fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm flex justify-center items-center p-4'>
            <form onSubmit={onSubmitHandler} className='relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden'>
                {/* Header */}
                <div className='bg-navy-900 px-8 py-6 text-center'>
                    <div className='w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3'>
                        <svg className='w-6 h-6 text-teal-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                        </svg>
                    </div>
                    <h1 className='text-xl font-bold text-white'>Recruiter {state}</h1>
                    <p className='text-sm text-navy-300 mt-1'>
                        {state === 'Login' ? 'Welcome back! Sign in to manage your jobs' : 'Create an account to start hiring'}
                    </p>
                </div>

                {/* Close button */}
                <button
                    type='button'
                    onClick={() => setShowRecruiterLogin(false)}
                    className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors'
                >
                    <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                </button>

                {/* Form Body */}
                <div className='px-8 py-6'>
                    {state === "Sign Up" && isTextDataSubmited
                        ? <div className='flex flex-col items-center py-4'>
                            <label htmlFor="image" className='cursor-pointer group'>
                                <div className='w-20 h-20 rounded-2xl bg-navy-50 border-2 border-dashed border-navy-200 group-hover:border-teal-400 flex items-center justify-center overflow-hidden transition-colors'>
                                    {image
                                        ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image)} alt="Company logo" />
                                        : <svg className='w-8 h-8 text-navy-300 group-hover:text-teal-500 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                        </svg>
                                    }
                                </div>
                                <input onChange={e => setImage(e.target.files[0])} type="file" id='image' hidden />
                            </label>
                            <p className='text-sm font-medium text-navy-700 mt-3'>Upload Company Logo</p>
                            <p className='text-xs text-navy-400 mt-0.5'>Click to browse or drag and drop</p>
                        </div>
                        : <div className='flex flex-col gap-4'>

                            {state !== 'Login' && (
                                <div>
                                    <label className='block text-sm font-medium text-navy-700 mb-1.5'>Company Name</label>
                                    <div className='flex items-center gap-3 px-4 py-2.5 border border-navy-200 rounded-lg focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-500 transition-all'>
                                        <svg className='w-4 h-4 text-navy-400 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                                        </svg>
                                        <input className='outline-none text-sm text-navy-800 placeholder:text-navy-300 w-full bg-transparent' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Acme Corp' required />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className='block text-sm font-medium text-navy-700 mb-1.5'>Email Address</label>
                                <div className='flex items-center gap-3 px-4 py-2.5 border border-navy-200 rounded-lg focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-500 transition-all'>
                                    <svg className='w-4 h-4 text-navy-400 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                    </svg>
                                    <input className='outline-none text-sm text-navy-800 placeholder:text-navy-300 w-full bg-transparent' onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='you@company.com' required />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-navy-700 mb-1.5'>Password</label>
                                <div className='flex items-center gap-3 px-4 py-2.5 border border-navy-200 rounded-lg focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-500 transition-all'>
                                    <svg className='w-4 h-4 text-navy-400 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                    </svg>
                                    <input className='outline-none text-sm text-navy-800 placeholder:text-navy-300 w-full bg-transparent' onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Enter your password' required />
                                </div>
                            </div>

                        </div>
                    }

                    {state === "Login" && (
                        <p className='text-xs text-teal-600 hover:text-teal-700 mt-2 cursor-pointer font-medium'>Forgot password?</p>
                    )}

                    <button type='submit' className='w-full bg-navy-900 hover:bg-navy-800 text-white font-medium py-2.5 rounded-lg mt-5 transition-colors text-sm'>
                        {state === 'Login' ? 'Sign In' : isTextDataSubmited ? 'Create Account' : 'Continue'}
                    </button>

                    <p className='mt-5 text-center text-sm text-navy-500'>
                        {state === 'Login'
                            ? <>{"Don't have an account? "}<button type='button' className='text-teal-600 hover:text-teal-700 font-medium' onClick={() => setState("Sign Up")}>Sign Up</button></>
                            : <>Already have an account? <button type='button' className='text-teal-600 hover:text-teal-700 font-medium' onClick={() => setState("Login")}>Sign In</button></>
                        }
                    </p>
                </div>
            </form>
        </div>
    )
}

export default RecruiterLogin
