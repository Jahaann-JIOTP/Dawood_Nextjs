"use client"

const bars = Array.from({ length: 12 })

export default function CustomLoader({ size = "" }) {
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        height: size.length > 0 ? "30px" : "60vh",
      }}
    >
      <div
        className="relative"
        style={{
          width: size.length > 0 ? size : "54px",
          height: size.length > 0 ? size : "54px",
        }}
      >
        {bars.map((_, index) => {
          const rotate = index * 30
          const delay = -(1.2 - index * 0.1)
          return (
            <div
              key={index}
              className="absolute left-1/2 top-[30%] w-[8%] h-[24%] bg-gray-500 opacity-0 rounded-full shadow-sm animate-fadePulse"
              style={{
                transform: `rotate(${rotate}deg) translate(0, -130%)`,
                animationDelay: `${delay}s`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
