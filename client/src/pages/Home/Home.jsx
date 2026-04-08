import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Map, Radio, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-black text-white min-h-screen font-['Inter'] relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[160px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[160px]"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32">
        <div className="container mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles size={14} className="animate-pulse" />
            Next-Gen Routing Engine
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
            Navigate the World. <br /> 
            <span className="text-white">Intelligently.</span>
          </h1>
          
          <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-12 text-gray-400 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            Routelytics fuses AI pathfinding with real-time telemetry to create the most aesthetic and efficient journey planning experience on the planet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Link 
              to="/explore" 
              className="group relative px-12 py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] active:scale-95"
            >
              <span className="relative flex items-center gap-3">
                Start Journey <ChevronRight size={18} />
              </span>
            </Link>
            <Link 
              to="/features" 
              className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all border-white/20"
            >
              Platform Overview
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 border-t border-white/5 relative bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap size={32} />}
              title="AI Optimization"
              desc="Our neural network predicts traffic flows 30 minutes into the future."
            />
            <FeatureCard 
              icon={<Map size={32} />}
              title="Tactical POI"
              desc="Discover facilities and locations filtered by your personal vibe and needs."
            />
            <FeatureCard 
              icon={<Radio size={32} />}
              title="Live Telemetry"
              desc="Real-time bus tracking and transport schedules synced across all devices."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="container mx-auto px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-600 mb-4">
            Powered by Aether Core v4.0
          </p>
          <p className="text-gray-500 text-sm italic">
            &copy; 2026 Routelytics. Redefining modern exploration.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group p-10 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-indigo-500/30 transition-all duration-700 hover:-translate-y-2">
    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{title}</h3>
    <p className="text-gray-500 leading-relaxed font-medium group-hover:text-gray-300 transition-colors">{desc}</p>
  </div>
);

export default Home;