"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins as CoinsIcon, X, ShoppingBag } from "lucide-react";

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

const NIVEL_DEMO = 1;
const MOEDAS_DEMO = 100;

export default function Home() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [verificando, setVerificando] = useState(true);
  const [modalMoedas, setModalMoedas] = useState(false);

  const bgUrl = ImgHome?.src || ImgHome;

  useEffect(() => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const nomeSalvo =
      sessionStorage.getItem("nome") || localStorage.getItem("nome") || "";

    const primeiroNome = nomeSalvo.trim().split(/\s+/)[0] || "";

    setNome(primeiroNome);
    setVerificando(false);
  }, [router]);

  useEffect(() => {
    if (!modalMoedas) return;

    function fecharComEscape(event) {
      if (event.key === "Escape") {
        setModalMoedas(false);
      }
    }

    window.addEventListener("keydown", fecharComEscape);

    return () => {
      window.removeEventListener("keydown", fecharComEscape);
    };
  }, [modalMoedas]);

  function handleStart() {
    router.push("/fases");
  }

  function handleNotifications() {
    router.push("/notificacoes");
  }

  function handleNivel() {
    router.push("/home/nivel");
  }

  if (verificando) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <p className="text-sm font-medium text-gray-500">Carregando ...</p>
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
            <button
              type="button"
              onClick={handleNivel}
              aria-label="Ver meu nível"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-secondary shadow-sm transition active:scale-95"
            >
              <p className="text-2xl font-bold text-white">{NIVEL_DEMO}</p>
            </button>

            <Coins />
          </div>

          <button
            type="button"
            onClick={handleNotifications}
            aria-label="Abrir notificações"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm transition active:scale-95"
          >
            <img src={Bell?.src || Bell} alt="" className="h-6 w-6" />
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
                  Que bom te ver! Vamos brincar e aprender juntinhos?
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
            <p className="text-lg font-semibold text-white">Sua semana</p>

            <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1">
              <img src={FireIcon?.src || FireIcon} alt="" className="h-4 w-4" />

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

      {modalMoedas && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 px-6"
          onClick={() => setModalMoedas(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-moedas"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-sm rounded-[28px] border-4 border-[#F7D5A2] bg-white px-6 pb-7 pt-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setModalMoedas(false)}
              aria-label="Fechar"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF3E4] text-[#C68C3A]"
            >
              <X size={20} />
            </button>

            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF3D9]">
              <CoinsIcon size={42} className="text-[#E5A83D]" strokeWidth={2} />
            </div>

            <h2
              id="titulo-moedas"
              className="text-center text-xl font-extrabold text-[#D98E35]"
            >
              Minhas moedinhas!
            </h2>

            <div className="mt-5 rounded-2xl bg-[#FFF8EA] px-4 py-5 text-center">
              <p className="text-xs font-semibold text-[#A98250]">
                Saldo de demonstração
              </p>

              <p className="mt-1 text-4xl font-extrabold text-[#D98E35]">
                {MOEDAS_DEMO}
              </p>

              <p className="mt-1 text-xs text-[#A98250]">moedinhas</p>
            </div>

            <p className="mt-5 text-center text-[13px] font-medium leading-6 text-[#7C6A61]">
              Em breve, você poderá ganhar moedinhas completando atividades e
              desafios para escolher roupinhas e acessórios para a Lolá!
            </p>

            <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFF3E4] px-4 py-3.5 text-sm font-bold text-[#C68C3A]">
              <ShoppingBag size={19} />
              Lojinha em breve!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
