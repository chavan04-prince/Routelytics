import React from 'react';
import { Mail, MessageCircle, Send, Globe } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-black text-white min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-7xl font-black mb-8 italic uppercase tracking-tighter">Reach Ops.</h1>
            <p className="text-gray-500 text-xl mb-12 font-medium leading-relaxed">
              Encountered a glitch in the grid or need tactical support? Our global ops center is monitoring 24/7.
            </p>
            
            <div className="space-y-10">
              <ContactItem icon={<Mail />} label="Comm Link" value="ops@routelytics.ai" />
              <ContactItem icon={<MessageCircle />} label="Tactical Comms" value="join.routelytics.ai" />
              <ContactItem icon={<Globe />} label="Nexus Point" value="Global HQ - SF" />
            </div>
          </div>

          <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[60px] group-hover:bg-indigo-600/10 transition-all"></div>
            <form className="space-y-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Identity Tag</label>
                <input type="text" className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-indigo-500 transition-all font-bold" placeholder="Pilot-01" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Transmission Frequency</label>
                <input type="email" className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-indigo-500 transition-all font-bold" placeholder="your@email.com" />
              </div>
              <button type="button" className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all uppercase tracking-[0.2em] text-sm shadow-xl flex items-center justify-center gap-3">
                Broadcast Transmission <Send size={18}/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, label, value }) => (
  <div className="flex gap-6 items-center group cursor-pointer">
    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-1">{label}</p>
      <p className="text-xl font-bold italic tracking-tight group-hover:text-white transition-colors">{value}</p>
    </div>
  </div>
);

export default Contact;