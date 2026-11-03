
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Dumbbell,
  Star,
  Lightbulb,
  Flame,
  PartyPopper,
  MessageCircle,
  Bell,
  CheckCheck
} from "lucide-react";

import BottomNav from "@/components/BottomNav";

const notificacoesIniciais = [
  {
    id: 1,
    tipo: "atividade",
    texto: "Sua fonoaudióloga enviou uma nova missão para você! Vamos conferir?",
    horario: "Agora",
    lida: false
  },
  {
    id: 2,
    tipo: "mensagem",
    texto: "Você recebeu uma nova mensagem da sua fonoaudióloga!",
    horario: "Agora",
    lida: false
  },
  {
    id: 3,
    tipo: "estrela",
    texto: "Parabéns! Você ganhou 10 estrelas.",
    horario: "Hoje",
    lida: false
  },
  {
    id: 4,
    tipo: "item",
    texto: "Um novo tema acabou de ser desbloqueado! Venha conhecer os novos sons.",
    horario: "Ontem",
    lida: true
  },
  {
    id: 5,
    tipo: "sequencia",
    texto: "3 dias seguidos treinando! Você está ficando cada vez mais rápido.",
    horario: "Ontem",
    lida: true
  },
  {
    id: 6,
    tipo: "nivel",
    texto: "Subimos de nível! Você agora é um Mestre dos Sons. Vamos ver o que o próximo mundo reserva?",
    horario: "Há 2 dias",
    lida: true
  }
];

const mensagensIniciais = [
  {
    id: 1,
    remetente: "Sua fonoaudióloga",
    texto: "Olá! Preparei uma nova atividade para você.",
    horario: "Hoje",
    lida: false
  }
];

function IconeNotificacao({ tipo }) {
  const propriedades = {
    size: 25,
    strokeWidth: 1.8,
    className: "text-[#F8B140]"
  };

  if (tipo === "atividade") {
    return <Dumbbell {...propriedades} />;
  }

  if (tipo === "mensagem") {
    return <MessageCircle {...propriedades} />;
  }

  if (tipo === "estrela") {
    return <Star {...propriedades} />;
  }

  if (tipo === "item") {
    return <Lightbulb {...propriedades} />;
  }

  if (tipo === "sequencia") {
    return <Flame {...propriedades} />;
  }

  return <PartyPopper {...propriedades} />;
}

export default function PaginaNotificacoes() {
  const router = useRouter();

  const [abaAtiva, setAbaAtiva] = useState("notificacoes");
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);
  const [mensagens] = useState(mensagensIniciais);

  const notificacoesNaoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida
  ).length;

  const mensagensNaoLidas = mensagens.filter(
    (mensagem) => !mensagem.lida
  ).length;

  const marcarNotificacaoLida = (id) => {
    setNotificacoes((anteriores) =>
      anteriores.map((notificacao) =>
        notificacao.id === id
          ? { ...notificacao, lida: true }
          : notificacao
      )
    );
  };

  const abrirNotificacao = (notificacao) => {
    marcarNotificacaoLida(notificacao.id);

    if (notificacao.tipo === "mensagem") {
      setAbaAtiva("mensagens");
    }
  };

  const abrirMensagem = () => {
    router.push("/mensagens");
  };

  const limparNotificacoes = () => {
    setNotificacoes([]);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#EA8177]">
      <header className="flex h-[92px] shrink-0 items-start px-5 pt-5">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="flex h-10 w-10 items-center justify-center text-white"
        >
          <ArrowLeft size={30} strokeWidth={2.5} />
        </button>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[24px] bg-white">
        <div className="shrink-0 px-5 pt-5">
          <h1 className="text-[22px] font-extrabold text-[#EF8177]">
            Notificações
          </h1>

          <div className="mt-5 flex overflow-hidden rounded-[12px] bg-[#FFF0D5] p-1">
            <button
              type="button"
              onClick={() => setAbaAtiva("notificacoes")}
              className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-[9px] px-2 py-3 text-xs font-bold transition-colors ${
                abaAtiva === "notificacoes"
                  ? "bg-[#F8B140] text-white"
                  : "text-[#E98079]"
              }`}
            >
              <Bell size={16} />
              Notificações

              {notificacoesNaoLidas > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${
                    abaAtiva === "notificacoes"
                      ? "bg-white text-[#E98079]"
                      : "bg-[#E98079] text-white"
                  }`}
                >
                  {notificacoesNaoLidas}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setAbaAtiva("mensagens")}
              className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-[9px] px-2 py-3 text-xs font-bold transition-colors ${
                abaAtiva === "mensagens"
                  ? "bg-[#F8B140] text-white"
                  : "text-[#E98079]"
              }`}
            >
              <MessageCircle size={16} />
              Mensagens

              {mensagensNaoLidas > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${
                    abaAtiva === "mensagens"
                      ? "bg-white text-[#E98079]"
                      : "bg-[#E98079] text-white"
                  }`}
                >
                  {mensagensNaoLidas}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          <AnimatePresence mode="wait">
            {abaAtiva === "notificacoes" ? (
              <motion.section
                key="notificacoes"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
              >
                <div className="my-4 flex min-h-6 items-center justify-between">
                  <span className="text-xs font-semibold text-[#A59A95]">
                    {notificacoes.length} avisos
                  </span>

                  {notificacoes.length > 0 && (
                    <button
                      type="button"
                      onClick={limparNotificacoes}
                      className="text-xs font-bold text-[#E98079]"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {notificacoes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <Bell
                      size={42}
                      strokeWidth={1.5}
                      className="text-[#F8B140]"
                    />

                    <p className="text-sm font-bold text-[#985C40]">
                      Tudo em dia!
                    </p>

                    <p className="max-w-[220px] text-xs text-[#A59A95]">
                      Quando chegar uma novidade, ela aparecerá aqui.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {notificacoes.map((notificacao, indice) => (
                      <motion.button
                        key={notificacao.id}
                        type="button"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: indice * 0.05 }}
                        onClick={() => abrirNotificacao(notificacao)}
                        className={`flex w-full items-center gap-3 rounded-[16px] px-3 py-4 text-left transition-colors ${
                          notificacao.lida
                            ? "bg-[#F1F1F1]"
                            : "bg-[#FFF2E4]"
                        }`}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                          <IconeNotificacao tipo={notificacao.tipo} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium leading-relaxed text-[#3F3F3F]">
                            {notificacao.texto}
                          </p>

                          <span className="mt-1 block text-[10px] text-[#A59A95]">
                            {notificacao.horario}
                          </span>
                        </div>

                        {!notificacao.lida && (
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#E98079]" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.section>
            ) : (
              <motion.section
                key="mensagens"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <div className="my-4 flex min-h-6 items-center justify-between">
                  <span className="text-xs font-semibold text-[#A59A95]">
                    {mensagens.length} mensagens
                  </span>
                </div>

                {mensagens.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <MessageCircle
                      size={42}
                      strokeWidth={1.5}
                      className="text-[#F8B140]"
                    />

                    <p className="text-sm font-bold text-[#985C40]">
                      Nenhuma mensagem ainda
                    </p>

                    <p className="max-w-[220px] text-xs text-[#A59A95]">
                      Os recados da sua fonoaudióloga aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {mensagens.map((mensagem) => (
                      <button
                        key={mensagem.id}
                        type="button"
                        onClick={abrirMensagem}
                        className={`flex w-full items-center gap-3 rounded-[16px] px-3 py-4 text-left ${
                          mensagem.lida
                            ? "bg-[#F1F1F1]"
                            : "bg-[#FFF2E4]"
                        }`}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F8B140]">
                          <MessageCircle
                            size={24}
                            className="text-white"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#985C40]">
                            {mensagem.remetente}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs text-[#665C59]">
                            {mensagem.texto}
                          </p>

                          <span className="mt-2 block text-[10px] text-[#A59A95]">
                            {mensagem.horario}
                          </span>
                        </div>

                        {!mensagem.lida ? (
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#E98079]" />
                        ) : (
                          <CheckCheck
                            size={16}
                            className="shrink-0 text-[#A59A95]"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="shrink-0">
        <BottomNav activeTab="notificacoes" />
      </div>
    </div>
  );
}
