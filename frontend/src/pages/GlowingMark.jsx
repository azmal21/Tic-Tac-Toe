import React from "react";

export default function GlowingMark({ type = "X", size = 80, active = false }) {
  const styles = { width: size, height: size, display: "block" };

  // choose colors based on type
  const colors = {
    X: "#ff4d6d",   // neon reddish-pink
    O: "#00e5ff",   // neon cyan-blue
  };

  if (type === "X") {
    return (
      <svg
        viewBox="0 0 120 120"
        style={styles}
        className={active ? "glow pulse" : "glow"}
      >
        <defs>
          <filter id="glowX" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#glowX)">
          <path
            d="M30 30 L90 90"
            stroke={colors.X}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M90 30 L30 90"
            stroke={colors.X}
            strokeWidth="10"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  } else {
    return (
      <svg
        viewBox="0 0 120 120"
        style={styles}
        className={active ? "glow pulse" : "glow"}
      >
        <defs>
          <filter id="glowO" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#glowO)">
          <circle
            cx="60"
            cy="60"
            r="28"
            stroke={colors.O}
            strokeWidth="10"
            fill="none"
          />
        </g>
      </svg>
    );
  }
}
