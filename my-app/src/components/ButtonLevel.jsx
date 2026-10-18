"use client";
import React from "react";
import Star from "@/assets/icons/star.svg";

const ButtonLevel = ({ children, onStart }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="flex gap-3">
        <img src={Star.src || Star} alt="Estrela" className="w-5 h-5"></img>
        <img src={Star.src || Star} alt="Estrela"></img>
        <img src={Star.src || Star} alt="Estrela"></img>
      </div>
      <div className="flex justify-center items-center w-20 h-20 md:w-18 md:h-18 border-6 border-secondary rounded-full bg-[#97E8E5] shadow-lg">
        <p className="text-white font-bold text-2xl">{children}</p>
      </div>
    </div>
  );
};

export default ButtonLevel;
