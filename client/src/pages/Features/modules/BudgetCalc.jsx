import React from 'react';
import { Wallet, Calculator } from 'lucide-react';

const BudgetCalc = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Tactical Budgeting</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">Expense Inputs</h3>
           <div className="space-y-6 text-white">
              {['Fuel Price', 'Toll Estimate', 'Food/Logistics'].map(label => (
                <div key={label}>
                  <label className="text-xs font-bold mb-2 block">{label}</label>
                  <input type="number" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500" placeholder="$ 0.00" />
                </div>
              ))}
           </div>
        </div>
        <div className="bg-indigo-600 p-10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl">
           <Calculator size={48} className="text-white/20" />
           <div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-2">Total Mission Cost</p>
             <h4 className="text-7xl font-black italic">$ 0.00</h4>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalc;