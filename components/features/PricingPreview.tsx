'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export function PricingPreview() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-gray-600">Choose the plan that fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className="p-6 border-2">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900">$0</div>
              <p className="text-sm text-gray-500 mt-1">Forever</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Coverage check</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Preview first 5 transitions</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>≤20 compounds</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Sample export</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Current Plan</Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 border-4 border-primary relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
              Most Popular
            </Badge>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-gray-900">$49</div>
              <p className="text-sm text-gray-500 mt-1">Per month</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Batch export CSV/TXT</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>ΔCE sweep (±2, ±4 eV)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Save & manage methods</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Version history</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Start 7-day trial
              <div className="text-xs mt-1 opacity-90">No credit card</div>
            </Button>
          </Card>

          {/* Enterprise Plan */}
          <Card className="p-6 border-2">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900">Custom</div>
              <p className="text-sm text-gray-500 mt-1">Contact sales</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>REST API access</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>SLA guarantee</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Team management</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Dedicated support</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Contact Sales</Button>
          </Card>
        </div>
      </div>
    </section>
  );
}

