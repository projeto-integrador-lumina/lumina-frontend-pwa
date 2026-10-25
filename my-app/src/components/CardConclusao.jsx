"use client";

import React from "react";
import { motion } from "framer-motion";

import Coin from "@/assets/coin.svg";
import StarOn from "@/assets/star-on.svg";
import StarOff from "@/assets/star-off.svg";
import Parabens from "@/assets/parabens.svg";

const CardConclusao = ({ nivel, fonema, moedas = 5, estrelas = 2, onProximo }) => {
  // Array com 3 posições para montar as estrelas
  const listaEstrelas = [1, 2, 3];

  return (
    //responsivo: só acrescentei overflow-y-auto (rola se a tela for baixa) e o notch/barra de gestos. O visual é o original
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
    >
    {/* responsivo: "absolute" virou "relative m-auto" (continua centralizado, mas agora não corta) */}
    <div className="relative flex flex-col justify-center items-center gap-4 w-full max-w-[320px] sm:max-w-sm m-auto p-4 z-20">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col justify-center items-center bg-[#F4D3A6] w-full rounded-2xl p-5 sm:p-6 gap-5 shadow-2xl relative"
      >

        <div className="w-full flex justify-center">
          <img
            src={Parabens.src || Parabens}
            alt="Parabéns"
            className="w-56 sm:w-60 max-w-full h-auto object-contain drop-shadow-md"
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-6 bg-[#985C40] py-6 px-4 w-full rounded-xl shadow-inner">
          
          <div className="flex gap-2 items-center justify-center">
            {listaEstrelas.map((num, index) => {
              const estaAtiva = num <= estrelas;
              const iconeEstrela = estaAtiva
                ? StarOn.src || StarOn
                : StarOff.src || StarOff;

              return (
                <motion.img
                  key={num}
                  src={iconeEstrela}
                  alt={`Estrela ${num}`}
                  initial={{ scale: 0, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.35, 
                    type: "spring",
                    stiffness: 260,
                    damping: 15,
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              );
            })}
          </div>

          <div className="flex flex-col justify-center items-center gap-3 text-center w-full">
            <p className="text-tertiary text-base sm:text-lg ">
              Nível {nivel} - Concluído
            </p>

            <p className="text-sm sm:text-base text-tertiary">
              {fonema}
            </p>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.3 }}
              className="flex items-center justify-center gap-2 mt-2"
            >
              <img
                src={Coin.src || Coin}
                alt="Moeda"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
              <span className="px-6 py-1.5 bg-tertiary/50 text-white font-extrabold text-lg sm:text-xl rounded-lg shadow-sm">
                +{moedas}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.3 }}
        onClick={onProximo}
        className="text-white bg-[#F8A527] hover:bg-[#e08f1b]  px-10 py-2.5 rounded-xl shadow-lg active:scale-95 transition-all text-base tracking-wider border-b-4 border-[#c77a0c]"
      >
        Próximo
      </motion.button>
    </div>
    </motion.div>
  );
};

export default CardConclusao;