"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Volume,
  Volume2,
  Mic,
  AudioLines,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import niveis from "./dados";
import CardConclusao from "@/components/CardConclusao";

//assets
import Avatar from "@/assets/avatar-natasha.svg";
import BgFundo from "@/assets/bg-nivel.svg";
import CardOpcao from "@/components/CardOpcao";

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

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioGravado, setAudioGravado] = useState(null);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [statusResposta, setStatusResposta] = useState(null); // 'acertou' ou 'errou'
  const [mensagemFeedback, setMensagemFeedback] = useState("");
  const [opcaoFocada, setOpcaoFocada] = useState(null);

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
  const handleMicrofoneClique = async (e) => {
    e.stopPropagation();

    //se não estiver gravando, inicia a gravação
    if (!gravando) {
      try {
        //pedir permissão pra gravr
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        // Configuração da Web Audio API para analisar o volume
        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        //guarda os pedaços de áudio gravados
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        let tempoSilencio = 0;
        let jaDetectouFala = false;

        // Monitora o volume em tempo real para detectar quando a criança para de falar
        const checarVolume = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);

          let soma = 0;
          for (let i = 0; i < bufferLength; i++) {
            soma += dataArray[i];
          }
          const volumeMedio = soma / bufferLength;

          const LIMITE_VOZ = 15; // Sensibilidade para a fala da criança

          if (volumeMedio > LIMITE_VOZ) {
            jaDetectouFala = true;
            tempoSilencio = 0; // Reseta o silêncio enquanto estiver falando
          } else if (jaDetectouFala) {
            tempoSilencio += 200;

            // Para automaticamente após 1.5s de silêncio após ter falado
            if (tempoSilencio >= 1500) {
              pararGravacao();
            }
          }
        }, 200);

        const pararGravacao = () => {
          clearInterval(checarVolume);
          if (recorder.state === "recording") {
            recorder.stop();
          }
          audioContext.close();
        };

        //quando a gravação parar, cria a url do áudio gravado
        recorder.onstop = () => {
          const blobAudio = new Blob(chunks, { type: "audio/webm" });
          const urlAudio = URL.createObjectURL(blobAudio);
          setAudioGravado(urlAudio);

          //para de usar o microfone e mudar o ícone
          stream.getTracks().forEach((track) => track.stop());
          setGravando(false);

          handleAvancar();
        };

        recorder.start();
        setMediaRecorder(recorder);
        setGravando(true);

        // Limite de segurança de 8s para não ficar gravando infinitamente caso a criança não fale nada
        setTimeout(() => {
          if (recorder.state === "recording") {
            pararGravacao();
          }
        }, 8000);
      } catch (error) {
        console.error("Erro ao acessar o microfone: ", error);
        alert("Precisamos de permissão do microfone para fazer o exercício!");
      }
    } else {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
      setGravando(false);
      setJaFalou(true);
    }
  };

  const handleEscolherOpcao = (opcao) => {
    setOpcaoSelecionada(opcao.id);

    if (etapa.opcaoCorreta) {
      if (opcao.id === etapa.opcaoCorreta) {
        //acertou?
        setStatusResposta("acertou");
        setMensagemFeedback("Muito bem! Você acertou!");

        //animação p/ ver o acerto
        setTimeout(() => {
          setOpcaoSelecionada(null);
          setStatusResposta(null);
          setMensagemFeedback("");
          handleAvancar();
        }, 1200);
      } else {
        //errou?
        setStatusResposta("errou");
        setMensagemFeedback("Ops! Que pena, você errou. Tente novamente!");

        //limpa a seleção pra tentar de novo
        setTimeout(() => {
          setOpcaoSelecionada(null);
          setStatusResposta(null);
          setMensagemFeedback("");
        }, 1500);
      }
    }
  };

  // Quando a criança clica no Card (apenas foca e toca áudio)
  const handleFocarCard = (opcao) => {
    setOpcaoFocada(opcao.id);
    if (opcao.pronuncia) {
      const audio = new Audio(opcao.pronuncia);
      audio.play().catch((err) => console.log("Erro ao tocar áudio:", err));
    }
  };

  // Quando a criança clica no botão SELECIONAR (valida o acerto/erro)
  const handleConfirmarResposta = (opcao) => {
    setOpcaoSelecionada(opcao.id);
    setOpcaoFocada(opcao.id);

    if (opcao.id === etapa.opcaoCorreta) {
      setStatusResposta("acertou");
      setMensagemFeedback("Muito bem! Você acertou!");

      setTimeout(() => {
        setOpcaoSelecionada(null);
        setOpcaoFocada(null);
        setStatusResposta(null);
        setMensagemFeedback("");
        handleAvancar();
      }, 1200);
    } else {
      setStatusResposta("errou");
      setMensagemFeedback("Ops! Tente novamente!");

      setTimeout(() => {
        setOpcaoSelecionada(null);
        setStatusResposta(null);
        setMensagemFeedback("");
      }, 1500);
    }
  };

  return (
    //responsivo: h-screen virou min-h-dvh (altura real visível do celular, sem a barra do navegador)
    //os tamanhos grandes (avatar, margem, microfone) agora usam dvh: no celular alto ficam IGUAIS ao original e só diminuem se a tela for mais baixa
    <div
      onClick={
        etapa.tipo !== "recompensa" &&
        etapa.tipo !== "conclusao" &&
        (etapa.tipo === "dialogo" || etapa.tipo === "exercicio_ouvir")
          ? handleAvancar
          : undefined
      }
      className="w-full min-h-dvh overflow-x-hidden"
    >
      <div
        className="flex w-full min-h-dvh bg-no-repeat bg-center bg-cover bg-top"
        style={{ backgroundImage: `url(${BgFundo.src || BgFundo})` }}
      >

        <div className="w-full min-w-0 flex flex-col justify-center items-center px-6 min-[360px]:px-8 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
          <div className="flex w-full items-center justify-between gap-4">
            <Link href="/fases" className="shrink-0">
              <ArrowLeft className="text-white w-10 h-10"></ArrowLeft>
            </Link>
            <div className="w-full flex gap-2 justify-center items-center">
              <span className="w-full h-3 bg-tertiary/50 rounded-full"></span>
              <p className="text-white font-semibold text-sm shrink-0">1/5</p>
            </div>
          </div>

          {etapa.silaba ? (
            <div className="flex flex-col items-center px-8 min-[360px]:px-14 md:px-12 py-4 w-full gap-y-4 mt-2">
              
              <div className="w-full p-6 h-[clamp(7rem,16.6dvh,8.75rem)] flex justify-center items-center bg-primary rounded-[24px]">
                <img
                  src={etapa.imagem?.src || etapa.imagem}
                  alt="Exercício"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex flex-wrap gap-3 justify-center items-center">
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
                    <Volume2 className="text-white w-5" />
                    <p className="text-white text-sm">Ouvir</p>
                  </div>
                </button>
              )}
            </div>
          ) : etapa.tipo === "selecionar_palavra" && etapa.opcoes ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-2 justify-items-center items-center my-auto mt-2">
              {etapa.opcoes.map((opcao) => (
                <CardOpcao
                  key={opcao.id}
                  imagem={opcao.imagem}
                  palavra={opcao.palavra}
                  corCard={opcao.corCard}
                  audioPronuncia={opcao.pronuncia}
                  focado={opcaoFocada === opcao.id}
                  selecionado={opcaoSelecionada === opcao.id}
                  status={opcaoSelecionada === opcao.id ? statusResposta : null}
                  onFocar={() => handleFocarCard(opcao)}
                  onConfirmar={() => handleConfirmarResposta(opcao)}
                />
              ))}
            </div>
          ) : etapa.tipo === "conclusao" ? (
            <CardConclusao
              nivel={etapa.nivel}
              fonema={etapa.fonema}
              moedas={etapa.moedas}
              onProximo={() => router.push("/fases")}
            ></CardConclusao>
          ) : null}

          <div className="flex flex-1 justify-start w-full items-end mb-[clamp(2rem,10dvh,7.5rem)]">
            <img
              src={Avatar.src}
              alt="Avatar"
              className="h-[clamp(8rem,23.7dvh,12.5rem)] md:h-auto w-auto shrink-0"
            ></img>

            {etapa.fala && (
              <div className="relative min-w-0 bg-white rounded-[32px] p-4 shadow-lg text-center flex flex-col items-center justify-center border-1 border-[#985C40] -translate-y-[clamp(3rem,11.8dvh,6.25rem)]">
                <p className="text-xs sm:text-sm text-[#985C40] leading-snug font-medium break-words">
                  {mensagemFeedback || etapa.fala || etapa.instrucao}
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

          {etapa.tipo === "exercicio_falar" ? (
            <button
              onClick={handleMicrofoneClique}
              className="transition-transform active:scale-95"
            >
              <div className="flex w-[clamp(4.5rem,11.8dvh,6.25rem)] h-[clamp(4.5rem,11.8dvh,6.25rem)] justify-center items-center p-4 rounded-full bg-primary -mt-[clamp(3rem,9.5dvh,5rem)]">
                {gravando ? (
                  <AudioLines className="text-white w-10 h-10 animate-pulse"></AudioLines>
                ) : (
                  <Mic className="text-white w-10 h-10"></Mic>
                )}
              </div>
            </button>
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-white text-base">Toque para continuar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaLevel;