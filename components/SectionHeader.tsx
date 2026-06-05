export function SectionHeader({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <div className="text-sm font-medium text-violet-300">{eyebrow}</div> : null}
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
      </div>
      {children}
    </div>
  );
}
