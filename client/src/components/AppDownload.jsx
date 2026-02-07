import { assets } from '../assets/assets'

const AppDownload = () => {
    return (
        <div className='container px-4 2xl:px-20 mx-auto my-16'>
            <div className='relative overflow-hidden bg-navy-900 p-10 sm:p-16 lg:p-20 rounded-2xl'>
                {/* Background decorations */}
                <div className='absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full translate-x-1/3 -translate-y-1/3'></div>
                <div className='absolute bottom-0 left-1/2 w-48 h-48 bg-teal-500/10 rounded-full translate-y-1/2'></div>

                <div className='relative z-10 flex flex-col lg:flex-row items-center gap-10'>
                    <div className='flex-1'>
                        <span className='inline-block bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider'>
                            Mobile App
                        </span>
                        <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-balance leading-tight'>
                            Take Your Job Search <span className='text-teal-400'>On the Go</span>
                        </h2>
                        <p className='text-navy-300 text-sm sm:text-base mb-8 max-w-lg leading-relaxed'>
                            Download our mobile app for instant notifications, easy applications, and a seamless job search experience anywhere.
                        </p>
                        <div className='flex gap-4'>
                            <a href="#" className='inline-block hover:opacity-90 transition-opacity'>
                                <img className='h-11' src={assets.play_store} alt="Google Play Store" />
                            </a>
                            <a href="#" className='inline-block hover:opacity-90 transition-opacity'>
                                <img className='h-11' src={assets.app_store} alt="Apple App Store" />
                            </a>
                        </div>
                    </div>
                    <div className='hidden lg:block flex-shrink-0'>
                        <img className='w-64 drop-shadow-2xl' src={assets.app_main_img} alt="Mobile app preview" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppDownload
