'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  function scrollToHero() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-primary to-blue-600 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to build your methods?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Paste your list → Check coverage → Generate
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button 
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
            onClick={scrollToHero}
          >
            Try with my list
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
          >
            See sample output
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-blue-100 mt-6">
          No credit card required · Free coverage check · Instant results
        </p>
      </div>
    </section>
  );
}

