"use client";

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { useRouter } from "next/navigation";
import avatarPiscando from '@/assets/avatar-piscando.svg';

const CardHome = ({ titulo, bgColor, borderColor, onStart, playColor, pattern }) => {
  // Trata o import do pattern de forma segura
  const patternUrl = pattern?.src || pattern;

  return (
    <div className={`relative overflow-hidden w-full h-30 ${bgColor} ${borderColor} rounded-2xl border-b-8 px-4 pt-4 flex justify-between`}>

      {patternUrl && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={patternUrl}
            alt="Padrão de fundo"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      )}

      <div className="flex flex-col gap-2 pb-4 z-10">
        <p className="font-semibold text-sm text-white">{titulo}</p>
        <button onClick={onStart} type="button" className="cursor-pointer active:scale-95 transition-transform w-fit">
          <div className="flex items-center bg-white gap-2 px-6 w-fit rounded-xl py-1 shadow-sm">
            <Play className={`w-4 h-4 ${playColor}`} />
            <span className={`text-[12px] ${playColor} font-medium`}>Iniciar</span>
          </div>
        </button>
      </div>

      <div className="flex items-end z-10">
        <img
          src={avatarPiscando.src || avatarPiscando}
          alt="Avatar Piscando"
          className="w-24 block object-contain"
        />
      </div>
    </div>
  );
};

export default CardHome;