import React from 'react';
import { MessageSquare, Upload, BrainCircuit } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const Sidebar = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { id: 'chat', label: 'Chat', icon: MessageSquare },
        { id: 'upload', label: 'Knowledge Base', icon: Upload },
    ];

    return (
        <div className="w-64 h-screen glass-panel border-r border-slate-800 flex flex-col p-4">
            <div className="flex items-center gap-3 px-4 mb-8 mt-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <BrainCircuit className="w-6 h-6 text-indigo-400" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    NeurRecall
                </h1>
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group overflow-hidden",
                                isActive
                                    ? "text-white"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}

                            <Icon className={clsx("w-5 h-5 relative z-10", isActive && "text-indigo-400")} />
                            <span className="relative z-10 font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto px-4 py-4 border-t border-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 border border-slate-700">
                        U
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-300">User</span>
                        <span className="text-xs text-slate-500">Free Tier</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
