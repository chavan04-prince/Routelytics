import React from 'react';
import { Send, Sparkles, User, Terminal } from 'lucide-react';

const Assistant = () => {
  return (
    <div className="bg-black text-white min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto flex flex-col h-[70vh]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(79,70,229,0.5)]">
            <Terminal className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Neural Concierge</h1>
            <p className="text-[10px] text-indigo-400 font-black tracking-widest uppercase">Uplink Active</p>
          </div>
        </div>

        <div className="flex-grow bg-[#050505] rounded-[2.5rem] p-8 border border-white/5 overflow-y-auto mb-6 space-y-8 shadow-inner no-scrollbar">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex-shrink-0 flex items-center justify-center font-black italic text-xs">RT</div>
            <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none max-w-[85%] border border-white/5 shadow-xl">
              <p className="text-gray-300 font-medium leading-relaxed">
                Mission briefing: Your departure is optimized for 08:30 to avoid predicted congestion. Shall I mark the charging stations along your route?
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start self-end flex-row-reverse">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center"><User size={18}/></div>
            <div className="bg-indigo-600 p-5 rounded-3xl rounded-tr-none max-w-[85%] shadow-2xl">
              <p className="text-white font-medium leading-relaxed text-right">Yes, prioritize stations with high-speed ports and a lounge area.</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Submit query to neural link..."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-6 px-8 outline-none focus:border-indigo-500 transition-all text-white font-bold"
            />
            <button className="absolute right-4 top-4 bg-indigo-600 p-3 rounded-xl hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-lg">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;