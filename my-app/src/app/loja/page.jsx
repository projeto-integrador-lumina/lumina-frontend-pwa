
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, RefreshCw, ShoppingBag } from "lucide-react";
import AvatarLoja from "@/components/loja/AvatarLoja";
import AbasLoja from "@/components/loja/AbasLoja";
import CategoriasLoja from "@/components/loja/CategoriasLoja";
import CardRoupa from "@/components/loja/CardRoupa";
import ModalCompra from "@/components/loja/ModalCompra";
import BottomNav from "@/components/BottomNav";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const obterToken = () => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

const requisitar = async (caminho, opcoes = {}) => {
  const token = obterToken();

  if (!token) {
    const erro = new Error("Sua sessão terminou. Entre novamente.");
    erro.status = 401;
    throw erro;
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...opcoes.headers
    },
    cache: "no-store"
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    const erro = new Error(
      dados.error ||
        dados.message ||
        "Não conseguimos completar essa ação."
    );

    erro.status = resposta.status;
    throw erro;
  }

  return dados;
};

export default function LojaPage() {
  const router = useRouter();

  const [abaAtiva, setAbaAtiva] = useState("inventario");
  const [categoriaAtiva, setCategoriaAtiva] = useState("camiseta");

  const [itensLoja, setItensLoja] = useState([]);
  const [itensInventario, setItensInventario] = useState([]);
  const [moedas, setMoedas] = useState(0);

  const [avatar, setAvatar] = useState({
    genero: "F",
    camiseta: null,
    calca: null,
    calcado: null
  });

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [acaoEmAndamento, setAcaoEmAndamento] = useState(null);

  const [itemParaComprar, setItemParaComprar] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const carregarDados = useCallback(
    async (inicial = false) => {
      if (inicial) {
        setCarregando(true);
      } else {
        setAtualizando(true);
      }

      setErro("");

      try {
        const [loja, inventario] = await Promise.all([
          requisitar("/api/app/loja"),
          requisitar("/api/app/inventario")
        ]);

        setItensLoja(loja.itens || []);
        setItensInventario(inventario.itens || []);
        setMoedas(inventario.moedas ?? loja.moedas ?? 0);

        setAvatar({
          genero: inventario.avatar?.genero || "F",
          camiseta: inventario.avatar?.camiseta || null,
          calca: inventario.avatar?.calca || null,
          calcado: inventario.avatar?.calcado || null
        });
      } catch (error) {
        if (error.status === 401) {
          router.replace("/login");
          return;
        }

        setErro(
          "Ops! Não conseguimos carregar a lojinha. Vamos tentar de novo?"
        );
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    [router]
  );

  useEffect(() => {
    carregarDados(true);
  }, [carregarDados]);

  useEffect(() => {
    if (!mensagem) return;

    const tempo = setTimeout(() => {
      setMensagem("");
    }, 3500);

    return () => clearTimeout(tempo);
  }, [mensagem]);

  const itensExibidos = useMemo(() => {
    const itens =
      abaAtiva === "loja" ? itensLoja : itensInventario;

    return itens.filter((item) => {
      if (item.categoria !== categoriaAtiva) {
        return false;
      }

      if (abaAtiva === "loja" && item.comprado) {
        return false;
      }

      return true;
    });
  }, [
    abaAtiva,
    categoriaAtiva,
    itensLoja,
    itensInventario
  ]);

  const estaEquipado = (item) => {
    const equipado = avatar[item.categoria];

    return Boolean(
      equipado &&
        String(equipado._id) === String(item._id)
    );
  };

  const comprarItem = async (item) => {
    if (!item || acaoEmAndamento) return;

    setAcaoEmAndamento(item._id);
    setErro("");

    try {
      const resposta = await requisitar(
        "/api/app/loja/comprar",
        {
          method: "POST",
          body: JSON.stringify({
            id_item: item._id
          })
        }
      );

      setMoedas(resposta.moedas);
      setItemParaComprar(null);
      setMensagem(`Oba! ${item.nome} agora é seu!`);

      await carregarDados();
    } catch (error) {
      if (error.status === 401) {
        router.replace("/login");
        return;
      }

      setErro(
        error.status === 400
          ? "Você ainda não tem moedas suficientes."
          : error.status === 409
            ? "Essa roupinha já está no seu guarda-roupa!"
            : "Ops! Não conseguimos comprar agora."
      );

      if (error.status === 409) {
        setItemParaComprar(null);
        await carregarDados();
      }
    } finally {
      setAcaoEmAndamento(null);
    }
  };

  const atualizarAvatar = async (
    alteracoes,
    mensagemSucesso
  ) => {
    if (acaoEmAndamento) return;

    setAcaoEmAndamento("avatar");
    setErro("");

    try {
      await requisitar("/api/app/avatar", {
        method: "PUT",
        body: JSON.stringify(alteracoes)
      });

      await carregarDados();

      if (mensagemSucesso) {
        setMensagem(mensagemSucesso);
      }
    } catch (error) {
      if (error.status === 401) {
        router.replace("/login");
        return;
      }

      setErro(
        "Ops! Não conseguimos mudar sua roupinha."
      );
    } finally {
      setAcaoEmAndamento(null);
    }
  };

  const equiparItem = (item) => {
    atualizarAvatar(
      { [item.categoria]: item._id },
      `${item.nome} escolhida!`
    );
  };

  const retirarItem = (item) => {
    atualizarAvatar(
      { [item.categoria]: null },
      "Roupinha retirada!"
    );
  };

  const alterarGenero = (genero) => {
    atualizarAvatar(
      { genero },
      "Personagem atualizado!"
    );
  };

  const tituloVazio =
    abaAtiva === "loja"
      ? "Não há mais roupinhas nessa categoria!"
      : "Seu guarda-roupa está esperando novas roupinhas!";

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <AvatarLoja
          moedas={moedas}
          genero={avatar.genero}
          avatar={avatar}
          carregando={acaoEmAndamento === "avatar"}
          onChangeGenero={alterarGenero}
        />

        <main className="relative w-full bg-white pb-10">
          <div>
            <AbasLoja
              abaAtiva={abaAtiva}
              onChange={(aba) => {
                setAbaAtiva(aba);
                setErro("");
                setMensagem("");
              }}
            />
          </div>

          <div>
            <CategoriasLoja
              categoriaAtiva={categoriaAtiva}
              onChange={setCategoriaAtiva}
            />
          </div>

          {mensagem && (
            <div
              role="status"
              className="mx-5 mt-4 rounded-xl border border-[#B9D9BB] bg-[#EDF8EA] px-3 py-3 text-center text-[12px] font-bold text-[#598C62]"
            >
              {mensagem}
            </div>
          )}

          {erro && (
            <div
              role="alert"
              className="mx-5 mt-4 rounded-xl border border-[#F1C1B8] bg-[#FFF0EC] px-3 py-3 text-center text-[12px] font-bold text-[#BB6B64]"
            >
              {erro}
            </div>
          )}

          {carregando ? (
            <div className="flex min-h-[230px] flex-col items-center justify-center gap-3 px-6">
              <LoaderCircle
                size={32}
                className="animate-spin text-[#E99490]"
              />

              <p className="text-center text-[13px] font-semibold text-[#AD8171]">
                Preparando suas roupinhas...
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 pb-4 pt-2">
                <h2 className="text-[15px] font-extrabold text-[#915B53]">
                  {abaAtiva === "loja"
                    ? "Escolha sua roupinha!"
                    : "Minhas roupinhas"}
                </h2>

                <button
                  type="button"
                  onClick={() => carregarDados()}
                  disabled={
                    atualizando ||
                    Boolean(acaoEmAndamento)
                  }
                  aria-label="Atualizar roupinhas"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0E3] text-[#D68F84] disabled:opacity-50"
                >
                  <RefreshCw
                    size={18}
                    className={
                      atualizando ? "animate-spin" : ""
                    }
                  />
                </button>
              </div>

              {itensExibidos.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-5 pb-8">
                  {itensExibidos.map((item) => (
                    <CardRoupa
                      key={item._id}
                      item={{
                        ...item,
                        comprado:
                          abaAtiva === "loja"
                            ? item.comprado
                            : true
                      }}
                      abaAtiva={abaAtiva}
                      equipado={estaEquipado(item)}
                      carregando={
                        acaoEmAndamento === item._id ||
                        acaoEmAndamento === "avatar"
                      }
                      onComprar={setItemParaComprar}
                      onEquipar={equiparItem}
                      onRetirar={retirarItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 px-8 pb-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0D8]">
                    <ShoppingBag
                      size={27}
                      className="text-[#E5AC58]"
                    />
                  </div>

                  <p className="max-w-[250px] text-[13px] font-bold leading-relaxed text-[#A77B70]">
                    {tituloVazio}
                  </p>

                  {abaAtiva !== "loja" && (
                    <button
                      type="button"
                      onClick={() => setAbaAtiva("loja")}
                      className="rounded-full bg-[#F6BD62] px-5 py-2.5 text-[12px] font-extrabold text-white"
                    >
                      Comprar roupinhas
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <div className="z-20 shrink-0">
        <BottomNav />
      </div>

      <ModalCompra
        item={itemParaComprar}
        aberto={Boolean(itemParaComprar)}
        moedas={moedas}
        carregando={Boolean(acaoEmAndamento)}
        onFechar={() => setItemParaComprar(null)}
        onConfirmar={comprarItem}
      />
    </div>
  );
}
