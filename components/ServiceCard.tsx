import Link from "next/link";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export default function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#E8861A]/30 transition-all duration-300 flex flex-col">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-[#0A2342] mb-2 group-hover:text-[#E8861A] transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed flex-1">{description}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#E8861A] hover:text-[#0A2342] transition-colors"
      >
        Découvrir
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
