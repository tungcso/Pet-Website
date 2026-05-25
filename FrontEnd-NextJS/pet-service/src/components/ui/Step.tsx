export default function Step({
  n,
  title,
  desc,
}: {
  n: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 dark:border-white/10 p-6 bg-white/5 dark:bg-white/5 backdrop-blur">
      <div className="w-9 h-9 rounded-full bg-pink-300 text-white flex items-center justify-center font-semibold mb-4">
        {n}
      </div>
      <div className="font-semibold text-lg mb-2">{title}</div>
      <div className="text-sm opacity-80">{desc}</div>
    </div>
  );
}
