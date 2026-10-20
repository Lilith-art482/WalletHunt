import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { GlossaryDialog } from "@/components/glossary-dialog";
import { GuideDialog } from "@/components/guide-dialog";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Wallet Hunt — Solana wallets & devs",
  description:
    "Find Solana wallets to copy and devs whose launches are worth sniping. Save your favorites in folders and export them to .txt.",
  applicationName: "Wallet Hunt",
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark light",
};

const themeScript = `(function(){try{var theme=localStorage.getItem("wallet-hunt:theme");if(theme==="light"){document.documentElement.dataset.theme="light";document.documentElement.style.colorScheme="light";}}catch(error){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          <SiteHeader />
          {children}
          <GuideDialog />
          <GlossaryDialog />
        </Providers>
      </body>
    </html>
  );
}
