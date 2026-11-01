
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, UserRound, RefreshCw } from "lucide-react";

import BottomNav from "@/components/BottomNav";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

const categorias = [
  "Sons líquidos",
  "Sons explosivos",
  "Sons nasais",
  "Sons fricativos"
];

function obterUrlFoto(foto) {
  if (!foto) return null;

  const valor = String(foto).trim();

  if (!valor) return null;

  if (valor.startsWith("data:")) {
    return valor;
  }

  if (valor.startsWith("//")) {
    return `https:${valor}`;
  }

  if (
    valor.startsWith("http://") ||
    valor.startsWith("https://")
  ) {
    try {
      const url = new URL(valor);

      if (
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1"
      ) {
        return `${API_URL}${url.pathname}${url.search}`;
      }

      return valor;
    } catch {
      return null;
    }
  }

  return `${API_URL}/${valor.replace(/^\/+/, "")}`;
}

function formatarData(valor) {
  if (!valor) return "Não informado";

  const texto = String(valor);

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    return texto;
  }

  const partes = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (partes) {
    return `${partes[3]}/${partes[2]}/${partes[1]}`;
  }

  return texto;
}

export default function PaginaPerfil() {
  const router = useRouter();

  const [paciente, setPaciente] = useState(null);
  const [nomeSalvo, setNomeSalvo] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const carregarPerfil = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const nome =
        localStorage.getItem("nome") ||
        sessionStorage.getItem("nome") ||
        "";

      setNomeSalvo(nome);

      if (!token) {
        router.replace("/login");
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const resposta = await fetch(
          `${API_URL}/api/pacientes/meu-perfil`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            },
            cache: "no-store",
            signal: controller.signal
          }
        );

        const dados = await resposta.json().catch(() => ({}));

        if (resposta.status === 401) {
          router.replace("/login");
          return;
        }

        if (!resposta.ok) {
          throw new Error(
            dados.error ||
              `Não foi possível carregar o perfil (${resposta.status}).`
          );
        }

        if (!dados.paciente) {
          throw new Error(
            "A API não retornou os dados do paciente."
          );
        }

        setPaciente(dados.paciente);
        setFotoFalhou(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErro(
            error instanceof TypeError
              ? "Não foi possível conectar à API. Tente novamente."
              : error.message ||
                  "Ops! Ocorreu um erro ao carregar seu perfil."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    };

    carregarPerfil();

    return () => controller.abort();
  }, [router, tentativa]);

  const nomeCompleto = paciente
    ? [paciente.nome, paciente.sobrenome]
        .filter(Boolean)
        .join(" ")
    : nomeSalvo;

  const foto = obterUrlFoto(paciente?.foto_perfil);

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

      <main className="relative -mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-[24px] bg-white px-5 pb-8 pt-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="text-[22px] font-extrabold text-[#EF8177]"
        >
          Perfil
        </motion.h1>

        {carregando && (
          <div className="mt-8 flex items-center justify-center gap-2 text-[#985C40]">
            <RefreshCw
              size={18}
              className="animate-spin"
            />
            <span className="text-sm font-semibold">
              Carregando informações...
            </span>
          </div>
        )}

        {!carregando && erro && (
          <div className="mt-5 rounded-2xl bg-[#FFF0EA] px-4 py-3">
            <p
              role="alert"
              className="text-center text-xs font-medium text-[#985C40]"
            >
              {erro}
            </p>

            <button
              type="button"
              onClick={() =>
                setTentativa((valor) => valor + 1)
              }
              className="mx-auto mt-3 flex items-center gap-2 text-xs font-bold text-[#E98079]"
            >
              <RefreshCw size={15} />
              Tentar novamente
            </button>
          </div>
        )}

        {!carregando && !erro && paciente && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 170,
                damping: 15
              }}
              className="mx-auto mt-5 flex h-[112px] w-[112px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[4px] border-[#EA8177] bg-[#F8E4D7]"
            >
              {foto && !fotoFalhou ? (
                <img
                  src={foto}
                  alt={`Foto de ${nomeCompleto}`}
                  onError={() => setFotoFalhou(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound
                  size={60}
                  strokeWidth={1.6}
                  className="text-[#D99688]"
                />
              )}
            </motion.div>

            <section className="mt-6 w-full">
              <div>
                <p className="text-sm font-bold text-[#EF8177]">
                  Nome
                </p>

                <p className="mt-1 text-sm font-medium text-[#665C59]">
                  {nomeCompleto || "Não informado"}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <p className="text-sm font-bold text-[#EF8177]">
                    Data de Nascimento
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#665C59]">
                    {formatarData(paciente.data_nasc)}
                  </p>
                </div>

                <div className="min-w-[65px]">
                  <p className="text-sm font-bold text-[#EF8177]">
                    Idade
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#665C59]">
                    {paciente.idade != null
                      ? `${paciente.idade} anos`
                      : "Não informada"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-bold text-[#EF8177]">
                  Alvo Atual
                </p>

                <p className="mt-1 text-sm font-medium text-[#665C59]">
                  Aguardando dados da terapia
                </p>
              </div>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.45
              }}
              className="mt-8 rounded-[18px] bg-[#EE978E] px-4 pb-5 pt-4 shadow-[0_6px_0_#B83C32]"
            >
              <h2 className="text-base font-extrabold text-white">
                Evolução
              </h2>

              <p className="mt-1 text-xs text-white/90">
                O progresso aparecerá aqui quando os dados das
                atividades estiverem disponíveis.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                {categorias.map((categoria) => (
                  <div key={categoria}>
                    <p className="mb-1 text-xs font-bold text-white">
                      {categoria}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="h-[15px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#FFE7A5]" />

                      <span className="w-10 shrink-0 text-right text-xs font-bold text-white">
                        —
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </>
        )}
      </main>

      <div className="shrink-0">
        <BottomNav
          activeTab="profile"
          onSelectTab={(tab) => {
            if (tab === "shop") router.push("/loja");
            if (tab === "profile") router.push("/perfil");
            if (tab === "settings") {
              router.push("/configuracoes");
            }
          }}
        />
      </div>
    </div>
  );
}
