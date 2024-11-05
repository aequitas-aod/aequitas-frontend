import { Footer } from "@/components/organisms/Footer/Footer";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { sidebarItems } from "../../../../mocks/sidebar";

export default function PrivateLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const menuItems = sidebarItems.map((item) => ({
    ...item,
    href: `/${locale}/${item.path}`,
  }));

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 p-4 space-x-4">
        <Sidebar menuItems={menuItems} />
        <div className="w-full">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
