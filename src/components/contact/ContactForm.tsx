"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import { createPortal } from "react-dom";

import { ErrorIcon, SendIcon, SuccessIcon } from "@/components/icons";
import { site } from "@/data/site";
import {
  CONTACT_LIMITS,
  trimValues,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactResponse,
  type ContactValues,
} from "@/lib/contact";

import Turnstile, { type TurnstileHandle } from "./Turnstile";

const EMPTY: ContactValues = { name: "", email: "", subject: "", message: "" };
const FIELD_ORDER: ContactField[] = ["name", "email", "subject", "message"];
const VERIFY_PROMPT = "Please verify that you are human and try again.";

type Toast = { id: number; type: "success" | "error"; message: string };

const subscribeNothing = () => () => {};

export default function ContactForm({ siteKey }: { siteKey: string }) {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [verifyError, setVerifyError] = useState("");
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const startedAt = useRef(0);
  // Synchronous lock: `sending` state only updates after a re-render, too late for a double click
  const inFlight = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  // Portals need document.body, which only exists in the browser
  const isBrowser = useSyncExternalStore(subscribeNothing, () => true, () => false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), toast.type === "error" ? 7000 : 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: Toast["type"], message: string) => setToast({ id: Date.now(), type, message });

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as ContactField;
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onToken = (value: string) => {
    setToken(value);
    if (value) setVerifyError("");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;

    const clean = trimValues(values);
    const fieldErrors = validateContact(clean);
    setErrors(fieldErrors);
    setVerifyError(token ? "" : VERIFY_PROMPT);

    const firstInvalid = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    if (!token) return;

    inFlight.current = true;
    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...clean,
          website: honeypotRef.current?.value ?? "",
          formStartTime: startedAt.current,
          turnstileToken: token,
        }),
      });
      const data = (await response.json().catch(() => null)) as ContactResponse | null;

      if (response.ok && data?.success) {
        setValues(EMPTY);
        setErrors({});
        showToast("success", data.message);
      } else {
        const message =
          data && !data.success ? data.error : `Something went wrong (error ${response.status}). Please try again.`;
        if (data && !data.success && data.field === "turnstile") setVerifyError(message);
        else if (data && !data.success && data.field) setErrors({ [data.field]: message });
        showToast("error", message);
      }
    } catch {
      showToast("error", `Network error: your message was not sent. Please try again or email ${site.email} directly.`);
    } finally {
      // Turnstile tokens are single-use, so always fetch a new one
      turnstileRef.current?.reset();
      inFlight.current = false;
      setSending(false);
    }
  };

  const fieldProps = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": `contact-${field}-error`,
    required: true,
  });

  return (
    <>
      <form className="contact-form" noValidate onSubmit={onSubmit} aria-label="Contact form">
        {/* Honeypot: hidden from people, filled in by naive bots */}
        <div className="hp-wrapper" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field blank</label>
          <input ref={honeypotRef} type="text" id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="contact-name" className="form-label">
            Your Name <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            className={`form-input${errors.name ? " invalid" : ""}`}
            placeholder="e.g. Alex Morgan"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name.max}
          />
          <span className="error-msg" id="contact-name-error" aria-live="polite">
            {errors.name}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">
            Your Email <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            className={`form-input${errors.email ? " invalid" : ""}`}
            placeholder="e.g. alex@example.com"
            autoComplete="email"
            inputMode="email"
            maxLength={CONTACT_LIMITS.email.max}
          />
          <span className="error-msg" id="contact-email-error" aria-live="polite">
            {errors.email}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="contact-subject" className="form-label">
            Subject <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            {...fieldProps("subject")}
            type="text"
            className={`form-input${errors.subject ? " invalid" : ""}`}
            placeholder="e.g. Project Inquiry / Role Opportunity"
            maxLength={CONTACT_LIMITS.subject.max}
          />
          <span className="error-msg" id="contact-subject-error" aria-live="polite">
            {errors.subject}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="contact-message" className="form-label">
            Message <span className="required" aria-hidden="true">*</span>
          </label>
          <textarea
            {...fieldProps("message")}
            className={`form-textarea${errors.message ? " invalid" : ""}`}
            rows={4}
            placeholder="Tell me about your project, opportunity, or requirements..."
            maxLength={CONTACT_LIMITS.message.max}
          />
          <span className="error-msg" id="contact-message-error" aria-live="polite">
            {errors.message}
          </span>
        </div>

        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          action="contact-form"
          contactEmail={site.email}
          onToken={onToken}
          error={verifyError}
        />

        <button type="submit" className="btn btn-primary btn-full" disabled={sending} aria-busy={sending}>
          {sending ? (
            <span>SENDING...</span>
          ) : (
            <>
              <span className="btn-text">SEND MESSAGE</span>
              <SendIcon className="btn-icon" />
            </>
          )}
        </button>
      </form>

      {isBrowser &&
        createPortal(
          <div className="toast-container" aria-live="polite" aria-atomic="true">
            {toast && (
              <div key={toast.id} className={`toast${toast.type === "error" ? " toast-error" : ""}`}>
                {toast.type === "error" ? <ErrorIcon /> : <SuccessIcon />}
                <span>{toast.message}</span>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
