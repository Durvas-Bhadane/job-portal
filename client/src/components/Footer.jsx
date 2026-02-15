import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-navy-900 text-white mt-20'>
      <div className='container px-4 2xl:px-20 mx-auto'>
        {/* Top section */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-navy-700'>
          {/* Brand */}
          <div className='md:col-span-1'>
            <img className='h-8 brightness-0 invert' src={assets.logo} alt="Job Portal" />
            <p className='mt-4 text-navy-300 text-sm leading-relaxed'>
              Your trusted platform for finding the perfect job opportunity. Connect with top employers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-sm font-semibold text-white uppercase tracking-wider mb-4'>Quick Links</h4>
            <ul className='flex flex-col gap-2.5'>
              <li><Link to='/' className='text-sm text-navy-300 hover:text-teal-400 transition-colors'>Home</Link></li>
              <li><Link to='/' className='text-sm text-navy-300 hover:text-teal-400 transition-colors'>Browse Jobs</Link></li>
              <li><Link to='/applications' className='text-sm text-navy-300 hover:text-teal-400 transition-colors'>Applied Jobs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className='text-sm font-semibold text-white uppercase tracking-wider mb-4'>Resources</h4>
            <ul className='flex flex-col gap-2.5'>
              <li><span className='text-sm text-navy-300 hover:text-teal-400 transition-colors cursor-pointer'>Career Advice</span></li>
              <li><span className='text-sm text-navy-300 hover:text-teal-400 transition-colors cursor-pointer'>Resume Tips</span></li>
              <li><span className='text-sm text-navy-300 hover:text-teal-400 transition-colors cursor-pointer'>Help Center</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className='text-sm font-semibold text-white uppercase tracking-wider mb-4'>Legal</h4>
            <ul className='flex flex-col gap-2.5'>
              <li><span className='text-sm text-navy-300 hover:text-teal-400 transition-colors cursor-pointer'>Privacy Policy</span></li>
              <li><span className='text-sm text-navy-300 hover:text-teal-400 transition-colors cursor-pointer'>Terms of Service</span></li>
              <li><span className='text-sm text-navy-300 hover:text-teal-400 transition-colors cursor-pointer'>Cookie Policy</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 py-6'>
          <p className='text-sm text-navy-400'>
            &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
          </p>
          <div className='flex items-center gap-4'>
            <a href='#' className='w-9 h-9 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors' aria-label="Facebook">
              <img className='w-4 h-4 brightness-0 invert opacity-60' src={assets.facebook_icon} alt="" />
            </a>
            <a href='#' className='w-9 h-9 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors' aria-label="Twitter">
              <img className='w-4 h-4 brightness-0 invert opacity-60' src={assets.twitter_icon} alt="" />
            </a>
            <a href='#' className='w-9 h-9 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors' aria-label="Instagram">
              <img className='w-4 h-4 brightness-0 invert opacity-60' src={assets.instagram_icon} alt="" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
