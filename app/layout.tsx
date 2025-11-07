import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MRM Method Builder – GC-MS/MS (QQQ) Transition Generator for Pesticides & Environmental Analytes',
  description: 'One-click generation of GC-MS/MS methods with RT prediction and CE optimization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
