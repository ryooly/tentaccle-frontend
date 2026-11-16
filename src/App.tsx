import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import MultichainExplorer from "./pages/MultichainExplorer";
import ChainDetail from "./pages/ChainDetail";
import MobileWarning from "./components/MobileWarning";

function App() {
  const action = useNavigationType();
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 825px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => { if (action !== "POP") window.scrollTo(0, 0); }, [action, pathname]);
  useEffect(() => {
    document.title = "Tentaccle — Multichain Explorer";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Explore multichain activity with Tentaccle.");
  }, [pathname]);

  if (isMobile) {
    return <MobileWarning />;
  }

  return <Routes><Route path="/" element={<MultichainExplorer />} /><Route path="/chain/:slug" element={<ChainDetail />} /></Routes>;
}

export default App;
