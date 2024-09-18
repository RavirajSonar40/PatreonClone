import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Get Me a Vadapavvv",
  description: "You can buy me a vadapav",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]`}>
        <SessionWrapper>
          <Navbar />
          <div className="min-h-screen relative text-white">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
            <div className="relative z-50">{children}</div>
          </div>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
