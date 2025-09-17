import { LucideIcon } from 'lucide-react';

interface TechCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isClickable?: boolean;
}

const TechCard = ({ icon: Icon, title, description, isClickable = false }: TechCardProps) => {
  return (
    <div className={`group relative p-6 border border-gris-trazado rounded-lg overflow-hidden h-full ${isClickable ? 'cursor-pointer' : ''}`}>
      <div className={`absolute inset-0 bg-noche ${isClickable ? 'group-hover:bg-gris-trazado/20' : ''} transition-colors duration-300`}></div>
      <div className="relative">
        <Icon className="w-8 h-8 text-menta mb-4" />
        <h3 className="text-xl font-plex-mono font-bold text-hueso mb-2">{title}</h3>
        <p className="text-gris-neutro font-plex-sans">{description}</p>
      </div>
      {/* Hover effect line */}
      <div className={`absolute bottom-0 left-0 h-0.5 bg-menta w-full transform transition-transform duration-300 origin-left ${isClickable ? 'scale-x-0 group-hover:scale-x-100' : 'scale-x-0'}`}></div>
    </div>
  );
};

export default TechCard;
