
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  LockKeyhole,
  Send,
  X,
  RefreshCw,
  MessageCircle
} from "lucide-react";

import BottomNav from "@/components/BottomNav";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

export default function PaginaMensagens() {
  const router = useRouter();
  const fimConversaRef = useRef(null);

  const [tokenPaciente, setTokenPaciente] = useState("");
  const [tokenResponsavel, setTokenResponsavel] = useState("");
  const [expiraEm, setExpiraEm] = useState(0);

  const [pin, setPin] = useState("");
  const [validando, setValidando] = useState(false);
  const [erroPin, setErroPin] = useState("");

  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erroMensagens, setErroMensagens] = useState("");

  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const bloquear = useCallback(() => {
    setTokenResponsavel("");
    setExpiraEm(0);
    setMensagens([]);
    setTexto("");
    setPin("");
  }, []);

  useEffect(() => {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setTokenPaciente(token);
  }, [router]);

  useEffect(() => {
    if (!tokenResponsavel || !expiraEm) return;

    const restante = expiraEm - Date.now();

    if (restante <= 0) {
      bloquear();
      return;
    }

    const timer = window.setTimeout(bloquear, restante);

    return () => window.clearTimeout(timer);
  }, [tokenResponsavel, expiraEm, bloquear]);

  const carregarMensagens = useCallback(async () => {
    if (!tokenPaciente || !tokenResponsavel) return;

    setCarregando(true);
    setErroMensagens("");

    try {
      const resposta = await fetch(`${API_URL}/api/app/mensagens`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenPaciente}`,
          "x-responsavel-token": tokenResponsavel
        },
        cache: "no-store"
      });

      const dados = await resposta.json().catch(() => ({}));

      if (resposta.status === 401 && dados.precisaPin) {
        bloquear();
        return;
      }

      if (!resposta.ok) {
        throw new Error(dados.error || "Erro ao buscar mensagens.");
      }

      setMensagens(Array.isArray(dados.mensagens) ? dados.mensagens : []);
    } catch (error) {
      setErroMensagens(error.message);
    } finally {
      setCarregando(false);
    }
  }, [tokenPaciente, tokenResponsavel, bloquear]);

  useEffect(() => {
    if (tokenResponsavel) {
      carregarMensagens();
    }
  }, [tokenResponsavel, carregarMensagens]);

  useEffect(() => {
    if (tokenResponsavel && mensagens.length > 0) {
      fimConversaRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensagens, tokenResponsavel]);

  const verificarPin = async (event) => {
    event.preventDefault();

    if (!/^\d{4,6}$/.test(pin)) {
      setErroPin("Digite um PIN de 4 a 6 números.");
      return;
    }

    setValidando(true);
    setErroPin("");

    try {
      const resposta = await fetch(
        `${API_URL}/api/app/mensagens/desbloquear`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenPaciente}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ pin })
        }
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(dados.error || "Não foi possível validar o PIN.");
      }

      if (!dados.token_responsavel) {
        throw new Error("A API não retornou a autorização do responsável.");
      }

      setTokenResponsavel(dados.token_responsavel);
      setExpiraEm(
        Date.now() + Number(dados.expira_em_segundos || 600) * 1000
      );
      setPin("");
    } catch (error) {
      setErroPin(error.message);
      setPin("");
    } finally {
      setValidando(false);
    }
  };

  const enviarMensagem = async (event) => {
    event.preventDefault();

    const conteudo = texto.trim();

    if (!conteudo || enviando || !tokenResponsavel) return;

    if (conteudo.length > 1000) {
      setErroMensagens("A mensagem deve ter até 1000 caracteres.");
      return;
    }

    setEnviando(true);
    setErroMensagens("");

    try {
      const resposta = await fetch(`${API_URL}/api/app/mensagens`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenPaciente}`,
          "x-responsavel-token": tokenResponsavel,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ texto: conteudo })
      });

      const dados = await resposta.json().catch(() => ({}));

      if (resposta.status === 401 && dados.precisaPin) {
        bloquear();
        return;
      }

      if (!resposta.ok) {
        throw new Error(dados.error || "Não foi possível enviar a mensagem.");
      }

      setTexto("");
      await carregarMensagens();
    } catch (error) {
      setErroMensagens(error.message);
    } finally {
      setEnviando(false);
    }
  };

  const desbloqueado = Boolean(tokenResponsavel);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#EA8177]">
      <header className="flex h-[92px] shrink-0 items-start justify-between px-5 pt-5">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="flex h-10 w-10 items-center justify-center text-white"
        >
          <ArrowLeft size={30} strokeWidth={2.5} />
        </button>

        {desbloqueado && (
          <button
            type="button"
            onClick={bloquear}
            className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 text-xs font-bold text-white"
          >
            <LockKeyhole size={15} />
            Bloquear
          </button>
        )}
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[24px] bg-white">
        <div className="shrink-0 px-5 pb-4 pt-5">
          <h1 className="text-[22px] font-extrabold text-[#EF8177]">
            Mensagens
          </h1>

          <p className="mt-1 text-xs text-[#A59A95]">
            Conversa com sua fonoaudióloga
          </p>
        </div>

        {desbloqueado ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
              {carregando && mensagens.length === 0 && (
                <div className="flex items-center justify-center gap-2 py-8 text-[#985C40]">
                  <RefreshCw size={18} className="animate-spin" />
                  <span className="text-xs">Carregando mensagens...</span>
                </div>
              )}

              {!carregando && mensagens.length === 0 && !erroMensagens && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                  <MessageCircle
                    size={42}
                    strokeWidth={1.5}
                    className="text-[#F8B140]"
                  />

                  <p className="text-sm font-bold text-[#985C40]">
                    Nenhuma mensagem ainda
                  </p>

                  <p className="max-w-[240px] text-xs text-[#A59A95]">
                    Você pode iniciar uma conversa com a fonoaudióloga.
                  </p>
                </div>
              )}

              {mensagens.map((mensagem, indice) => {
                const minha = mensagem.autor === "responsavel";

                return (
                  <motion.div
                    key={mensagem._id || indice}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${minha ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-[18px] px-4 py-3 ${
                        minha
                          ? "rounded-br-sm bg-[#FFDEA0]"
                          : "rounded-bl-sm bg-[#ECECEC]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-[#49413D]">
                        {mensagem.texto}
                      </p>

                      {mensagem.createdAt && (
                        <p className="mt-2 text-right text-[10px] text-[#8E8580]">
                          {new Date(mensagem.createdAt).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit"
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              <div ref={fimConversaRef} />
            </div>

            {erroMensagens && (
              <div className="mx-5 mb-2 rounded-xl bg-[#FFF0EA] px-3 py-2">
                <p className="text-xs text-[#985C40]">
                  {erroMensagens}
                </p>

                <button
                  type="button"
                  onClick={carregarMensagens}
                  className="mt-1 text-xs font-bold text-[#E98079]"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            <form
              onSubmit={enviarMensagem}
              className="flex shrink-0 items-center gap-2 border-t border-[#F5E9E5] bg-white px-4 py-3"
            >
              <input
                type="text"
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
                maxLength={1000}
                placeholder="Digite sua mensagem aqui"
                aria-label="Digite sua mensagem"
                className="min-w-0 flex-1 rounded-full bg-[#F1F1F1] px-4 py-3 text-xs text-[#49413D] outline-none placeholder:text-[#A59A95] focus:ring-2 focus:ring-[#F8B140]"
              />

              <button
                type="submit"
                disabled={!texto.trim() || enviando}
                aria-label="Enviar mensagem"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EA8177] text-white transition active:scale-95 disabled:opacity-50"
              >
                {enviando ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Send size={19} />
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center px-5">
            <p className="max-w-[240px] text-center text-xs text-[#A59A95]">
              Esta conversa é protegida para os responsáveis.
            </p>
          </div>
        )}

        <AnimatePresence>
          {!desbloqueado && tokenPaciente && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 px-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-[320px] rounded-[20px] bg-white px-6 pb-7 pt-8 shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => router.back()}
                  aria-label="Fechar"
                  className="absolute right-4 top-4 text-[#665C59]"
                >
                  <X size={18} />
                </button>

                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0D5]">
                    <LockKeyhole
                      size={25}
                      className="text-[#F8B140]"
                    />
                  </div>
                </div>

                <h2 className="text-center text-sm font-extrabold text-[#985C40]">
                  Área dos responsáveis
                </h2>

                <p className="mt-2 text-center text-xs leading-relaxed text-[#665C59]">
                  Digite o PIN do responsável para acessar a conversa.
                </p>

                <form onSubmit={verificarPin} className="mt-5">
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={6}
                    value={pin}
                    onChange={(event) =>
                      setPin(event.target.value.replace(/\D/g, ""))
                    }
                    placeholder="PIN de 4 a 6 números"
                    aria-label="PIN do responsável"
                    className="w-full rounded-[12px] bg-[#F1F1F1] px-4 py-3 text-center text-sm tracking-[0.2em] text-[#49413D] outline-none focus:ring-2 focus:ring-[#F8B140]"
                  />

                  {erroPin && (
                    <p className="mt-3 text-center text-xs text-[#D45A51]">
                      {erroPin}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={validando || pin.length < 4}
                    className="mt-4 flex w-full items-center justify-center rounded-full bg-[#EA8177] px-4 py-3 text-sm font-bold text-white transition active:scale-95 disabled:opacity-50"
                  >
                    {validando ? "Verificando..." : "Entrar"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}
