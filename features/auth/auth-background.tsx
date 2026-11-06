export function AuthBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-linear-to-br from-orange-200 via-pink-200 to-violet-300"
      aria-hidden="true"
    >
      {/* Glowing light (same drifting animations as the landing page) */}
      <div className="bf-blob-a absolute -left-32 -top-32 h-[36rem] w-[36rem] rounded-full bg-yellow-300/70 blur-[110px]" />
      <div className="bf-blob-b absolute -right-32 top-1/4 h-[34rem] w-[34rem] rounded-full bg-sky-300/70 blur-[110px]" />
      <div className="bf-blob-c absolute -bottom-32 left-1/4 h-[32rem] w-[32rem] rounded-full bg-fuchsia-300/70 blur-[110px]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="mesh-indigo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
            <stop offset="55%" stopColor="#6366f1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="mesh-orange" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#fb923c" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="mesh-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="35%" stopColor="white" stopOpacity="1" />
            <stop offset="75%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <mask id="mesh-mask">
            <rect width="1440" height="900" fill="url(#mesh-fade)" />
          </mask>
        </defs>

        <path
          d="M-120 170 C160 20 380 40 590 180 C800 320 980 310 1180 170 C1300 85 1400 70 1560 130 L1560 430 C1360 350 1200 390 1030 470 C800 580 600 520 410 390 C210 255 70 280 -120 390 Z"
          fill="url(#mesh-indigo)"
          mask="url(#mesh-mask)"
        />

        <path
          d="M-120 720 C110 570 300 550 510 650 C720 750 900 790 1110 650 C1300 525 1430 540 1560 610 L1560 940 L-120 940 Z"
          fill="url(#mesh-orange)"
          mask="url(#mesh-mask)"
        />

        <g stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.2">
          <path d="M-100 240 C180 90 390 110 600 245 C810 380 990 370 1200 225 C1330 135 1430 130 1550 185" />
          <path d="M-100 275 C180 125 390 145 600 280 C810 415 990 405 1200 260 C1330 170 1430 165 1550 220" />
          <path d="M-100 310 C180 160 390 180 600 315 C810 450 990 440 1200 295 C1330 205 1430 200 1550 255" />
          <path d="M-100 650 C130 520 340 535 545 640 C760 750 930 765 1130 635 C1300 525 1430 535 1550 590" />
          <path d="M-100 690 C130 560 340 575 545 680 C760 790 930 805 1130 675 C1300 565 1430 575 1550 630" />
          <path d="M-100 730 C130 600 340 615 545 720 C760 830 930 845 1130 715 C1300 605 1430 615 1550 670" />
        </g>

        <g stroke="#c026d3" strokeWidth="1.2" strokeOpacity="0.24">
          <path d="M-50 450 C240 300 420 320 650 455 C860 580 1050 585 1240 455 C1340 385 1430 370 1510 400" />
          <path d="M-50 475 C240 325 420 345 650 480 C860 605 1050 610 1240 480 C1340 410 1430 395 1510 425" />
          <path d="M-50 500 C240 350 420 370 650 505 C860 630 1050 635 1240 505 C1340 435 1430 420 1510 450" />
        </g>

        <g>
          <circle cx="260" cy="220" r="3" fill="#6d28d9" fillOpacity="0.5" />
          <circle cx="1180" cy="250" r="3" fill="#ea580c" fillOpacity="0.5" />
          <circle cx="390" cy="690" r="2.5" fill="#c026d3" fillOpacity="0.5" />
          <circle cx="1080" cy="720" r="3" fill="#0284c7" fillOpacity="0.5" />
        </g>
      </svg>
    </div>
  );
}