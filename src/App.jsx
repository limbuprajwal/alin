import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  const noTexts = useMemo(
    () => [
      "No",
      "Really sure?",
      "Seriously?",
      "Have a heart!",
      "You're breaking my heart :(",
      "Last chance…",
      "Okay… but why 😭",
      "Don't do this to me 💔",
    ],
    []
  );

  const [showCard, setShowCard] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);

  // Delay timer for showing the card after video ends
  const delayTimer = useRef(null);

  // grows each time "No" is clicked
  const yesScale = Math.min(1 + noCount * 0.28, 4);

  function handleNo() {
    setNoCount((c) => c + 1);
  }

  function handleYes() {
    setAccepted(true);
  }

  // Cleanup timeout on unmount (avoids warnings)
  useEffect(() => {
    return () => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
    };
  }, []);

  return (
    <div className="page">
      <div className="frame">
        {/* VIDEO */}
        <div className="videoWrap">
          <video
            className="video"
            src="/intro.mov"
            autoPlay
            playsInline
            muted
            onEnded={() => {
              // Delay before showing the card (adjust 500–1200ms)
              delayTimer.current = setTimeout(() => setShowCard(true), 800);
            }}
          />
        </div>

        {/* CARD UNDER VIDEO */}
        <div className={`cardSlot ${showCard ? "show" : ""}`}>
          {showCard && (
            <div className="card">
              {!accepted ? (
                <>
                  <div className="bear" aria-hidden>
                    🧸💗
                  </div>

                  <div className="question">Will you be my Valentine?</div>

                  <div className="btnRow">
                    <button
                      className="btn yes"
                      style={{ transform: `scale(${yesScale})` }}
                      onClick={handleYes}
                    >
                      Yes
                    </button>

                    <button className="btn no" onClick={handleNo}>
                      {noTexts[Math.min(noCount, noTexts.length - 1)]}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bear" aria-hidden>
                    🧸💖
                  </div>
                  <div className="question big">YAYYY!! 🎉</div>
                  <div className="sub">Screenshot and send it 😄</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
