import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

import "./accordion-gallery.css";

gsap.registerPlugin(useGSAP);

export type AccordionGalleryItem = {
  image: string;
  label: string;
  alt: string;
};

type AccordionGalleryProps = {
  items: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function AccordionGallery({
  items,
  defaultIndex = 0,
  accentColor = "#ffffff",
  overlayColor = "#060010",
  textColor = "#ffffff",
  height = 440,
  gap = 8,
  radius = 6,
  expandRatio = 0.48,
  orientation = "horizontal",
  duration = 0.65,
  ease = "power3.out",
  parallax = 0.3,
  tilt = 4,
  stagger = 0.06,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
  className = "",
}: AccordionGalleryProps) {
  const vertical = orientation === "vertical";
  const count = items.length;
  const [active, setActive] = useState(() => clamp(defaultIndex, 0, Math.max(0, count - 1)));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const overlayRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const textRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current.slice(0, count);
      if (!panels.length) return;

      const root = rootRef.current;
      const mobile = !vertical && window.matchMedia("(max-width: 520px)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ratio = clamp(expandRatio, 0.2, 0.9);
      const expandedGrow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;
      const animationDuration = animate && !reducedMotion ? duration : 0;
      const timeline = gsap.timeline();

      timelineRef.current?.kill();

      panels.forEach((panel, index) => {
        if (!panel) return;
        const isActive = index === active;
        const rotation = isActive ? 0 : index < active ? tilt : -tilt;
        const panelVars = mobile
          ? {
              flexGrow: 0,
              rotationX: 0,
              rotationY: 0,
            }
          : {
              flexGrow: isActive ? expandedGrow : 1,
              rotationX: vertical ? -rotation : 0,
              rotationY: vertical ? 0 : rotation,
            };

        timeline.to(panel, { ...panelVars, duration: animationDuration, ease }, 0);

        const media = mediaRefs.current[index];
        if (media) {
          const drift = clamp(active - index, -1.5, 1.5);
          const shift = drift * parallax * mediaSizeRef.current * 0.06;
          timeline.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical || mobile || isActive ? 0 : shift,
              y: vertical && !mobile && !isActive ? shift : 0,
              filter: grayscale ? `grayscale(${isActive ? 0 : 1})` : "grayscale(0)",
              duration: animationDuration,
              ease,
            },
            0,
          );
        }

        const overlay = overlayRefs.current[index];
        if (overlay) {
          timeline.to(
            overlay,
            { opacity: isActive ? 0.24 : 0.76, duration: animationDuration, ease },
            0,
          );
        }

        const bar = barRefs.current[index];
        const text = textRefs.current[index];
        if (showLabels && bar && text) {
          timeline.to(
            [bar, text],
            {
              autoAlpha: isActive ? 1 : 0,
              x: isActive ? 0 : -14,
              duration: animationDuration,
              ease,
              stagger: isActive && !reducedMotion ? stagger : 0,
            },
            0,
          );
        }
      });

      timelineRef.current = timeline;
      if (!root) timeline.kill();
    },
    [
      active,
      count,
      duration,
      ease,
      expandRatio,
      grayscale,
      parallax,
      showLabels,
      stagger,
      tilt,
      vertical,
    ],
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || count === 0) return;

      const measure = () => {
        const mobile = window.matchMedia("(max-width: 520px)").matches;
        const total = vertical && !mobile ? root.clientHeight : root.clientWidth;
        const usable = Math.max(total - gap * (count - 1), 120);
        const mediaSize = Math.max(140, usable * clamp(expandRatio, 0.2, 0.9) * 1.22);
        mediaSizeRef.current = mediaSize;
        root.style.setProperty("--ag-media-size", `${mediaSizeRef.current}px`);
        return total;
      };

      let observedSize = measure();
      applyLayout(!firstRunRef.current);
      firstRunRef.current = false;

      const observer = new ResizeObserver(() => {
        const nextSize = measure();
        if (Math.abs(nextSize - observedSize) <= 1) return;
        observedSize = nextSize;
        applyLayout(true);
      });
      observer.observe(root);

      return () => {
        observer.disconnect();
        timelineRef.current?.kill();
      };
    },
    {
      scope: rootRef,
      dependencies: [applyLayout, count, expandRatio, gap, vertical],
      revertOnUpdate: true,
    },
  );

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLButtonElement>) => {
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index - 1
          : null;
    if (next === null || count === 0) return;
    event.preventDefault();
    const nextIndex = (next + count) % count;
    setActive(nextIndex);
    panelRefs.current[nextIndex]?.focus();
  };

  if (count === 0) return null;

  const style = {
    "--ag-accent": accentColor,
    "--ag-overlay": overlayColor,
    "--ag-text": textColor,
    "--ag-gap": `${gap}px`,
    "--ag-radius": `${radius}px`,
    "--ag-mobile-active-height": `${Math.min(260, Math.round(height * 0.58))}px`,
    "--ag-mobile-duration": `${duration}s`,
    height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? " accordion-gallery--vertical" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      role="group"
      aria-label="Galeri Gampeng Hills"
    >
      {items.map((item, index) => {
        const isActive = index === active;
        return (
          <button
            key={`${item.label}-${item.image}`}
            ref={(element) => {
              panelRefs.current[index] = element;
            }}
            className={`ag-panel${isActive ? " ag-panel--active" : ""}`}
            type="button"
            aria-label={item.label}
            aria-pressed={isActive}
            onClick={() => {
              setActive(index);
              setLightboxIndex(index);
            }}
            onMouseEnter={() => {
              if (trigger === "hover") setActive(index);
            }}
            onFocus={() => setActive(index)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          >
            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={(element) => {
                  mediaRefs.current[index] = element;
                }}
              >
                <img src={item.image} alt={item.alt} loading="lazy" draggable={false} />
              </span>
              <span
                className="ag-panel__overlay"
                ref={(element) => {
                  overlayRefs.current[index] = element;
                }}
                aria-hidden="true"
              />
            </span>
            {showLabels ? (
              <span className="ag-panel__label" aria-hidden="true">
                <span
                  className="ag-panel__bar"
                  ref={(element) => {
                    barRefs.current[index] = element;
                  }}
                />
                <span
                  className="ag-panel__text"
                  ref={(element) => {
                    textRefs.current[index] = element;
                  }}
                >
                  {item.label}
                </span>
              </span>
            ) : null}
          </button>
        );
      })}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => setLightboxIndex(open ? lightboxIndex : null)}
      >
        <DialogContent className="ag-lightbox-shell">
          {lightboxIndex !== null ? (
            <div className="ag-lightbox">
              <DialogTitle className="sr-only">{items[lightboxIndex].label}</DialogTitle>
              <DialogDescription className="sr-only">{items[lightboxIndex].alt}</DialogDescription>
              <div className="ag-lightbox__image-wrap">
                <img src={items[lightboxIndex].image} alt={items[lightboxIndex].alt} />
              </div>
              <div className="ag-lightbox__caption">
                <span className="ag-lightbox__caption-bar" />
                <span>{items[lightboxIndex].label}</span>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
