"use client";

import React from "react";
import BottomNav from "@/components/BottomNav";
import CardHome from "@/components/CardHome";
import Coins from "@/components/Coins";
import DaysWeek from "@/components/DaysWeek";
import { useRouter } from "next/navigation";

import ImgHome from "@/assets/background-home.svg";
import Bell from "@/assets/icons/notif.svg";
import LolaAvatar from "@/assets/lola.svg";
import FireIcon from "@/assets/icons/fire.svg";
import BgCardBlue from "@/assets/fundo-card1.svg";
import BgCardPurple from "@/assets/fundo-card2.svg";

const Home = () => {
  const bgUrl = ImgHome?.src || ImgHome;

  const router = useRouter();
  
  const handleStart = () => {
    router.push("/fases");
  }

  return (
    /* Container que ocupa 100% do celular */
    <div className="relative w-full h-full overflow-hidden">
      
      <div
        className="w-full h-full overflow-y-auto p-6 pb-24 flex flex-col justify-between bg-cover bg-center scrollbar-none"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-4 justify-center items-center">
            <div className="bg-secondary w-14 h-14 rounded-full flex justify-center items-center border-4 border-white shadow-sm">
              <p className="text-2xl font-bold text-white">1</p>
            </div>
            <Coins />
          </div>

          <div className="bg-primary p-2 rounded-full cursor-pointer">
            <img src={Bell?.src || Bell} alt="Notificação" className="w-6 h-6" />
          </div>
        </div>

        <div className="my-4 flex">
          <img
            src={LolaAvatar?.src || LolaAvatar}
            alt="Avatar Lola"
            className="h-36 w-auto object-contain"
          />
        </div>

        <div className="py-2 flex flex-col gap-4">
          <CardHome
            titulo="Treinamento de Fonema"
            bgColor="bg-secondary"
            borderColor="border-b-secondary-dark"
            playColor="text-secondary"
            onStart={handleStart}
            pattern={BgCardBlue}
          />

          <CardHome
            titulo="Missão do dia"
            bgColor="bg-quaternary"
            borderColor="border-b-quaternary-dark"
            playColor="text-quaternary"
            pattern={BgCardPurple}
          />
        </div>

        <div className="mt-2 w-full bg-primary rounded-2xl border-b-primary-dark border-b-8 p-4 flex flex-col gap-4 shadow-md">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-lg text-white">Sua semana</p>
            <span className="flex justify-between items-center bg-white rounded-full px-3 py-1 gap-1.5">
              <img src={FireIcon?.src || FireIcon} alt="Fogo" className="w-4 h-4" />
              <p className="text-[12px] font-bold text-text-main">
                2 dias na sequência
              </p>
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 px-1">
            <DaysWeek>SEG</DaysWeek>
            <DaysWeek>TER</DaysWeek>
            <DaysWeek>QUA</DaysWeek>
            <DaysWeek>QUI</DaysWeek>
            <DaysWeek>SEX</DaysWeek>
            <DaysWeek>SÁB</DaysWeek>
            <DaysWeek>DOM</DaysWeek>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-30">
        <BottomNav />
      </div>

    </div>
  );
};

export default Home;