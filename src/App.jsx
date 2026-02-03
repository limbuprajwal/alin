import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  const videoRef = useRef(null);

  // Show card when video pauses at 5s
  const [showCard, setShowCard] = useState(false);
  const [pausedAtMid, setPausedAtMid] = useState(false);


  // Confetti state
  const [confettiOn, setConfettiOn] = useState(false);
  const confettiTimer = useRef(null);

  // Pre-generate confetti pieces (stable)
  const confettiPieces = useMemo(() => {
    const count = 90;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // %
      delay: Math.random() * 0.25, // s
      duration: 1.4 + Math.random() * 0.9, // s
      rotate: Math.floor(Math.random() * 360),
      drift: (Math.random() * 2 - 1) * 120, // px left/right drift
    }));
  }, []);

  // Pause the video around 5s and show card
  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v) return;

    // Pause once when it crosses 5s
    if (!pausedAtMid && v.currentTime >= 5) {
      v.pause();
      setPausedAtMid(true);
      setShowCard(true);
    }
  }

  async function handleYes() {
    // Hide popup
    setShowCard(false);

    // Confetti burst
    setConfettiOn(true);
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    confettiTimer.current = setTimeout(() => setConfettiOn(false), 2200);

    // Resume video
    const v = videoRef.current;
    if (v) {
      try {
        await v.play();
      } catch {
        // If autoplay policy blocks (rare since muted), user can tap play
      }
    }
  }

  useEffect(() => {
    return () => {
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
    };
  }, []);

  return (
    <div className="page">
      <div className="frame">
        {/* VIDEO */}
        <div className="videoWrap">
          <video
            ref={videoRef}
            className="video"
            src="/intro.mov"
            autoPlay
            playsInline
            muted
            onTimeUpdate={handleTimeUpdate}
          />
        </div>

        {/* CONFETTI (on Yes) */}
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

        {/* CARD UNDER VIDEO */}
        <div className="cardSlot">
          {showCard && (
            <div className="card">
              <div className="title">Prerna, will you be my Valentine?</div>
              <div className="mini">💗</div>

              <div className="btnRow">
                <button className="btn yes" onClick={handleYes}>
                  Yes
                </button>

                <button className="btn no" type="button">
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
