"use client";

import { useEffect, useLayoutEffect } from "react";

// Scroll reveals for the homepage, and nothing else.
//
// One IntersectionObserver for every target rather than a scroll listener per
// card. Nothing here reads or writes markup: the page marks what to reveal
// with two attributes and this finds them, so EntryCard keeps its own shape
// and /browse is untouched by any of it.
//
//   [data-reveal]            one block, revealed as a unit
//   [data-reveal-group] > *  children, staggered across each visual row
//
// The stagger is read off the live grid rather than hardcoded, so it follows
// the breakpoints instead of duplicating them: three columns on desktop
// staggers a row of three, two columns staggers a row of two, and one column
// gives every card a delay of zero, which is what makes a phone reveal cards
// one at a time as they arrive instead of holding them back in threes.
const STAGGER_MS = 80;

// Reveals start this far below the fold, so a row has already begun settling
// by the time it reaches the viewport instead of being caught blank and then
// animating. Measured: with the old negative bottom margin plus a 0.2
// threshold, a card was ~194px on screen before it so much as started, and
// ~674px on a fast scroll. Expanding the root downwards is what fixes that;
// the threshold goes to 0 so any pixel crossing the expanded edge counts.
const PRELOAD_PX = 200;

const SELECTOR = "[data-reveal], [data-reveal-group] > *";

// The hidden state is painted from the server HTML (see the bootstrap script
// in app/page.js), so on a fresh load there is nothing to do before paint.
// This only matters on a client-side navigation into the homepage, where the
// inline script does not re-run — a layout effect gets the class on before the
// browser paints, so the content never flashes in and then hides itself.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// `columnCache` is per callback batch: a row of three arrives in one batch, and
// without it the column count would be read back from style between the writes
// to each card, interleaving reads and writes for no reason.
function staggerFor(element, columnCache) {
  const group = element.parentElement;
  if (!group || !group.hasAttribute("data-reveal-group")) return 0;

  let columns = columnCache.get(group);
  if (columns === undefined) {
    columns =
      getComputedStyle(group)
        .gridTemplateColumns.split(" ")
        .filter(Boolean).length || 1;
    columnCache.set(group, columns);
  }

  const index = Array.prototype.indexOf.call(group.children, element);

  return (index % columns) * STAGGER_MS;
}

export default function Reveal() {
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");

    const show = (element, delay) => {
      element.style.setProperty("--reveal-delay", `${delay}ms`);
      element.classList.add("is-revealed");
    };

    // Someone who has asked for less motion, or a browser without the
    // observer, gets the finished state immediately rather than content that
    // never arrives.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Sprint 1 could sweep the document once and be finished, because the six
    // homepage cards were compiled into the page. They come from a Supabase
    // query now, which resolves after this effect has already run — the cards
    // simply are not in the document yet at first sweep. Anything that arrives
    // later and is never picked up keeps the hidden state .js-reveal gives it,
    // permanently. So the sweep repeats whenever the page gains nodes.
    let sweep;
    let cleanUpObserver;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      sweep = () => {
        for (const element of document.querySelectorAll(SELECTOR)) {
          show(element, 0);
        }
      };
      cleanUpObserver = () => {};
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          const columnCache = new Map();
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            show(entry.target, staggerFor(entry.target, columnCache));
            // Once only: scrolling back up and down again must not replay it.
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0, rootMargin: `0px 0px ${PRELOAD_PX}px 0px` }
      );

      // Observing the same element twice is harmless, but the WeakSet keeps
      // each repeat sweep to the nodes it has not already handed over.
      const claimed = new WeakSet();
      sweep = () => {
        for (const element of document.querySelectorAll(SELECTOR)) {
          if (claimed.has(element)) continue;
          claimed.add(element);
          observer.observe(element);
        }
      };
      cleanUpObserver = () => observer.disconnect();
    }

    sweep();

    const mutations = new MutationObserver(sweep);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      cleanUpObserver();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
