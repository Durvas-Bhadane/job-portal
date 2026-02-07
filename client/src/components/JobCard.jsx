import { useNavigate } from 'react-router-dom'

const JobCard = ({ job }) => {

  const navigate = useNavigate()

  return (
    <div className='group bg-white border border-navy-100 rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-teal-200 transition-all duration-200'>
      {/* Company row */}
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center overflow-hidden flex-shrink-0'>
          <img className='w-6 h-6 object-contain' src={job.companyId.image} alt={job.companyId.name} />
        </div>
        <div className='min-w-0'>
          <p className='text-xs font-medium text-navy-500 truncate'>{job.companyId.name}</p>
        </div>
      </div>

      {/* Title */}
      <h4 className='font-semibold text-lg text-navy-900 mt-3 leading-snug line-clamp-2'>{job.title}</h4>

      {/* Tags */}
      <div className='flex items-center gap-2 mt-3 flex-wrap'>
        <span className='inline-flex items-center gap-1 bg-navy-50 text-navy-600 text-xs font-medium px-2.5 py-1 rounded-md'>
          <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
          </svg>
          {job.location}
        </span>
        <span className='inline-flex items-center bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-md'>
          {job.level}
        </span>
      </div>

      {/* Description */}
      <p className='text-navy-400 text-sm mt-3 line-clamp-2 leading-relaxed' dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}></p>

      {/* Actions */}
      <div className='mt-4 flex gap-3 text-sm'>
        <button
          onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }}
          className='flex-1 bg-navy-900 hover:bg-navy-800 text-white font-medium py-2.5 rounded-lg transition-colors text-center'
        >
          Apply now
        </button>
        <button
          onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }}
          className='flex-1 text-navy-600 border border-navy-200 hover:border-navy-300 hover:bg-navy-50 font-medium rounded-lg py-2.5 transition-colors text-center'
        >
          Learn more
        </button>
      </div>
    </div>
  )
}

export default JobCard
