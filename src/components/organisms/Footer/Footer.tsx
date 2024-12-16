import { AequitasLogoImage } from "@/components/contents/images";

const ApiUrlInfo = () => {
  return (
    <span>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || "not set"}</span>
  );
};

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white text-center py-2 px-12">
      <AequitasLogoImage maxW="sm" hFull={false} />
      <ApiUrlInfo />
    </footer>
  );
};
