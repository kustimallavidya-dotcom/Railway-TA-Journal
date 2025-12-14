import React from 'react';

interface AdProps {
  type: 'banner' | 'interstitial';
}

export const AdComponent: React.FC<AdProps> = ({ type }) => {
  // In a real implementation, this would connect to AdMob/AdSense
  if (type === 'banner') {
    return (
      <div className="w-full h-14 bg-gray-100 border-t border-gray-300 flex items-center justify-center text-xs text-gray-400 no-print">
        <span>Advertisement Area (Banner)</span>
      </div>
    );
  }
  return null;
};