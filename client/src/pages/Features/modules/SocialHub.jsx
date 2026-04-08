import React from 'react';
import { Users, Radio } from 'lucide-react';

const SocialHub = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Fleet Command</h2>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl group hover:border-indigo-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400"><Users size={20}/></div>
              <div>
                <p className="font-bold tracking-tight">Pilot-0{i}</p>
                <p className="text-[10px] uppercase font-black text-gray-600">Distance: {i * 1.2} KM</p>
              </div>
            </div>
            <Radio size={18} className="text-indigo-500 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialHub;