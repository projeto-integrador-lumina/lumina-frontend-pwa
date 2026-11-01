"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

import CeleiroFechado from "@/assets/level-home-1.svg";
import CeleiroAberto from "@/assets/level-home-2.svg";
import Avatar from "@/assets/avatar-natasha.svg";

const imagem = (arquivo) => arquivo?.src || arquivo;

export default function EntradaNivel({
  titulo = "Nível 01 - A fazenda",
  onComplete,
}) {
  const [portaAberta, setPortaAberta] = useState(false);
  const reduzirMovimento = useReducedMotion();

  const partes = titulo.split(/\s*[-–—]\s*/);
  const numeroNivel = partes[0] || "Nível 01";
  const nomeNivel = partes.slice(1).join(" - ") || "A fazenda";

  useEffect(() => {
    const temporizador = setTimeout(
      () => {
        setPortaAberta(true);
      },
      reduzirMovimento ? 300 : 1900,
    );

    return () => clearTimeout(temporizador);
  }, [reduzirMovimento]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="absolute inset-0 z-50 h-full w-full overflow-hidden bg-[#B8E6EC]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${imagem(CeleiroFechado)}")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: portaAberta ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${imagem(CeleiroAberto)}")`,
        }}
      />

      <motion.div
        initial={
          reduzirMovimento
            ? false
            : { y: -90, opacity: 0, scale: 0.65, rotate: -6 }
        }
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          delay: reduzirMovimento ? 0 : 0.15,
          type: "spring",
          stiffness: 190,
          damping: 13,
        }}
        className="absolute left-1/2 top-[9%] z-30 flex w-[90%] -translate-x-1/2 flex-col items-center"
      >
        <motion.div
          animate={
            reduzirMovimento
              ? {}
              : {
                  rotate: [0, -2, 2, 0],
                }
          }
          transition={{
            delay: 0.85,
            duration: 0.6,
          }}
          className="relative flex max-w-full flex-col items-center rounded-[26px] border-[4px] border-white bg-[#F8B140] px-6 py-3 text-center shadow-[0_7px_0_#D99531]"
        >
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/90">
            {numeroNivel}
          </span>

          <h1 className="mt-1 break-words text-[clamp(1.35rem,6vw,2rem)] font-black uppercase leading-tight text-white">
            {nomeNivel}
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reduzirMovimento ? 0 : 0.65,
              type: "spring",
              stiffness: 250,
            }}
            className="absolute -right-4 -top-4 rounded-full bg-white p-2 shadow-md"
          >
            <Sparkles size={23} className="text-[#F8B140]" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={
          reduzirMovimento
            ? { opacity: 0 }
            : {
                opacity: [0, 1, 1, 0],
                scale: [0.7, 1, 1, 0.9],
              }
        }
        transition={{
          delay: 0.8,
          duration: 1.5,
          times: [0, 0.25, 0.75, 1],
        }}
        className="pointer-events-none absolute bottom-[31%] left-[8%] z-30 rounded-[20px] border-2 border-[#E98C86] bg-white px-4 py-3 shadow-lg"
      >
        <p className="text-xs font-bold text-[#B96A62]">Vamos lá!</p>
      </motion.div>

      <motion.div
        initial={
          reduzirMovimento
            ? false
            : {
                x: "-90%",
                y: 0,
                scale: 1,
                opacity: 0,
              }
        }
        animate={
          reduzirMovimento
            ? {
                x: "15%",
                y: "-145%",
                scale: 0.1,
                opacity: 0,
              }
            : {
                x: ["-90%", "-45%", "-10%", "15%", "15%"],
                y: ["0%", "-20%", "-65%", "-115%", "-145%"],
                scale: [1, 0.95, 0.75, 0.45, 0.1],
                opacity: [0, 1, 1, 1, 0],
                rotate: [0, -4, 4, -3, 0],
              }
        }
        transition={{
          delay: reduzirMovimento ? 0.3 : 1.05,
          duration: reduzirMovimento ? 0.1 : 2.9,
          times: [0, 0.12, 0.48, 0.78, 1],
          ease: "easeInOut",
        }}
        onAnimationComplete={() => {
          onComplete?.();
        }}
        className="pointer-events-none absolute bottom-[8%] left-[35%] z-20 flex w-[clamp(110px,35%,160px)] items-end justify-center"
      >
        <motion.img
          src={imagem(Avatar)}
          alt="Natasha entrando no celeiro"
          draggable={false}
          animate={
            reduzirMovimento
              ? {}
              : {
                  rotate: [-3, 3, -3],
                  y: [0, -5, 0],
                }
          }
          transition={{
            duration: 0.38,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-auto w-full object-contain drop-shadow-lg"
        />
      </motion.div>
    </motion.div>
  );
}
