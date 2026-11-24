import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, Minus, Navigation, Plus } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershop';
import { buildDirectionsUrl, buildWazeDirectionsUrl } from '../utils/booking';

export function LocationMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [originAddress, setOriginAddress] = useState('');
  const [zoomLevel, setZoomLevel] = useState(16);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapInstanceRef.current) return;

    const { lat, lng } = BUSINESS_INFO.coordinates;

    const map = L.map(container, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'alcateia-custom-pin',
      html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
        <div style="background:#1A1A1A;color:#F2F2F0;border:2px solid #9CA3AF;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,0.6);">Barbearia Alcateia</div>
        <div style="width:12px;height:12px;background:#F2F2F0;border:3px solid #1A1A1A;border-radius:9999px;margin-top:4px;box-shadow:0 2px 8px rgba(0,0,0,0.6);"></div>
      </div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
    marker.bindPopup(
      `<div style="min-width:190px;line-height:1.4;">
        <strong style="font-size:13px;display:block;margin-bottom:4px;">${BUSINESS_INFO.name}</strong>
        <span style="font-size:11px;color:#D4D4D4;display:block;">${BUSINESS_INFO.address}</span>
      </div>`,
    );

    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    const { lat, lng } = BUSINESS_INFO.coordinates;
    mapInstanceRef.current?.setView([lat, lng], 16, { animate: true });
    markerRef.current?.openPopup();
  };

  return (
    <div className="rounded-lg overflow-hidden border border-white/10 bg-[#181818] flex flex-col">
      {/* Interactive Map Canvas */}
      <div className="relative h-[320px] sm:h-[360px] w-full alcateia-map-container bg-[#161616]">
        {/* Subtle dark architectural grid underlay visible immediately while/if tiles load */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(to right, #3a3a3a 1px, transparent 1px), linear-gradient(to bottom, #3a3a3a 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        <div
          ref={mapContainerRef}
          data-testid="location-map"
          className="relative z-10 w-full h-full"
          aria-label="Mapa interativo da localização da Barbearia Alcateia na Av. Hermógenes Coelho"
        />

        {/* Custom Map Controls */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Aproximar mapa"
            className="w-9 h-9 rounded bg-[#1A1A1A]/95 border border-white/20 text-[#F2F2F0] hover:bg-[#4A4A4A] flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Afastar mapa"
            className="w-9 h-9 rounded bg-[#1A1A1A]/95 border border-white/20 text-[#F2F2F0] hover:bg-[#4A4A4A] flex items-center justify-center transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRecenter}
            aria-label="Centralizar na Barbearia Alcateia"
            className="w-9 h-9 rounded bg-[#1A1A1A]/95 border border-white/20 text-[#F2F2F0] hover:bg-[#4A4A4A] flex items-center justify-center transition-colors"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>

        {/* Address badge overlay */}
        <div className="absolute bottom-3 left-3 z-[400] max-w-[calc(100%-5rem)] bg-[#1A1A1A]/95 border border-white/15 rounded px-3 py-2 text-xs text-[#E5E5E5]">
          <span className="font-semibold block text-white">{BUSINESS_INFO.name}</span>
          <span className="text-[#B5B5B5] block truncate">
            {BUSINESS_INFO.address} · Zoom {zoomLevel}x
          </span>
        </div>
      </div>

      {/* Directions Bar */}
      <div className="p-4 sm:p-5 bg-[#1F1F1F] border-t border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="directions-origin" className="sr-only">
            Seu ponto de partida (opcional)
          </label>
          <input
            id="directions-origin"
            type="text"
            value={originAddress}
            onChange={(e) => setOriginAddress(e.target.value)}
            placeholder="Digite seu ponto de partida (opcional)"
            className="flex-1 h-10 px-3 rounded bg-[#161616] border border-white/15 text-xs sm:text-sm text-[#F2F2F0] placeholder:text-[#737373] focus:outline-none focus:border-[#9CA3AF]"
          />
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={buildDirectionsUrl(originAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-semibold text-white bg-[#4A4A4A] hover:bg-[#5E5E5E] rounded transition-colors whitespace-nowrap"
            >
              <Navigation className="w-3.5 h-3.5" />
              Traçar Rota
            </a>
            <a
              href={buildWazeDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-3.5 text-xs font-medium text-[#E5E5E5] bg-[#282828] hover:bg-[#363636] border border-white/15 rounded transition-colors whitespace-nowrap"
            >
              Abrir no Waze
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
