interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export default function Card({
  title,
  children,
}: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      {title && (
        <h2 className="text-2xl font-bold mb-5">
          {title}
        </h2>
      )}

      {children}

    </div>
  );
}