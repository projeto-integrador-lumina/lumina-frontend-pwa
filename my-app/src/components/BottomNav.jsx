
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Store, User, Settings } from "lucide-react";

const BottomNav = ({ activeTab = "home", onSelectTab }) => {
  const router = useRouter();

  const handleNavigation = (tab) => {
    onSelectTab?.(tab);

    if (tab === "settings") {
      router.push("/configuracoes");
    }

    if (tab === "profile") {
      router.push("/perfil");
    }

    if (tab === "shop") {
      router.push("/loja");
    }
  };

  return (
    <nav className="bg-[#F8B140] h-16 w-full flex items-center justify-around px-6">
      <button
        type="button"
        onClick={() => handleNavigation("shop")}
        aria-label="Loja"
        className="p-2 hover:scale-110 transition-transform"
      >
        <Store className="h-7 w-7 text-white" />
      </button>

      <button
        type="button"
        onClick={() => handleNavigation("profile")}
        aria-label="Perfil"
        className="p-2 hover:scale-110 transition-transform"
      >
        <User className="h-7 w-7 text-white" />
      </button>

      <button
        type="button"
        onClick={() => handleNavigation("settings")}
        aria-label="Configurações"
        className="p-2 hover:scale-110 transition-transform"
      >
        <Settings className="h-7 w-7 text-white" />
      </button>
    </nav>
  );
};

export default BottomNav;
