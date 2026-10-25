import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Lolá - Gamificando a fala",
  description: "PWA de fonoaudiologia infantil",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full w-full overflow-hidden">
      <body
        className={`${roboto.className} antialiased bg-gray-100 h-full w-full flex items-center justify-center overflow-hidden p-0 md:p-4`}
      >
        
        <div className="w-full h-full md:w-[375px] md:h-[780px] md:max-h-[92vh] bg-white rounded-none md:rounded-[40px] flex flex-col relative shadow-none md:shadow-2xl border-0 md:border-gray-800 overflow-hidden shrink-0">
          
          <main className="flex-1 w-full h-full overflow-hidden relative">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}