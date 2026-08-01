import nodemailer from 'nodemailer';
import { randomBytes, randomInt } from 'crypto';
import db from './database.js';

const EMAIL_USER = 'mwanzidevis01@gmail.com';
const EMAIL_PASS = 'fkduqqokmjcicvia';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

transporter.verify()
  .then(() => console.log('✅ SMTP connection verified'))
  .catch(err => console.error('❌ SMTP connection failed:', err.message));

export function generateResetCode() {
  return randomInt(100000, 999999).toString();
}

export async function sendResetEmail(email, code) {
  const mailOptions = {
    from: '"eFootball Hub" <mwanzidevis01@gmail.com>',
    to: email,
    subject: 'Your eFootball Hub Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #22d3ee, #a855f7); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⚽ eFootball Hub</h1>
        </div>
        <div style="background: #161d2e; padding: 30px; border-radius: 0 0 12px 12px; color: #e2e8f0; text-align: center;">
          <h2 style="color: #22d3ee; margin-top: 0;">Password Reset Code</h2>
          <p>Use this code to reset your password. It expires in 15 minutes.</p>
          <div style="background: linear-gradient(135deg, #22d3ee, #06b6d4); color: #0a0f1a; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 24px; border-radius: 12px; margin: 24px 0; font-family: monospace;">
            ${code}
          </div>
          <p style="color: #94a3b8; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Reset code sent:', info.messageId, 'to:', email);
    return info;
  } catch (err) {
    console.error('❌ Failed to send reset email:', err.message);
    throw err;
  }
}

export function storeResetCode(email, code) {
  const expiresAt = new Date(Date.now() + 900000).toISOString(); // 15 minutes
  db.prepare('INSERT OR REPLACE INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)')
    .run(email, code, expiresAt);
}

export function verifyResetCode(email, code) {
  const row = db.prepare('SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > datetime("now")').get(email, code);
  return row;
}

export function deleteResetCode(email) {
  db.prepare('DELETE FROM password_resets WHERE email = ?').run(email);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS password_resets (
    email TEXT PRIMARY KEY,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL
  );
`);