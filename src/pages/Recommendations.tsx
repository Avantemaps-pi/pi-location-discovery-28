
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { recommendedForYou, suggestedForYou, avanteTopChoice } from '@/data/mockPlaces';
import CategorySection from '@/components/business/CategorySection';

const Recommendations = () => {
  const navigate = useNavigate();
  
  const handlePlaceClick = (placeId: string) => {
    navigate('/', { state: { selectedPlaceId: placeId } });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Recommendations</h1>
          <p className="text-muted-foreground">Discover top-rated places that accept Pi cryptocurrency as payment.</p>
        </div>

        <div className="space-y-12">
          <CategorySection 
            title="Avante Top Choice" 
            places={avanteTopChoice} 
            onPlaceClick={handlePlaceClick} 
          />
          
          <CategorySection 
            title="Suggested for you" 
            places={suggestedForYou} 
            onPlaceClick={handlePlaceClick} 
          />
          
          <CategorySection 
            title="Recommended for you" 
            places={recommendedForYou} 
            onPlaceClick={handlePlaceClick} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
