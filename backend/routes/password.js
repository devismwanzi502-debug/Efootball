import { Router } from 'express';
import { hashPassword } from '../auth.js';
import { generateResetToken, sendResetEmail, storeResetToken, verifyResetToken, deleteResetToken } from '../email.js';
import db from '../database.js';

const router = Router();

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }
    
    const token = generateResetToken();
    storeResetToken(email, token);
    await sendResetEmail(email, token);
    
    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }
    
    const reset = verifyResetToken(token);
    if (!reset) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    const hashed = await hashPassword(password);
    db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashed, reset.email);
    deleteResetToken(token);
    
    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;