'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Database, GitBranch, ExternalLink } from 'lucide-react';

export function TrustSection() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trust & Transparency</h2>
          <p className="text-lg text-gray-600">Open methodology, clear limitations, your data stays yours</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data Sources */}
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Data Sources & Methods</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Compound database from peer-reviewed publications and validated standards. No vendor-specific naming. RI data covers C8–C35 range.
              </p>
              <Button variant="link" className="text-sm p-0 h-auto">
                View detailed methodology
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-6 border-2 border-green-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Privacy Promise</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We never upload raw spectra. Only method parameters and export records are saved (optional). Your compound lists stay private.
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                No data mining
              </Badge>
            </div>
          </Card>

          {/* Changelog */}
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Changelog</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Latest update: Nov 2024</p>
                <ul className="text-left space-y-1">
                  <li>• Added 87 compounds</li>
                  <li>• Updated RI for C30+ range</li>
                  <li>• Refined CE for organophosphates</li>
                </ul>
              </div>
              <Button variant="link" className="text-sm p-0 h-auto">
                View full changelog
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

