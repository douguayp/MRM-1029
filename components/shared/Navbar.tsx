'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, ArrowRight, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

// Category options for dropdown
const CATEGORY_OPTIONS = [
  { value: 'Pesticides', label: 'Pesticide Residues' },
  { value: 'Environmental', label: 'Environmental Contaminants' },
  { value: 'Veterinary', label: 'Veterinary Drug Residues', disabled: true }
] as const;

interface NavbarProps {
  family?: string;
  onFamilyChange?: (family: string) => void;
  showCategorySelector?: boolean;
}

export function Navbar({ family = 'Pesticides', onFamilyChange, showCategorySelector = true }: NavbarProps) {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showResourcesMenu, setShowResourcesMenu] = useState(false);

  function handleLogout() {
    setUser(null);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300 py-4 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Left: Logo with hover animation */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/30 cursor-pointer overflow-hidden">
              <svg viewBox="0 0 40 40" className="w-full h-full p-2">
                {/* 用质谱峰排列成M形状 - 左高→下降→中间低→上升→右高 */}
                
                {/* 左边最高峰 - M的左顶 */}
                <line x1="7" y1="28" x2="7" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                
                {/* 左侧下降 */}
                <line x1="10.5" y1="28" x2="10.5" y2="13" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                
                <line x1="14" y1="28" x2="14" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                
                {/* 中间最低峰 - M的中心V底 */}
                <line x1="17.5" y1="28" x2="17.5" y2="21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                
                <line x1="20" y1="28" x2="20" y2="23" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                
                <line x1="22.5" y1="28" x2="22.5" y2="21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                
                {/* 右侧上升 */}
                <line x1="26" y1="28" x2="26" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                
                <line x1="29.5" y1="28" x2="29.5" y2="13" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                
                {/* 右边最高峰 - M的右顶 */}
                <line x1="33" y1="28" x2="33" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                
                {/* 底部基线 */}
                <line x1="5" y1="29" x2="35" y2="29" stroke="white" strokeWidth="1.5" opacity="0.5"/>
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors cursor-pointer">
              MRM Method Builder
            </h1>
          </Link>

          {/* Center: Navigation Links with underline animation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="/" 
              className="text-base font-medium text-gray-700 hover:text-primary transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              Home
            </a>
            <div 
              className="relative"
              onMouseEnter={() => setShowProductMenu(true)}
              onMouseLeave={() => setShowProductMenu(false)}
            >
              <button 
                className="text-base font-medium text-gray-700 hover:text-primary transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 flex items-center gap-1"
              >
                Product
                <ChevronDown className="h-4 w-4" />
              </button>
              {showProductMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <a 
                    href="/generator" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <div className="font-medium">🚀 Generator</div>
                    <div className="text-xs text-gray-500 mt-0.5">Build MRM methods instantly</div>
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <a 
                    href="/ri-to-rt-mapping" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <div className="font-medium">📊 RI→RT Mapping</div>
                    <div className="text-xs text-gray-500 mt-0.5">Retention index conversion</div>
                  </a>
                  <a 
                    href="/gc-method-presets" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <div className="font-medium">⚙️ GC Method Presets</div>
                    <div className="text-xs text-gray-500 mt-0.5">Standard & Fast methods</div>
                  </a>
                  <a 
                    href="/templates" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <div className="font-medium">📋 Templates</div>
                    <div className="text-xs text-gray-500 mt-0.5">Ready-to-use method templates</div>
                  </a>
                  <a 
                    href="/sample-output" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <div className="font-medium">📁 Sample Output</div>
                    <div className="text-xs text-gray-500 mt-0.5">Example export files</div>
                  </a>
                </div>
              )}
            </div>
            <a 
              href="/compound-library" 
              className="text-base font-medium text-gray-700 hover:text-primary transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              Compound Library
            </a>
            <div 
              className="relative"
              onMouseEnter={() => setShowResourcesMenu(true)}
              onMouseLeave={() => setShowResourcesMenu(false)}
            >
              <button 
                className="text-base font-medium text-gray-700 hover:text-primary transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300 flex items-center gap-1"
              >
                Resources
                <ChevronDown className="h-4 w-4" />
              </button>
              {showResourcesMenu && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <a 
                    href="/resources/documentation" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    📚 Documentation
                  </a>
                  <a 
                    href="/resources/tutorial" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    🎓 Tutorial
                  </a>
                  <a 
                    href="/resources/api" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    🔧 API Reference
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <a 
                    href="/resources/help" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    💬 Help Center
                  </a>
                  <a 
                    href="/resources/contact" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    📧 Contact Us
                  </a>
                </div>
              )}
            </div>
            <a 
              href="/pricing" 
              className="text-base font-medium text-gray-700 hover:text-primary transition-all duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              Pricing
            </a>
          </nav>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 gap-2 transition-all hover:scale-105">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden md:inline font-medium">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-in fade-in slide-in-from-top-2">
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all hover:scale-105"
                >
                  Log in
                </Button>
                <Button
                  variant="ghost"
                  className="text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all hover:scale-105"
                >
                  Sign up
                </Button>
                <Link href="/generator">
                  <Button
                    className="text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 group"
                  >
                    <span className="flex items-center gap-2">
                      Start Free
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                {showCategorySelector && (
                  <Select value={family} onValueChange={onFamilyChange}>
                    <SelectTrigger className="w-44 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {option.label}
                          {option.disabled && (
                            <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-full">
                              Updating
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

