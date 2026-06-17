/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BRAND_COLORS } from '../data';

interface JerseySvgProps {
  baseColor: string;
  accentColor: string;
  stripeColors: string[];
  patternType: 'vintage-stripes' | 'chest-band' | 'retro-v' | 'minimalist' | 'classic-quarters';
  className?: string;
  showShadow?: boolean;
}

export const JerseySvg: React.FC<JerseySvgProps> = ({
  baseColor,
  accentColor,
  stripeColors = [],
  patternType,
  className = "w-full h-full",
  showShadow = true
}) => {
  // SVG proportions: 400x450
  return (
    <svg
      viewBox="0 0 400 450"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft shadow for the entire jersey to look realistic */}
        {showShadow && (
          <filter id="drop-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        )}
        
        {/* Fabric texture overlay */}
        <pattern id="fabric-grid" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 4 4 M 4 0 L 0 4" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.08" />
        </pattern>
        
        {/* Soft lighting clipping masks */}
        <linearGradient id="lighting" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="sleeve-lighting" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g filter={showShadow ? "url(#drop-shadow)" : undefined}>
        {/* ================= LEFT SLEEVE ================= */}
        <path
          d="M 120 70 L 40 120 L 70 180 L 130 140 Z"
          fill={baseColor}
        />
        {/* Sleeve striping / highlights */}
        <path
          d="M 40 120 L 70 180"
          stroke={accentColor}
          strokeWidth="10"
        />
        {stripeColors.slice(0, 3).map((col, idx) => (
          <path
            key={`left-sleeve-stripe-${idx}`}
            d={`M ${40 + (idx + 1) * 6} ${120 + (idx + 1) * 4} L ${70 + (idx + 1) * 6} ${180 + (idx + 1) * 4}`}
            stroke={col}
            strokeWidth="3.5"
          />
        ))}

        {/* ================= RIGHT SLEEVE ================= */}
        <path
          d="M 280 70 L 360 120 L 330 180 L 270 140 Z"
          fill={baseColor}
        />
        {/* Sleeve striping / highlights */}
        <path
          d="M 360 120 L 330 180"
          stroke={accentColor}
          strokeWidth="10"
        />
        {stripeColors.slice(0, 3).map((col, idx) => (
          <path
            key={`right-sleeve-stripe-${idx}`}
            d={`M ${360 - (idx + 1) * 6} ${120 + (idx + 1) * 4} L ${330 - (idx + 1) * 6} ${180 + (idx + 1) * 4}`}
            stroke={col}
            strokeWidth="3.5"
          />
        ))}

        {/* ================= MAIN JERSEY BODY ================= */}
        <path
          d="M 120 70 C 120 70, 200 100, 280 70 L 290 140 L 295 400 C 295 410, 275 415, 200 415 C 125 415, 105 410, 105 400 L 110 140 Z"
          fill={baseColor}
          id="jersey-body-path"
        />

        {/* ================= STRIPING / PATTERNS ================= */}
        <g style={{ clipPath: "url(#body-clip)" }}>
          {/* Clip path definition via inline SVG masking */}
          <mask id="body-mask">
            <path
              d="M 120 70 C 120 70, 200 100, 280 70 L 290 140 L 295 400 C 295 410, 275 415, 200 415 C 125 415, 105 410, 105 400 L 110 140 Z"
              fill="#FFFFFF"
            />
          </mask>

          {/* Render pattern inside mask */}
          <g mask="url(#body-mask)">
            {patternType === 'vintage-stripes' && (
              <g>
                {/* Vintage Horizontal chest stripes resembling the user's logo stripes */}
                <g transform="translate(0, 180)">
                  {stripeColors.map((color, idx) => {
                    const stripeHeight = 15;
                    const spacing = 4;
                    const yOffset = idx * (stripeHeight + spacing);
                    return (
                      <rect
                        key={`h-stripe-${idx}`}
                        x="90"
                        y={yOffset}
                        width="220"
                        height={stripeHeight}
                        fill={color}
                        opacity="0.95"
                      />
                    );
                  })}
                </g>
              </g>
            )}

            {patternType === 'chest-band' && (
              <g>
                {/* Thick Chest Band */}
                <rect x="90" y="200" width="220" height="70" fill={stripeColors[0] || accentColor} />
                {/* Inner stripes */}
                {stripeColors.slice(1).map((col, idx) => (
                  <rect
                    key={`cb-inner-${idx}`}
                    x="90"
                    y={200 + 15 + idx * 12}
                    width="220"
                    height="8"
                    fill={col}
                  />
                ))}
              </g>
            )}

            {patternType === 'retro-v' && (
              <g>
                {/* Retro Chevron 'V' shape */}
                {stripeColors.map((color, idx) => {
                  const thickness = 14;
                  const yOffset = idx * 18;
                  return (
                    <path
                      key={`chevron-${idx}`}
                      d={`M 90 ${140 + yOffset} L 200 ${230 + yOffset} L 310 ${140 + yOffset}`}
                      stroke={color}
                      strokeWidth={thickness}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })}
              </g>
            )}

            {patternType === 'classic-quarters' && (
              <g>
                {/* Split Quarters */}
                <path
                  d="M 200 80 L 295 80 L 295 415 L 200 415 Z"
                  fill={stripeColors[0] || accentColor}
                  opacity="0.25"
                />
                <path
                  d="M 105 240 L 295 240 L 295 415 L 105 415 Z"
                  fill={stripeColors[1] || accentColor}
                  opacity="0.15"
                />
              </g>
            )}

            {patternType === 'minimalist' && (
              <g>
                {/* Single vertical center stripe or side pinstripes */}
                <rect x="195" y="80" width="10" height="335" fill={accentColor} opacity="0.3" />
                {stripeColors.map((color, idx) => (
                  <g key={`ministripe-${idx}`}>
                    <rect x={185 - idx * 8} y="80" width="3" height="335" fill={color} opacity="0.8" />
                    <rect x={212 + idx * 8} y="80" width="3" height="335" fill={color} opacity="0.8" />
                  </g>
                ))}
              </g>
            )}
          </g>
        </g>

        {/* ================= JERSEY COLLAR (Elegant Retro V-Neck) ================= */}
        <path
          d="M 160 55 C 160 55, 200 95, 240 55 C 240 55, 248 45, 248 45 L 200 85 L 152 45 Z"
          fill={accentColor}
        />
        {/* Inner thin lines of collar to match stripes */}
        <path
          d="M 165 47 L 200 78 L 235 47"
          stroke={stripeColors[0] || baseColor}
          strokeWidth="3.5"
          fill="none"
        />

        {/* ================= BRAND LOGO / CLUB CREST ================= */}
        {/* Draw a very beautiful premium crest in gold/cream */}
        <g transform="translate(150, 140) scale(0.65)">
          {/* Golden Shield Background */}
          <path
            d="M 20 8 Q 20 40 40 55 Q 60 40 60 8 Z"
            fill={accentColor}
            opacity="0.9"
          />
          {/* Stripe Accent inside shield */}
          <path
            d="M 33 13 L 40 50 L 47 13"
            stroke={stripeColors[1] || BRAND_COLORS.coral}
            strokeWidth="3.5"
            fill="none"
          />
          {/* Monogram text JE */}
          <text
            x="40"
            y="36"
            fill={baseColor}
            fontSize="18"
            fontWeight="900"
            fontFamily="serif"
            textAnchor="middle"
          >
            JE
          </text>
        </g>

        {/* Brand visual watermark print (Jersey Essence) */}
        <text
          x="200"
          y="290"
          fill={accentColor}
          fontSize="11"
          fontWeight="bold"
          fontFamily="monospace"
          letterSpacing="4"
          textAnchor="middle"
          opacity="0.2"
        >
          JERSEY ESSENCE
        </text>

        {/* ================= 3D FABRIC GRAIN & LIGHTING OVERLAY ================= */}
        {/* Apply lighting to give depth and realistic 3D sports mesh texture */}
        <path
          d="M 120 70 C 120 70, 200 100, 280 70 L 290 140 L 295 400 C 295 410, 275 415, 200 415 C 125 415, 105 410, 105 400 L 110 140 Z"
          fill="url(#fabric-grid)"
          pointerEvents="none"
        />
        <path
          d="M 120 70 C 120 70, 200 100, 280 70 L 290 140 L 295 400 C 295 410, 275 415, 200 415 C 125 415, 105 410, 105 400 L 110 140 Z"
          fill="url(#lighting)"
          pointerEvents="none"
          style={{ mixBlendMode: "multiply" }}
        />

        {/* Sleeve lighting */}
        <path
          d="M 120 70 L 40 120 L 70 180 L 130 140 Z"
          fill="url(#sleeve-lighting)"
          pointerEvents="none"
          style={{ mixBlendMode: "overlay" }}
        />
        <path
          d="M 280 70 L 360 120 L 330 180 L 270 140 Z"
          fill="url(#sleeve-lighting)"
          pointerEvents="none"
          style={{ mixBlendMode: "overlay" }}
        />
      </g>
    </svg>
  );
};
