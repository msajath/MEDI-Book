export default function StatCard({ icon, value, label, color, trend }) {
  return (
    <div className="flex items-center gap-4 p-5 px-6 bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]">
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" 
        style={{ background: color ? `${color}15` : '#ecfeff', color: color || '#0891b2' }}
      >
        <span className="material-icons-outlined text-24">{icon}</span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-2xl font-bold text-navy leading-tight">{value}</span>
        <span className="text-sm font-medium text-outline">{label}</span>
      </div>
      {trend && (
        <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'text-success bg-success-bg' : 'text-error bg-error-bg'}`}>
          <span className="material-icons-outlined text-[16px]">{trend > 0 ? 'trending_up' : 'trending_down'}</span>
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  )
}
