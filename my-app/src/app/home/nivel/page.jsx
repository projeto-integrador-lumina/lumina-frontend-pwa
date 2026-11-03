
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Trophy,
  Sparkles,
  LockKeyhole,
} from "lucide-react";

import LolaAvatar from "@/assets/lola.svg";

const NIVEL_DEMO = 1;
const XP_ATUAL_DEMO = 0;
const XP_PROXIMO_NIVEL_DEMO = 100;

export default function PaginaNivel() {
  const router = useRouter();

  const [verificando, setVerificando] = useState(true);

  const progresso =
    (XP_ATUAL_DEMO / XP_PROXIMO_NIVEL_DEMO) * 100;

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
      <div className="flex h-full w-full items-center justify-center bg-white">
        <p className="text-sm text-gray-500">
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#EB8982]">
      <header className="flex shrink-0 items-center gap-3 px-6 pb-12 pt-7">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Voltar para o início"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition active:scale-95"
        >
          <ArrowLeft size={28} strokeWidth={2.2} />
        </button>

        <h1 className="text-xl font-bold text-white">
          Meu nível
        </h1>
      </header>

      <main className="-mt-5 min-h-0 flex-1 overflow-y-auto rounded-t-[28px] bg-[#FFFCFB] px-6 pb-10 pt-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[7px] border-white bg-[#F8C3A4] shadow-[0_6px_0_#F1A985]">
            <Star
              size={75}
              fill="#FFE9A3"
              stroke="#E8A443"
              strokeWidth={1.8}
            />

            <span className="absolute text-3xl font-extrabold text-[#B87431]">
              {NIVEL_DEMO}
            </span>
          </div>

          <h2 className="mt-7 text-center text-2xl font-extrabold text-[#E77E77]">
            Você está no nível {NIVEL_DEMO}!
          </h2>

          <div className="mt-8 w-full rounded-[24px] border-2 border-[#F8DDD7] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Trophy
                  size={21}
                  className="text-[#E5A23D]"
                />

                <p className="text-sm font-bold text-[#C77E57]">
                  Meu progresso
                </p>
              </div>
            </div>

            <div className="mt-5 h-5 overflow-hidden rounded-full bg-[#FCE9E2]">
              <div
                className="h-full rounded-full bg-[#EB8982] transition-all"
                style={{
                  width: `${progresso}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between gap-2 text-xs font-semibold text-[#A68B81]">
              <span>{XP_ATUAL_DEMO} XP</span>

              <span>
                {XP_PROXIMO_NIVEL_DEMO} XP
              </span>
            </div>
          </div>

          <div className="mt-6 w-full rounded-[22px] border-2 border-dashed border-[#F2D5CE] bg-white p-5">
            <div className="flex items-center gap-2">
              <LockKeyhole
                size={20}
                className="text-[#D8A19A]"
              />

              <p className="text-sm font-bold text-[#D18B83]">
                Próximas conquistas
              </p>
            </div>

            <p className="mt-3 text-xs leading-6 text-[#A68B81]">
              Aqui você poderá acompanhar suas
              medalhas, recompensas e novos níveis.
              Essa funcionalidade chegará em uma
              próxima atualização!
            </p>
          </div>

          <div className="mt-7 flex items-end justify-center gap-3">
            <img
              src={LolaAvatar?.src || LolaAvatar}
              alt="Lolá"
              className="h-28 w-24 object-contain object-bottom"
            />

            <div className="mb-5 max-w-[190px] rounded-2xl border-2 border-[#F4C3B9] bg-white px-4 py-3 shadow-[0_4px_0_#F4C3B9]">
              <p className="text-xs font-bold leading-5 text-[#E77E77]">
                Estou torcendo por você!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
