"use client";
import React from "react";
import BgFases from "@/assets/bg-fases.svg";
import AvatarNatasha from "@/assets/avatar-natasha.svg";
import ButtonLevel from "@/components/ButtonLevel";
import Link from "next/link";

const Fases = () => {
  return (
    <div className="relative w-full overflow-hidden h-full bg-[#ACECEA]">
      <div className="relative w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none">
        <img
          src={BgFases.src || BgFases}
          alt="Caminho das fases"
          className="w-full h-auto object-cover object-top"
        />

        <div className="absolute w-full top-[20%] md:top-[30%] flex flex-col">
            <div className="flex justify-center pl-18">
              <ButtonLevel>1</ButtonLevel>
            </div>
          <div className="flex justify-start pl-20">
            <ButtonLevel>2</ButtonLevel>
          </div>
          <div className="flex justify-center pl-16">
            <ButtonLevel>3</ButtonLevel>
          </div>
          <div className="flex justify-start pl-16">
            <ButtonLevel>4</ButtonLevel>
          </div>
          <div className="flex justify-end pr-18">
            <ButtonLevel>5</ButtonLevel>
          </div>
          <div className="flex justify-center pr-16">
            <ButtonLevel>6</ButtonLevel>
          </div>
          <div className="flex justify-end pr-20">
            <ButtonLevel>7</ButtonLevel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fases;
