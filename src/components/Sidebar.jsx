import React from 'react';
import { MessageSquare, Upload, LogOut } from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange, onLogout, user }) => {
    const tabs = [
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'upload', icon: Upload, label: 'Upload' },
    ];

    return (
        <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20">
            <div className="p-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                    Knowledge Capture
                </h1>
                {user && (
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                        {user.full_name || user.email}
                    </p>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {onLogout && (
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            )}
        </aside>
    );
};
