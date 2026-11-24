import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Scissors, X } from 'lucide-react';
import { ESTABLISHMENT_PHOTOS, GalleryPhoto } from '../data/barbershop';

export function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const total = ESTABLISHMENT_PHOTOS.length;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === null ? 0 : (prev - 1 + total) % total));
  }, [total]);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % total));
  }, [total]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  const activePhoto: GalleryPhoto | null =
    activeIndex !== null ? ESTABLISHMENT_PHOTOS[activeIndex] : null;

  return (
    <section
      id="galeria"
      className="py-16 lg:py-24 bg-[#1A1A1A] border-b border-white/10"
      aria-labelledby="heading-galeria"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#A3A3A3]">
              Espaço real em Goiás - GO
            </p>
            <h2
              id="heading-galeria"
              className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F2F2F0] [text-wrap:balance]"
            >
              Galeria de Fotos
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#B8B8B8] max-w-md leading-relaxed">
            Conheça nossas instalações na Av. Hermógenes Coelho. Clique em qualquer foto para ampliar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-10">
          {ESTABLISHMENT_PHOTOS.map((photo, index) => {
            const hasFailed = Boolean(failedImages[photo.id]);
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ampliar foto ${index + 1}: ${photo.caption}`}
                className="group relative text-left rounded-lg overflow-hidden bg-[#232323] border border-white/10 hover:border-[#4A4A4A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <div className="aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden bg-[#202020]">
                  {hasFailed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#232323] to-[#171717]">
                      <Scissors className="w-8 h-8 text-[#737373] mb-3" />
                      <span className="text-xs font-medium text-[#D4D4D4]">{photo.caption}</span>
                    </div>
                  ) : (
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [photo.id]: true }))
                      }
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="p-4 flex items-center justify-between gap-3 bg-[#1A1A1A] border-t border-white/10">
                  <span className="text-xs text-[#D4D4D4] line-clamp-1">{photo.caption}</span>
                  <Expand className="w-4 h-4 text-[#A3A3A3] group-hover:text-white shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada: ${activePhoto.caption}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-4xl bg-[#1A1A1A] border border-white/15 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1F1F1F]">
              <span className="text-xs font-medium text-[#D4D4D4] tabular-nums">
                {activeIndex + 1} / {total} · {activePhoto.caption}
              </span>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Fechar visualização"
                className="inline-flex items-center justify-center w-9 h-9 rounded hover:bg-[#303030] text-[#E5E5E5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-[#121212] flex items-center justify-center max-h-[75vh] min-h-[300px]">
              {failedImages[activePhoto.id] ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Scissors className="w-10 h-10 text-[#737373] mb-3" />
                  <p className="text-sm text-[#D4D4D4]">{activePhoto.caption}</p>
                </div>
              ) : (
                <img
                  src={activePhoto.url}
                  alt={activePhoto.alt}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              )}

              <button
                type="button"
                onClick={showPrev}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#1A1A1A]/90 border border-white/20 text-white hover:bg-[#4A4A4A] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#1A1A1A]/90 border border-white/20 text-white hover:bg-[#4A4A4A] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
