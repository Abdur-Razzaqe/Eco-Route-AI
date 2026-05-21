import { AuthProvider } from "@/context/AuthContext";
import "./globals.css"; // আপনার এক্সিসটিং ইম্পোর্টগুলো থাকবে

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
