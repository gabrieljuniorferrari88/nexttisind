import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let scrollToTarget: ((target: string) => void) | null = null;

export function scrollTo(target: string) {
  if (scrollToTarget) {
    scrollToTarget(target);
    return;
  }

  document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function mountMotion(root: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hero = root.querySelector<HTMLElement>(".hero");
  const heroWord = root.querySelector<HTMLElement>("[data-hero-word]");
  const heroRule = root.querySelector<HTMLElement>("[data-hero-rule]");
  const heroShine = root.querySelector<HTMLElement>("[data-hero-shine]");
  const glow = root.querySelector<HTMLElement>("[data-glow]");
  const mark = root.querySelector<HTMLElement>("[data-hero-tilt]");
  const chevrons = gsap.utils.toArray<HTMLElement>("[data-chevron]");
  const restLetters = gsap.utils.toArray<HTMLElement>("[data-rest-letter]");
  const cursor = root.querySelector<HTMLElement>("[data-cursor]");
  const closeSpotlight = root.querySelector<HTMLElement>("[data-close-spotlight]");
  const marqueeA = root.querySelector<HTMLElement>("[data-marquee-a]");
  const marqueeB = root.querySelector<HTMLElement>("[data-marquee-b]");
  const marqueeStack = root.querySelector<HTMLElement>("[data-marquee]");

  root.classList.add("is-ready");

  const heroRest = root.querySelector<HTMLElement>("[data-hero-rest]");
  const heroNEl = root.querySelector<HTMLElement>("[data-hero-n]");
  const heroSizer = root.querySelector<HTMLElement>(".hero-sizer");
  let wordOpen = false;
  let wordTween: gsap.core.Timeline | null = null;

  const measureRuleWidth = (open: boolean) => {
    if (open && heroSizer) {
      return Math.max(heroSizer.getBoundingClientRect().width, 120);
    }
    if (heroNEl) {
      return Math.max(heroNEl.getBoundingClientRect().width * 0.95, 48);
    }
    return 56;
  };

  // Estado inicial: linha curta sob o N
  requestAnimationFrame(() => {
    if (heroRule) gsap.set(heroRule, { width: measureRuleWidth(false) });
  });
  if (heroRest) gsap.set(heroRest, { maxWidth: 0, overflow: "hidden" });
  gsap.set(restLetters, { yPercent: 115, opacity: 0 });

  const setWord = (open: boolean) => {
    if (wordOpen === open) return;
    wordOpen = open;
    hero?.classList.toggle("is-open", open);
    heroWord?.setAttribute("aria-expanded", open ? "true" : "false");

    const duration = open ? 0.75 : 0.5;
    const restWidth =
      heroSizer && heroNEl
        ? Math.max(heroSizer.getBoundingClientRect().width - heroNEl.getBoundingClientRect().width + 12, 160)
        : 260;

    wordTween?.kill();
    wordTween = gsap.timeline({ defaults: { ease: "power3.out", duration } });

    // Palavra e linha andam juntas, no mesmo tempo
    if (heroRest) {
      wordTween.to(heroRest, { maxWidth: open ? restWidth : 0 }, 0);
    }

    wordTween.to(
      restLetters,
      {
        yPercent: open ? 0 : 115,
        opacity: open ? 1 : 0,
        stagger: open ? 0.04 : 0.02,
      },
      0,
    );

    if (heroRule) {
      wordTween.to(heroRule, { width: measureRuleWidth(open), ease: "power3.inOut" }, 0);
    }

    if (heroShine && open) {
      wordTween.fromTo(
        heroShine,
        { xPercent: -120, opacity: 0 },
        { xPercent: 140, opacity: 0.65, duration: 0.75, ease: "power2.out" },
        0.1,
      );
    }

    if (glow && !reduce) {
      wordTween.to(
        glow,
        {
          scale: open ? 1.28 : 1,
          opacity: open ? 1 : 0.72,
        },
        0,
      );
    }

    if (!reduce) {
      chevrons.forEach((chevron, index) => {
        wordTween?.to(
          chevron,
          {
            z: open ? 24 + index * 18 : 0,
            scale: open ? 1 + index * 0.03 : 1,
          },
          0,
        );
      });
    }
  };

  const onWordEnter = () => setWord(true);
  const onWordLeave = () => setWord(false);
  const onWordClick = (event: Event) => {
    event.preventDefault();
    setWord(!wordOpen);
  };

  // Sempre liga hover/click — inclusive com "reduzir movimento" do Windows
  heroWord?.addEventListener("mouseenter", onWordEnter);
  heroWord?.addEventListener("mouseleave", onWordLeave);
  heroWord?.addEventListener("pointerenter", onWordEnter);
  heroWord?.addEventListener("pointerleave", onWordLeave);
  heroWord?.addEventListener("focus", onWordEnter);
  heroWord?.addEventListener("blur", onWordLeave);
  heroWord?.addEventListener("click", onWordClick);

  if (!finePointer && hero) {
    const demo = gsap.timeline({ delay: 1 });
    demo.call(() => setWord(true)).to({}, { duration: 1.4 }).call(() => setWord(false));
  }

  if (reduce) {
    scrollToTarget = (target) => {
      document.querySelector(target)?.scrollIntoView({ block: "start" });
    };
    return () => {
      heroWord?.removeEventListener("mouseenter", onWordEnter);
      heroWord?.removeEventListener("mouseleave", onWordLeave);
      heroWord?.removeEventListener("pointerenter", onWordEnter);
      heroWord?.removeEventListener("pointerleave", onWordLeave);
      heroWord?.removeEventListener("focus", onWordEnter);
      heroWord?.removeEventListener("blur", onWordLeave);
      heroWord?.removeEventListener("click", onWordClick);
      wordTween?.kill();
      scrollToTarget = null;
    };
  }

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
  });

  scrollToTarget = (target) => {
    lenis.scrollTo(target, { offset: -8 });
  };

  const progress = root.querySelector<HTMLElement>("[data-progress]");
  const header = root.querySelector<HTMLElement>("[data-header]");

  let marqueeVelocity = 1;
  let marqueeSkew = 0;

  lenis.on("scroll", ({ velocity }) => {
    ScrollTrigger.update();
    if (progress) gsap.set(progress, { scaleX: lenis.progress });
    header?.classList.toggle("is-scrolled", lenis.scroll > 20);

    const speed = Math.max(-2.8, Math.min(2.8, velocity / 18));
    marqueeVelocity += (1 + Math.abs(speed) * 1.6 - marqueeVelocity) * 0.12;
    marqueeSkew += (speed * 4.5 - marqueeSkew) * 0.12;
  });

  const ticker = (time: number) => {
    lenis.raf(time * 1000);

    if (marqueeA) {
      const current = Number(marqueeA.dataset.x || 0);
      const next = current - 0.45 * marqueeVelocity;
      const wrapped = ((next % 50) + 50) % 50;
      marqueeA.dataset.x = String(wrapped);
      marqueeA.style.transform = `translate3d(${-wrapped}%, 0, 0) skewX(${marqueeSkew}deg)`;
    }

    if (marqueeB) {
      const current = Number(marqueeB.dataset.x || 0);
      const next = current + 0.28 * marqueeVelocity;
      const wrapped = ((next % 50) + 50) % 50;
      marqueeB.dataset.x = String(wrapped);
      marqueeB.style.transform = `translate3d(${-50 + wrapped}%, 0, 0) skewX(${-marqueeSkew * 0.7}deg)`;
    }

    marqueeVelocity += (1 - marqueeVelocity) * 0.03;
    marqueeSkew += (0 - marqueeSkew) * 0.05;
  };

  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  const context = gsap.context(() => {
    gsap.to("[data-hero-mark]", {
      y: 120,
      scale: 0.9,
      opacity: 0.18,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to("[data-hero-copy]", {
      y: 64,
      opacity: 0.28,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.utils.toArray<HTMLElement>("[data-section-rule] span").forEach((line) => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: line.parentElement,
            start: "top 88%",
            end: "top 55%",
            scrub: true,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
      if (panel.id === "empresa") return;

      const body = panel.querySelector<HTMLElement>(".panel-body");
      if (!body) return;

      gsap.fromTo(
        body,
        { y: 56 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top 92%",
            end: "top 45%",
            scrub: true,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
      if (element.closest("#empresa")) return;
      const distance = Number(element.dataset.parallax || "-28");
      gsap.fromTo(
        element,
        { y: distance * -0.35 },
        {
          y: distance,
          ease: "none",
          scrollTrigger: {
            trigger: element.parentElement || element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((element) => {
      gsap.to(element, {
        y: 0,
        opacity: 1,
        duration: 1.05,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 86%",
        },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-split]").forEach((heading) => {
      gsap.to(heading.querySelectorAll(".word"), {
        y: 0,
        duration: 0.95,
        stagger: 0.035,
        ease: "power4.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 88%",
        },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-slide]").forEach((element, index) => {
      gsap.from(element, {
        x: index % 2 === 0 ? -40 : 40,
        y: 28,
        opacity: 0,
        duration: 0.95,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
        },
      });
    });

    const path = root.querySelector<HTMLElement>("[data-path]");
    const pathFill = root.querySelector<HTMLElement>("[data-path-fill]");
    const stepsEls = gsap.utils.toArray<HTMLElement>("[data-step]");

    if (path && pathFill && stepsEls.length) {
      gsap.fromTo(
        pathFill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: path,
            start: "top 70%",
            end: "bottom 35%",
            scrub: true,
          },
        },
      );

      stepsEls.forEach((step) => {
        const strokes = step.querySelectorAll<SVGPathElement | SVGCircleElement>(".glyph-stroke");

        strokes.forEach((stroke) => {
          const length = "getTotalLength" in stroke ? stroke.getTotalLength() : 120;
          gsap.set(stroke, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        });

        ScrollTrigger.create({
          trigger: step,
          start: "top 72%",
          end: "bottom 42%",
          onEnter: () => step.classList.add("is-active"),
          onEnterBack: () => step.classList.add("is-active"),
          onLeave: () => step.classList.remove("is-active"),
          onLeaveBack: () => step.classList.remove("is-active"),
          onToggle: (self) => {
            if (self.isActive) {
              gsap.to(strokes, {
                strokeDashoffset: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: "power2.out",
              });
            } else {
              gsap.to(strokes, {
                strokeDashoffset: (_i, target) => {
                  const el = target as SVGPathElement;
                  return "getTotalLength" in el ? el.getTotalLength() : 120;
                },
                duration: 0.45,
                ease: "power2.in",
              });
            }
          },
        });

        if (finePointer) {
          step.addEventListener("pointerenter", () => step.classList.add("is-hot"));
          step.addEventListener("pointerleave", () => step.classList.remove("is-hot"));
        }
      });
    }

    const closeWords = gsap.utils.toArray<HTMLElement>("[data-close-word]");
    if (closeWords.length) {
      gsap.set(closeWords, { opacity: 0.18 });
      gsap.to(closeWords, {
        opacity: 1,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-close-line]",
          start: "top 78%",
          end: "top 32%",
          scrub: true,
        },
      });
    }
  }, root);

  if (marqueeStack && finePointer) {
    marqueeStack.addEventListener("pointerenter", () => {
      marqueeVelocity = 0.35;
    });
    marqueeStack.addEventListener("pointerleave", () => {
      marqueeVelocity = 1;
    });
  }

  const magnetX = heroNEl ? gsap.quickTo(heroNEl, "x", { duration: 0.45, ease: "power3.out" }) : null;
  const magnetY = heroNEl ? gsap.quickTo(heroNEl, "y", { duration: 0.45, ease: "power3.out" }) : null;
  const tiltX = mark ? gsap.quickTo(mark, "rotateY", { duration: 0.85, ease: "power3.out" }) : null;
  const tiltY = mark ? gsap.quickTo(mark, "rotateX", { duration: 0.85, ease: "power3.out" }) : null;
  const shifts = chevrons.map((chevron, index) => ({
    x: gsap.quickTo(chevron, "x", { duration: 0.65 + index * 0.15, ease: "power3.out" }),
    y: gsap.quickTo(chevron, "y", { duration: 0.75 + index * 0.14, ease: "power3.out" }),
  }));
  const spotX = closeSpotlight
    ? gsap.quickTo(closeSpotlight, "x", { duration: 0.75, ease: "power3.out" })
    : null;
  const spotY = closeSpotlight
    ? gsap.quickTo(closeSpotlight, "y", { duration: 0.75, ease: "power3.out" })
    : null;

  let pointerX = window.innerWidth * 0.62;
  let pointerY = window.innerHeight * 0.45;
  let cursorX = pointerX;
  let cursorY = pointerY;
  let hot = false;
  let frame = 0;

  const onMove = (event: MouseEvent) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    root.classList.add("has-pointer");

    if (!finePointer) return;

    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;
    const openBoost = wordOpen ? 1.35 : 1;
    tiltX?.(nx * 14 * openBoost);
    tiltY?.(-ny * 9 * openBoost);
    shifts.forEach((shift, index) => {
      const depth = (index + 1) * openBoost;
      shift.x(nx * 24 * depth);
      shift.y(ny * 12 * depth);
    });

    if (glow) {
      glow.style.transform = `translate3d(${event.clientX - window.innerWidth * 0.72}px, ${event.clientY - window.innerHeight * 0.5}px, 0)`;
    }

    if (closeSpotlight && spotX && spotY) {
      const close = root.querySelector<HTMLElement>("[data-close]");
      if (close) {
        const rect = close.getBoundingClientRect();
        if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
          spotX(event.clientX - rect.left);
          spotY(event.clientY - rect.top);
        }
      }
    }

    if (heroWord && magnetX && magnetY) {
      const rect = heroWord.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.18;
      const cy = rect.top + rect.height * 0.55;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 140) {
        const strength = (1 - dist / 140) * 10;
        magnetX((dx / 140) * strength);
        magnetY((dy / 140) * strength);
      } else {
        magnetX(0);
        magnetY(0);
      }
    }

    const target = event.target instanceof Element ? event.target : null;
    hot = Boolean(target?.closest("a, button, .hero-word, .step, .marquee-stack"));
  };

  const onLeave = () => {
    root.classList.remove("has-pointer");
    tiltX?.(0);
    tiltY?.(0);
    magnetX?.(0);
    magnetY?.(0);
    shifts.forEach((shift) => {
      shift.x(0);
      shift.y(0);
    });
  };

  const drawCursor = () => {
    cursorX += (pointerX - cursorX) * 0.2;
    cursorY += (pointerY - cursorY) * 0.2;
    if (cursor) {
      const scale = hot ? 2.8 : 1;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(${scale})`;
    }
    frame = window.requestAnimationFrame(drawCursor);
  };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseleave", onLeave);
  if (finePointer) frame = window.requestAnimationFrame(drawCursor);

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseleave", onLeave);
    heroWord?.removeEventListener("mouseenter", onWordEnter);
    heroWord?.removeEventListener("mouseleave", onWordLeave);
    heroWord?.removeEventListener("pointerenter", onWordEnter);
    heroWord?.removeEventListener("pointerleave", onWordLeave);
    heroWord?.removeEventListener("focus", onWordEnter);
    heroWord?.removeEventListener("blur", onWordLeave);
    heroWord?.removeEventListener("click", onWordClick);
    wordTween?.kill();
    context.revert();
    gsap.ticker.remove(ticker);
    lenis.destroy();
    scrollToTarget = null;
  };
}
