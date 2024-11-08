import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  return (
    <html lang={locale}>
      <body>
        <main> {children}</main>
        <Toaster />
      </body>
    </html>
  );
}
