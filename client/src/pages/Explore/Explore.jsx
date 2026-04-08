import React from 'react';
import { Map as MapIcon, Search, Filter, Crosshair } from 'lucide-react';

const Explore = () => {
  return (
    <div className="min-h-screen bg-black pt-32 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Live Grid Overlay</span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Tactical Explorer</h1>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-grow md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Scan coordinates..." 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all font-bold text-sm text-white"
                />
             </div>
             <button className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all text-white">
                <Filter size={20} />
             </button>
          </div>
        </div>

        {/* Tactical Map Container */}
        <div className="w-full h-[65vh] rounded-[3rem] overflow-hidden border border-white/10 bg-[#050505] relative flex items-center justify-center group shadow-2xl">
          {/* CRT/Grid Effect Layer */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
          
          <div className="text-center relative z-10">
            <div className="relative mb-6">
              <MapIcon size={80} className="mx-auto text-indigo-500/10 animate-pulse" />
              <Crosshair size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500/40" />
            </div>
            <p className="text-gray-600 font-black uppercase tracking-[0.5em] text-xs">Initializing Neural Map Engine...</p>
          </div>

          {/* Floating UI Overlay */}
          <div className="absolute bottom-10 left-10 p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md hidden md:block">
            <div className="flex gap-6 items-center">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-gray-600">Sync Status</p>
                <p className="text-xs font-bold text-indigo-400 uppercase italic">Active Link</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-gray-600">Bitrate</p>
                <p className="text-xs font-bold text-white uppercase italic">124 GB/S</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;