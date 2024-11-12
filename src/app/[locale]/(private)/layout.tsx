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
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 p-4 space-x-4 h-screen">
        <Sidebar menuItems={menuItems} />
        <div className="w-full">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
