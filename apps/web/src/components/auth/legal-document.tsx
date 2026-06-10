import type { LegalSection } from "@/content/legal";

export function LegalDocument({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) {
  return (
    <article>
      {title && <h2 className="text-lg font-semibold mb-6">{title}</h2>}
      <div className="space-y-5 text-sm text-muted leading-relaxed">
        {sections.map((section) => (
          <section key={section.title}>
            <h3 className="font-medium text-foreground mb-1.5">{section.title}</h3>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
