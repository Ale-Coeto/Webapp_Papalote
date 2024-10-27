
export default function Card({ children } : { children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 shadow-md rounded-md">
      {children}
    </div>
  );
}