import { Footer } from "@/components/organisms/Footer/Footer";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { sidebarItems } from "../../../../mocks/sidebar";

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
