import React from 'react';
import { Leaf, Wind } from 'lucide-react';

const EcoMode = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8 text-emerald-500">Eco-Optimizer</h2>
      <div className="glass-card p-12 rounded-[3rem] border-emerald-500/20 bg-emerald-500/5 text-center">
        <Leaf size={64} className="mx-auto mb-6 text-emerald-500 animate-pulse" />
        <h3 className="text-2xl font-bold mb-4">Greener Paths Detected</h3>
        <p className="text-gray-400 mb-10">Switching to neural-eco routing reduces emissions by up to 24%.</p>
        <button className="px-12 py-5 bg-emerald-600 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all text-sm">
          Activate Green Lane
        </button>
      </div>
    </div>
  );
};

export default EcoMode;