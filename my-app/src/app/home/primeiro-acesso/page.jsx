
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/LogoLola";
import Button from "@/components/Button";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function PrimeiroAcesso() {
  const router = useRouter();

  useEffect(() => {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (
      sessionStorage.getItem("trocaSenhaPendente") !== "true"
    ) {
      router.replace("/home");
    }
  }, [router]);

  function criarSenha() {
    router.push("/login/alterar-senha");
  }

  function agoraNao() {
    sessionStorage.removeItem("trocaSenhaPendente");
    router.replace("/home");
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-white">
      <div className="flex h-44 shrink-0 items-center justify-center bg-secondary pt-4">
        <Logo className="h-24" />
      </div>

      <div className="relative z-10 -mt-4 flex flex-1 flex-col rounded-t-[32px] bg-white px-6 pb-8 pt-8 shadow-lg">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <LockKeyhole className="h-12 w-12 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-primary">
            Sua conta, sua senha!
          </h1>

          <p className="mt-5 text-sm leading-7 text-text-main/70">
            Você entrou com a senha fornecida pela
            fonoaudióloga. Que tal criar uma senha só sua?
          </p>

          <div className="mt-7 flex w-full items-start gap-3 rounded-2xl bg-secondary/10 p-4 text-left">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" />

            <p className="text-xs leading-6 text-text-main/80">
              Recomendamos trocar a senha inicial para
              proteger o acesso às atividades e informações
              da criança.
            </p>
          </div>

          <div className="mt-10 flex w-full flex-col gap-3">
            <Button
              type="button"
              onClick={criarSenha}
              className="w-full"
            >
              Criar minha senha
            </Button>

            <button
              type="button"
              onClick={agoraNao}
              className="min-h-12 rounded-full border-2 border-primary bg-white px-6 py-3 font-semibold text-primary transition hover:bg-primary/5"
            >
              Agora não
            </button>
          </div>

          <p className="mt-6 text-xs leading-5 text-gray-500">
            Você poderá alterar sua senha depois,
            nas configurações do aplicativo.
          </p>
        </div>
      </div>
    </div>
  );
}
