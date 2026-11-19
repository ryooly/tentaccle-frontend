import React, { CSSProperties } from "react";
import styles from "./MobileWarning.module.css";

/**
 * Full-screen overlay shown on mobile devices (< 826px).
 * Replaces the explorer with a branded GasPulse illustration featuring the purple octopus
 * hugging and curling its tentacles around a desktop monitor displaying the multichain web.
 */
export default function MobileWarning() {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        {/* Animated Octopus + Desktop Illustration */}
        <div className={styles.illustrationWrapper}>
          <svg
            className={styles.desktopIcon}
            viewBox="0 0 360 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              {/* Octopus 3D Head Lighting */}
              <radialGradient
                id="mw-octopus-head"
                cx="180"
                cy="46"
                r="74"
                fx="176"
                fy="36"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#D8A4FF" />
                <stop offset="55%" stopColor="#AC6BF3" />
                <stop offset="100%" stopColor="#7834CF" />
              </radialGradient>

              {/* Head Under-Shadow against Monitor */}
              <linearGradient id="mw-octopus-shadow" x1="180" y1="90" x2="180" y2="124" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7834CF" stopOpacity="0" />
                <stop offset="100%" stopColor="#4A1E86" stopOpacity="0.75" />
              </linearGradient>

              {/* Tentacle Gradient */}
              <linearGradient id="mw-tentacle-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BA7BFF" />
                <stop offset="100%" stopColor="#873BDD" />
              </linearGradient>

              {/* Rosy Cheek Blush */}
              <radialGradient id="mw-blush" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFAEEB" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#D49AFA" stopOpacity="0" />
              </radialGradient>

              {/* Desktop Monitor Screen Gradient */}
              <linearGradient id="mw-screen-bg" x1="180" y1="116" x2="180" y2="238" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1B0E33" />
                <stop offset="100%" stopColor="#29154C" />
              </linearGradient>

              {/* Screen Multichain Center Glow */}
              <radialGradient id="mw-screen-glow" cx="180" cy="177" r="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#1B0E33" stopOpacity="0" />
              </radialGradient>

              {/* Floating Ambient Bubbles */}
              <linearGradient id="mw-bubble" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="45%" stopColor="#E3B7FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#AC6BF3" stopOpacity="0.12" />
              </linearGradient>
            </defs>

            {/* Ambient Floating Bubbles */}
            <g className={styles.bubbles}>
              <circle cx="56" cy="68" r="9" fill="url(#mw-bubble)" />
              <circle cx="53" cy="65" r="2.2" fill="#FFFFFF" opacity="0.9" />

              <circle cx="44" cy="115" r="6" fill="url(#mw-bubble)" />
              <circle cx="42" cy="113" r="1.5" fill="#FFFFFF" opacity="0.9" />

              <circle cx="308" cy="58" r="8" fill="url(#mw-bubble)" />
              <circle cx="306" cy="55" r="2" fill="#FFFFFF" opacity="0.9" />

              <circle cx="324" cy="98" r="11" fill="url(#mw-bubble)" />
              <circle cx="321" cy="94" r="2.8" fill="#FFFFFF" opacity="0.9" />

              <circle cx="296" cy="130" r="5" fill="url(#mw-bubble)" />
              <circle cx="78" cy="42" r="5.5" fill="url(#mw-bubble)" />
            </g>

            {/* Back Tentacles (peeking out behind head) */}
            <path
              d="M 132 86 C 105 84, 88 95, 96 114 C 100 123, 108 122, 114 116 C 118 112, 126 100, 134 98 Z"
              fill="#7A33D1"
            />
            <path
              d="M 228 86 C 255 84, 272 95, 264 114 C 260 123, 252 122, 246 116 C 242 112, 234 100, 226 98 Z"
              fill="#7A33D1"
            />

            {/* Octopus Head */}
            <g className={styles.octopusHead}>
              {/* Head Dome */}
              <path
                d="M 124 118 C 122 55, 142 12, 180 12 C 218 12, 238 55, 236 118 Z"
                fill="url(#mw-octopus-head)"
              />

              {/* Head Under-Shadow against the top bezel */}
              <path
                d="M 124 106 C 140 114, 160 118, 180 118 C 200 118, 220 114, 236 106 L 236 118 L 124 118 Z"
                fill="url(#mw-octopus-shadow)"
              />

              {/* Forehead Glossy Curve Highlight */}
              <path
                d="M 150 32 C 160 25, 174 25, 184 30"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.85"
              />
              <circle cx="191" cy="33" r="2.2" fill="#FFFFFF" opacity="0.85" />

              {/* Cheeks / Blush */}
              <ellipse cx="140" cy="88" rx="10" ry="6" fill="url(#mw-blush)" />
              <ellipse cx="220" cy="88" rx="10" ry="6" fill="url(#mw-blush)" />

              {/* Eye Whites */}
              <ellipse cx="157" cy="70" rx="15" ry="20" fill="#FFFFFF" />
              <ellipse cx="203" cy="70" rx="15" ry="20" fill="#FFFFFF" />

              {/* Tracking Pupils with Sparkles */}
              <g className={styles.pupils}>
                <ellipse cx="160" cy="72" rx="8.5" ry="11.5" fill="#301A4E" />
                <ellipse cx="200" cy="72" rx="8.5" ry="11.5" fill="#301A4E" />

                {/* Primary Highlights */}
                <circle cx="162" cy="68" r="3.4" fill="#FFFFFF" />
                <circle cx="202" cy="68" r="3.4" fill="#FFFFFF" />

                {/* Secondary Cute Sparkles */}
                <circle cx="157" cy="77" r="1.8" fill="#FFFFFF" opacity="0.9" />
                <circle cx="197" cy="77" r="1.8" fill="#FFFFFF" opacity="0.9" />
              </g>

              {/* Animated Blinking Eyelids */}
              <ellipse
                className={styles.eyelid}
                cx="157"
                cy="70"
                rx="15"
                ry="20"
                fill="#AC6BF3"
                style={{ "--lid-cx": "157px", "--lid-cy": "50px" } as CSSProperties}
              />
              <ellipse
                className={styles.eyelid}
                cx="203"
                cy="70"
                rx="15"
                ry="20"
                fill="#AC6BF3"
                style={{ "--lid-cx": "203px", "--lid-cy": "50px" } as CSSProperties}
              />

              {/* Cute Smiling Mouth */}
              <path
                d="M 174 84 Q 180 91 186 84"
                stroke="#301A4E"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Desktop Monitor Stand */}
            <g className={styles.monitorStand}>
              {/* Ambient desk shadow */}
              <ellipse cx="180" cy="286" rx="66" ry="6" fill="#20113B" opacity="0.2" />

              {/* Stand Neck */}
              <rect x="165" y="248" width="30" height="28" rx="4" fill="#3E2170" />
              <rect x="165" y="248" width="8" height="28" rx="2" fill="#2A164D" />

              {/* Stand Base */}
              <rect x="120" y="274" width="120" height="12" rx="6" fill="#341C5E" />
              <rect x="126" y="275" width="108" height="3" rx="1.5" fill="#522C92" />
            </g>

            {/* Desktop Monitor Body */}
            <g className={styles.monitorBody}>
              {/* Outer Bezel */}
              <rect x="65" y="104" width="230" height="146" rx="16" fill="#2E1754" />
              <rect
                x="66"
                y="105"
                width="228"
                height="144"
                rx="15"
                stroke="#482782"
                strokeWidth="2"
                fill="none"
              />

              {/* Webcam dot */}
              <circle cx="180" cy="111" r="2.2" fill="#140826" />
              <circle cx="180" cy="111" r="0.8" fill="#3A1C68" />

              {/* Screen Area */}
              <rect x="76" y="116" width="208" height="122" rx="9" fill="url(#mw-screen-bg)" />
              <rect x="76" y="116" width="208" height="122" rx="9" fill="url(#mw-screen-glow)" />

              {/* Screen Radar Grid */}
              <circle
                cx="180"
                cy="177"
                r="30"
                stroke="#492782"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <circle
                cx="180"
                cy="177"
                r="56"
                stroke="#492782"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.4"
              />
              <line x1="86" y1="177" x2="274" y2="177" stroke="#492782" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <line x1="180" y1="124" x2="180" y2="230" stroke="#492782" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

              {/* Multichain Pulse Connection Web */}
              <g className={styles.networkLines}>
                <line x1="180" y1="177" x2="118" y2="146" stroke="#9345EB" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="180" y1="177" x2="148" y2="136" stroke="#9345EB" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="180" y1="177" x2="212" y2="136" stroke="#9345EB" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="180" y1="177" x2="242" y2="146" stroke="#9345EB" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="180" y1="177" x2="126" y2="206" stroke="#9345EB" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="180" y1="177" x2="234" y2="206" stroke="#9345EB" strokeWidth="1.5" strokeDasharray="4 4" />
              </g>

              {/* Peripheral Blockchain Nodes */}
              {/* Ethereum */}
              <circle cx="118" cy="146" r="6" fill="#627EEA" />
              <circle cx="118" cy="146" r="2.2" fill="#FFFFFF" opacity="0.8" />

              {/* Polygon */}
              <circle cx="148" cy="136" r="5" fill="#8247E5" />
              <circle cx="148" cy="136" r="1.8" fill="#FFFFFF" opacity="0.8" />

              {/* BNB */}
              <circle cx="212" cy="136" r="5" fill="#F3BA2F" />
              <circle cx="212" cy="136" r="1.8" fill="#FFFFFF" opacity="0.8" />

              {/* Solana */}
              <circle cx="242" cy="146" r="6" fill="#14F195" />
              <circle cx="242" cy="146" r="2.2" fill="#FFFFFF" opacity="0.8" />

              {/* Arbitrum */}
              <circle cx="126" cy="206" r="5.5" fill="#28A0F0" />
              <circle cx="126" cy="206" r="2" fill="#FFFFFF" opacity="0.8" />

              {/* Optimism */}
              <circle cx="234" cy="206" r="5.5" fill="#FF0420" />
              <circle cx="234" cy="206" r="2" fill="#FFFFFF" opacity="0.8" />

              {/* Center GasPulse Octopus Core Node */}
              <circle cx="180" cy="177" r="16" fill="#B378F4" opacity="0.3">
                <animate attributeName="r" values="14;20;14" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="180" cy="177" r="9.5" fill="#AC6BF3" />
              <circle cx="180" cy="177" r="4" fill="#FFFFFF" />

              {/* Screen Bottom Progress / Metric Bar */}
              <rect x="94" y="224" width="172" height="4" rx="2" fill="#3B1D6E" />
              <rect x="94" y="224" width="76" height="4" rx="2" fill="#AC6BF3" />
            </g>

            {/* Foreground Tentacles Hugging the Desktop Monitor */}
            {/* 1. Top-Left Tentacle draping over top bezel */}
            <g className={styles.tentacleForeground}>
              <path
                d="M 124 102 C 110 102, 96 106, 92 118 C 88 128, 92 138, 102 138 C 110 138, 112 128, 108 120 C 112 114, 118 110, 126 110 Z"
                fill="url(#mw-tentacle-grad)"
              />
              {/* Suction Cups */}
              <ellipse cx="87" cy="118" rx="3.8" ry="4.8" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="87" cy="118" rx="1.8" ry="2.2" fill="#7834CF" />

              <ellipse cx="92" cy="132" rx="4.2" ry="3.8" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="92" cy="132" rx="2" ry="1.8" fill="#7834CF" />

              <ellipse cx="102" cy="141" rx="3.4" ry="2.8" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="102" cy="141" rx="1.6" ry="1.4" fill="#7834CF" />
            </g>

            {/* 2. Top-Right Tentacle draping over top bezel */}
            <g className={styles.tentacleForeground}>
              <path
                d="M 236 102 C 250 102, 264 106, 268 118 C 272 128, 268 138, 258 138 C 250 138, 248 128, 252 120 C 248 114, 242 110, 234 110 Z"
                fill="url(#mw-tentacle-grad)"
              />
              {/* Suction Cups */}
              <ellipse cx="273" cy="118" rx="3.8" ry="4.8" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="273" cy="118" rx="1.8" ry="2.2" fill="#7834CF" />

              <ellipse cx="268" cy="132" rx="4.2" ry="3.8" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="268" cy="132" rx="2" ry="1.8" fill="#7834CF" />

              <ellipse cx="258" cy="141" rx="3.4" ry="2.8" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="258" cy="141" rx="1.6" ry="1.4" fill="#7834CF" />
            </g>

            {/* 3. Left Side Hugging Tentacle */}
            <g className={styles.tentacleForeground}>
              <path
                d="M 64 142 C 50 150, 48 168, 60 178 C 70 186, 84 182, 86 172 C 88 162, 78 158, 72 165 C 66 171, 60 166, 60 156 C 60 150, 62 146, 66 142 Z"
                fill="url(#mw-tentacle-grad)"
              />
              {/* Suction Cups */}
              <ellipse cx="46" cy="158" rx="3.8" ry="4.8" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="46" cy="158" rx="1.8" ry="2.2" fill="#7834CF" />

              <ellipse cx="53" cy="174" rx="4.5" ry="3.5" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="53" cy="174" rx="2" ry="1.6" fill="#7834CF" />

              <ellipse cx="68" cy="183" rx="3.5" ry="4" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="68" cy="183" rx="1.6" ry="1.8" fill="#7834CF" />
            </g>

            {/* 4. Right Side Hugging Tentacle */}
            <g className={styles.tentacleForeground}>
              <path
                d="M 296 142 C 310 150, 312 168, 300 178 C 290 186, 276 182, 274 172 C 272 162, 282 158, 288 165 C 294 171, 300 166, 300 156 C 300 150, 298 146, 294 142 Z"
                fill="url(#mw-tentacle-grad)"
              />
              {/* Suction Cups */}
              <ellipse cx="314" cy="158" rx="3.8" ry="4.8" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="314" cy="158" rx="1.8" ry="2.2" fill="#7834CF" />

              <ellipse cx="307" cy="174" rx="4.5" ry="3.5" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="307" cy="174" rx="2" ry="1.6" fill="#7834CF" />

              <ellipse cx="292" cy="183" rx="3.5" ry="4" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="292" cy="183" rx="1.6" ry="1.8" fill="#7834CF" />
            </g>

            {/* 5. Bottom Left Stand Curler */}
            <g className={styles.tentacleForeground}>
              <path
                d="M 150 248 C 134 254, 116 262, 112 274 C 109 282, 120 286, 130 284 C 138 282, 138 272, 130 270 C 125 268, 130 260, 142 256 Z"
                fill="url(#mw-tentacle-grad)"
              />
              <ellipse cx="108" cy="272" rx="3.5" ry="4.5" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="108" cy="272" rx="1.6" ry="2" fill="#7834CF" />

              <ellipse cx="118" cy="285" rx="4" ry="3" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="118" cy="285" rx="1.8" ry="1.4" fill="#7834CF" />
            </g>

            {/* 6. Bottom Right Stand Curler */}
            <g className={styles.tentacleForeground}>
              <path
                d="M 210 248 C 226 254, 244 262, 248 274 C 251 282, 240 286, 230 284 C 222 282, 222 272, 230 270 C 235 268, 230 260, 218 256 Z"
                fill="url(#mw-tentacle-grad)"
              />
              <ellipse cx="252" cy="272" rx="3.5" ry="4.5" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="252" cy="272" rx="1.6" ry="2" fill="#7834CF" />

              <ellipse cx="242" cy="285" rx="4" ry="3" fill="#EBD2FF" stroke="#4A1E86" strokeWidth="1.2" />
              <ellipse cx="242" cy="285" rx="1.8" ry="1.4" fill="#7834CF" />
            </g>
          </svg>
        </div>

        {/* Informational Text & Badge */}
        <div className={styles.textContainer}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Multichain Explorer</span>
          </div>

          <h1 className={styles.heading}>Desktop Only</h1>

          <p className={styles.message}>
            This multichain explorer is designed for desktop use. Please open it on a larger
            screen for the full experience.
          </p>
        </div>
      </div>
    </div>
  );
}
