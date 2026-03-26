interface CardProps {
    index: number;
    title: string;
    description: string;
}

export function Card({ index, title, description }: CardProps) {
    return (
        <div className="glass-card p-8 flex flex-col items-start gap-4 group h-full min-h-[280px]">
            <div className="text-4xl font-display font-bold text-[#E3FB51]/10 group-hover:text-[#E3FB51]/30 transition-colors duration-700">
                0{index}
            </div>
            <h3 className="text-xl font-display font-bold text-white group-hover:text-[#E3FB51] transition-colors duration-500">
                {title}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-500 flex-grow">
                {description}
            </p>
        </div>
    );
}
