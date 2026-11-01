
"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Coins, LoaderCircle, X } from "lucide-react";
import { obterImagemItem } from "@/app/loja/dados";

export default function ModalCompra({
  item,
  aberto = false,
  moedas = 0,
  carregando = false,
  onConfirmar,
  onFechar
}) {
  const preco = Number(item?.preco ?? 0);
  const saldo = Number(moedas ?? 0);
  const saldoSuficiente = saldo >= preco;
  const imagem = obterImagemItem(item);

  useEffect(() => {
    if (!aberto) return;

    const aoPressionarTecla = (evento) => {
      if (evento.key === "Escape" && !carregando) {
        onFechar?.();
      }
    };

    window.addEventListener("keydown", aoPressionarTecla);

    return () => {
      window.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [aberto, carregando, onFechar]);

  return (
    <AnimatePresence>
      {aberto && item && (
        <motion.div
          key="modal-compra"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#382521]/55 px-5"
          onClick={() => {
            if (!carregando) onFechar?.();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-compra"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 25 }}
            onClick={(evento) => evento.stopPropagation()}
            className="relative w-full max-w-[340px] overflow-hidden rounded-[26px] border-[3px] border-[#E7B69E] bg-[#FFF8E9] p-5 shadow-[0_12px_40px_rgba(74,41,31,0.25)]"
          >
            <button
              type="button"
              onClick={onFechar}
              disabled={carregando}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F8E3D8] text-[#A96D65] transition active:scale-95 disabled:opacity-50"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col items-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE2A8] text-[#D79A43]">
                <Coins size={27} fill="#F6C45C" />
              </div>

              <h2
                id="titulo-modal-compra"
                className="text-center text-[21px] font-extrabold text-[#8C514B]"
              >
                Comprar roupinha?
              </h2>

              <p className="mt-1 text-center text-[13px] font-medium text-[#AD8171]">
                Que tal levar essa peça para o seu guarda-roupa?
              </p>

              <div className="mt-4 flex w-full flex-col items-center rounded-[18px] border-2 border-[#F0D8BB] bg-[#FFF0D4] px-4 py-3">
                <div className="flex h-[115px] w-full items-center justify-center">
                  {imagem ? (
                    <Image
                      src={imagem}
                      alt={item.nome}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-[#AC8B7B]">
                      Imagem indisponível
                    </span>
                  )}
                </div>

                <span className="mt-2 text-center text-[15px] font-extrabold text-[#915C51]">
                  {item.nome}
                </span>

                <span className="mt-2 flex items-center gap-1.5 rounded-full border border-[#E7B26D] bg-[#FFE0A0] px-4 py-1.5 text-[16px] font-extrabold text-[#9D643F]">
                  <Coins
                    size={18}
                    fill="#F6C45C"
                    className="text-[#D89C3C]"
                  />
                  {preco}
                </span>
              </div>

              <div className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#F9EBDD] px-4 py-3">
                <span className="text-[13px] font-bold text-[#9C7567]">
                  Suas moedas
                </span>

                <span className="flex items-center gap-1.5 text-[16px] font-extrabold text-[#956046]">
                  <Coins
                    size={17}
                    fill="#F6C45C"
                    className="text-[#D89C3C]"
                  />
                  {saldo}
                </span>
              </div>

              {!saldoSuficiente && (
                <p
                  role="alert"
                  className="mt-3 text-center text-[12px] font-bold text-[#CE7773]"
                >
                  Ops! Você ainda não tem moedas suficientes.
                </p>
              )}

              <div className="mt-5 grid w-full grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onFechar}
                  disabled={carregando}
                  className="flex min-h-[45px] items-center justify-center rounded-xl border-2 border-[#E9C9B9] bg-white px-3 text-[13px] font-extrabold text-[#AA7B70] transition active:scale-95 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => onConfirmar?.(item)}
                  disabled={carregando || !saldoSuficiente}
                  className="flex min-h-[45px] items-center justify-center gap-1.5 rounded-xl bg-[#E99490] px-3 text-[13px] font-extrabold text-white shadow-[0_3px_0_#CF7B78] transition active:scale-95 disabled:cursor-not-allowed disabled:bg-[#D9C5BA] disabled:shadow-none"
                >
                  {carregando ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                      Aguarde
                    </>
                  ) : (
                    <>
                      <Check size={17} strokeWidth={3} />
                      Comprar
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
