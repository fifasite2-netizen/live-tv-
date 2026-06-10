import { Space_Grotesk } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Ajker Khela',
  description: 'FIFA World Cup Streaming App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className={spaceGrotesk.className}>
        <Navbar />
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
