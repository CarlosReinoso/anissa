export default function ScrollDownIndicator() {
  return (
    <div className="flex justify-center items-center w-full mt-8">
      <div className="relative w-8 h-14">
        <svg
          width="32"
          height="56"
          viewBox="0 0 32 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="30"
            height="54"
            rx="15"
            stroke="#C2A05C"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <span className="absolute left-1/2 top-4 -translate-x-1/2 w-3 h-6 flex justify-center">
          <span className="block w-2 h-4 rounded bg-[#C2A05C] animate-scroll-wheel" />
        </span>
      </div>
      <style jsx>{`
        @keyframes scroll-wheel {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          60% {
            transform: translateY(16px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-scroll-wheel {
          animation: scroll-wheel 1.4s infinite;
        }
      `}</style>
    </div>
  );
}
