
"use client";

const abas = [
  {
    id: "inventario",
    nome: "Meus Itens"
  },
  {
    id: "loja",
    nome: "Comprar Roupas"
  }
];

export default function AbasLoja({
  abaAtiva = "inventario",
  onChange
}) {
  return (
    <div className="w-full px-4 pt-4">
      <div
        role="tablist"
        aria-label="Navegação da lojinha"
        className="flex w-full items-end border-b-2 border-[#F9D98C]"
      >
        {abas.map((aba) => {
          const ativa = abaAtiva === aba.id;

          return (
            <button
              key={aba.id}
              type="button"
              role="tab"
              id={`aba-${aba.id}`}
              aria-label={aba.nome}
              aria-selected={ativa}
              onClick={() => onChange?.(aba.id)}
              className={`relative flex min-h-[48px] flex-1 items-center justify-center px-2 pb-3 pt-2 text-center text-[13px] font-extrabold transition-colors duration-200 ${
                ativa
                  ? "text-[#E9AA3F]"
                  : "text-[#C9B38B]"
              }`}
            >
              {aba.nome}

              {ativa && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-[-2px] left-3 right-3 h-[4px] rounded-t-full bg-[#F6BD62]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
