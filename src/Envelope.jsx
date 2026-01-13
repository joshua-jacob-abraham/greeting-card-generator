import { useState, useRef, useEffect } from "react";
import domtoimage from "dom-to-image-more";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import "./styles/Envelope.css";

function Envelope() {
  const [opened, setOpened] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const letterRef = useRef(null);
  const [modLetter, setModLetter] = useState(false);

  const { name1, name2 } = useParams();
  const modName1 = name1 || "Juliet";
  const rom = name2 || "Romeo";

  useEffect(() => {
    if (!name1) {
      setShowHelp(true);
    } else {
      setShowHelp(false);
    }
  }, [name1]);

  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const juliet = capitalizeFirstLetter(modName1);
  const modRom = capitalizeFirstLetter(rom);
  const romeo = "-" + modRom;

  const handleClick = () => {
    setOpened(!opened);
  };

  const handleLetterClick = () => {
    setLetterOpened(!letterOpened);
  };

  const handleHeartClick = (event) => {
    setModLetter(true);
    setShowTooltip(false);
    event.stopPropagation();

    const letterElement = document.querySelector(".letter-comp");
    if (!letterElement) return;

    domtoimage
      .toPng(letterElement, { quality: 1, scale: 2 })
      .then((dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `Letter_From_${modRom}_To_${juliet}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error generating image:", error);
      });
  };

  const handleOutsideClick = (event) => {
    if (letterRef.current && !letterRef.current.contains(event.target)) {
      setLetterOpened(false);
      setOpened(false);
      setModLetter(false);
    }
  };

  const imagePaths = [
    "/envelope-open-front-textured.svg",
    "/envelope-closed-front-textured-svg.svg",
    "/envelope-open-back-textured.svg",
    "/letter-mini-modified.svg",
    "/letter.svg",
    "/heart-stamp.png",
  ];

  const getFormattedDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const getOrdinal = (num) => {
      if (num > 3 && num < 21) return "th";
      switch (num % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinal(day)} ${month}, ${year}`;
  };

  const formattedDate = getFormattedDate();

  useEffect(() => {
    let loadedImages = 0;

    imagePaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === imagePaths.length) {
          setImagesLoaded(true);
          console.log("loaded");
        }
      };
    });
  }, []);

  useEffect(() => {
    if (letterOpened) {
      setTimeout(() => {
        setShowTooltip(true);
      }, 2000);

      setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
    }
  }, [letterOpened]);

  if (!imagesLoaded) {
    return (
      <p
        style={{
          fontFamily: "Cedarville Cursive",
          fontWeight: "400",
          fontSize: "16px",
          fontStyle: "normal",
        }}
      >
        Patient as love &#9825;
      </p>
    );
  }

  return (
    <>
      {!letterOpened && imagesLoaded && (
        <div className="container">
          {!opened && (
            <div className="envelope-closed" onClick={handleClick}>
              <img
                className="closed-back"
                src="/envelope-open-front-textured.svg"
              />
              <img
                className="closed-front"
                src="/envelope-closed-front-textured-svg.svg"
              />
            </div>
          )}

          {opened && (
            <div className="envelope-active" onClick={handleLetterClick}>
              <img
                className="open-back"
                src="/envelope-open-back-textured.svg"
              />
              <img
                className="open-front"
                src="/envelope-open-front-textured.svg"
              />
              <img className="letter-mini" src="/letter-mini-modified.svg" />
            </div>
          )}

          <p className="the-to">To {juliet}</p>
        </div>
      )}

      {letterOpened && imagesLoaded && (
        <div className="letter-back" onClick={handleOutsideClick}>
          <div
            className="letter-comp"
            ref={letterRef}
            onClick={(e) => e.stopPropagation()}
          >
            <img className="letter" src="/letter.svg" />

            {showTooltip && (
              <p
                className={`tooltip ${showTooltip ? "fade-in" : "fade-out"}`}
                onClick={handleHeartClick}
              >
                Click to save <span className="heart-icon">&#9825;</span>
              </p>
            )}

            <img
              className="heart"
              src="/heart-stamp.png"
              onClick={handleHeartClick}
            />

            <p className="the-from">{romeo}</p>

            {modLetter && (
              <p className="the-to mod-to">
                {juliet} &#9825; {formattedDate}
              </p>
            )}
          </div>
        </div>
      )}

      {showHelp && (
        <div className="help">
          <p
            style={{
              margin: "0px",
            }}
          >
            https://zimra.netlify.app/to-name/from-name to
            create your custom card &#9825;
          </p>
          <p
            style={{
              margin: "0px",
              marginTop: "5px",
            }}
          >
            Eg: https://zimra.netlify.app/juliet/romeo
          </p>
        </div>
      )}
    </>
  );
}

export default Envelope;
