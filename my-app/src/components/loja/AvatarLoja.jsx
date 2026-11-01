"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BgLoja from "@/assets/shop-background.svg";
import Natasha from "@/assets/avatar-natasha.svg";
import Coins from "@/components/Coins";

export default function AvatarLoja({
  moedas = 0,
  genero = "F",
  onChangeGenero,
  avatar,
  carregando = false,
}) {
  const router = useRouter();

  const alterarGenero = (novoGenero) => {
    if (carregando || genero === novoGenero) return;

    onChangeGenero?.(novoGenero);
  };

  return (
    <section className="relative w-full shrink-0">
      <div className="relative h-[325px] w-full overflow-hidden rounded-b-[24px]">
        {" "}
        <Image src={BgLoja} alt="" fill priority className="object-cover" />
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#6ED5D6] text-white transition active:scale-95"
        >
          <ArrowLeft size={25} strokeWidth={3} />
        </button>
        <div className="absolute right-3 top-3 z-20">
          <Coins moedas={moedas} />
        </div>
        <div className="absolute inset-x-0 bottom-[50px] z-10 flex justify-center">
          <Image
            src={Natasha}
            alt="Avatar da Lolá"
            priority
            className="h-[200px] w-auto max-w-[80%] object-contain"
          />
        </div>
        <div className="absolute bottom-[7px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          <button
            type="button"
            onClick={() => alterarGenero("F")}
            disabled={carregando}
            aria-label="Selecionar personagem feminina"
            aria-pressed={genero === "F"}
            className={`flex h-[35px] w-[38px] items-center justify-center rounded-[7px] border-[3px] border-white bg-[#E98E86] text-[25px] font-extrabold leading-none text-white shadow-sm transition active:scale-95 ${
              genero === "F" ? "opacity-100" : "opacity-75"
            }`}
          >
            ♀
          </button>

          <button
            type="button"
            onClick={() => alterarGenero("M")}
            disabled={carregando}
            aria-label="Selecionar personagem masculino"
            aria-pressed={genero === "M"}
            className={`flex h-[35px] w-[38px] items-center justify-center rounded-[7px] border-[3px] border-white bg-[#6ED5D6] text-[25px] font-extrabold leading-none text-white shadow-sm transition active:scale-95 ${
              genero === "M" ? "opacity-100" : "opacity-75"
            }`}
          >
            ♂
          </button>
        </div>
      </div>
    </section>
  );
}
