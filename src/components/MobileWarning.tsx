import React from "react";
import styles from "./MobileWarning.module.css";

/**
 * Full-screen overlay shown on mobile devices. Replaces the normal explorer UI with a
 * solid white page containing a desktop illustration and a warning that the experience
 * requires desktop. Uses the brand's darkorchid accent to stay on-design.
 */
export default function MobileWarning() {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <svg
          className={styles.desktopIcon}
          viewBox="0 0 320 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Monitor stand base */}
          <rect x="120" y="220" width="80" height="14" rx="7" fill="#4A2D7A" />
          <rect x="145" y="200" width="30" height="20" rx="4" fill="#5A3A8A" />
          {/* Monitor body */}
          <rect x="40" y="30" width="240" height="170" rx="14" fill="#4A2D7A" />
          <rect x="52" y="42" width="216" height="146" rx="8" fill="#E8D5FF" />
          {/* Screen content - simplified map view */}
          <circle cx="160" cy="100" r="28" fill="#B378F4" opacity="0.6">
            <animate attributeName="r" values="28;32;28" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <rect x="90" y="150" width="140" height="4" rx="2" fill="#763BC8" opacity="0.4" />
          <rect x="100" y="165" width="120" height="4" rx="2" fill="#763BC8" opacity="0.4" />
          <rect x="110" y="180" width="100" height="4" rx="2" fill="#763BC8" opacity="0.4" />
        </svg>
        <h1 className={styles.heading}>Desktop Only</h1>
        <p className={styles.message}>
          This multichain explorer is designed for desktop use. Please open it on a larger
          screen for the full experience.
        </p>
      </div>
    </div>
  );
}