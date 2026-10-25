"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import CeleiroFechado from "@/assets/level-home-1.svg";
import CeleiroAberto from "@/assets/level-home-2.svg";
import Avatar from "@/assets/avatar-natasha.svg";

const EntradaNivel = ({ titulo = "Nível 01 - A fazenda", onComplete }) => {
  const [portaAberta, setPortaAberta] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPortaAberta(true);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  const fundoAtual = portaAberta
    ? CeleiroAberto.src || CeleiroAberto
    : CeleiroFechado.src || CeleiroFechado;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.8, ease: "easeInOut" }} 
      className="relative w-full h-screen overflow-hidden bg-no-repeat bg-center bg-cover flex flex-col justify-between items-center transition-all duration-300 z-50"
      style={{ backgroundImage: `url(${fundoAtual})` }}
    >
    <div
      className="relative w-full h-screen overflow-hidden bg-no-repeat bg-center bg-cover flex flex-col justify-between items-center transition-all duration-300"
      style={{ backgroundImage: `url(${fundoAtual})` }}
    >
      <motion.div
        initial={{ y: "500%", opacity: 0, scale: 0.9 }}
        animate={{ y: "0%", opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-30 mt-16 text-center"
      >
        <h1 className="text-[#FF7A61] font-black text-2xl sm:text-3xl uppercase px-4">
          {titulo}
        </h1>
      </motion.div>

      <div className="relative w-full max-w-md h-[50vh] flex justify-center items-end pb-12">
        <motion.img
          src={Avatar.src || Avatar}
          alt="Avatar"
          initial={{ y: -10, x: -30, scale: 1, opacity: 1 }}
          animate={{
            y: [-10, -70, -200],  // Sobe em direção à porta no fundo
            x: [-30, -10, 0],     // Alinha horizontalmente com a porta
            scale: [1, 0.75, 0.4], // Diminui de tamanho simulando distância
            opacity: [1, 1, 0],   // Desaparece ao entrar na porta
          }}
          transition={{
            delay: 0.8,
            duration: 2.0,
            times: [0, 0.6, 1],
            ease: "easeInOut",
          }}
          onAnimationComplete={onComplete} 
          className="h-30 sm:h-32 object-contain drop-shadow-lg"
        />
      </div>
    </div>
    </motion.div>
  );
};

export default EntradaNivel;
