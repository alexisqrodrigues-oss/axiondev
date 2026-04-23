import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container py-10 md:py-14 animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
