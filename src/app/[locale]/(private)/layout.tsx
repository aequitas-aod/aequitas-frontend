import { Footer } from "@/components/organisms/Footer/Footer";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { sidebarItems } from "../../../../mocks/sidebar";
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
  const menuItems = await Promise.all(
    sidebarItems.map(async (item) => ({
      ...item,
      href: `/${(await params).locale}/${item.path}`,
    }))
  );

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
        {/* Sidebar occupa tutta l'altezza disponibile */}
        <Sidebar menuItems={menuItems} />

        {/* Contenuto principale */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Contenuto scrollabile */}
          {children}
        </div>
      </div>
      {/* Footer fisso in basso */}
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
