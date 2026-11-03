
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import SplashScreen from "@/components/SplashScreen";
import BgIndex from "@/assets/background-index.svg";
import Lola from "@/assets/lola-2.svg";
import Button from "@/components/Button";

export default function RootPage() {
  const [splash, setSplash] = useState(true);

  return (
    <main className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-[#F0E7E1]">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden">
        <Image
          src={BgIndex}
          alt="Cenário da Lolá"
          fill
          priority
          className="object-cover object-center"
        />

        {!splash && (
          <>
            <div className="pointer-events-none absolute left-[47%] top-[69%] md:top-[78%] z-10 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.7,
                  y: 25
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 14,
                  delay: 0.2
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -4, 0],
                    rotate: [-1, 1, -1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src={Lola}
                    alt="Avatar da Lolá"
                    width={100}
                    height={130}
                    priority
                    className="h-auto w-[90px] sm:w-[100px]"
                  />
                </motion.div>
              </motion.div>
            </div>

            <div className="absolute bottom-[7%] md:bottom-[3%]  left-1/2 z-20 w-max -translate-x-1/2">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 30
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.6,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link href="/login">
                  <Button className="w-50">
                    Fazer login
                  </Button>
                </Link>
              </motion.div>
            </div>
          </>
        )}

        {splash && (
          <SplashScreen
            onFinish={() => setSplash(false)}
          />
        )}
      </div>
    </main>
  );
}
