export default function Title({ text }: { text: string }) {
  return (
    <div className="text-2xl font-semibold text-gris">
      <h1>{text}</h1>
    </div>
  );
}
