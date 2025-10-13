import React, { useState } from 'react';
import { Button } from '@/components/ThirdParty/ShadCn/Button';
import { StarIcon, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-300/50 sticky top-0 z-50" style={{ width: '100vw' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <StarIcon className="h-8 w-8 text-gray-800" />
              <span className="text-xl font-bold text-gray-800">Astrology</span>
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" asChild className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50">
                <a href="/signs">Signs</a>
              </Button>
              <Button variant="ghost" asChild className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/50">
                <a href="/houses">Houses</a>
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile navigation menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50">
              <div className="px-4 py-2 space-y-1 bg-white/95 backdrop-blur-md">
                <Button variant="ghost" asChild className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100/50">
                  <a href="/signs" onClick={() => setIsMobileMenuOpen(false)}>Signs</a>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100/50">
                  <a href="/houses" onClick={() => setIsMobileMenuOpen(false)}>Houses</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;