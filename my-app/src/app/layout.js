
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Lolá - Gamificando a fala",
  description: "Aplicativo web de fonoaudiologia infantil",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.className} min-h-dvh bg-[#f1f3f6] antialiased`}
      >
        <div className="mx-auto flex h-dvh min-h-0 w-full max-w-[430px] flex-col overflow-hidden bg-white">
          <main className="relative min-h-0 w-full flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
