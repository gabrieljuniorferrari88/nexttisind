import { useEffect, useState } from "react";

const DURATION_MS = 5000;
const TICK_MS = 50;
const STEP = 100 / (DURATION_MS / TICK_MS);

type SplashProps = {
  onDone: () => void;
};

export default function Splash({ onDone }: SplashProps) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    let value = 0;
    let leaveTimer = 0;

    const interval = window.setInterval(() => {
      value = Math.min(100, value + STEP);
      setProgress(value);

      if (value >= 100) {
        window.clearInterval(interval);
        setLeaving(true);
        leaveTimer = window.setTimeout(() => {
          document.documentElement.style.overflow = "";
          onDone();
        }, 700);
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(leaveTimer);
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div className={`splash${leaving ? " is-leaving" : ""}`} aria-busy="true" aria-live="polite">
      <div className="splash-inner">
        <img src="/brand/mark.png" alt="" />
        <div className="splash-title" aria-label="NEXTTI">
          <span className="splash-title-shadow">NEXTTI</span>
          <span className="splash-title-fill" style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}>
            NEXTTI
          </span>
        </div>
        <p className="splash-status">
          Carregando... {Math.round(progress)}%
        </p>
        <div className="splash-bar-track">
          <div className="splash-bar-fill" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>
    </div>
  );
}
