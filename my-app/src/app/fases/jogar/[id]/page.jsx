"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Volume, Volume2, Mic, AudioLines, ArrowRight } from "lucide-react";
import niveis from "./dados";

//assets
import Avatar from "@/assets/avatar-natasha.svg";
import BgFundo from "@/assets/bg-nivel.svg";

const PaginaLevel = () => {
  const router = useRouter();
  const params = useParams();

  //pega o número que tá na url
  const nivelId = params.id;

  //buscando os dados que estão na index.js dentro do objeto niveis
  const nivel = niveis[nivelId];

  //estado para saber em qual tela a criança está
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [gravando, setGravando] = useState(false);
  const [jaFalou, setJaFalou] = useState(false); // Estado para saber se a criança já falou pelo menos uma vez

  //selecionando os dados que estão no nivel01
  const etapas = nivel ? nivel.etapas : [];

  //se etapa for etapaAtual for 1, vai salvar os dados do array de objetos na posição 1 (tela 1)
  const etapa = etapas[etapaAtual];

  if (!nivel || !etapa) {
    return (
      <div className="p-4 text-center text-white">Nível não encontrado!</div>
    );
  }

  //função para avançar as telas a cada toque
  const handleAvancar = () => {
    setGravando(false);
    setJaFalou(false); // Reseta para a próxima etapa
    //etapas.lenght tá contando quantos objetos tenho dentro do array, que simbolizam as minhas telas do figma
    if (etapaAtual < etapas.length - 1) {
      setEtapaAtual((prev) => prev + 1);
    } else {
      router.push("/fases");
    }
  };

  //função para tocar o áudio
  const handleOuvirPalavra = (e) => {
    e.stopPropagation();
    if (etapa.pronuncia) {
      const audio = new Audio(etapa.pronuncia);

      audio.volume = 1.0;

      audio
        .play()
        .catch((error) => console.log("Erro ao tocar o áudio: ", error));
    } else {
      console.log("Nenhum ficheiro de áudio definido para esta etapa!");
    }
  };

  //troca do símbolo de microfone
  const handleMicrofoneClique = (e) => {
    e.stopPropagation();
    if (!gravando) {
      setGravando(true);

      setTimeout(() => {
        setGravando(false);
        setJaFalou(true); // Marca que a criança já pronunciou a palavra

        handleAvancar();
      }, 5000);
    } else {
      setGravando(false);
      setJaFalou(true); // Marca que a criança já pronunciou a palavra
      handleAvancar();
    }
  };

  return (
    <div
      onClick={etapa.tipo === "dialogo" || etapa.tipo === "exercicio_ouvir" ? handleAvancar : undefined}
      className="w-full h-screen"
    >
      <div
        className="flex w-full h-screen bg-no-repeat bg-center bg-cover bg-top"
        style={{ backgroundImage: `url(${BgFundo.src || BgFundo})` }}
      >
        <div className="w-full flex flex-col justify-center items-center p-8">
          <div className="w-full p-6 flex gap-2 justify-center items-center">
            <span className="w-full h-3 bg-tertiary/50 rounded-full"></span>
            <p className="text-white font-semibold text-sm">1/5</p>
          </div>

          {etapa.silaba && (
            <div className="flex flex-col items-center px-14 md:px-12 py-4 w-full gap-y-4">
              <div className="w-full p-6 h-35 w-full flex justify-center items-center bg-primary rounded-[24px]">
                <img src={etapa.imagem.src}></img>
              </div>

              <div className="flex gap-3 justify-center items-center">
                {etapa.silaba.map((sil, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center bg-primary p-4 rounded-[12px]"
                  >
                    <p className="text-white font-bold text-3xl">{sil}</p>
                  </div>
                ))}
              </div>

              {(etapa.tipo === "exercicio_ouvir" ||
                etapa.tipo === "exercicio_falar") && (
                <button
                  onClick={handleOuvirPalavra}
                  className="mt-1 transition-transform active:scale-95"
                >
                  <div className="flex bg-[#3AA2ED] px-6 py-2 justify-center items-center gap-3 rounded-full">
                    <Volume2 className="text-white w-5"></Volume2>
                    <p className="text-white text-sm">Ouvir</p>
                  </div>
                </button>
              )}
            </div>
          )}

          <div className="flex flex-1 justify-start w-full items-end mb-30">
            <img src={Avatar.src} alt="Avatar" className="h-50 md:h-auto"></img>

            {etapa.fala && (
              <div className="relative bg-white rounded-[32px] p-4 shadow-lg text-center flex flex-col items-center justify-center border-1 border-[#985C40] -translate-y-25">
                {/* texto trazido dos dados do nível 01 */}
                <p className="text-xs sm:text-sm text-[#985C40] leading-snug">
                  {etapa.fala || etapa.instrucao}
                </p>

                <button
                  onClick={handleOuvirPalavra}
                  className="mt-2 text-gray-500 hover:text-gray-800 transition-transform active:scale-90"
                >
                  <Volume2 className="text-[#985C40]" />
                </button>

                <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[12px] border-r-white z-10" />
                <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[9px] border-y-transparent border-r-[13px] border-r-[#985C40] z-0" />
              </div>
            )}
          </div>

          {etapa.tipo === "exercicio_falar" && !jaFalou ? (
            <button
              onClick={handleMicrofoneClique}
              className="transition-transform active:scale-95"
            >
              <div className="flex w-25 h-25 justify-center items-center p-4 rounded-full bg-primary -mt-20">
                {gravando ? (
                  <AudioLines className="text-white w-10 h-10 animate-pulse"></AudioLines>
                ) : (
                  <Mic className="text-white w-10 h-10"></Mic>
                )}
              </div>
            </button>
          ) : etapa.tipo === "exercicio_falar" && jaFalou ? (
            <button
              onClick={handleAvancar}
              className="flex items-center gap-2 bg-primary hover:bg-amber-500 text-white px-6 py-2.5 rounded-full shadow-lg transition-transform active:scale-95 -mt-20"
            >
              <span>Próximo</span>
              <ArrowRight className="w-5 h-5"></ArrowRight>
            </button>
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-white text-md">Toque para continuar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaLevel;