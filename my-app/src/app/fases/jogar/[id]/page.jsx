"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  Mic,
  AudioLines,
  Sparkles,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

import niveis from "./dados";
import CardConclusao from "@/components/CardConclusao";
import EntradaNivel from "@/components/EntradaNivel";
import CardOpcao from "@/components/CardOpcao";

import Avatar from "@/assets/avatar-natasha.svg";
import BgFundo from "@/assets/bg-nivel.svg";

const imagem = (arquivo) => arquivo?.src || arquivo;

export default function PaginaLevel() {
  const router = useRouter();
  const params = useParams();
  const reduzirMovimento = useReducedMotion();

  const nivelId = params.id;
  const nivel = niveis[nivelId];

  const etapas = (nivel?.etapas || []).filter(
    (item) => !(String(nivelId) === "1" && [7, 8].includes(item.id)),
  );

  const [etapaAtual, setEtapaAtual] = useState(0);
  const [entrada, setEntrada] = useState(true);
  const [gravando, setGravando] = useState(false);
  const [ouvindo, setOuvindo] = useState(false);
  const [lendoInstrucao, setLendoInstrucao] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [opcaoFocada, setOpcaoFocada] = useState(null);
  const [statusResposta, setStatusResposta] = useState(null);
  const [mensagemFeedback, setMensagemFeedback] = useState("");
  const [processando, setProcessando] = useState(false);
  const [erroMicrofone, setErroMicrofone] = useState("");
  const [tentouMicrofone, setTentouMicrofone] = useState(false);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerGravacaoRef = useRef(null);
  const timerRespostaRef = useRef(null);
  const audioRef = useRef(null);
  const encerrandoRef = useRef(false);
  const etapaRef = useRef(0);
  const montadoRef = useRef(true);

  const etapa = etapas[etapaAtual];

  const pararAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setOuvindo(false);
  };

  const pararLeitura = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setLendoInstrucao(false);
  };

  const limparRecursosMicrofone = () => {
    if (timerGravacaoRef.current) {
      clearTimeout(timerGravacaoRef.current);
      timerGravacaoRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const pararGravacao = () => {
    const recorder = recorderRef.current;

    if (!recorder || recorder.state !== "recording") return;
    if (encerrandoRef.current) return;

    encerrandoRef.current = true;

    if (timerGravacaoRef.current) {
      clearTimeout(timerGravacaoRef.current);
      timerGravacaoRef.current = null;
    }

    recorder.stop();
  };

  useEffect(() => {
    montadoRef.current = true;

    return () => {
      montadoRef.current = false;

      if (timerGravacaoRef.current) {
        clearTimeout(timerGravacaoRef.current);
      }

      if (timerRespostaRef.current) {
        clearTimeout(timerRespostaRef.current);
      }

      if (recorderRef.current?.state === "recording") {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioRef.current?.pause();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    etapaRef.current = etapaAtual;

    pararAudio();
    pararLeitura();

    setGravando(false);
    setOpcaoSelecionada(null);
    setOpcaoFocada(null);
    setStatusResposta(null);
    setMensagemFeedback("");
    setProcessando(false);
    setErroMicrofone("");
    setTentouMicrofone(false);
  }, [etapaAtual]);

  const avancar = () => {
    if (gravando || processando) return;

    pararAudio();
    pararLeitura();

    if (etapaAtual < etapas.length - 1) {
      setEtapaAtual((anterior) => anterior + 1);
    } else {
      router.push("/fases");
    }
  };

  const handleToqueTela = () => {
    if (entrada) return;

    if (etapa?.tipo === "dialogo" || etapa?.tipo === "exercicio_ouvir") {
      avancar();
    }
  };

  const handleOuvirPalavra = (evento) => {
    evento?.stopPropagation();

    if (!etapa?.pronuncia) return;

    pararAudio();
    pararLeitura();

    const audio = new Audio(etapa.pronuncia);

    audioRef.current = audio;
    audio.volume = 1;

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setOuvindo(false);
      }
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setOuvindo(false);
      }
    };

    setOuvindo(true);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setOuvindo(false);
      }
    });
  };

  const handleLerInstrucao = (evento) => {
    evento.stopPropagation();

    if (!("speechSynthesis" in window)) {
      setMensagemFeedback(
        "A leitura em voz alta não está disponível neste navegador.",
      );
      return;
    }

    if (lendoInstrucao) {
      pararLeitura();
      return;
    }

    pararAudio();
    pararLeitura();

    const texto =
      mensagemFeedback || erroMicrofone || etapa?.fala || etapa?.instrucao;

    if (!texto) return;

    const leitura = new SpeechSynthesisUtterance(texto);

    leitura.lang = "pt-BR";
    leitura.rate = 0.85;
    leitura.pitch = 1.08;
    leitura.volume = 1;

    leitura.onend = () => {
      if (montadoRef.current) setLendoInstrucao(false);
    };

    leitura.onerror = () => {
      if (montadoRef.current) setLendoInstrucao(false);
    };

    setLendoInstrucao(true);
    window.speechSynthesis.speak(leitura);
  };

  const concluirExercicioFalar = () => {
    setGravando(false);
    setProcessando(true);
    setErroMicrofone("");
    setMensagemFeedback("Muito bem! Vamos continuar!");

    timerRespostaRef.current = setTimeout(() => {
      if (!montadoRef.current) return;

      setProcessando(false);
      setMensagemFeedback("");

      if (etapaRef.current < etapas.length - 1) {
        setEtapaAtual((anterior) => anterior + 1);
      } else {
        router.push("/fases");
      }
    }, 1100);
  };

  const handleMicrofoneClique = async (evento) => {
    evento.stopPropagation();

    if (gravando) {
      pararGravacao();
      return;
    }

    if (processando) return;

    setErroMicrofone("");
    setTentouMicrofone(true);

    pararAudio();
    pararLeitura();

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setErroMicrofone(
        "Não foi possível usar o microfone. Você pode tentar novamente ou continuar.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (!montadoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);

      recorderRef.current = recorder;
      encerrandoRef.current = false;

      recorder.onstop = () => {
        limparRecursosMicrofone();
        recorderRef.current = null;
        encerrandoRef.current = false;

        if (montadoRef.current) {
          concluirExercicioFalar();
        }
      };

      recorder.onerror = () => {
        limparRecursosMicrofone();
        recorderRef.current = null;
        encerrandoRef.current = false;

        if (montadoRef.current) {
          setGravando(false);
          setErroMicrofone(
            "Houve um problema com a gravação. Você pode tentar novamente ou continuar.",
          );
        }
      };

      recorder.start();
      setGravando(true);

      timerGravacaoRef.current = setTimeout(() => {
        pararGravacao();
      }, 3500);
    } catch (erro) {
      limparRecursosMicrofone();

      recorderRef.current = null;
      encerrandoRef.current = false;

      setGravando(false);
      setErroMicrofone(
        "Não consegui acessar o microfone. Verifique a permissão ou continue.",
      );
    }
  };

  const handleContinuarSemMicrofone = (evento) => {
    evento.stopPropagation();

    if (gravando || processando) return;

    concluirExercicioFalar();
  };

  const handleFocarCard = (opcao) => {
    if (processando) return;

    setOpcaoFocada(opcao.id);

    if (opcao.pronuncia) {
      pararAudio();
      pararLeitura();

      const audio = new Audio(opcao.pronuncia);
      audioRef.current = audio;

      audio.play().catch(() => {});
    }
  };

  const handleConfirmarResposta = (opcao) => {
    if (processando) return;

    pararAudio();
    pararLeitura();

    setProcessando(true);
    setOpcaoSelecionada(opcao.id);
    setOpcaoFocada(opcao.id);

    const acertou = opcao.id === etapa.opcaoCorreta;

    setStatusResposta(acertou ? "acertou" : "errou");
    setMensagemFeedback(
      acertou
        ? "Muito bem! Você acertou!"
        : "Quase lá! Vamos tentar novamente?",
    );

    timerRespostaRef.current = setTimeout(
      () => {
        if (!montadoRef.current) return;

        if (acertou) {
          setOpcaoSelecionada(null);
          setOpcaoFocada(null);
          setStatusResposta(null);
          setMensagemFeedback("");
          setProcessando(false);

          if (etapaRef.current < etapas.length - 1) {
            setEtapaAtual((anterior) => anterior + 1);
          } else {
            router.push("/fases");
          }
        } else {
          setOpcaoSelecionada(null);
          setStatusResposta(null);
          setMensagemFeedback("");
          setProcessando(false);
        }
      },
      acertou ? 1400 : 1200,
    );
  };

  if (!nivel || !etapa) {
    return (
      <div className="flex h-full items-center justify-center bg-[#ACECEA] px-6 text-center">
        <p className="font-bold text-white">Nível não encontrado!</p>
      </div>
    );
  }

  const etapaDialogo = etapa.tipo === "dialogo";
  const etapaOuvir = etapa.tipo === "exercicio_ouvir";
  const etapaFalar = etapa.tipo === "exercicio_falar";
  const etapaSelecao = etapa.tipo === "selecionar_palavra";
  const etapaConclusao = etapa.tipo === "conclusao";

  const podeAvancarTocando = etapaDialogo || etapaOuvir;
  const progresso = ((etapaAtual + 1) / etapas.length) * 100;

  const textoBalao =
    erroMicrofone ||
    mensagemFeedback ||
    etapa.fala ||
    etapa.instrucao ||
    (etapaFalar ? "Agora é sua vez! Toque no microfone para falar." : "");

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">
      <AnimatePresence>
        {entrada && (
          <EntradaNivel
            key={`entrada-${nivelId}`}
            titulo={nivel.titulo}
            onComplete={() => setEntrada(false)}
          />
        )}
      </AnimatePresence>

      <div
        onClick={handleToqueTela}
        className={`relative h-full min-h-0 w-full overflow-y-auto overflow-x-hidden bg-cover bg-center bg-no-repeat ${
          podeAvancarTocando ? "cursor-pointer" : ""
        }`}
        style={{
          backgroundImage: `url("${imagem(BgFundo)}")`,
        }}
      >
        <div className="flex min-h-full w-full flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
          <header className="flex w-full shrink-0 items-center gap-4">
            <Link
              href="/fases"
              onClick={(evento) => evento.stopPropagation()}
              aria-label="Voltar para as fases"
              className="flex h-11 w-11 shrink-0 items-center justify-center text-white"
            >
              <ArrowLeft size={32} strokeWidth={2.5} />
            </Link>

            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/40">
                <motion.div
                  initial={false}
                  animate={{ width: `${progresso}%` }}
                  transition={{ duration: 0.45 }}
                  className="h-full rounded-full bg-[#F8B140]"
                />
              </div>

              <span className="shrink-0 text-xs font-extrabold text-white">
                {etapaAtual + 1}/{etapas.length}
              </span>
            </div>
          </header>

          <div className="flex min-h-0 w-full flex-1 flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={etapa.id}
                initial={
                  reduzirMovimento ? false : { opacity: 0, y: 20, scale: 0.96 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduzirMovimento
                    ? { opacity: 0 }
                    : { opacity: 0, y: -15, scale: 0.97 }
                }
                transition={{
                  duration: reduzirMovimento ? 0.1 : 0.32,
                }}
                className="w-full"
              >
                {etapa.silaba && (
                  <div className="mt-5 flex w-full flex-col items-center gap-4">
                    <motion.div
                      initial={
                        reduzirMovimento
                          ? false
                          : { scale: 0.7, opacity: 0, rotate: -5 }
                      }
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 14,
                      }}
                      className="flex h-[clamp(115px,19dvh,165px)] w-[min(100%,270px)] items-center justify-center rounded-[26px] bg-primary p-5 shadow-lg"
                    >
                      <motion.img
                        src={imagem(etapa.imagem)}
                        alt={etapa.palavra || "Animal"}
                        className="h-full max-w-full object-contain"
                        animate={reduzirMovimento ? {} : { y: [0, -4, 0] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {etapa.silaba.map((silaba, indice) => (
                        <motion.div
                          key={`${etapa.id}-${indice}`}
                          initial={
                            reduzirMovimento
                              ? false
                              : { opacity: 0, y: -20, scale: 0.7 }
                          }
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            delay: reduzirMovimento ? 0 : indice * 0.15,
                            type: "spring",
                            stiffness: 220,
                            damping: 13,
                          }}
                          className="flex min-h-14 min-w-16 items-center justify-center rounded-xl bg-primary px-4 py-2 shadow-md"
                        >
                          <span className="text-2xl font-black text-white">
                            {silaba}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {(etapaOuvir || etapaFalar) && (
                      <motion.button
                        type="button"
                        onClick={handleOuvirPalavra}
                        whileTap={{ scale: 0.92 }}
                        animate={
                          ouvindo && !reduzirMovimento
                            ? { scale: [1, 1.07, 1] }
                            : {}
                        }
                        transition={{
                          duration: 0.85,
                          repeat: ouvindo ? Infinity : 0,
                        }}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#3AA2ED] px-6 py-2.5 text-white shadow-md"
                      >
                        <Volume2 size={21} />

                        <span className="text-sm font-bold">
                          {ouvindo ? "Reproduzindo..." : "Ouvir"}
                        </span>
                      </motion.button>
                    )}
                  </div>
                )}

                {etapaSelecao && etapa.opcoes && (
                  <div
                    onClick={(evento) => evento.stopPropagation()}
                    className="mx-auto mt-5 grid w-[82%] max-w-[290px] grid-cols-2 gap-x-2 gap-y-3"
                  >
                    {etapa.opcoes.map((opcao, indice) => (
                      <motion.div
                        key={opcao.id}
                        initial={
                          reduzirMovimento
                            ? false
                            : { opacity: 0, y: 25, scale: 0.85 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: reduzirMovimento ? 0 : indice * 0.1,
                          type: "spring",
                          stiffness: 190,
                          damping: 15,
                        }}
                        className="min-w-0"
                      >
                        <motion.div
                          animate={
                            statusResposta === "errou" &&
                            opcaoSelecionada === opcao.id &&
                            !reduzirMovimento
                              ? { x: [-7, 7, -5, 5, 0] }
                              : statusResposta === "acertou" &&
                                  opcaoSelecionada === opcao.id &&
                                  !reduzirMovimento
                                ? { scale: [1, 1.08, 1] }
                                : {}
                          }
                          transition={{ duration: 0.4 }}
                        >
                          <CardOpcao
                            imagem={opcao.imagem}
                            palavra={opcao.palavra}
                            corCard={opcao.corCard}
                            audioPronuncia={opcao.pronuncia}
                            focado={opcaoFocada === opcao.id}
                            selecionado={opcaoSelecionada === opcao.id}
                            status={
                              opcaoSelecionada === opcao.id
                                ? statusResposta
                                : null
                            }
                            onFocar={() => handleFocarCard(opcao)}
                            onConfirmar={() => handleConfirmarResposta(opcao)}
                          />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {etapaConclusao && (
                  <div
                    onClick={(evento) => evento.stopPropagation()}
                    className="flex flex-1 items-center justify-center py-6"
                  >
                    <CardConclusao
                      nivel={etapa.nivel}
                      fonema={etapa.fonema}
                      moedas={etapa.moedas}
                      onProximo={() => router.push("/fases")}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {!etapaConclusao && (
              <div className="mt-auto flex w-full flex-col pt-5">
                <div className="flex min-h-[145px] w-full items-end">
                  <motion.img
                    src={imagem(Avatar)}
                    alt="Natasha"
                    initial={reduzirMovimento ? false : { opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.55,
                      ease: "easeOut",
                    }}
                    className="h-[clamp(125px,23dvh,200px)] w-auto max-w-[42%] shrink-0 object-contain"
                  />

                  {textoBalao && (
                    <div
                      onClick={(evento) => evento.stopPropagation()}
                      className="relative mb-12 ml-1 flex min-w-0 flex-1 flex-col items-center justify-center rounded-[26px] border-2 border-[#985C40] bg-white px-3 py-3 text-center shadow-lg"
                    >
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`${etapa.id}-${textoBalao}`}
                          initial={
                            reduzirMovimento ? false : { opacity: 0, y: 8 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="break-words text-[clamp(11px,3.3vw,14px)] font-semibold leading-relaxed text-[#985C40]"
                        >
                          {textoBalao}
                        </motion.p>
                      </AnimatePresence>

                      <motion.button
                        type="button"
                        onClick={handleLerInstrucao}
                        whileTap={{ scale: 0.88 }}
                        aria-label={
                          lendoInstrucao
                            ? "Parar leitura da instrução"
                            : "Ouvir instrução"
                        }
                        className={`mt-2 flex h-8 w-8 items-center justify-center rounded-full ${
                          lendoInstrucao ? "bg-[#FCE6D9]" : "bg-transparent"
                        }`}
                      >
                        <Volume2 size={21} className="text-[#985C40]" />
                      </motion.button>

                      <div className="absolute -left-[11px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-r-[12px] border-y-transparent border-r-[#985C40]" />

                      <div className="absolute -left-[8px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[7px] border-r-[10px] border-y-transparent border-r-white" />
                    </div>
                  )}
                </div>

                {etapaFalar ? (
                  <div
                    onClick={(evento) => evento.stopPropagation()}
                    className="flex flex-col items-center gap-2 pb-3"
                  >
                    <div className="relative flex items-center justify-center">
                      {gravando && !reduzirMovimento && (
                        <>
                          {[0, 1].map((indice) => (
                            <motion.div
                              key={indice}
                              initial={{ scale: 1, opacity: 0.65 }}
                              animate={{ scale: 1.8, opacity: 0 }}
                              transition={{
                                duration: 1.4,
                                repeat: Infinity,
                                delay: indice * 0.7,
                              }}
                              className="absolute h-[76px] w-[76px] rounded-full bg-[#F8B140]/50"
                            />
                          ))}
                        </>
                      )}

                      <motion.button
                        type="button"
                        onClick={handleMicrofoneClique}
                        disabled={processando}
                        whileTap={{ scale: 0.9 }}
                        className={`relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-full border-4 border-white text-white shadow-lg disabled:opacity-60 ${
                          gravando ? "bg-[#EF7774]" : "bg-primary"
                        }`}
                        aria-label={
                          gravando ? "Finalizar gravação" : "Começar gravação"
                        }
                      >
                        {gravando ? (
                          <AudioLines size={34} />
                        ) : (
                          <Mic size={34} />
                        )}
                      </motion.button>
                    </div>

                    <p className="text-center text-sm font-bold text-white drop-shadow-sm">
                      {gravando
                        ? "Estou ouvindo você..."
                        : processando
                          ? "Muito bem!"
                          : "Toque para falar"}
                    </p>

                    {erroMicrofone && tentouMicrofone && !processando && (
                      <button
                        type="button"
                        onClick={handleContinuarSemMicrofone}
                        className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#985C40] shadow-sm"
                      >
                        Continuar sem microfone
                      </button>
                    )}
                  </div>
                ) : podeAvancarTocando ? (
                  <motion.p
                    initial={{ opacity: 0.5 }}
                    animate={
                      reduzirMovimento
                        ? { opacity: 1 }
                        : { opacity: [0.5, 1, 0.5] }
                    }
                    transition={{
                      duration: 1.8,
                      repeat: reduzirMovimento ? 0 : Infinity,
                    }}
                    className="pb-3 text-center text-sm font-semibold text-white drop-shadow-sm"
                  >
                    Toque para continuar
                  </motion.p>
                ) : etapaSelecao ? (
                  <div className="flex min-h-12 items-center justify-center pb-3">
                    <AnimatePresence mode="wait">
                      {statusResposta === "acertou" ? (
                        <motion.div
                          key="acerto"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 rounded-full bg-[#55B878] px-4 py-2 text-sm font-bold text-white"
                        >
                          <CheckCircle2 size={19} />
                          Muito bem!
                          <Sparkles size={17} />
                        </motion.div>
                      ) : statusResposta === "errou" ? (
                        <motion.div
                          key="erro"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 rounded-full bg-[#F8B140] px-4 py-2 text-sm font-bold text-white"
                        >
                          <RotateCcw size={18} />
                          Tente outra vez!
                        </motion.div>
                      ) : (
                        <motion.p
                          key="instrucao"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-sm font-semibold text-white drop-shadow-sm"
                        >
                          Escolha o animal correto
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
