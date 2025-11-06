'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { LoginDialog } from '@/components/features/LoginDialog';
import { Hero } from '@/components/features/Hero';
import { ValueProps } from '@/components/features/ValueProps';
import { ProductPreview } from '@/components/features/ProductPreview';
import { Pricing } from '@/components/features/Pricing';
import { FAQ } from '@/components/features/FAQ';
import { FooterCTA } from '@/components/features/FooterCTA';
import { Footer } from '@/components/features/Footer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Home() {
  // User authentication state
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  function handleLogin(userData: { username: string; email: string }) {
    setUser(userData);
    setShowLoginDialog(false);
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Minimalist Navigation Bar */}
      <header className="bg-gradient-to-b from-blue-50 to-transparent border-b border-gray-200 py-4 px-6">
        <div className="w-full max-w-full">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                MassHunter GC-QQQ Method Generator
              </h1>
            </div>

            {/* Center: Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-white/50"
              >
                Product
              </Button>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-white/50"
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-white/50"
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-white/50"
              >
                Docs
              </Button>
            </nav>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-white/50 gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">{user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      <span>{user.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>退出登录</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-gray-900 hover:bg-white/50"
                    onClick={() => setShowLoginDialog(true)}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="default"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setShowLoginDialog(true)}
                  >
                    Sign up →
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

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

      {/* Login Dialog */}
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />
    </div>
  );
}
