
// src/components/DebugBanner.tsx

import React from "react";
import { PI_CONFIG } from "@/config/environment";
import { isSdkInitialized } from "@/utils/piNetwork/initialization";

// Function to check if the debug flag is present in URL
const isDebugEnabled = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("debug") === "true";
};

const DebugBanner = () => {
  const isSandbox = PI_CONFIG.sandbox;
  const initialized = isSdkInitialized();

  // Show only in non-production environments or when debug=true is in the URL
  const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
  const isTestnetDomain = typeof window !== "undefined" && window.location.hostname.includes("testnet");

  // Check for environment variable to enable debug mode - using Vite's import.meta approach instead of process.env
  const isDebugMode = import.meta.env.VITE_DEBUG_MODE === "true";
  const showBanner = isLocalhost || isTestnetDomain || isDebugEnabled() || isDebugMode;

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: isSandbox ? "#f59e0b" : "#10b981", // amber or green
        color: "#000",
        padding: "6px 12px",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
        zIndex: 9999,
      }}
    >
      {isSandbox ? "⚠️ Running in TESTNET (Sandbox) Mode" : "✅ Running in MAINNET Mode"} | Pi SDK:{" "}
      {initialized ? "Initialized ✅" : "Not Initialized ❌"}
    </div>
  );
};

export default DebugBanner;
