import { Bell, Search, Settings } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b border-cream-300 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-forest-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索动物、记录..."
              className="pl-10 pr-4 py-2 w-64 bg-cream-100 border border-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-forest-400 transition-all"
            />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-cream-100 text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-warm-500 rounded-full animate-pulse-soft"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-cream-100 text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
