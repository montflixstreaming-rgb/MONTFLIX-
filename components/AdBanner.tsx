
import React from 'react';

interface AdBannerProps {
  type: 'leaderboard' | 'rectangle';
}

/**
 * AD BANNER DISABLED - MONTFLIX ADS-FREE POLICY
 */
const AdBanner: React.FC<AdBannerProps> = () => {
  return null; // Retorna nulo para não ocupar espaço nem carregar scripts
};

export default AdBanner;
