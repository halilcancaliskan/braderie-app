import React from 'react';

function MediaCarousel({ photos = [], altBase = 'Photo' }) {
  const trackRef = React.useRef(null);
  const [idx, setIdx] = React.useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIdx(i);
  };

  if (!photos?.length) return null;

  return (
    <div className="carousel">
      <div className="carousel__track" ref={trackRef} onScroll={onScroll}>
        {photos.map((src, i) => (
          <div key={i} className="carousel__item">
            <img src={src} alt={`${altBase} ${i + 1}`} />
          </div>
        ))}
      </div>
      <div className="carousel__counter">{idx + 1}/{photos.length}</div>
    </div>
  );
}

export default MediaCarousel;
