
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

import BottomNav from "@/components/BottomNav";
import CardHome from "@/components/CardHome";
import Coins from "@/components/Coins";
import DaysWeek from "@/components/DaysWeek";

import ImgHome from "@/assets/background-home.svg";
import Bell from "@/assets/icons/notif.svg";
import LolaAvatar from "@/assets/lola.svg";
import FireIcon from "@/assets/icons/fire.svg";
import BgCardBlue from "@/assets/fundo-card1.svg";
import BgCardPurple from "@/assets/fundo-card2.svg";

export default function Home() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [verificando, setVerificando] = useState(true);

  const bgUrl = ImgHome?.src || ImgHome;

  useEffect(() => {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const nomeSalvo =
      sessionStorage.getItem("nome") ||
      localStorage.getItem("nome") ||
      "";

    const primeiroNome = nomeSalvo.trim().split(/\s+/)[0] || "";

    setNome(primeiroNome);
    setVerificando(false);
  }, [router]);

  function handleStart() {
    router.push("/fases");
  }

  if (verificando) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <p className="text-sm font-medium text-gray-500">
          Carregando sua aventura...
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="scrollbar-none flex h-full w-full flex-col overflow-y-auto bg-cover bg-center px-5 pb-24 pt-6 sm:px-6"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-secondary shadow-sm">
              <p className="text-2xl font-bold text-white">
                1
              </p>
            </div>

            <Coins />
          </div>

          <button
            type="button"
            aria-label="Notificações"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm transition active:scale-95"
          >
            <img
              src={Bell?.src || Bell}
              alt=""
              className="h-6 w-6"
            />
          </button>
        </header>

        <section className="my-6 flex min-h-[155px] items-center justify-center gap-1">
          <div className="relative z-10 flex w-[39%] shrink-0 items-end justify-center self-end">
            <img
              src={LolaAvatar?.src || LolaAvatar}
              alt="Lolá dando boas-vindas"
              className="h-auto max-h-44 w-full object-contain object-bottom drop-shadow-sm"
            />
          </div>

          <div className="relative min-w-0 flex-1">
            <div className="relative rounded-[22px] border-2 border-[#F4C3B9] bg-white px-4 py-4 shadow-[0_5px_0_#F4C3B9]">
              <div className="absolute -left-[9px] top-[55%] h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-[#F4C3B9] bg-white" />

              <div className="relative z-10">
                <div className="mb-2 flex items-center gap-1.5">
                  <p className="break-words text-base font-extrabold leading-tight text-primary">
                    {nome ? `Oi, ${nome}!` : "Oi, amiguinho!"}
                  </p>
                </div>

                <p className="text-[12px] font-medium leading-[1.6] text-text-main/80">
                  Que bom te ver!
                  Vamos brincar e aprender juntinhos?
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 py-2">
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
        </section>

        <section className="mt-5 flex w-full flex-col gap-4 rounded-2xl border-b-8 border-b-primary-dark bg-primary p-4 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-lg font-semibold text-white">
              Sua semana
            </p>

            <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1">
              <img
                src={FireIcon?.src || FireIcon}
                alt=""
                className="h-4 w-4"
              />

              <p className="text-[11px] font-bold text-text-main">
                2 dias na sequência
              </p>
            </div>
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
        </section>
      </div>

      <div className="absolute bottom-0 left-0 z-30 w-full">
        <BottomNav />
      </div>
    </div>
  );
}
