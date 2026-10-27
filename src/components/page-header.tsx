export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className="mb-12">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {intro && <p className="mt-3 max-w-prose text-lg text-muted">{intro}</p>}
    </header>
  );
}
