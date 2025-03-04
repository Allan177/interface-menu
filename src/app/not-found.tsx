import React from "react";

export default function NotFound() {
  return (
    <div className="relative h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-400 to-indigo-600 opacity-70 animate-pulse"></div>

      {/* Main content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-6 py-12 sm:px-12 sm:py-16 bg-opacity-50 rounded-lg backdrop-blur-lg shadow-lg">
        <h1 className="text-9xl font-extrabold tracking-wide opacity-80 animate__animated animate__fadeIn animate__delay-1s">
          404
        </h1>
        <h2 className="text-4xl sm:text-5xl font-semibold mt-6 opacity-90 animate__animated animate__fadeIn animate__delay-2s">
          Página Não Encontrada
        </h2>
        <p className="mt-4 text-lg sm:text-xl opacity-75 animate__animated animate__fadeIn animate__delay-3s">
          A página que você procura não está disponível. Talvez você tenha se perdido?
        </p>

        <a
          href="/"
          className="mt-8 inline-block px-8 py-4 text-lg font-semibold text-teal-800 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-teal-200 hover:shadow-xl animate__animated animate__fadeIn animate__delay-4s"
        >
          Voltar para a Página Inicial
        </a>
      </div>

      {/* Efeito de partículas */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 bg-teal-300 opacity-50 rounded-full h-24 w-24 animate-ping"></div>
        <div className="absolute top-40 left-40 bg-pink-400 opacity-60 rounded-full h-32 w-32 animate-pulse"></div>
        <div className="absolute top-80 left-20 bg-purple-500 opacity-70 rounded-full h-40 w-40 animate-bounce"></div>
      </div>
    </div>
  );
}
