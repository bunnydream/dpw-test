import { Space_Grotesk, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ['latin'],
  variable: '--font-atkinson',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

export const metadata = {
  title: 'Digital Public Works',
  description: 'The nonprofit alternative for income verification. Open source. At cost. No vendor lock-in.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${atkinsonHyperlegible.variable}`}>
      <body>{children}</body>
    </html>
  );
}
