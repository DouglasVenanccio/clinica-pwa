"use client";

import { useState, useEffect } from "react";

/**
 * Hook personalizado para detectar media queries.
 * Util para layouts responsivos.
 *
 * @param query - Media query CSS (ex: "(min-width: 768px)")
 * @returns boolean indicando se a media query corresponde
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)");
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Verifica se esta no navegador (SSR)
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Define o valor inicial
    setMatches(mediaQuery.matches);

    // Listener para mudancas
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adiciona o listener
    mediaQuery.addEventListener("change", handleChange);

    // Remove o listener ao desmontar
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hook para detectar se a tela e mobile.
 * Utiliza a media query padrao de 768px.
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

/**
 * Hook para detectar se a tela e tablet.
 * Utiliza media queries entre 768px e 1024px.
 */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
}

/**
 * Hook para detectar se a tela e desktop.
 * Utiliza a media query padrao de 1024px.
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
