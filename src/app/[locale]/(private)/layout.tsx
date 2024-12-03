import { Footer } from "@/components/organisms/Footer/Footer";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function PrivateLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = (await params).locale;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex flex-col h-[100vh]">
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Contenuto scrollabile */}
        {children}
      </div>
      {/* Footer fisso in basso */}
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
