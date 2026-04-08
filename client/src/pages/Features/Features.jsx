import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Wallet, AlertTriangle, Leaf, Users, ChevronRight } from 'lucide-react';

const Features = () => {
  const featureList = [
    { 
      id: 'ai-planner',
      icon: <Zap />, 
      title: "AI Travel Planner", 
      desc: "Neural-engine pathfinding with multi-stop optimization.",
      tag: "CORE"
    },
    { 
      id: 'budget-calc',
      icon: <Wallet />, 
      title: "Budget Calculator", 
      desc: "Tactical expense forecasting for fuel, tolls, and stays.",
      tag: "FINANCE"
    },
    { 
      id: 'safety-alerts',
      icon: <AlertTriangle />, 
      title: "Safety Grid", 
      desc: "Real-time risk assessment and crime-map overlays.",
      tag: "TACTICAL"
    },
    { 
      id: 'emergency',
      icon: <Shield />, 
      title: "SOS Matrix", 
      desc: "One-tap emergency uplink to nearest response units.",
      tag: "URGENT"
    },
    { 
      id: 'eco-mode',
      icon: <Leaf />, 
      title: "Eco-Optimizer", 
      desc: "Carbon footprint reduction via green-lane routing.",
      tag: "BIO"
    },
    { 
      id: 'social-hub',
      icon: <Users />, 
      title: "Social Hub", 
      desc: "Collaborative mission planning with live fleet tracking.",
      tag: "NETWORK"
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h1 className="text-7xl font-black mb-4 italic uppercase tracking-tighter">Mission Modules</h1>
          <p className="text-gray-500 text-xl max-w-2xl font-medium">Select a module to deploy the tactical interface.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((f) => (
            <Link 
              key={f.id} 
              to={`/features/${f.id}`}
              className="group relative p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-indigo-500/50 transition-all duration-500 flex flex-col justify-between hover:bg-white/[0.02]"
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 text-indigo-500 bg-indigo-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-lg">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-gray-700 bg-white/5 px-3 py-1 rounded-full">{f.tag}</span>
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight uppercase italic">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium group-hover:text-gray-300 transition-colors">{f.desc}</p>
              </div>
              
              <div className="mt-10 flex items-center gap-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                Initialize Module <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;