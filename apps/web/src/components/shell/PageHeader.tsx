export function PageHeader({
  title,
  meta,
  lead,
}: {
  title: string;
  meta?: string;
  lead?: string;
}) {
  return (
    <header className="page-header">
      {meta ? <p className="page-header__meta">{meta}</p> : null}
      <h1 className="page-header__title">{title}</h1>
      {lead ? <p className="page-header__lead">{lead}</p> : null}
    </header>
  );
}
