"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function TransitionProvider({ children }) {
  const containerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={containerRef} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
