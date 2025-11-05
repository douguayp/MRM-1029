'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

export function Pricing() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-gray-600">Start free, upgrade when you need more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className="p-6 border-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Free</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Coverage detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Preview first 5 transitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">≤20 compounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Sample export</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </div>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 border-2 border-primary relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Most Popular
            </Badge>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$49</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Batch export CSV/TXT</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">ΔCE sweep optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Save methods</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Version history</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Priority support</span>
                </li>
              </ul>

              <Button className="w-full">
                Start 7-day trial
              </Button>
              <p className="text-xs text-center text-gray-500">No credit card required</p>
            </div>
          </Card>

          {/* Enterprise Plan */}
          <Card className="p-6 border-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Team/Enterprise</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">REST API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">SLA guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Organization management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Dedicated support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Custom integrations</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
