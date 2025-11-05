'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Clock, ExternalLink } from 'lucide-react';

export function TrustSection() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data Source */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Data & Method Source</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Compound database from literature & vendor-neutral standards. RI calibration based on C8–C35 alkanes.
                </p>
                <Button variant="link" className="p-0 h-auto text-sm text-primary">
                  View details <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Privacy Statement</h3>
                <p className="text-sm text-gray-600 mb-3">
                  No raw spectra uploaded. Only method parameters & export records stored. GDPR compliant.
                </p>
                <Button variant="link" className="p-0 h-auto text-sm text-primary">
                  Privacy policy <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Changelog */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Latest Update
                  <Badge variant="secondary" className="ml-2 text-xs">v2.1</Badge>
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Added 120+ compounds, updated RI values, refined CE optimization for 50+ pesticides.
                </p>
                <Button variant="link" className="p-0 h-auto text-sm text-primary">
                  View changelog <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RI Limitations Note */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            <strong>Note on RI limitations:</strong> RI-based RT prediction works best for non-polar to moderately polar compounds. 
            Highly polar or thermally labile compounds may show larger deviations. Always verify with standards for critical analytes.
          </p>
        </div>
      </div>
    </section>
  );
}
