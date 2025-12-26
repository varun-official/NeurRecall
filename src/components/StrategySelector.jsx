import React from 'react';
import { Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const STRATEGIES = [
    { id: 'vector', label: 'Vector Search', desc: 'Fast semantic search' },
    { id: 'keyword', label: 'Keyword Search', desc: 'Exact phrase matching' },
    { id: 'hybrid', label: 'Hybrid Search', desc: 'Combined Vector + Keyword (RRF)' },
    { id: 'multi_query_vector', label: 'Multi-Query Vector', desc: '3 Variations -> Vector' },
    { id: 'multi_query_hybrid', label: 'Multi-Query Hybrid', desc: '3 Variations -> Hybrid' },
    { id: 'query_decompose_vector', label: 'Decompose Vector', desc: 'Sub-questions -> Vector' },
    { id: 'query_decompose_hybrid', label: 'Decompose Hybrid', desc: 'Sub-questions -> Hybrid' },
];

export const StrategySelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const selected = STRATEGIES.find(s => s.id === value) || STRATEGIES[0];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors"
            >
                <Settings2 className="w-4 h-4 text-indigo-400" />
                <span>{selected.label}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 bottom-12 z-20 w-64 glass-panel rounded-xl overflow-hidden p-1"
                        >
                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                RAG Strategy
                            </div>
                            <div className="max-h-64 overflow-y-auto space-y-0.5">
                                {STRATEGIES.map((strategy) => (
                                    <button
                                        type="button"
                                        key={strategy.id}
                                        onClick={() => {
                                            onChange(strategy.id);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${value === strategy.id
                                            ? 'bg-indigo-500/20 text-indigo-300'
                                            : 'text-slate-300 hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className="font-medium">{strategy.label}</div>
                                        <div className="text-xs text-slate-500">{strategy.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
