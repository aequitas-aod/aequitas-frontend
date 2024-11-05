import { Footer } from "@/components/organisms/Footer/Footer";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";

export default function PrivateLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const menuItems = [
    {
      id: 1,
      name: "Dataset Choice",
      path: `/${locale}/dataset-choice`,
      longDescription:
        "This section allows you to choose different datasets for analysis.",
    },
    {
      id: 2,
      name: "Dataset View",
      path: `/${locale}/dataset-view`,
      longDescription:
        "Here you can view the details and structure of your chosen dataset.",
    },
    {
      id: 3,
      name: "Feature View",
      path: `/${locale}/feature-view`,
      longDescription:
        "This section provides an overview of the features within your dataset.",
    },
    {
      id: 4,
      name: "Dependencies",
      path: `/${locale}/dependencies`,
      longDescription:
        "View and manage dependencies between different components in your workflow.",
    },
    {
      id: 5,
      name: "Detection",
      path: `/${locale}/detection`,
      longDescription:
        "This section is used to detect issues or anomalies in your data.",
    },
    {
      id: 6,
      name: "Data mitigation",
      path: `/${locale}/data-mitigation`,
      longDescription:
        "Apply strategies to mitigate data issues and improve data quality.",
    },
  ];

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
