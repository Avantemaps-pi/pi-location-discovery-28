
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';
import PlaceCardPopup from '../PlaceCardPopup';

interface PlaceOverlayProps {
  selectedPlace: Place | null;
  showPopover: boolean;
  onOverlayClick: () => void;
  detailCardRef?: React.RefObject<HTMLDivElement>;
}

const PlaceOverlay: React.FC<PlaceOverlayProps> = ({ 
  selectedPlace, 
  showPopover, 
  onOverlayClick,
  detailCardRef 
}) => {
  const navigate = useNavigate();

  if (!selectedPlace || !showPopover) return null;
  
  return (
    <>
      {/* Greyish transparent overlay that appears when a place is selected */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
        onClick={onOverlayClick}
      />
      
      {/* Popup card overlay for selected place */}
      <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 place-popup">
        <PlaceCardPopup location={selectedPlace} detailCardRef={detailCardRef} />
      </div>
    </>
  );
};

export default PlaceOverlay;
