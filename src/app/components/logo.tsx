
export function Logo({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div className="flex items-center gap-2 p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-primary"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l.7-1.5L11.45 12h.55l.7-1.5L13.5 12H20" stroke="hsl(var(--accent))" />
        <path d="M19.5 12h1" stroke="hsl(var(--accent))" />
         <path d="M21 10.5v3" stroke="hsl(var(--accent))" />
      </svg>
      <h2 className={`text-xl font-bold tracking-tight text-foreground ${isMobile ? '' : 'group-data-[collapsible=icon]:hidden'}`}>
        <span className="text-primary">Scan</span><span className="text-accent">Sehati</span>
      </h2>
    </div>
  );
}
