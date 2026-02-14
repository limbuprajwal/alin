import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [showCard, setShowCard] = useState(false);
  const [pausedAtMid, setPausedAtMid] = useState(false);
  const [confettiOn, setConfettiOn] = useState(false);
  const [showValentineMsg, setShowValentineMsg] = useState(false);

  // Yes grows when No is clicked
  const [yesScale, setYesScale] = useState(1);

  const confettiTimer = useRef(null);

  const confettiPieces = useMemo(() => {
    const count = 90;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
      duration: 1.4 + Math.random() * 0.9,
      rotate: Math.floor(Math.random() * 360),
      drift: (Math.random() * 2 - 1) * 120,
    }));
  }, []);

  // Pause video exactly at 8 seconds
  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v) return;

    const targetTime = 8;

    if (!pausedAtMid && v.currentTime >= targetTime) {
      v.currentTime = targetTime; // snap exactly to 8.000
      v.pause();
      setPausedAtMid(true);
      setShowCard(true);
    }
  }

  function handleNo() {
    setYesScale((prev) => {
      const next = prev + 0.15;
      return next > 2.2 ? 2.2 : next; // cap max
    });
  }

  async function handleYes() {
    setShowCard(false);
    setShowValentineMsg(true);

    // Confetti burst
    setConfettiOn(true);
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    confettiTimer.current = setTimeout(() => setConfettiOn(false), 2200);

    // Resume video
    const v = videoRef.current;
    if (v) {
      try {
        await v.play();
      } catch {}
    }
  }

  // Background music (autoplay-safe)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.muted = true;

    const start = async () => {
      try {
        await audio.play();
        audio.currentTime = 3; // start from 3s
        audio.muted = false;
      } catch {
        const resume = async () => {
          try {
            await audio.play();
            audio.currentTime = 3;
            audio.muted = false;
          } catch {}
        };
        window.addEventListener("pointerdown", resume, { once: true });
      }
    };

    start();

    return () => {
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
    };
  }, []);

  return (
    <div className="page">
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {showValentineMsg && (
        <div className="valentineBanner">
          <div className="bannerLine1">Happy Valentine’s Day, mayaa 💖</div>
          <div className="bannerLine2">I’ve never felt this loved before.</div>
          <div className="bannerLine3">You are my everything.</div>
        </div>
      )}

      <div className="frame">
        <div className="videoWrap">
          <video
            ref={videoRef}
            className="video"
            src="/intro.mp4"
            autoPlay
            playsInline
            muted
            onTimeUpdate={handleTimeUpdate}
          />
        </div>

        {confettiOn && (
          <div className="confetti" aria-hidden>
            {confettiPieces.map((p) => (
              <span
                key={p.id}
                className="confettiPiece"
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  transform: `rotate(${p.rotate}deg)`,
                  "--drift": `${p.drift}px`,
                }}
              />
            ))}
          </div>
        )}

        <div className="cardSlot">
          {showCard && (
            <div className="card">
              <div className="title">Prerna, will you be my Valentine?</div>
              <div className="mini">💗</div>

              <div className="btnRow">
                <button
                  className="btn yes"
                  onClick={handleYes}
                  style={{ transform: `scale(${yesScale})` }}
                >
                  Yes
                </button>

                <button className="btn no" type="button" onClick={handleNo}>
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}