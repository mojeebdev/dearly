import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Dearly — Beautiful Personal Greetings",
  description:
    "Craft AI-powered, personalized greeting pages for the people you love.",   
 metadataBase: new URL("https://dearly.icu"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-guardian-cream text-guardian-deep">
        {children}
      </body>
    </html>
  );
}