const Loading = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-navy-50/50'>
      <div className='relative'>
        <div className='w-12 h-12 rounded-full border-[3px] border-navy-100'></div>
        <div className='absolute top-0 left-0 w-12 h-12 rounded-full border-[3px] border-transparent border-t-teal-500 animate-spin'></div>
      </div>
      <p className='mt-4 text-sm text-navy-400 font-medium'>Loading...</p>
    </div>
  )
}

export default Loading
