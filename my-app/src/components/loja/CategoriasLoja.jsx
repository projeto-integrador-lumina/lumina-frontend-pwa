
"use client";

import { Shirt, Footprints } from "lucide-react";

const categorias = [
  {
    id: "camiseta",
    nome: "Camisetas",
    Icone: Shirt
  },
  {
    id: "calca",
    nome: "Calças e Saias",
    Icone: null
  },
  {
    id: "calcado",
    nome: "Calçados",
    Icone: Footprints
  }
];

function IconeCalca() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12l2 18h-6l-2-10-2 10H4L6 3Z" />
      <path d="M6 7h12" />
    </svg>
  );
}

export default function CategoriasLoja({
  categoriaAtiva = "camiseta",
  onChange
}) {
  return (
    <div className="w-full px-4 pt-3 pb-2">
      <div
        role="group"
        aria-label="Categorias de roupas"
        className="grid w-full grid-cols-3 gap-1.5"
      >
        {categorias.map(({ id, nome, Icone }) => {
          const ativa = categoriaAtiva === id;

          return (
            <button
              key={id}
              type="button"
              aria-label={nome}
              aria-pressed={ativa}
              title={nome}
              onClick={() => onChange?.(id)}
              className={`flex h-[48px] items-center justify-center rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                ativa
                  ? "border-[#F2B653] bg-[#F6BD62] text-white shadow-[0_3px_0_#E5A846]"
                  : "border-[#F8DCA4] bg-[#FFDE9C] text-white"
              }`}
            >
              {Icone ? (
                <Icone
                  size={25}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              ) : (
                <IconeCalca />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
