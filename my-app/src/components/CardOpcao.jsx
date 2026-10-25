import React from "react";
import { Volume2 } from "lucide-react";

const CardOpcao = ({
  imagem,
  palavra,
  corCard,
  audioPronuncia,
  focado,
  selecionado,
  status,
  onFocar,
  onConfirmar,
}) => {
  let estiloBorda = "border-4 border-transparent";

  if (focado || selecionado) {
    if (status === "acertou") {
      estiloBorda = "border-4 border-green-500 scale-105";
    } else if (status === "errou") {
      estiloBorda = "border-4 border-red-500 animate-shake";
    } else {
      estiloBorda = "border-4 border-[#3AA2ED] scale-105";
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">

      <div
        onClick={onFocar}
        className={`relative shrink-0 [--w:clamp(6rem,min(34vw,14dvh),8.5rem)] sm:[--w:8.5rem] w-[var(--w)] h-[calc(var(--w)*1.125)] rounded-[24px] p-2 flex flex-col justify-between items-center cursor-pointer transition-all shadow-sm ${corCard} ${estiloBorda}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFocar();
          }}
          className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full p-1 transition-transform active:scale-90 shadow-sm z-10"
        >
          <Volume2 className="w-4 h-4 text-gray-700" />
        </button>

        <div className="flex-1 w-full flex justify-center items-center mt-3 overflow-hidden">
          <img
            src={imagem?.src || imagem}
            alt={palavra}
            className="max-h-12 sm:max-h-14 w-auto object-contain"
          />
        </div>

        <p className="font-extrabold text-black text-sm sm:text-base uppercase tracking-wider text-center leading-none mb-1 max-w-full break-words">
          {palavra}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onConfirmar();
        }}
        className={`text-white font-extrabold text-[11px] sm:text-xs uppercase px-5 py-1 rounded-full shadow-sm active:scale-95 transition-all tracking-wider whitespace-nowrap ${
          selecionado && status === "errou"
            ? "bg-red-500"
            : selecionado && status === "acertou"
            ? "bg-green-500"
            : "bg-[#3AA2ED] hover:bg-[#2b8cdb]"
        }`}
      >
        SELECIONAR
      </button>
    </div>
  );
};

export default CardOpcao;