"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      gutter={10}
      containerStyle={{ top: 86 }}
      toastOptions={{
        duration: 3800,
        style: {
          background: "#123d2f",
          color: "#faf6ec",
          borderRadius: "14px",
          padding: "11px 16px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 18px 50px -18px rgba(11, 44, 33, 0.55)",
          maxWidth: "420px",
        },
        success: {
          iconTheme: {
            primary: "#e9a33c",
            secondary: "#123d2f",
          },
        },
        error: {
          style: {
            background: "#7f2f20",
            color: "#fff4ef",
          },
          iconTheme: {
            primary: "#ffb4a2",
            secondary: "#7f2f20",
          },
        },
        loading: {
          iconTheme: {
            primary: "#e9a33c",
            secondary: "#123d2f",
          },
        },
      }}
    />
  );
}
