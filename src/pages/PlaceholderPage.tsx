interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="pg">
      <div className="ph">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="card">
        <div className="ch">
          <div className="ch-t">In progress</div>
        </div>
        <div className="pad">This page is scaffolded in the PoC shell and will be wired next in Phase 4.</div>
      </div>
    </div>
  )
}
