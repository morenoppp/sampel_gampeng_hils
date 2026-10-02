import { useCallback, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { useLazyVideo } from "@/hooks/use-lazy-video";

import "./scroll-expand.css";

type ScrollExpandProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  src?: string;
  mediaType?: "image" | "video";
  poster?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  children?: ReactNode;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const progress = clamp((value - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return progress * progress * (3 - 2 * progress);
};

export default function ScrollExpand({
  src = "",
  mediaType = "image",
  poster = "",
  alt = "",
  title = "",
  scrollHint = "",
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = "",
  style,
  ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useLazyVideo(videoRef, mediaType === "video" ? src : "");

  const propsRef = useRef({});
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  };

  const applyProgress = useCallback((progress: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const options = propsRef.current as {
      startWidth: number;
      startHeight: number;
      startRadius: number;
      endRadius: number;
      mediaZoom: number;
      overlayScrim: number;
    };
    const eased = smoothstep(0, 1, progress);
    const width = options.startWidth + (100 - options.startWidth) * eased;
    const height = options.startHeight + (100 - options.startHeight) * eased;
    const insetX = Math.max(0, (100 - width) / 2);
    const insetY = Math.max(0, (100 - height) / 2);
    const radius = options.startRadius + (options.endRadius - options.startRadius) * eased;

    frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
    media.style.transform = `scale(${options.mediaZoom + (1 - options.mediaZoom) * eased})`;
    if (scrimRef.current) scrimRef.current.style.opacity = `${options.overlayScrim * eased}`;

    if (titleRef.current) {
      const fade = smoothstep(0.4, 0.88, progress);
      titleRef.current.style.opacity = `${1 - fade}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * fade}px, 0) scale(${1 + 0.06 * fade})`;
    }

    if (hintRef.current) {
      const fade = smoothstep(0, 0.12, progress);
      hintRef.current.style.opacity = `${1 - fade}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * fade}px, 0)`;
    }

    if (overlayRef.current) {
      const reveal = smoothstep(0.68, 1, progress);
      overlayRef.current.style.opacity = `${reveal}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - reveal)}px, 0)`;
      overlayRef.current.style.pointerEvents = reveal > 0.95 ? "auto" : "none";
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let current = 0;
    let target = 0;
    let stageHeight = 0;
    let running = false;
    let previousFrameTime: number | null = null;

    const measure = () => {
      const options = propsRef.current as {
        useWindowScroll: boolean;
        scrollDistance: number;
        holdDistance: number;
      };
      stageHeight = options.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageHeight <= 0) return;
      stage.style.height = `${stageHeight}px`;
      track.style.height = `${stageHeight * (1 + Math.max(0, options.scrollDistance) + Math.max(0, options.holdDistance))}px`;
      stage.style.setProperty(
        "--se-title-size",
        `${clamp(root.clientWidth || stageHeight, 267, 1120) * 0.075}px`,
      );
    };

    const readProgress = () => {
      const options = propsRef.current as {
        enabled: boolean;
        useWindowScroll: boolean;
        scrollDistance: number;
      };
      if (!options.enabled) return 1;
      const span = stageHeight * Math.max(0.01, options.scrollDistance);
      return options.useWindowScroll
        ? clamp(-track.getBoundingClientRect().top / span, 0, 1)
        : clamp(root.scrollTop / span, 0, 1);
    };

    const tick = (timestamp: number) => {
      const options = propsRef.current as { smoothing: number };
      const elapsed =
        previousFrameTime === null
          ? 1 / 60
          : Math.min((timestamp - previousFrameTime) / 1000, 0.05);
      previousFrameTime = timestamp;
      const factor = options.smoothing <= 0 ? 1 : 1 - Math.exp(-elapsed / options.smoothing);
      current += (target - current) * factor;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
        previousFrameTime = null;
      }
      applyProgress(current);
      animationFrame = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      previousFrameTime = null;
      if (!animationFrame) animationFrame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (
        propsRef.current &&
        ((propsRef.current as { smoothing: number }).smoothing <= 0 || reduceMotion)
      ) {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        running = false;
        previousFrameTime = null;
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(root);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  const media =
    mediaType === "video" ? (
      <video
        ref={(element) => {
          videoRef.current = element;
          mediaRef.current = element;
        }}
        className="scroll-expand__media"
        preload="none"
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img
        ref={mediaRef as React.RefObject<HTMLImageElement>}
        className="scroll-expand__media"
        src={src}
        alt={alt}
        draggable={false}
      />
    );

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? "scroll-expand--window" : "scroll-expand--scroller"} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
