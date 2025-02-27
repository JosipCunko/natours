import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import Header from "./_components/Header";
import { UserProvider } from "./_components/UserContext";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Natours | Exciting tours for adventurous",
  description: "Natours's company application for future guests. ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <UserProvider>
          <Header />
          {children}
          <footer className="footer">
            <div className="footer__logo">
              <img src="/img/logo-green.png" alt="Natours logo" />
            </div>
            <ul className="footer__nav">
              <li>
                <Link href="#">About us</Link>
              </li>
              <li>
                <Link href="#">Download apps</Link>
              </li>
              <li>
                <Link href="#">Become a guide</Link>
              </li>
              <li>
                <Link href="#">Careers</Link>
              </li>
              <li>
                <Link href="#">Contact</Link>
              </li>
            </ul>
            <p className="footer__copyright">
              &copy; by Jonas Schmedtmann. All rights reserved.
            </p>
          </footer>
        </UserProvider>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
            },
          }}
        />
      </body>
    </html>
  );
}
