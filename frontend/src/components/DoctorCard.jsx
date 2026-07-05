import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-slate-200 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-200 cursor-pointer" 
      id={`doctor-card-${doctor.id}`}
      onClick={() => navigate(`/doctors/${doctor._id || doctor.id}`)}
    >
      <div className="bg-[#eaf0fb] w-full aspect-square flex justify-center items-end overflow-hidden">
        <img 
          src={doctor.avatar || assets.profile_pic}
          alt={doctor.name} 
          className="w-full h-full object-cover object-bottom" 
        />
      </div>
      <div className="p-5 flex flex-col items-start bg-white">
        <div className={`flex items-center gap-1.5 text-xs font-semibold mb-2 ${doctor.available ? 'text-emerald-500' : 'text-red-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          {doctor.available ? 'Available' : 'Not Available'}
        </div>
        <h3 className="text-[1.1rem] font-semibold text-slate-800 mb-1">{doctor.name}</h3>
        <p className="text-[0.85rem] text-slate-500 font-normal">{doctor.specialty}</p>
      </div>
    </div>
  )
}
