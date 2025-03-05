import { Toaster } from "sonner";

export default function ToasterNotification() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "custom-toast",
        duration: 2000,
        style: {
          background: "hsl(268, 10%, 25%)",
          border: "1px solid hsl(268, 15%, 35%)",
          color: "#fff",
          fontSize: "13px",
          padding: "8px",
          borderRadius: "20px",
          textAlign: "center",
          pointerEvents: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
        },
      }}
    />
  );
}
