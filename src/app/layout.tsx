import { Suspense } from "react";
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
        <Suspense
          fallback={
            <div>
              <h1>Loading...</h1>
            </div>
          }
        >
          <main> {children}</main>
        </Suspense>

        <Toaster />
      </body>
    </html>
  );
}
