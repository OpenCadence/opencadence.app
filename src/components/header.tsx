"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Code2,
  Infinity,
  LayoutGrid,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { GitHubLogo } from "@/components/github-logo";

const navigation = [
  { href: "/#workspace", label: "The workspace", icon: LayoutGrid },
  { href: "/#community", label: "Open source", icon: Code2 },
  { href: "/cloud", label: "Cloud", icon: Infinity },
] as const;

export function Header() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const activeHref = pathname === "/cloud" ? "/cloud" : activeSection;

  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    const sections = ["workspace", "community"];
    function syncSection() {
      frame = 0;
      // Read just below the sticky header. Each section stays active until
      // the next linked section reaches this line, without rewriting the URL.
      const threshold =
        (headerRef.current?.getBoundingClientRect().bottom ?? 0) + 32;
      let current = "";
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold) {
          current = `/#${id}`;
        }
      }
      setActiveSection(current);
    }
    function scheduleSync() {
      if (!frame) frame = requestAnimationFrame(syncSection);
    }
    syncSection();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    const observer = new ResizeObserver(scheduleSync);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/cloud") return;
    // Next's automatic scrolling can align the main content below the sticky
    // header instead of returning to the document's actual top.
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function closeOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      )
        setOpen(false);
    }
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  function navigate() {
    setOpen(false);
  }

  return (
    <header ref={headerRef} className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          aria-label="OpenCadence home"
          className="logo-link"
          onClick={navigate}
        >
          <img
            src="/brand/logo-horizontal-primary.svg"
            alt="OpenCadence"
            width="198"
            height="52"
          />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavigationLinks activeHref={activeHref} onNavigate={navigate} />
        </nav>
        <a className="header-github" href={site.github}>
          <GitHubLogo size={18} /> View on GitHub{" "}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <button
          ref={toggleRef}
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          <NavigationLinks activeHref={activeHref} onNavigate={navigate} />
          <a
            className="mobile-github"
            href={site.github}
            onClick={() => setOpen(false)}
          >
            <GitHubLogo size={19} /> View on GitHub{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </nav>
      )}
    </header>
  );
}

function NavigationLinks({
  activeHref,
  onNavigate,
}: {
  activeHref: string;
  onNavigate: (href: string) => void;
}) {
  return navigation.map(({ href, label, icon: Icon }) => (
    <Link
      key={href}
      href={href}
      aria-current={
        activeHref === href
          ? href === "/cloud"
            ? "page"
            : "location"
          : undefined
      }
      onClick={() => onNavigate(href)}
    >
      <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
      {label}
      {href === "/cloud" && <span className="nav-soon">Soon</span>}
    </Link>
  ));
}
