import nodemailer from 'nodemailer';

// In-Memory Sliding Window Rate Limiter (Per warm serverless container instance)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 submissions per 15 minutes per IP

function checkRateLimit(ip) {
  if (!ip) return false;
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, firstRequest: now };

  // Reset window if expired
  if (now - record.firstRequest > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.firstRequest = now;
    rateLimitMap.set(ip, record);
    return false;
  }

  record.count += 1;
  rateLimitMap.set(ip, record);

  // Periodic cleanup to avoid memory leak
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.firstRequest > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  return record.count > MAX_REQUESTS_PER_WINDOW;
}

/**
 * Vercel Serverless Function: /api/contact
 * Handles contact form submissions and delivers emails to muralicodex@gmail.com via Nodemailer and Gmail SMTP.
 */
export default async function handler(req, res) {
  // 1. Support GET method to retrieve public Turnstile Site Key safely
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      siteKey: process.env.TURNSTILE_SITE_KEY || ''
    });
  }

  // Enforce POST method for form submissions
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only GET and POST requests are supported.'
    });
  }

  try {
    // 2. Parse Request Body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const {
      name,
      email,
      subject,
      message,
      website,
      _hp_website,
      formStartTime,
      elapsedMs,
      turnstileToken,
      'cf-turnstile-response': cfTurnstileResponse
    } = body || {};

    const activeTurnstileToken = (turnstileToken || cfTurnstileResponse || '').trim();

    // 3. Honeypot Anti-Spam Check (Reject immediately if filled)
    const honeypot = (website || _hp_website || '').trim();
    if (honeypot.length > 0) {
      console.warn('[Anti-Spam] Honeypot field filled. Rejection triggered.');
      return res.status(400).json({
        success: false,
        error: 'Spam submission detected.'
      });
    }

    // 4. Minimum Submission Timing Check (Reject if submitted under 3 seconds)
    const MIN_SUBMISSION_TIME_MS = 3000; // 3 seconds
    const MAX_SUBMISSION_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();
    const parsedStartTime = Number(formStartTime);
    const parsedElapsed = Number(elapsedMs);

    if (parsedStartTime && !isNaN(parsedStartTime)) {
      const serverElapsed = now - parsedStartTime;
      if (serverElapsed < MIN_SUBMISSION_TIME_MS || serverElapsed > MAX_SUBMISSION_TIME_MS) {
        console.warn(`[Anti-Spam] Timing check failed. Server elapsed: ${serverElapsed}ms`);
        return res.status(400).json({
          success: false,
          error: 'Spam submission detected.'
        });
      }
    } else if (parsedElapsed && !isNaN(parsedElapsed) && parsedElapsed < MIN_SUBMISSION_TIME_MS) {
      console.warn(`[Anti-Spam] Client elapsed time too fast: ${parsedElapsed}ms`);
      return res.status(400).json({
        success: false,
        error: 'Spam submission detected.'
      });
    }

    // 5. Basic Rate Limiting
    const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
    if (checkRateLimit(clientIp)) {
      console.warn(`[Rate Limit] Client IP ${clientIp} exceeded submission rate limit.`);
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a few minutes before submitting again.'
      });
    }

    // 6. Server-side Input Validation & Trimming
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    // Validate Name (2 - 100 characters)
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid name between 2 and 100 characters.'
      });
    }

    // Validate Email (RFC 5322 pattern, max 254 characters)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!trimmedEmail || trimmedEmail.length > 254 || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    // Validate Subject (3 - 200 characters)
    if (!trimmedSubject || trimmedSubject.length < 3 || trimmedSubject.length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid subject between 3 and 200 characters.'
      });
    }

    // Validate Message (10 - 5000 characters)
    if (!trimmedMessage || trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message between 10 and 5000 characters.'
      });
    }

    // 7. Cloudflare Turnstile Server-Side Siteverify Verification
    if (!activeTurnstileToken) {
      console.warn('[Anti-Spam] Turnstile token is missing.');
      return res.status(400).json({
        success: false,
        error: 'Please verify that you are human and try again.'
      });
    }

    const turnstileSecret = (process.env.TURNSTILE_SECRET_KEY || '').trim();
    if (!turnstileSecret) {
      console.error('[Turnstile Error] TURNSTILE_SECRET_KEY environment variable is not configured.');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Turnstile verification is unavailable.'
      });
    }

    try {
      const verifyParams = new URLSearchParams();
      verifyParams.append('secret', turnstileSecret);
      verifyParams.append('response', activeTurnstileToken);
      if (clientIp) {
        verifyParams.append('remoteip', clientIp);
      }

      const cfResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: verifyParams.toString()
      });

      const cfData = await cfResponse.json();

      // Allowed hostnames: Vercel production domain, preview domains, and local dev hosts
      const allowedHostnames = [
        'rmuralikumar.vercel.app',
        'localhost',
        '127.0.0.1',
        '::1'
      ];

      const rawHostname = (cfData.hostname || '').toLowerCase();
      const isHostnameAllowed =
        allowedHostnames.includes(rawHostname) ||
        rawHostname.endsWith('.vercel.app') ||
        rawHostname.endsWith('.localhost');

      const isActionValid = !cfData.action || cfData.action === 'contact-form';

      if (!cfData.success || !isHostnameAllowed || !isActionValid) {
        console.warn('[Turnstile Failed]', {
          success: cfData.success,
          hostname: cfData.hostname,
          action: cfData.action,
          errorCodes: cfData['error-codes']
        });
        return res.status(400).json({
          success: false,
          error: 'Human verification failed. Please try again.'
        });
      }
    } catch (cfErr) {
      console.error('[Turnstile Network Error]:', cfErr);
      return res.status(500).json({
        success: false,
        error: 'Security verification failed due to network error. Please try again.'
      });
    }

    // 8. Gmail SMTP Configuration from Environment Variables
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpSecure = process.env.SMTP_SECURE === 'false' ? false : true;
    const smtpUser = process.env.SMTP_USER || 'muralicodex@gmail.com';
    const smtpPassword = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.trim() : '';
    const contactEmail = process.env.CONTACT_EMAIL || 'muralicodex@gmail.com';

    if (!smtpPassword) {
      console.error('[SMTP Error] SMTP_PASSWORD environment variable is missing.');
      return res.status(500).json({
        success: false,
        error: 'Gmail SMTP configuration error: SMTP_PASSWORD environment variable is missing in Vercel settings.'
      });
    }

    // 5. Create Nodemailer SMTP Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // true for 465 (SSL)
      auth: {
        user: smtpUser,
        pass: smtpPassword
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    // 6. Build Clean Plain-Text & HTML Email Templates
    const emailSubject = `Portfolio Contact: ${trimmedSubject}`;

    const textContent = `New message from Murali Kumar R's portfolio

Name:
${trimmedName}

Email:
${trimmedEmail}

Subject:
${trimmedSubject}

Message:
${trimmedMessage}

---
Reply directly to this email to respond to ${trimmedName} (${trimmedEmail}).`;

    // HTML Escaper to prevent HTML injection in email clients
    const escapeHtml = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeSubject = escapeHtml(trimmedSubject);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br>');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 20px; background-color: #f5f5f7; }
          .email-wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; border: 1px solid #e2e2e8; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
          .header { background: #0a0a0c; color: #ffffff; padding: 24px 28px; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
          .header p { margin: 6px 0 0 0; color: #9e9ea7; font-size: 13px; }
          .content { padding: 28px; }
          .field-group { margin-bottom: 20px; }
          .field-label { font-size: 11px; font-weight: 700; color: #62626e; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 5px; }
          .field-value { font-size: 15px; color: #111114; font-weight: 500; }
          .message-box { background: #f7f7f9; border-left: 4px solid #0a0a0c; padding: 18px; border-radius: 4px; font-size: 15px; color: #222225; margin-top: 8px; line-height: 1.6; word-break: break-word; }
          .footer { background: #fafafc; padding: 18px 28px; font-size: 13px; color: #6e6e78; border-top: 1px solid #eeeeef; }
          .footer strong { color: #0a0a0c; }
          .footer a { color: #0a0a0c; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>New Message from Murali Kumar R's Portfolio</h1>
            <p>Direct submission via rmuralikumar.vercel.app</p>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="field-label">Sender Name</div>
              <div class="field-value">${safeName}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Sender Email</div>
              <div class="field-value"><a href="mailto:${safeEmail}" style="color: #0a0a0c; font-weight: 600;">${safeEmail}</a></div>
            </div>
            <div class="field-group">
              <div class="field-label">Subject</div>
              <div class="field-value">${safeSubject}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Message</div>
              <div class="message-box">${safeMessage}</div>
            </div>
          </div>
          <div class="footer">
            Click <strong>Reply</strong> to directly respond to <strong>${safeName}</strong> (<a href="mailto:${safeEmail}">${safeEmail}</a>).
          </div>
        </div>
      </body>
      </html>
    `;

    // 7. Send Mail via Nodemailer Gmail SMTP
    const mailOptions = {
      from: `"Murali's Portfolio" <${smtpUser}>`,
      to: contactEmail,
      replyTo: trimmedEmail,
      subject: emailSubject,
      text: textContent,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[SMTP Success] Message sent successfully. MessageId:', info.messageId);

    // 8. Return Success Response
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully. Thanks for reaching out!'
    });

  } catch (error) {
    console.error('[SMTP Error Occurred]:', error);

    let clientErrorMessage = 'Failed to send email via Gmail SMTP.';

    if (error.code === 'EAUTH' || error.responseCode === 535 || error.responseCode === 534) {
      clientErrorMessage = 'Gmail SMTP authentication failed: Invalid Google App Password. Please ensure 2FA is active and a 16-character App Password is set in Vercel.';
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
      clientErrorMessage = 'Gmail SMTP connection timed out. Please try again.';
    } else if (error.message) {
      clientErrorMessage = `SMTP error: ${error.message}`;
    }

    return res.status(500).json({
      success: false,
      error: clientErrorMessage
    });
  }
}
