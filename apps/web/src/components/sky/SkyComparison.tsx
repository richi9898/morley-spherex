
"use client";

import { useEffect, useRef, useState } from "react";
import type { AladinInstance } from "aladin-lite";

type SkySource = "allwise" | "spherex";

const SURVEYS: Record<SkySource, string> = {
  // AllWISE hosted by NASA/IPAC IRSA.
  // Avoids depending on the CDS MOCServer registry.
  allwise:
    "https://irsa.ipac.caltech.edu/data/hips/CDS/AllWISE/RGB-W4-W2-W1",

  // SPHEREx DR1 official all-sky spectral HiPS cube.
  spherex:
    "https://irsa.ipac.caltech.edu/data/hips/SPHEREx/spherex_allsky_cube",
};

export default function SkyComparison() {
  const aladinRef = useRef<AladinInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<SkySource>("allwise");
  const [status, setStatus] = useState("Initializing Aladin Lite...");

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        // Carga Aladin solo en el navegador.
        const { default: A } = await import("aladin-lite");
        await A.init;

        if (cancelled) return;

        // Una sola instancia para todas las fuentes.
        
        const aladin = A.aladin("#eter-sky-viewer", {
          survey: SURVEYS.allwise,
          target: "0 +0",
          fov: 360,
          projection: "AIT",
          cooFrame: "equatorial",

          // Disable Aladin telemetry requests to CDS.
          log: false,
        });


        aladinRef.current = aladin;
        setReady(true);
        setStatus("Viewer initialized.");
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setStatus("Failed to initialize Aladin Lite.");
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
      aladinRef.current?.remove();
      aladinRef.current = null;
    };
  }, []);


async function changeSource(next: SkySource) {
    const aladin = aladinRef.current;

    if (!aladin) return;

    try {
      // AllWISE is a regular HiPS image survey.
      if (next === "allwise") {
        aladin.setBaseImageLayer(SURVEYS.allwise);
        setSource("allwise");
        setStatus("AllWISE selected.");
        return;
      }

      // Load Aladin's API in the browser.
      const { default: A } = await import("aladin-lite");

      if (aladinRef.current !== aladin) return;

      // SPHEREx is a multi-channel HiPS cube.
      const spherexHiPS = A.HiPS(SURVEYS.spherex, {
        name: "SPHEREx DR1",
        imgFormat: "png",

        successCallback: (layer) => {
          // Avoid the documented blank channels 50 and 51.
          layer.setSliceNumber(62);

          console.log("SPHEREx: requested channel 62");

          setStatus(
            "SPHEREx DR1: channel 62 requested. Checking tiles..."
          );
        },

        errorCallback: (error) => {
          console.error("SPHEREx loading failed:", error);
          setStatus("Could not load SPHEREx HiPS.");
        },
      });

      setStatus("Loading SPHEREx DR1...");
      aladin.setBaseImageLayer(spherexHiPS);
      setSource("spherex");
    } catch (error) {
      console.error("Source change failed:", error);
      setStatus("Could not change the image source.");
    }
  }


  function changeView(mode: "all-sky" | "galactic-center") {
    const aladin = aladinRef.current;
    if (!aladin) return;

    if (mode === "all-sky") {
      aladin.setProjection("AIT");
      aladin.gotoRaDec(0, 0);
      aladin.setFoV(360);
    } else {
      aladin.setProjection("SIN");
      aladin.gotoRaDec(266.4168, -29.0078);
      aladin.setFoV(10);
    }
  }

  const buttonStyle = {
    background: "#242b45",
    border: "1px solid #465070",
    borderRadius: 8,
    color: "white",
    padding: "10px 15px",
    cursor: ready ? "pointer" : "not-allowed",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a1020",
        color: "white",
        padding: 24,
      }}
    >
      <h1>ÉTER — Sky Comparison</h1>
      <p>NASA SPHEREx / AllWISE integration test</p>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <button
          style={buttonStyle}
          disabled={!ready}
          onClick={() => changeSource("allwise")}
        >
          AllWISE
        </button>

        <button
          style={buttonStyle}
          disabled={!ready}
          onClick={() => changeSource("spherex")}
        >
          SPHEREx DR1
        </button>

        <button
          style={buttonStyle}
          disabled={!ready}
          onClick={() => changeView("all-sky")}
        >
          Full Sky
        </button>

        <button
          style={buttonStyle}
          disabled={!ready}
          onClick={() => changeView("galactic-center")}
        >
          Galactic Center
        </button>
      </div>

      <div
        id="eter-sky-viewer"
        style={{
          width: "100%",
          height: "min(65vh, 700px)",
          minHeight: 350,
          background: "#050915",
          borderRadius: 12,
          overflow: "hidden",
        }}
      />

      <p style={{ marginTop: 16, color: "#b7c1dc" }}>
        Selected source:{" "}
        {source === "allwise"
          ? "AllWISE — Infrared reference survey"
          : "SPHEREx DR1 — Spectral mosaic"}
      </p>

      <p style={{ color: "#b7c1dc" }}>{status}</p>

      <small style={{ color: "#94a3b8" }}>
        SPHEREx HiPS is for visualization only.
        A selected source does not guarantee that its tiles loaded.
      </small>
    </main>
  );
}
