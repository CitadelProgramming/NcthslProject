import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-[70vh]">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
