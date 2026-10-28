import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "ARCHIVE — Sell your unused accounts",
  description:
    "ARCHIVE is a marketplace where sellers list unused social media, gaming and marketplace accounts and buyers pay by card or crypto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-black">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Toaster position="top-right" />
        <Footer />
      </body>
    </html>
  );
}
