import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
