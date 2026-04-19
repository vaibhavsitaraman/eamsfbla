import { ScrollPathSVG } from "@/components/ui/svg-follow-scroll";

export default function DemoScrollPath() {
  return (
    <ScrollPathSVG 
      title="Hall of Fame" 
      subtitle="Honoring our State Officers and their legacy"
    >
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold">State Officer {i}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                FBLA State Leadership Position
              </p>
            </div>
          ))}
        </div>
      </div>
    </ScrollPathSVG>
  );
}
