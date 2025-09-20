interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({ title, description, children, className = '' }: SectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        {description && (
          <p className="text-gray-400">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}