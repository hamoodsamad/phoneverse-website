export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private apiKey: string | undefined;
  private from: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.from = process.env.EMAIL_FROM || 'orders@phoneverse.com';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.isConfigured()) {
      console.log(`[Email Service Simulation] To: ${options.to} | Subject: "${options.subject}"`);
      return { success: true, id: `sim_${Date.now()}` };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.from,
          to: [options.to],
          subject: options.subject,
          html: options.html
        })
      });

      if (!response.ok) {
        throw new Error(`Email provider returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (err: any) {
      console.error('Email dispatch error:', err);
      return { success: false, error: err.message };
    }
  }

  async sendPriceDropAlert(userEmail: string, phoneName: string, oldPricePkr: number, newPricePkr: number, dropPct: number) {
    return this.sendEmail({
      to: userEmail,
      subject: `🔥 Price Drop Alert: ${phoneName} dropped by ${dropPct}% in Pakistan!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10b981;">Price Drop Alert for ${phoneName}</h2>
          <p>Great news! The price for <strong>${phoneName}</strong> has dropped from <s>PKR ${oldPricePkr.toLocaleString()}</s> to <strong>PKR ${newPricePkr.toLocaleString()}</strong> (${dropPct}% drop).</p>
          <p><a href="https://phoneverse.com/smartphones" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Live Retailers</a></p>
          <hr />
          <small style="color: #888;">PhoneVerse 2026 - Pakistan's Flagship Smartphone Intelligence Platform</small>
        </div>
      `
    });
  }
}

export const emailService = new EmailService();
