/**
 * Kuching skyline silhouette — foreground landmarks + grey depth layer.
 * Inspired by DUN, tower, modern high-rise, and riverside temple forms.
 */
export function KuchingSkyline({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg
        className="kuching-skyline__svg"
        viewBox="0 0 1200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* Background depth — muted silhouettes on purple */}
        <g fill="#000000" opacity="0.22">
          <rect x="40" y="118" width="52" height="62" />
          <rect x="98" y="102" width="38" height="78" />
          <rect x="142" y="128" width="44" height="52" />
          <rect x="192" y="96" width="36" height="84" />
          <rect x="234" y="112" width="48" height="68" />
          <rect x="288" y="88" width="32" height="92" />
          <rect x="326" y="108" width="56" height="72" />
          <rect x="388" y="94" width="40" height="86" />
          <rect x="434" y="120" width="50" height="60" />
          <rect x="490" y="100" width="34" height="80" />
          <rect x="530" y="116" width="46" height="64" />
          <rect x="582" y="92" width="38" height="88" />
          <rect x="626" y="110" width="52" height="70" />
          <rect x="684" y="98" width="36" height="82" />
          <rect x="726" y="114" width="44" height="66" />
          <rect x="776" y="90" width="40" height="90" />
          <rect x="822" y="106" width="48" height="74" />
          <rect x="876" y="118" width="38" height="62" />
          <rect x="920" y="100" width="42" height="80" />
          <rect x="968" y="112" width="50" height="68" />
          <rect x="1024" y="96" width="36" height="84" />
          <rect x="1066" y="122" width="44" height="58" />
          <rect x="1116" y="108" width="48" height="72" />
        </g>

        {/* Foreground — black landmark silhouettes */}
        <g fill="#0a0a0a">
          {/* DUN — tiered umbrella roof */}
          <path d="M72 178 L72 142 L88 132 L104 142 L104 178 Z" />
          <path d="M76 142 L88 134 L100 142 L88 150 Z" />
          <path d="M80 134 L88 128 L96 134 L88 140 Z" />
          <rect x="82" y="148" width="12" height="30" />

          {/* Slim communications tower */}
          <rect x="168" y="72" width="6" height="106" />
          <ellipse cx="171" cy="68" rx="14" ry="6" />
          <rect x="165" y="88" width="12" height="4" />

          {/* Mid-rise block */}
          <rect x="228" y="108" width="56" height="70" />
          <rect x="236" y="116" width="8" height="54" fill="#9945ff" opacity="0" />

          {/* Tallest — almond / modern tower */}
          <path d="M340 178 L352 48 L364 178 Z" />
          <path d="M348 60 L352 48 L356 60 L352 72 Z" opacity="0.15" fill="#fff" />

          {/* Riverside low-rise cluster */}
          <rect x="420" y="128" width="72" height="50" />
          <path d="M420 128 L456 108 L492 128 Z" />

          {/* Bridge / mast forms */}
          <rect x="540" y="98" width="8" height="80" />
          <path d="M548 98 L580 118 L548 138 Z" />

          <rect x="620" y="112" width="64" height="66" />
          <rect x="632" y="124" width="12" height="8" fill="#9945ff" opacity="0" />

          {/* Temple / gate — curved roof corners */}
          <path d="M780 178 L780 138 L800 122 L820 138 L820 178 Z" />
          <path d="M776 138 Q800 118 824 138" fill="none" stroke="#0a0a0a" strokeWidth="4" />
          <path d="M788 130 Q800 124 812 130" />

          {/* Right cluster */}
          <rect x="880" y="108" width="48" height="70" />
          <path d="M940 178 L940 118 L968 100 L996 118 L996 178 Z" />
          <path d="M952 118 L968 108 L984 118 L968 128 Z" />

          <rect x="1020" y="122" width="56" height="56" />
          <rect x="1092" y="108" width="40" height="70" />

          {/* Continuous base with organic bottom edge */}
          <path d="M0 178 L1200 178 L1200 220 L0 220 Z" />
        </g>

        {/* KUCHING wordmark */}
        <text
          x="600"
          y="208"
          textAnchor="middle"
          fill="#0a0a0a"
          fontFamily="var(--font-sans, system-ui, sans-serif)"
          fontSize="22"
          fontWeight="600"
          letterSpacing="0.42em"
        >
          KUCHING
        </text>
      </svg>
    </div>
  );
}
