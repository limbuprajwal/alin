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

  const delayTimer = useRef(null);

  // Button grows on each "No"
  const yesScale = Math.min(1 + noCount * 0.22, 3.2);

  function handleNo() {
    setNoCount((c) => c + 1);
  }

  function handleYes() {
    setAccepted(true);
  }

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
              delayTimer.current = setTimeout(() => setShowCard(true), 900);
            }}
          />
        </div>

        {/* CARD UNDER VIDEO */}
        <div className={`cardSlot ${showCard ? "show" : ""}`}>
          {showCard && (
            <div className="card">
              {!accepted ? (
                <>
                  <div className="title">Prerna, will you be my Valentine?</div>
                  <div className="subTitle">💗</div>

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
                  <div className="title big">YAYYY Prerna!! 💖</div>
                  <div className="sub">Now screenshot and send it 😄</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
