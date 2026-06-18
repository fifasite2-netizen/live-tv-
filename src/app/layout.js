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
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function kick() {
                  window.location.replace('about:blank');
                }
                
                // 1. Check window size difference (docked DevTools)
                function check() {
                  var threshold = 160;
                  if (
                    (window.outerWidth - window.innerWidth > threshold) || 
                    (window.outerHeight - window.innerHeight > threshold)
                  ) {
                    kick();
                  }
                }
                check();
                window.addEventListener('resize', check);

                // 2. Debugger check loop (halts execution if DevTools open)
                var debugInterval = setInterval(function() {
                  var start = performance.now();
                  debugger;
                  var end = performance.now();
                  if (end - start > 100) {
                    kick();
                  }
                }, 500);

                // 3. Console getter check (evaluates when DevTools formats logged elements)
                var element = new Image();
                Object.defineProperty(element, 'id', {
                  get: function() {
                    kick();
                  }
                });
                var consoleInterval = setInterval(function() {
                  console.log(element);
                  console.clear();
                }, 500);

                // 4. Keyboard Shortcuts
                window.addEventListener('keydown', function(e) {
                  if (
                    e.keyCode === 123 || 
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
                    (e.ctrlKey && e.keyCode === 85)
                  ) {
                    e.preventDefault();
                    kick();
                  }
                });

                // 5. Right Click context menu
                window.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
                });
              })();
            `,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
