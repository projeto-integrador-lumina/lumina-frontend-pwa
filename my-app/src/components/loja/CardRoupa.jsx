
"use client";

import Image from "next/image";
import { Check, LoaderCircle, Star } from "lucide-react";
import { obterImagemItem } from "@/app/loja/dados";

export default function CardRoupa({
  item,
  abaAtiva = "loja",
  equipado = false,
  carregando = false,
  onComprar,
  onEquipar,
  onRetirar
}) {
  const imagem = obterImagemItem(item);
  const comprado = Boolean(item?.comprado);
  const preco = Number(item?.preco ?? 0);
  const naLoja = abaAtiva === "loja";

  const executarAcao = () => {
    if (carregando || !item) return;

    if (naLoja) {
      if (!comprado) {
        onComprar?.(item);
      }
      return;
    }

    if (equipado) {
      onRetirar?.(item);
    } else {
      onEquipar?.(item);
    }
  };

  const descricaoAcao = naLoja
    ? comprado
      ? `${item?.nome} já comprada`
      : `Comprar ${item?.nome} por ${preco} moedas`
    : equipado
      ? `Retirar ${item?.nome}`
      : `Vestir ${item?.nome}`;

  return (
    <button
      type="button"
      onClick={executarAcao}
      disabled={carregando || (naLoja && comprado)}
      aria-label={descricaoAcao}
      aria-pressed={!naLoja ? equipado : undefined}
      className="group relative flex w-full min-w-0 flex-col overflow-hidden rounded-[16px] bg-[#FFE0A0] text-left transition-transform duration-150 active:scale-[0.97] disabled:cursor-default disabled:opacity-80"
    >
      <div className="flex h-[31px] w-full items-center justify-center rounded-t-[16px] bg-[#E98E86] px-2">
        <span className="line-clamp-1 text-center text-[11px] font-extrabold text-white">
          {item?.nome}
        </span>
      </div>

      <div className="relative flex h-[132px] w-full items-center justify-center px-3 pb-5 pt-2">
        {imagem ? (
          <Image
            src={imagem}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-center text-xs font-semibold text-[#AE8B6E]">
            Imagem indisponível
          </span>
        )}

        {carregando && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <LoaderCircle
              size={26}
              className="animate-spin text-[#D77F76]"
            />
          </div>
        )}

        {!naLoja && equipado && !carregando && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#7BC59B] text-white">
            <Check size={15} strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="flex w-full justify-center pb-3">
        {naLoja ? (
          <div className="flex h-[29px] min-w-[85px] items-center justify-center gap-2 rounded-full bg-[#E98E86] px-4 text-white">
            <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#FFC526]">
              <Star
                size={12}
                fill="white"
                strokeWidth={0}
                className="text-white"
              />
            </span>

            <span className="text-[13px] font-extrabold">
              {preco}
            </span>
          </div>
        ) : (
          <div
            className={`flex h-[29px] min-w-[85px] items-center justify-center gap-1.5 rounded-full px-3 text-[11px] font-extrabold ${
              equipado
                ? "bg-[#7BC59B] text-white"
                : "bg-[#E98E86] text-white"
            }`}
          >
            {equipado ? (
              <>
                <Check size={14} strokeWidth={3} />
                Vestindo
              </>
            ) : (
              "Vestir"
            )}
          </div>
        )}
      </div>
    </button>
  );
}
