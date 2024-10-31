import { Footer } from "@/components/Footer";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
