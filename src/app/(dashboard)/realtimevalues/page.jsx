
// "use client"; // if using App Router

// import { useEffect, useState } from "react";

// export default function RealTimeValues() {
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000); // Update every second

//     return () => clearInterval(timer); // Clean up
//   }, []);

//   return (
//     <div className="text-center p-10">
//       <h1 className="text-2xl font-bold">⏱️ Real-Time Clock</h1>
//       <p className="text-lg mt-4">
//         {currentTime.toLocaleTimeString()}
//       </p>
//     </div>
//   );
// }