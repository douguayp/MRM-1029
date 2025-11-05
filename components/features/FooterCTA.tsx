'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FooterCTA() {
  const router = useRouter();
  
  function handleTryWithList() {
    router.push('/generator');
  }

  function scrollToPreview() {
    const previewSection = document.querySelector('.product-preview-section');
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-primary to-blue-600">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to build your method?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Paste your list → Check coverage → Generate transitions
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Button 
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 h-14 px-8 text-base font-semibold"
            onClick={handleTryWithList}
          >
            Try with my list
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 h-14 px-8 text-base font-semibold"
            onClick={scrollToPreview}
          >
            See sample output
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <p className="mt-6 text-sm text-blue-100">
          No credit card required · Start free · Upgrade anytime
        </p>
      </div>
    </section>
  );
}

