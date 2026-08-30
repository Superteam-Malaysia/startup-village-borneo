export function PageHeader({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <header className="page-header">
      <h1 className="page-header__title">{title}</h1>
      {lead ? <p className="page-header__lead">{lead}</p> : null}
    </header>
  );
}
