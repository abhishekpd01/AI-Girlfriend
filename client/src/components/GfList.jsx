import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import '../gfList.css';

export const GfList = ({
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
  onSelectImage
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const items = [
    {
      image: "/gf_1.jpg",
      title: "Sarah Johnson",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)"
    },
    {
      image: "/gf_2.jpg",
      title: "Mike Chen",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)"
    },
    {
      image: "/gf_3.jpg",
      title: "Mike Chen",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)"
    }
  ];
  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = e => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true
    });
  };

  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Add a prop to receive the callback from parent
  // Example: onSelectImage
  return (
    <>
      <h1 className='choose-partner'> Choose One </h1>
      <div
        ref={rootRef}
        className={`chroma-grid ${className}`}
        style={{
          '--r': `${radius}px`,
          '--cols': columns,
          '--rows': rows
        }}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {data.map((c, i) => (
          <article
            key={i}
            className="chroma-card"
            onMouseMove={handleCardMove}
            onClick={() => {
              if (typeof onSelectImage === 'function') {
                onSelectImage(c.image); // ✅ call the prop directly
              }
            }}
            style={{
              '--card-border': c.borderColor || 'transparent',
              '--card-gradient': c.gradient,
              cursor: 'pointer'
            }}
          >
            <div className="chroma-img-wrapper">
              <img src={c.image} alt={c.title} loading="lazy" />
            </div>
            <footer className="chroma-info">
            </footer>
          </article>
        ))}
        <div className="chroma-overlay" />
        <div ref={fadeRef} className="chroma-fade" />
      </div>
    </>
  );
};

export default GfList;
