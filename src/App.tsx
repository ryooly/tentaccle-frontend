import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import MultichainExplorer from "./pages/MultichainExplorer";
import ChainDetail from "./pages/ChainDetail";
import DocsPage from "./pages/DocsPage";
import AboutDevsPage from "./pages/AboutDevsPage";
import MobileWarning from "./components/MobileWarning";
import { scrollToElement } from "./tentacleMotion";

function App() {
  const action = useNavigationType();
  const { pathname, hash } = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 825px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const id = hash.replace("#", "");
    const target = id ? document.getElementById(id) : null;
    if (target) {
      scrollToElement(target, { focus: false });
      return;
    }
    if (action === "POP") return;
    window.scrollTo(0, 0);
  }, [action, pathname, hash]);
  useEffect(() => {
    const title =
      pathname === "/docs"
        ? "Tentaccle — Docs"
        : pathname === "/about"
          ? "Tentaccle — About Devs"
          : "Tentaccle — Multichain Explorer";
    const description =
      pathname === "/docs"
        ? "How to use the Tentaccle multichain explorer."
        : pathname === "/about"
          ? "The studio behind Tentaccle, the multichain gas explorer."
          : "Explore multichain activity with Tentaccle.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [pathname]);

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <Routes>
      <Route path="/" element={<MultichainExplorer />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/about" element={<AboutDevsPage />} />
      <Route path="/chain/:slug" element={<ChainDetail />} />
    </Routes>
  );
}

export default App;
