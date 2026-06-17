import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, PawPrint, UtensilsCrossed, Heart, Baby,
  Home, Eye, GraduationCap, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '首页概览' },
  { path: '/animals', icon: PawPrint, label: '动物档案' },
  { path: '/feeding', icon: UtensilsCrossed, label: '饲喂管理' },
  { path: '/health', icon: Heart, label: '健康监测' },
  { path: '/breeding', icon: Baby, label: '繁育记录' },
  { path: '/enclosure', icon: Home, label: '笼舍环境' },
  { path: '/behavior', icon: Eye, label: '行为观察' },
  { path: '/education', icon: GraduationCap, label: '科普展示' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-white border-r border-cream-300 flex flex-col h-screen shadow-sm sticky top-0`}
    >
      <div className="p-4 border-b border-cream-300 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-700 rounded-xl flex items-center justify-center shadow-md">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-forest-800 leading-tight">
                动物园管理系统
              </h1>
              <p className="text-xs text-gray-500">饲养繁育平台</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-700 rounded-xl flex items-center justify-center shadow-md mx-auto">
            <PawPrint className="w-6 h-6 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-cream-100 text-gray-500 transition-colors"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `${isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item'} ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-cream-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-bold">
              管
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate">管理员</p>
              <p className="text-xs text-gray-500 truncate">admin@zoo.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
