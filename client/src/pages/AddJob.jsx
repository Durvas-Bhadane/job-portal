import { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AddJob = () => {

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Bangalore');
    const [category, setCategory] = useState('Programming');
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(0);

    const editorRef = useRef(null)
    const quillRef = useRef(null)

    const { backendUrl, companyToken } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {

            const description = quillRef.current.root.innerHTML

            const { data } = await axios.post(backendUrl + '/api/company/post-job',
                { title, description, location, salary, category, level },
                { headers: { token: companyToken } }
            )

            if (data.success) {
                toast.success(data.message)
                setTitle('')
                setSalary(0)
                quillRef.current.root.innerHTML = ""
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }


    }


    useEffect(() => {
        // Initiate Quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            })
        }
    }, [])

    return (
        <div className='max-w-3xl'>
            <div className='mb-6'>
                <h1 className='text-xl font-bold text-navy-900'>Add New Job</h1>
                <p className='text-sm text-navy-400 mt-1'>Create a new job listing for candidates</p>
            </div>

            <form onSubmit={onSubmitHandler} className='bg-white border border-navy-100 rounded-xl shadow-card p-6'>
                <div className='flex flex-col gap-5'>
                    {/* Job Title */}
                    <div>
                        <label className='block text-sm font-medium text-navy-700 mb-1.5'>Job Title</label>
                        <input
                            type="text"
                            placeholder='e.g. Full Stack Developer'
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                            required
                            className='w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm text-navy-800 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors'
                        />
                    </div>

                    {/* Job Description */}
                    <div>
                        <label className='block text-sm font-medium text-navy-700 mb-1.5'>Job Description</label>
                        <div ref={editorRef}></div>
                    </div>

                    {/* Row of selects */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-navy-700 mb-1.5'>Category</label>
                            <select
                                className='w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors bg-white'
                                onChange={e => setCategory(e.target.value)}
                            >
                                {JobCategories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-navy-700 mb-1.5'>Location</label>
                            <select
                                className='w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors bg-white'
                                onChange={e => setLocation(e.target.value)}
                            >
                                {JobLocations.map((location, index) => (
                                    <option key={index} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-navy-700 mb-1.5'>Level</label>
                            <select
                                className='w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors bg-white'
                                onChange={e => setLevel(e.target.value)}
                            >
                                <option value="Beginner level">Beginner level</option>
                                <option value="Intermediate level">Intermediate level</option>
                                <option value="Senior level">Senior level</option>
                            </select>
                        </div>
                    </div>

                    {/* Salary */}
                    <div>
                        <label className='block text-sm font-medium text-navy-700 mb-1.5'>Annual Salary (USD)</label>
                        <input
                            min={0}
                            className='w-full sm:w-48 px-4 py-2.5 border border-navy-200 rounded-lg text-sm text-navy-800 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors'
                            onChange={e => setSalary(e.target.value)}
                            type="Number"
                            placeholder='e.g. 75000'
                        />
                    </div>

                    {/* Submit */}
                    <div className='pt-2'>
                        <button
                            type='submit'
                            className='inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors'
                        >
                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                            </svg>
                            Publish Job
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddJob
