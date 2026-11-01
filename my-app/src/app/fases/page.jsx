
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import BgFases from "@/assets/bg-fases.svg";
import ButtonLevel from "@/components/ButtonLevel";
import Coins from "@/components/Coins";

const fases = [
  { numero: 1, top: "20%", left: "66%", disponivel: true },
  { numero: 2, top: "32%", left: "29%", disponivel: false },
  { numero: 3, top: "44%", left: "61%", disponivel: false },
  { numero: 4, top: "56%", left: "25%", disponivel: false },
  { numero: 5, top: "68%", left: "70%", disponivel: false },
  { numero: 6, top: "80%", left: "43%", disponivel: false },
  { numero: 7, top: "92%", left: "72%", disponivel: false },
];

export default function Fases() {
  const router = useRouter();

  const [verificando, setVerificando] = useState(true);

  const bgUrl = BgFases?.src || BgFases;

  useEffect(() => {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setVerificando(false);
  }, [router]);

  if (verificando) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#ACECEA]">
        <p className="text-sm font-medium text-white">
          Carregando fases...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#ACECEA]">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
        <div className="flex items-center justify-between gap-3 bg-gradient-to-b from-[#69BDBB]/75 via-[#69BDBB]/30 to-transparent px-4 pb-8 pt-5">
          <Link
            href="/home"
            aria-label="Voltar para a página inicial"
            className="pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition active:scale-95"
          >
            <ArrowLeft size={28} strokeWidth={2.5} />
          </Link>

          <div className="pointer-events-auto flex min-w-0 items-center gap-2">
            <Coins />

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-secondary shadow-sm">
              <span className="text-xl font-bold text-white">
                1
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="scrollbar-none min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="relative w-full">
          <img
            src={bgUrl}
            alt="Mapa ilustrado com o caminho das fases"
            className="block h-auto w-full select-none"
            draggable={false}
          />

          <div className="absolute inset-0">
            {fases.map((fase) => (
              <div
                key={fase.numero}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{
                  top: fase.top,
                  left: fase.left,
                }}
              >
                {fase.disponivel ? (
                  <Link
                    href={`/fases/jogar/${fase.numero}`}
                    aria-label={`Jogar fase ${fase.numero}`}
                    className="flex min-h-12 min-w-12 items-center justify-center rounded-full transition active:scale-95"
                  >
                    <ButtonLevel>
                      {fase.numero}
                    </ButtonLevel>
                  </Link>
                ) : (
                  <div
                    aria-label={`Fase ${fase.numero} indisponível`}
                    title="Em breve"
                    className="relative flex min-h-12 min-w-12 cursor-not-allowed items-center justify-center opacity-75 grayscale"
                  >
                    <ButtonLevel>
                      {fase.numero}
                    </ButtonLevel>

                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#F8B140] shadow-sm">
                      <LockKeyhole
                        size={12}
                        strokeWidth={2.5}
                        className="text-white"
                      />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
