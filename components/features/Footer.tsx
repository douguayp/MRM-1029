'use client';

import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Features
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Pricing
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Changelog
                </Button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Docs
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Data Source
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  API
                </Button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  About
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Contact
                </Button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Privacy
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                  Terms
                </Button>
              </li>
            </ul>
          </div>

          {/* Language */}
          <div>
            <h4 className="font-semibold text-white mb-3">Language</h4>
            <select className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-3 py-2 text-sm">
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-sm text-gray-400">© 2024 MRM Method Builder</span>
          </div>
          <div className="text-sm text-gray-500">
            Built for analytical chemists · Open source · Community driven
          </div>
        </div>
      </div>
    </footer>
  );
}
