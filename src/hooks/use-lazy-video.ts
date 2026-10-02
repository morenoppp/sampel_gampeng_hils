import { useEffect, type RefObject } from "react";

export function useLazyVideo(videoRef: RefObject<HTMLVideoElement | null>, src: string) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      video.src = src;
      video.load();
    };

    if (!("IntersectionObserver" in window)) {
      load();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      if (loaded) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [videoRef, src]);
}
