import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 pt-12 pb-6" id="main-footer">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start pb-8 border-b border-white/10 gap-6 md:gap-0">
          <div className="max-w-[300px]">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="material-icons-outlined text-primary text-24">local_hospital</span>
              <span className="text-xl font-bold text-white">MediBook</span>
            </Link>
            <p className="text-sm leading-relaxed">Your trusted healthcare companion for seamless medical consultations.</p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8">
            <Link to="/" className="text-sm text-white/70 hover:text-primary-light transition-colors">Privacy Policy</Link>
            <Link to="/" className="text-sm text-white/70 hover:text-primary-light transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-sm text-white/70 hover:text-primary-light transition-colors">Contact Us</Link>
            <Link to="/" className="text-sm text-white/70 hover:text-primary-light transition-colors">Help Center</Link>
          </div>
        </div>
        <div className="pt-6 text-sm text-center">
          <p>© 2024 MediBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
