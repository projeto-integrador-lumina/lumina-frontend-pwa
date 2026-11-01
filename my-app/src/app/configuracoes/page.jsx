
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Volume2,
  ChartNoAxesColumnIncreasing,
  Accessibility,
  ShieldCheck,
  CircleHelp,
  KeyRound,
  LogOut,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const opcoes = [
  {
    id: "som",
    titulo: "Ajuste de som",
    Icone: Volume2,
  },
  {
    id: "desempenho",
    titulo: "Desempenho",
    Icone: ChartNoAxesColumnIncreasing,
  },
  {
    id: "acessibilidade",
    titulo: "Acessibilidade",
    Icone: Accessibility,
  },
  {
    id: "seguranca",
    titulo: "Segurança e Gestão",
    Icone: ShieldCheck,
  },
  {
    id: "ajuda",
    titulo: "Ajuda",
    Icone: CircleHelp,
  },
];

export default function Configuracoes() {
  const router = useRouter();

  const [verificando, setVerificando] = useState(true);
  const [segurancaAberta, setSegurancaAberta] = useState(false);
  const [confirmarSaida, setConfirmarSaida] = useState(false);

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

  function selecionarOpcao(id) {
    if (id === "seguranca") {
      setSegurancaAberta((anterior) => !anterior);
      return;
    }

    if (id === "som") {
      router.push("/configuracoes/som");
      return;
    }

    if (id === "desempenho") {
      router.push("/configuracoes/desempenho");
      return;
    }

    if (id === "acessibilidade") {
      router.push("/configuracoes/acessibilidade");
      return;
    }

    if (id === "ajuda") {
      router.push("/configuracoes/ajuda");
    }
  }

  function sairDaConta() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("tipo");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("nome");
    sessionStorage.removeItem("tipo");
    sessionStorage.removeItem("trocaSenhaPendente");

    router.replace("/login");
  }

  if (verificando) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#EB8982]">
      <header className="shrink-0 px-6 pb-14 pt-7">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Voltar para o início"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition active:scale-95"
        >
          <ArrowLeft size={28} strokeWidth={2.2} />
        </button>
      </header>

      <main className="relative -mt-5 flex min-h-0 flex-1 flex-col rounded-t-[24px] bg-white px-7 pb-8 pt-8">
        <div className="flex min-h-0 flex-1 flex-col">
          <h1 className="mb-7 text-[18px] font-bold text-[#EB7770]">
            Configuração
          </h1>

          <div className="flex flex-col gap-1">
            {opcoes.map(({ id, titulo, Icone }) => {
              const expandido =
                id === "seguranca" && segurancaAberta;

              return (
                <div key={id}>
                  <button
                    type="button"
                    onClick={() => selecionarOpcao(id)}
                    aria-expanded={
                      id === "seguranca"
                        ? segurancaAberta
                        : undefined
                    }
                    className="flex min-h-[49px] w-full items-center gap-3 rounded-xl px-1 text-left text-[#EB7770] transition hover:bg-[#FFF4F2] active:bg-[#FFEAE7]"
                  >
                    <Icone
                      size={19}
                      fill={
                        id === "ajuda"
                          ? "#EB7770"
                          : "none"
                      }
                      strokeWidth={2.2}
                      className="shrink-0"
                    />

                    <span className="flex-1 text-[14px] font-medium">
                      {titulo}
                    </span>

                    {id === "seguranca" &&
                      (expandido ? (
                        <ChevronDown size={17} />
                      ) : (
                        <ChevronRight size={17} />
                      ))}
                  </button>

                  {expandido && (
                    <div className="mb-2 ml-7 mt-1 overflow-hidden rounded-xl bg-[#FFF5F3]">
                      <button
                        type="button"
                        onClick={() =>
                          router.push("/alterar-senha")
                        }
                        className="flex min-h-[52px] w-full items-center gap-3 px-4 text-left text-[#D96E68] transition hover:bg-[#FFEAE7]"
                      >
                        <KeyRound
                          size={18}
                          className="shrink-0"
                        />

                        <span className="flex-1 text-[13px] font-medium">
                          Alterar senha
                        </span>

                        <ChevronRight size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmarSaida(true)}
                        className="flex min-h-[52px] w-full items-center gap-3 border-t border-[#F8DFDB] px-4 text-left text-[#D96E68] transition hover:bg-[#FFEAE7]"
                      >
                        <LogOut
                          size={18}
                          className="shrink-0"
                        />

                        <span className="flex-1 text-[13px] font-medium">
                          Encerrar sessão
                        </span>

                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={() => setConfirmarSaida(true)}
              className="rounded-lg px-2 py-3 text-[14px] font-medium text-[#EB7770] transition hover:bg-[#FFF4F2]"
            >
              Sair do jogo
            </button>
          </div>
        </div>
      </main>

      {confirmarSaida && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-sair"
            className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF1EF]">
              <LogOut
                size={26}
                className="text-[#EB7770]"
              />
            </div>

            <h2
              id="titulo-sair"
              className="text-center text-xl font-bold text-[#EB7770]"
            >
              Sair do Lolá?
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-gray-500">
              Você precisará entrar novamente com seu
              usuário e senha para continuar jogando.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={sairDaConta}
                className="w-full rounded-xl bg-[#EB8982] px-4 py-3 font-semibold text-white transition hover:bg-[#DF7B74]"
              >
                Sim, quero sair
              </button>

              <button
                type="button"
                onClick={() => setConfirmarSaida(false)}
                className="w-full rounded-xl border border-[#F2C5C0] px-4 py-3 font-semibold text-[#EB7770] transition hover:bg-[#FFF4F2]"
              >
                Continuar no Lolá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
