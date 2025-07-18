// import React, { useEffect, useRef } from "react";

// export default function GraphAnimation({ points }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!points || points.length === 0) return;

//     const ctx = canvasRef.current.getContext("2d");
//     const width = 300;
//     const height = 300;
//     canvasRef.current.width = width;
//     canvasRef.current.height = height;

//     const scaled = points.map(([x, y]) => [
//       (x / 256) * width,
//       height / 2 - (y / 128) * (height / 2)
//     ]);

//     let i = 0;
//     const interval = setInterval(() => {
//       ctx.clearRect(0, 0, width, height);

//       // Draw curve path
//       ctx.beginPath();
//       ctx.moveTo(scaled[0][0], scaled[0][1]);
//       for (let j = 1; j <= i && j < scaled.length; j++) {
//         ctx.lineTo(scaled[j][0], scaled[j][1]);
//       }
//       ctx.strokeStyle = "#333";
//       ctx.lineWidth = 1.5;
//       ctx.stroke();

//       // Ball
//       if (i < scaled.length) {
//         ctx.beginPath();
//         ctx.arc(scaled[i][0], scaled[i][1], 6, 0, 2 * Math.PI);
//         ctx.fillStyle = "red";
//         ctx.fill();
//       }

//       i++;
//       if (i >= scaled.length) clearInterval(interval);
//     }, 40);

//     return () => clearInterval(interval);
//   }, [points]);

//   return (
//     <canvas ref={canvasRef} className="mx-auto my-4 border border-gray-400 shadow-lg" />
//   );
// }
