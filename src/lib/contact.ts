// Contact form rules shared by the browser (instant feedback) and the API route (enforcement).

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 200 },
  message: { min: 10, max: 5000 },
} as const;

export type ContactField = "name" | "email" | "subject" | "message";
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

// RFC 5322 style address check (same pattern the site used before)
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function trimValues(values: Partial<Record<ContactField, unknown>>): ContactValues {
  const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  return {
    name: clean(values.name),
    email: clean(values.email),
    subject: clean(values.subject),
    message: clean(values.message),
  };
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const { name, email, subject, message } = values;

  if (!name) errors.name = "Please enter your name.";
  else if (name.length < CONTACT_LIMITS.name.min) errors.name = "Name must be at least 2 characters.";
  else if (name.length > CONTACT_LIMITS.name.max) errors.name = "Name cannot exceed 100 characters.";

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > CONTACT_LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!subject) errors.subject = "Please enter a subject.";
  else if (subject.length < CONTACT_LIMITS.subject.min) errors.subject = "Subject must be at least 3 characters.";
  else if (subject.length > CONTACT_LIMITS.subject.max) errors.subject = "Subject cannot exceed 200 characters.";

  if (!message) errors.message = "Please enter your message.";
  else if (message.length < CONTACT_LIMITS.message.min) {
    errors.message = "Message must be at least 10 characters long.";
  } else if (message.length > CONTACT_LIMITS.message.max) {
    errors.message = "Message cannot exceed 5000 characters.";
  }

  return errors;
}

/** Body the contact form posts to /api/contact */
export type ContactRequest = ContactValues & {
  website: string; // honeypot, must stay empty
  formStartTime: number;
  turnstileToken: string;
};

export type ContactResponse =
  | { success: true; message: string }
  | { success: false; error: string; field?: ContactField | "turnstile" };
