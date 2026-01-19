import React from 'react';
import { LayoutDashboard, Shield, Search, Link2, Zap, Brain, Target, ClipboardList, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onReset }) => {
  const menuItems = [
    { id: ViewState.Dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.Technical, label: 'Technical', icon: Shield },
    { id: ViewState.OnPage, label: 'On-Page', icon: Search },
    { id: ViewState.OffPage, label: 'Off-Page', icon: Link2 },
    { id: ViewState.UX, label: 'UX & Business', icon: Zap },
    { id: ViewState.AI, label: 'AI-SEO', icon: Brain },
    { id: ViewState.Competitive, label: 'Competitors', icon: Target },
    { id: ViewState.Roadmap, label: 'Actions', icon: ClipboardList },
  ];

  return (
    <div className="w-72 bg-[#F0F0F2] flex flex-col h-screen sticky top-0 px-4 py-8">
      <div className="px-4 mb-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-[#6B72F0] rounded-lg flex items-center justify-center">
          <Shield size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold text-[#333333] tracking-tight">Report Pro</span>
      </div>

      <nav className="flex-1">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 sidebar-item text-sm font-semibold ${
                  isActive ? 'sidebar-active text-[#333333]' : 'text-[#666666] hover:bg-[#E8E8EA]'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#6B72F0]' : 'text-[#666666]'} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="pt-6 border-t border-[#D0D0D2]">
        <button
          onClick={onReset}
          className="w-full flex items-center gap-3 px-4 py-3 sidebar-item text-sm font-semibold text-[#666666] hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Reset Project
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
