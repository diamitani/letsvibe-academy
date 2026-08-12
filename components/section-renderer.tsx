import type { CurriculumSection } from "@/lib/curriculum-data"

function renderInline(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function SectionRenderer({ sections }: { sections: CurriculumSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <div key={i}>
          <h3 className="text-lg font-semibold mb-3">{section.heading}</h3>
          <div className="space-y-2">
            {section.items.map((item, j) => {
              const isHeading = item.startsWith("**") && item.endsWith("**")
              if (isHeading) {
                return (
                  <h4 key={j} className="font-medium text-foreground mt-4 mb-1">
                    {renderInline(item.slice(2, -2))}
                  </h4>
                )
              }
              if (item.startsWith("• ")) {
                return (
                  <div key={j} className="flex gap-2 text-muted-foreground">
                    <span className="shrink-0">•</span>
                    <span>{renderInline(item.slice(2))}</span>
                  </div>
                )
              }
              return (
                <p key={j} className="text-muted-foreground leading-relaxed">
                  {renderInline(item)}
                </p>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
