"use client";
import React from "react";
import BgFases from "@/assets/bg-fases.svg";
import AvatarNatasha from "@/assets/avatar-natasha.svg";
import ButtonLevel from "@/components/ButtonLevel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Coins from "@/components/Coins";

const Fases = () => {
  return (
    <div className="relative w-full overflow-hidden h-full bg-[#ACECEA]">

      <div className="flex justify-between items-center w-full absolute mt-8 px-4 z-10">
        <Link href="/home">
          <ArrowLeft className="text-white w-10 h-10"></ArrowLeft>
        </Link>
        <div className="flex justify-center items-center gap-4 flex-shrink-0">
          <Coins></Coins>
          <div className="bg-secondary w-14 h-14 rounded-full flex justify-center items-center border-4 border-white shadow-sm">
            <p className="text-2xl font-bold text-white">1</p>
          </div>
        </div>
      </div>

      <div className="relative w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none">
        <img
          src={BgFases.src || BgFases}
          alt="Caminho das fases"
          className="w-full h-auto object-cover object-top"
        />

        <div className="absolute w-full top-[20%] md:top-[30%] flex flex-col">
          <Link href="/fases/jogar/1">
            <div className="flex justify-center pl-18">
              <ButtonLevel>1</ButtonLevel>
            </div>
          </Link>

          <Link href="/fases/jogar/2">
            <div className="flex justify-start pl-20">
              <ButtonLevel>2</ButtonLevel>
            </div>
          </Link>

          <Link href="/fases/jogar/3">
            <div className="flex justify-center pl-16">
              <ButtonLevel>3</ButtonLevel>
            </div>
          </Link>

          <Link href="/fases/jogar/4">
            <div className="flex justify-start pl-16">
              <ButtonLevel>4</ButtonLevel>
            </div>
          </Link>

          <Link href="/fases/jogar/5">
            <div className="flex justify-end pr-18">
              <ButtonLevel>5</ButtonLevel>
            </div>
          </Link>

          <Link href="/fases/jogar/6">
            <div className="flex justify-center pr-16">
              <ButtonLevel>6</ButtonLevel>
            </div>
          </Link>

          <Link href="/fases/jogar/7">
            <div className="flex justify-end pr-20">
              <ButtonLevel>7</ButtonLevel>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Fases;
