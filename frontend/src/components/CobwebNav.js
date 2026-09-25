import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DROPS } from "@/utils/webGeometry";

const HOME_ITEM = { id: "home", label: "Home" };

export const CobwebNav = ({ currentView, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);
  const activeView = currentView === "blog-post" ? "blog" : currentView;

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsidePointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const items = [HOME_ITEM, ...DROPS];

  return (
    <div
      ref={rootRef}
      className="fixed right-6 top-6 z-[70] md:right-10 md:top-8"
      data-testid="cobweb-navigation"
    >
      <button
        ref={toggleRef}
        type="button"
        className="site-nav-trigger"
        aria-label={open ? "Close site navigation" : "Open site navigation"}
        aria-expanded={open}
        aria-controls={open ? "site-navigation-panel" : undefined}
        data-testid="cobweb-navigation-toggle"
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.25"
        >
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14m0-14.14L4.93 19.07" />
          <path d="M7 5.2a9 9 0 0 0 0 13.6m10-13.6a9 9 0 0 1 0 13.6M3.5 9.5a9 9 0 0 0 17 0m-17 5a9 9 0 0 1 17 0" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
        <span>Explore</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="site-navigation-panel"
            aria-label="Site navigation"
            className="site-nav-panel"
            data-testid="cobweb-navigation-panel"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <p className="site-nav-heading">Follow the web</p>
            <ul className="site-nav-list">
              {items.map(({ id, label }) => {
                const isActive = activeView === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`site-nav-link${isActive ? " is-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => {
                        setOpen(false);
                        toggleRef.current?.focus();
                        onNavigate(id);
                      }}
                    >
                      <span>{label}</span>
                      {isActive && <span className="site-nav-current">Current</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};
