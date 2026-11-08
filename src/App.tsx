import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import MultichainExplorer from "./pages/MultichainExplorer";
import ChainDetail from "./pages/ChainDetail";

function App() {
  const action = useNavigationType();
  const { pathname } = useLocation();

  useEffect(() => { if (action !== "POP") window.scrollTo(0, 0); }, [action, pathname]);
  useEffect(() => {
    document.title = "Octo — Multichain Explorer";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Explore multichain activity with Octo.");
  }, [pathname]);

  return <Routes><Route path="/" element={<MultichainExplorer />} /><Route path="/chain/:slug" element={<ChainDetail />} /></Routes>;
}

export default App;
