
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://lumina-backend-6mk6.onrender.com"
).replace(/\/+$/, "");

function CampoSenha({
  titulo,
  valor,
  alterar,
  mostrar,
  alternar,
  placeholder,
  autoComplete,
  limparErro,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">
        {titulo}
      </label>

      <div className="relative">
        <LockKeyhole
          size={20}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#E98C86]"
        />

        <input
          type={mostrar ? "text" : "password"}
          value={valor}
          onChange={(evento) => {
            alterar(evento.target.value);
            limparErro();
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-2xl border border-gray-200 bg-[#FAFAFA] py-4 pl-12 pr-12 text-base text-gray-800 outline-none transition focus:border-[#E98C86] focus:ring-2 focus:ring-[#E98C86]/20"
        />

        <button
          type="button"
          onClick={alternar}
          aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {mostrar ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}

export default function AlterarSenha() {
  const router = useRouter();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const [primeiroAcesso, setPrimeiroAcesso] = useState(false);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setPrimeiroAcesso(
      sessionStorage.getItem("trocaSenhaPendente") === "true"
    );

    setVerificando(false);
  }, [router]);

  function voltar() {
    router.push(
      primeiroAcesso ? "/primeiro-acesso" : "/configuracoes"
    );
  }

  async function salvarSenha(evento) {
    evento.preventDefault();

    if (carregando) return;

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (novaSenha.length < 8) {
      setErro("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("A confirmação não corresponde à nova senha.");
      return;
    }

    if (senhaAtual === novaSenha) {
      setErro("A nova senha deve ser diferente da senha atual.");
      return;
    }

    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(`${API_URL}/api/auth/senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senhaAtual,
          novaSenha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error ||
            dados.message ||
            "Não foi possível alterar a senha."
        );
      }

      sessionStorage.removeItem("trocaSenhaPendente");

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setSucesso(true);
    } catch (error) {
      setErro(
        error.message ||
          "Ocorreu um erro. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  if (verificando) {
    return (
      <div className="flex h-full min-h-dvh items-center justify-center bg-white">
        <p className="text-sm text-gray-500">
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-dvh flex-col overflow-y-auto bg-white">
      <header className="shrink-0 bg-secondary px-6 pb-12 pt-8">
        <button
          type="button"
          onClick={voltar}
          className="flex items-center gap-2 text-sm font-semibold text-white"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="mt-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/25">
            <LockKeyhole
              size={38}
              className="text-white"
            />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Alterar senha
          </h1>
        </div>
      </header>

      <main className="relative -mt-6 flex flex-1 flex-col rounded-t-[30px] bg-white px-6 pb-10 pt-9">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          {sucesso ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2
                  size={58}
                  className="text-green-500"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-[#E98C86]">
                Senha alterada!
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                Sua nova senha foi salva com sucesso.
                Agora você pode continuar aproveitando
                as atividades do Lolá!
              </p>

              <button
                type="button"
                onClick={() => router.replace("/home")}
                className="mt-9 w-full rounded-2xl bg-[#E98C86] px-6 py-4 font-bold text-white transition active:scale-[0.98]"
              >
                Ir para o início
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800">
                  {primeiroAcesso
                    ? "Crie sua senha pessoal"
                    : "Escolha uma nova senha"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {primeiroAcesso
                    ? "Digite a senha recebida da fonoaudióloga e escolha uma nova senha para acessar o Lolá."
                    : "Para alterar sua senha, informe a senha atual e escolha uma nova."}
                </p>
              </div>

              <form
                onSubmit={salvarSenha}
                className="flex flex-col gap-5"
              >
                <CampoSenha
                  titulo={
                    primeiroAcesso
                      ? "Senha recebida"
                      : "Senha atual"
                  }
                  valor={senhaAtual}
                  alterar={setSenhaAtual}
                  mostrar={mostrarSenhaAtual}
                  alternar={() =>
                    setMostrarSenhaAtual(!mostrarSenhaAtual)
                  }
                  placeholder="Digite sua senha atual"
                  autoComplete="current-password"
                  limparErro={() => setErro("")}
                />

                <CampoSenha
                  titulo="Nova senha"
                  valor={novaSenha}
                  alterar={setNovaSenha}
                  mostrar={mostrarNovaSenha}
                  alternar={() =>
                    setMostrarNovaSenha(!mostrarNovaSenha)
                  }
                  placeholder="Digite a nova senha"
                  autoComplete="new-password"
                  limparErro={() => setErro("")}
                />

                <CampoSenha
                  titulo="Confirmar nova senha"
                  valor={confirmarSenha}
                  alterar={setConfirmarSenha}
                  mostrar={mostrarConfirmacao}
                  alternar={() =>
                    setMostrarConfirmacao(!mostrarConfirmacao)
                  }
                  placeholder="Confirme sua nova senha"
                  autoComplete="new-password"
                  limparErro={() => setErro("")}
                />

                <div className="flex items-start gap-3 rounded-2xl bg-[#FFF5ED] p-4">
                  <ShieldCheck
                    size={22}
                    className="mt-0.5 shrink-0 text-[#E98C86]"
                  />

                  <p className="text-xs leading-6 text-gray-600">
                    Sua nova senha deve ter pelo menos
                    8 caracteres. Escolha uma senha
                    fácil de lembrar, mas difícil
                    de adivinhar.
                  </p>
                </div>

                {erro && (
                  <div
                    role="alert"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {erro}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={carregando}
                  className="mt-3 w-full rounded-2xl bg-[#E98C86] px-6 py-4 font-bold text-white transition hover:bg-[#df7c76] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {carregando
                    ? "Salvando..."
                    : "Salvar nova senha"}
                </button>

                <button
                  type="button"
                  onClick={voltar}
                  className="py-3 text-sm font-semibold text-gray-500"
                >
                  Cancelar
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
