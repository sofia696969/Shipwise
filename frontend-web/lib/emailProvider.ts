export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

const sendWithSendGrid: EmailProvider = {
  async send(message: EmailMessage) {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!apiKey || !fromEmail) {
      throw new Error("SendGrid is not configured");
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: message.to }] }],
        from: { email: fromEmail },
        subject: message.subject,
        content: [{ type: "text/plain", value: message.text }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`SendGrid error: ${response.status} ${text}`);
    }
  },
};

const sendWithSesApi: EmailProvider = {
  async send(message: EmailMessage) {
    const sesEndpoint = process.env.SES_API_ENDPOINT;
    const sesApiKey = process.env.SES_API_KEY;
    if (!sesEndpoint || !sesApiKey) {
      throw new Error("SES API gateway is not configured");
    }

    const response = await fetch(sesEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sesApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`SES API error: ${response.status} ${text}`);
    }
  },
};

const consoleFallback: EmailProvider = {
  async send(message: EmailMessage) {
    console.log("[email:stub]", message);
  },
};

export function getEmailProvider(): EmailProvider {
  const provider = (process.env.EMAIL_PROVIDER ?? "sendgrid").toLowerCase();
  if (provider === "sendgrid") return sendWithSendGrid;
  if (provider === "ses") return sendWithSesApi;
  return consoleFallback;
}
