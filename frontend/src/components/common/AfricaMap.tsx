interface AfricaMapProps {
  className?: string;
  fillColor?: string;
  strokeColor?: string;
  animated?: boolean;
}

export const AfricaMap = ({
  className = "w-full h-full",
  fillColor = "currentColor",
  strokeColor = "none",
  animated = false
}: AfricaMapProps) => {
  return (
    <svg
      viewBox="0 0 500 600"
      fill={fillColor}
      stroke={strokeColor}
      className={`${className} ${animated ? 'animate-float' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M250,50 L260,55 L270,58 L280,65 L288,75 L295,85 L300,95 L305,105 L308,115 L310,125 L312,135 L314,145 L315,155 L316,165 L317,175 L318,185 L320,195 L322,205 L324,215 L326,225 L328,235 L330,245 L332,255 L333,265 L335,275 L337,285 L339,295 L341,305 L343,315 L345,325 L347,335 L349,345 L351,355 L353,365 L355,375 L357,385 L359,395 L360,405 L361,415 L362,425 L363,435 L364,445 L365,455 L366,465 L367,475 L368,485 L369,495 L370,505 L371,515 L370,525 L368,535 L365,542 L360,548 L353,552 L345,555 L335,557 L325,558 L315,559 L305,560 L295,560 L285,559 L275,558 L265,556 L255,553 L245,549 L235,544 L225,538 L215,531 L205,523 L195,514 L185,504 L175,493 L165,481 L155,468 L145,454 L135,439 L125,423 L115,406 L105,388 L95,369 L85,349 L75,328 L68,310 L63,295 L60,280 L58,265 L57,250 L57,235 L58,220 L60,205 L63,190 L67,175 L72,160 L78,145 L85,130 L93,115 L102,100 L112,86 L123,73 L135,61 L148,51 L162,43 L177,37 L192,33 L208,31 L224,31 L240,33 L250,35 Z" />

      {/* Simplified Africa continent shape - more detailed version */}
      <path d="M 250 30 C 260 30, 270 32, 280 36 C 290 40, 298 46, 305 54 C 312 62, 318 71, 323 81 C 328 91, 332 102, 335 113 C 338 124, 340 135, 341 146 C 342 157, 343 168, 343 179 C 343 190, 343 201, 342 212 C 341 223, 340 234, 338 245 C 336 256, 334 267, 331 278 C 328 289, 324 300, 320 310 C 316 320, 311 330, 305 339 C 299 348, 293 357, 286 365 C 279 373, 271 380, 263 387 C 255 394, 246 400, 237 405 C 228 410, 218 414, 208 417 C 198 420, 188 422, 178 423 C 168 424, 158 424, 148 423 C 138 422, 128 420, 118 417 C 108 414, 98 410, 89 405 C 80 400, 71 394, 63 387 C 55 380, 47 373, 40 365 C 33 357, 27 348, 21 339 C 15 330, 10 320, 6 310 C 2 300, -2 289, -5 278 C -8 267, -10 256, -11 245 C -12 234, -13 223, -13 212 C -13 201, -13 190, -12 179 C -11 168, -10 157, -8 146 C -6 135, -3 124, 1 113 C 5 102, 10 91, 16 81 C 22 71, 29 62, 37 54 C 45 46, 54 40, 64 36 C 74 32, 85 30, 96 30 C 107 30, 118 30, 129 32 C 140 34, 151 37, 161 42 C 171 47, 181 53, 190 61 C 199 69, 207 78, 215 88 C 223 98, 230 109, 236 120 C 242 131, 247 143, 250 155 Z"
        transform="translate(250, 300)"
      />
    </svg>
  );
};

export const AfricaMapDetailed = ({
  className = "w-full h-full",
  fillColor = "currentColor",
  strokeColor = "currentColor",
  strokeWidth = "2",
  animated = false
}: AfricaMapProps & { strokeWidth?: string }) => {
  return (
    <svg
      viewBox="0 0 1000 1200"
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      className={`${className} ${animated ? 'animate-float' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Detailed Africa outline */}
      <path d="M 520 80 L 540 85 L 560 92 L 578 102 L 594 115 L 608 130 L 620 147 L 630 165 L 638 184 L 644 204 L 648 224 L 650 245 L 650 266 L 648 287 L 644 308 L 638 328 L 630 347 L 620 365 L 608 382 L 594 397 L 578 410 L 560 420 L 540 428 L 520 433 L 500 435 L 480 435 L 460 433 L 440 428 L 422 420 L 406 410 L 392 397 L 380 382 L 370 365 L 362 347 L 356 328 L 352 308 L 350 287 L 350 266 L 352 245 L 356 224 L 362 204 L 370 184 L 380 165 L 392 147 L 406 130 L 422 115 L 440 102 L 460 92 L 480 85 L 500 80 L 520 80 Z
        M 650 290 L 670 295 L 688 305 L 703 318 L 715 334 L 724 352 L 730 371 L 733 391 L 733 411 L 730 431 L 724 450 L 715 467 L 703 482 L 688 494 L 670 503 L 650 509 L 630 512 L 610 512 L 590 509 L 572 503 L 557 494 L 545 482 L 536 467 L 530 450 L 527 431 L 527 411 L 530 391 L 536 371 L 545 352 L 557 334 L 572 318 L 590 305 L 610 295 L 630 290 L 650 290 Z
        M 450 450 L 470 455 L 488 463 L 503 474 L 515 488 L 524 504 L 530 521 L 533 539 L 533 557 L 530 575 L 524 592 L 515 608 L 503 621 L 488 631 L 470 638 L 450 642 L 430 642 L 410 638 L 392 631 L 377 621 L 365 608 L 356 592 L 350 575 L 347 557 L 347 539 L 350 521 L 356 504 L 365 488 L 377 474 L 392 463 L 410 455 L 430 450 L 450 450 Z
        M 350 600 L 360 605 L 368 612 L 374 621 L 378 631 L 380 642 L 380 653 L 378 664 L 374 674 L 368 683 L 360 690 L 350 695 L 340 698 L 330 698 L 320 695 L 312 690 L 306 683 L 302 674 L 300 664 L 300 653 L 302 642 L 306 631 L 312 621 L 320 612 L 330 605 L 340 600 L 350 600 Z
        M 500 750 L 520 755 L 538 763 L 553 774 L 565 788 L 574 804 L 580 821 L 583 839 L 583 857 L 580 875 L 574 892 L 565 908 L 553 921 L 538 931 L 520 938 L 500 942 L 480 942 L 460 938 L 442 931 L 427 921 L 415 908 L 406 892 L 400 875 L 397 857 L 397 839 L 400 821 L 406 804 L 415 788 L 427 774 L 442 763 L 460 755 L 480 750 L 500 750 Z
        M 600 850 L 620 855 L 638 863 L 653 874 L 665 888 L 674 904 L 680 921 L 683 939 L 683 957 L 680 975 L 674 992 L 665 1008 L 653 1021 L 638 1031 L 620 1038 L 600 1042 L 580 1042 L 560 1038 L 542 1031 L 527 1021 L 515 1008 L 506 992 L 500 975 L 497 957 L 497 939 L 500 921 L 506 904 L 515 888 L 527 874 L 542 863 L 560 855 L 580 850 L 600 850 Z
        M 400 950 L 415 955 L 428 963 L 438 974 L 445 988 L 449 1003 L 450 1019 L 449 1035 L 445 1050 L 438 1064 L 428 1075 L 415 1083 L 400 1088 L 385 1088 L 370 1083 L 357 1075 L 347 1064 L 340 1050 L 336 1035 L 335 1019 L 336 1003 L 340 988 L 347 974 L 357 963 L 370 955 L 385 950 L 400 950 Z"
        fillRule="evenodd"
      />

      {/* Additional details - Mediterranean coast */}
      <path d="M 400 80 L 450 75 L 500 72 L 550 75 L 600 82 L 650 92"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Horn of Africa */}
      <path d="M 680 380 L 720 420 L 750 470 L 760 510"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Western coast detail */}
      <path d="M 200 400 L 180 450 L 170 500 L 175 550 L 190 600"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Simple outline version for backgrounds
export const AfricaMapOutline = ({
  className = "w-full h-full opacity-10",
  strokeColor = "currentColor",
  animated = false
}: Omit<AfricaMapProps, 'fillColor'> & { strokeColor?: string }) => {
  return (
    <svg
      viewBox="0 0 800 1000"
      fill="none"
      stroke={strokeColor}
      strokeWidth="4"
      className={`${className} ${animated ? 'animate-float' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified Africa continent outline for background use */}
      <path d="M 400 50
        C 450 50, 490 60, 520 85
        C 550 110, 570 145, 580 185
        C 590 225, 595 265, 595 305
        C 595 345, 590 385, 580 425
        C 570 465, 555 505, 535 540
        C 515 575, 490 605, 460 630
        C 430 655, 395 675, 355 685
        C 315 695, 275 695, 235 685
        C 195 675, 160 655, 130 630
        C 100 605, 75 575, 55 540
        C 35 505, 20 465, 10 425
        C 0 385, -5 345, -5 305
        C -5 265, 0 225, 10 185
        C 20 145, 40 110, 70 85
        C 100 60, 140 50, 190 50
        C 240 50, 290 50, 340 50
        L 400 50 Z
        M 580 300
        C 600 305, 620 320, 630 340
        C 640 360, 645 385, 640 410
        C 635 435, 620 455, 600 465
        M 500 700
        C 520 720, 535 745, 540 775
        C 545 805, 540 835, 525 860
        M 300 720
        C 280 740, 265 765, 260 795
        C 255 825, 260 855, 275 880
        M 100 450
        C 85 470, 75 495, 73 522
        C 71 549, 76 575, 88 597"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
