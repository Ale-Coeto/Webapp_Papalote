export default function Title({ text }: { text: string }) {
  return (
    <div className="text-xl font-semibold text-gris">
      <h1>{text}</h1>
    </div>
  );
}
