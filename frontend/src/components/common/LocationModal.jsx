import React, { useState } from 'react';
import { MapPin, X, Check, Navigation } from 'lucide-react';

const LocationModal = ({ isOpen, onClose, currentLocation, onSelectLocation }) => {
  const [selectedCity, setSelectedCity] = useState(currentLocation || 'Bengaluru, Indiranagar');

  const popularLocations = [
    { city: 'Bengaluru', area: 'Indiranagar (560038)', eta: '15 mins' },
    { city: 'Bengaluru', area: 'Koramangala (560034)', eta: '18 mins' },
    { city: 'Bengaluru', area: 'HSR Layout (560102)', eta: '20 mins' },
    { city: 'Bengaluru', area: 'Whitefield (560066)', eta: '25 mins' },
    { city: 'Mumbai', area: 'Bandra West (400050)', eta: '20 mins' },
    { city: 'Delhi NCR', area: 'Gurugram Sector 43 (122002)', eta: '15 mins' },
    { city: 'Hyderabad', area: 'Madhapur, Hitec City (500081)', eta: '15 mins' },
    { city: 'Pune', area: 'Kalyani Nagar (411006)', eta: '20 mins' },
  ];

  if (!isOpen) return null;

  const handleSelect = (loc) => {
    const formatted = `${loc.city}, ${loc.area.split(' ')[0]}`;
    setSelectedCity(formatted);
    onSelectLocation(formatted);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={22} color="#10b981" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Choose Delivery Location</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Select your location to check grocery item availability and estimated delivery slot speeds.
        </p>

        <button
          className="btn btn-outline-primary btn-block"
          style={{ marginBottom: '1.25rem', gap: '0.5rem' }}
          onClick={() => {
            const autoLoc = 'Bengaluru, Koramangala';
            onSelectLocation(autoLoc);
            onClose();
          }}
        >
          <Navigation size={18} /> Use Current GPS Location (Instant Detect)
        </button>

        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Popular Grocery Service Hubs
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {popularLocations.map((loc, idx) => {
            const label = `${loc.city}, ${loc.area.split(' ')[0]}`;
            const isSelected = selectedCity.includes(loc.city) && selectedCity.includes(loc.area.split(' ')[0]);

            return (
              <div
                key={idx}
                onClick={() => handleSelect(loc)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: isSelected ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    {loc.city} - {loc.area}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    ⚡ Express Delivery in {loc.eta}
                  </div>
                </div>
                {isSelected && <Check size={18} color="#10b981" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
