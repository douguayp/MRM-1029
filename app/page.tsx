import { Hero } from '@/components/features/Hero';
import { ValueProps } from '@/components/features/ValueProps';
import { ProductPreview } from '@/components/features/ProductPreview';
import { Pricing } from '@/components/features/Pricing';
import { FAQ } from '@/components/features/FAQ';
import { FooterCTA } from '@/components/features/FooterCTA';
import { Footer } from '@/components/features/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Value Propositions - 3 Key Features */}
      <ValueProps />

      {/* Product Preview Section */}
      <ProductPreview />

      {/* Pricing Section */}
      <Pricing />

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA */}
      <FooterCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
