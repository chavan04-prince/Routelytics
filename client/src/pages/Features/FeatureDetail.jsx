import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * MODULE IMPORTS
 * These files must exist in: client/src/pages/Features/modules/
 */
import AIPlanner from './modules/AIPlanner';
import BudgetCalc from './modules/BudgetCalc';
import EcoMode from './modules/EcoMode';
import SocialHub from './modules/SocialHub';
import SafetyGrid from './modules/SafetyGrid';
import EmergencySOS from './modules/EmergencySOS';

const FeatureDetail = () => {
  const { id } = useParams();

  // The Switchboard: Connects the URL ID to the imported Component
  const renderModule = () => {
    switch (id) {
      case 'ai-planner':    return <AIPlanner />;
      case 'budget-calc':   return <BudgetCalc />;
      case 'eco-mode':      return <EcoMode />;
      case 'social-hub':    return <SocialHub />;
      case 'safety-alerts': return <SafetyGrid />;
      case 'emergency':     return <EmergencySOS />;
      default: 
        return (
          <div className="text-center py-20">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-widest italic">
              Module Offline
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              The requested tactical module is not currently deployed.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-black min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Back Link */}
        <Link 
          to="/features" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-12 transition-all font-black uppercase text-[10px] tracking-[0.3em] group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Mission Modules
        </Link>
        
        {/* Container for the Teammate's Module */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           {renderModule()}
        </div>
      </div>
    </div>
  );
};

export default FeatureDetail;