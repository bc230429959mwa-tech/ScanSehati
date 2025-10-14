
'use client';

import  {InteractionDashboard}  from '@/app/components/interaction-dashboard';

export default function InteractionCheckPage() {
  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-headline">
            Check Drug Interactions
          </h1>
          <p className="text-xl text-muted-foreground">
            Check for potential interactions between multiple drugs.
          </p>
        </header>
        <InteractionDashboard />
      </div>
    </main>
  );
}
