
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/LogoLola";
import InputIcon from "@/components/InputIcon";
import Button from "@/components/Button";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

export default function Login() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [manterConectado, setManterConectado] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function entrar(evento) {
    evento.preventDefault();

    if (carregando) return;

    if (!usuario.trim() || !senha) {
      setErro("Informe seu usuário e sua senha.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: usuario.trim().toLowerCase(),
          senha,
          manter: manterConectado
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || "Não foi possível entrar."
        );
      }

      if (!dados.token) {
        throw new Error("Token de autenticação não recebido.");
      }

      if (dados.tipo !== "Paciente") {
        throw new Error(
          "Este aplicativo é destinado aos pacientes e responsáveis."
        );
      }

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      const armazenamento = manterConectado
        ? localStorage
        : sessionStorage;

      armazenamento.setItem("token", dados.token);
      armazenamento.setItem("nome", dados.nome || "");
      armazenamento.setItem("tipo", dados.tipo);

      if (dados.precisaTrocarSenha) {
        sessionStorage.setItem("trocaSenhaPendente", "true");
        router.replace("/home/primeiro-acesso");
      } else {
        sessionStorage.removeItem("trocaSenhaPendente");
        router.replace("/home");
      }
    } catch (error) {
      setErro(
        error instanceof TypeError
          ? "Não foi possível conectar à API. Verifique sua conexão e tente novamente."
          : error.message || "Erro ao entrar."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-white">
      <div className="flex h-44 shrink-0 items-center justify-center bg-secondary pt-4">
        <Logo className="h-24" />
      </div>

      <div className="relative z-10 -mt-4 flex flex-1 flex-col rounded-t-[32px] bg-white px-6 pb-8 pt-8 shadow-lg">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <h1 className="mb-3 text-center text-2xl font-bold text-primary">
            Login
          </h1>

          <p className="mb-8 text-center text-sm leading-6 text-text-main/70">
            Entre com os dados fornecidos pela sua fonoaudióloga.
          </p>

          <form onSubmit={entrar} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main">
                Nome de usuário
              </label>

              <InputIcon
                icon={<User className="h-5 w-5 text-primary" />}
                type="text"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(evento) => {
                  setUsuario(evento.target.value);
                  setErro("");
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main">
                Senha
              </label>

              <div className="relative">
                <InputIcon
                  icon={<Lock className="h-5 w-5 text-primary" />}
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(evento) => {
                    setSenha(evento.target.value);
                    setErro("");
                  }}
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={
                    mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                  }
                  className="absolute inset-y-0 right-2 flex items-center px-3 text-gray-500"
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <p
                role="alert"
                className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {erro}
              </p>
            )}

            <Button
              type="submit"
              className={`w-full ${
                carregando
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </Button>

            <label className="flex cursor-pointer items-center gap-2 px-1 text-xs font-medium text-text-main">
              <input
                type="checkbox"
                checked={manterConectado}
                onChange={(evento) =>
                  setManterConectado(evento.target.checked)
                }
                className="h-4 w-4 accent-primary"
              />
              Manter-me conectado
            </label>
          </form>

          <div className="mt-8 rounded-2xl bg-secondary/10 p-4 text-center">
            <p className="text-sm font-semibold text-primary">
              Primeiro acesso?
            </p>

            <p className="mt-2 text-xs leading-5 text-text-main/70">
              Utilize a senha recebida da fonoaudióloga.
              Depois de entrar, você poderá criar uma senha
              só sua.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
