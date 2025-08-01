
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { logger } from "../middleware/logger";

const RedirectHandler = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("urlData") || "{}");
    const entry = data[shortcode];

    if (!entry) return alert("Invalid shortcode");

    const now = new Date();
    if (new Date(entry.expiresAt) < now) return alert("Link expired");

    entry.clicks.push({
      time: now.toISOString(),
      location: "IN",
      referrer: document.referrer || "Direct"
    });

    logger("URL_CLICKED", { shortcode, referrer: document.referrer });

    localStorage.setItem("urlData", JSON.stringify({ ...data, [shortcode]: entry }));
    window.location.href = entry.longURL;
  }, [shortcode]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;
