import nodemailer from 'nodemailer';

/**
 * Vercel Serverless Function: /api/contact
 * Handles contact form submissions and delivers emails to muralicodex@gmail.com via Nodemailer and Gmail SMTP.
 */
export default async function handler(req, res) {
  // 1. Enforce POST method only
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const { name, email, subject, message, _hp_website } = body || {};

    // 2. Honeypot Spam Protection (Silently accept & drop bot submissions)
    if (_hp_website && typeof _hp_website === 'string' && _hp_website.trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully. Thanks for reaching out!'
      });
    }

    // 3. Server-side Input Validation & Trimming
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

    // 4. Gmail SMTP Configuration from Environment Variables
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
