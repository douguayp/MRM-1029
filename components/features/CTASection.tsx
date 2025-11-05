'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToApp() {
    const appSection = document.getElementById('app-section');
    if (appSection) {
      appSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to generate your methods?
        </h2>
        <p className="text-xl text-blue-50 mb-8 leading-relaxed">
          Paste your list → Check coverage → Generate
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
            onClick={scrollToTop}
          >
            Try with my list
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
            onClick={scrollToApp}
          >
            See sample output
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-blue-100 mt-6">
          No credit card required · Free forever for small projects
        </p>
      </div>
    </section>
  );
}

