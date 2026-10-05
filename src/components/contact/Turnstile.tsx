"use client";

import Script from "next/script";
import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState, type Ref } from "react";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = {
  /** Fetch a fresh token (tokens are single-use, so call this after every submission) */
  reset: () => void;
};

type TurnstileProps = {
  siteKey: string;
  action: string;
  contactEmail: string;
  /** Called with a new token, or "" when the current token is no longer valid */
  onToken: (token: string) => void;
  /** Form-level error, e.g. "please verify" after a submit without a token */
  error?: string;
  ref?: Ref<TurnstileHandle>;
};

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
// Invalid or disabled site key, or a hostname missing from the widget's Hostname Management (110200).
// Retrying cannot fix these, so they are reported straight away.
const CONFIG_ERROR = /^(110\d{3}|400020|400070)$/;
const MAX_AUTO_RETRIES = 3;
const SCRIPT_TIMEOUT_MS = 10_000;

export default function Turnstile({ siteKey, action, contactEmail, onToken, error, ref }: TurnstileProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Cloudflare's script and challenge only load once the form is close to the viewport,
  // so visitors who never scroll to the contact section don't pay for them
  const [shouldLoad, setShouldLoad] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [message, setMessage] = useState("");
  const [canRetry, setCanRetry] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Terminal failure: friendly message, retry button and the email fallback
  const showFailure = (reason: string) => {
    setMessage(`${reason} You can also email ${contactEmail} directly.`);
    setCanRetry(true);
  };

  // Effect-only versions, so the effects below don't re-run when these change
  const emitToken = useEffectEvent((token: string) => onToken(token));
  const fail = useEffectEvent((reason: string) => showFailure(reason));

  useImperativeHandle(ref, () => ({
    reset() {
      onToken("");
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    const group = groupRef.current;
    if (shouldLoad || !siteKey || !group) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShouldLoad(true);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(group);
    return () => observer.disconnect();
  }, [shouldLoad, siteKey]);

  // A blocked script (content blocker, network) may never fire an event, so stop waiting after a while
  useEffect(() => {
    if (!shouldLoad || scriptReady || scriptFailed || !siteKey) return;
    const timer = window.setTimeout(() => {
      console.warn("[Turnstile] challenges.cloudflare.com/turnstile/v0/api.js did not load.");
      setScriptFailed(true);
      fail("Human verification could not load. Disable content blockers for this site and try again.");
    }, SCRIPT_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [shouldLoad, scriptReady, scriptFailed, siteKey, attempt]);

  // Render the widget once the API is available, and remove it again on unmount or retry
  useEffect(() => {
    const api = window.turnstile;
    const container = containerRef.current;
    if (!scriptReady || !siteKey || !api || !container) return;

    let autoRetries = 0;
    // Pending auto-retries, cleared on cleanup so they never reset a removed widget
    const retryTimers = new Set<number>();
    let id: string;
    try {
      id = api.render(container, {
        sitekey: siteKey,
        action,
        theme: "dark",
        // The normal widget is a fixed 300px wide; small phones get the compact (150px) version.
        // Measure the full-width group: the empty container itself shrinks to 0 before rendering.
        size: (container.parentElement ?? container).clientWidth < 300 ? "compact" : "normal",
        retry: "never", // retries are handled below so configuration errors don't loop
        "refresh-expired": "auto",
        callback: (token: string) => {
          autoRetries = 0;
          setMessage("");
          setCanRetry(false);
          emitToken(token);
        },
        "expired-callback": () => {
          emitToken("");
          setMessage("Verification expired. Please verify again.");
        },
        "timeout-callback": () => {
          emitToken("");
          api.reset(id);
        },
        "error-callback": (code: string | number) => {
          emitToken("");
          console.warn("[Turnstile] error code:", code, "| host:", window.location.hostname);
          if (CONFIG_ERROR.test(String(code))) {
            fail(`Human verification is unavailable on this domain (code ${code}).`);
          } else if (autoRetries < MAX_AUTO_RETRIES) {
            autoRetries += 1;
            setMessage("Verification hit a snag. Retrying…");
            const timer = window.setTimeout(() => {
              retryTimers.delete(timer);
              api.reset(id);
            }, 1500 * autoRetries);
            retryTimers.add(timer);
          } else {
            fail(
              `Human verification could not complete${code ? ` (code ${code})` : ""}. Try again, or disable content blockers for this site.`,
            );
          }
          // Tells Turnstile the error was handled
          return true;
        },
      });
    } catch (renderError) {
      console.error("[Turnstile] render failed:", renderError);
      // Report after the effect finishes rather than re-rendering in the middle of it
      queueMicrotask(() => fail("Human verification could not load."));
      return;
    }

    widgetId.current = id;
    return () => {
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      api.remove(id);
      widgetId.current = null;
    };
  }, [scriptReady, siteKey, action, attempt]);

  const retry = () => {
    setMessage("");
    setCanRetry(false);
    if (window.turnstile) {
      // The API did arrive (for example after the load timeout fired); just render again
      setScriptFailed(false);
      setScriptReady(true);
    } else {
      // Load a fresh copy of the script; the first request was blocked or failed
      document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`).forEach((tag) => tag.remove());
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        setScriptFailed(false);
        setScriptReady(true);
      };
      script.onerror = () =>
        showFailure("Human verification could not load. Disable content blockers for this site and try again.");
      document.head.appendChild(script);
      setScriptFailed(false);
    }
    setAttempt((value) => value + 1);
  };

  const notConfigured = !siteKey;
  const shownMessage = notConfigured
    ? `Human verification is not configured. You can also email ${contactEmail} directly.`
    : message || error || "";

  return (
    <div ref={groupRef} className={`turnstile-group${error ? " has-error" : ""}`}>
      {!notConfigured && shouldLoad && (
        <Script
          src={SCRIPT_SRC}
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={() => {
            setScriptFailed(true);
            showFailure("Human verification could not load. Disable content blockers for this site and try again.");
          }}
        />
      )}
      <div ref={containerRef} className="cf-turnstile" />
      <span className="error-msg" id="turnstile-error" aria-live="polite">
        {shownMessage}
      </span>
      {canRetry && (
        <button type="button" className="turnstile-retry-btn" onClick={retry}>
          Retry verification
        </button>
      )}
    </div>
  );
}
