import { Resend } from "resend";
import { appOrigin, withBasePath } from "@/lib/auth/session";

type SendMagicLinkInput = {
  email: string;
  token: string;
};

export async function sendMagicLinkEmail({
  email,
  token,
}: SendMagicLinkInput): Promise<{ sent: boolean; previewUrl?: string }> {
  const verifyUrl = `${appOrigin()}${withBasePath("/api/auth/verify")}?token=${encodeURIComponent(token)}`;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Startup Village Borneo <hello@superteam.my>";

  if (!apiKey) {
    console.info("[auth] Magic link (no RESEND_API_KEY):", email, verifyUrl);
    return { sent: false, previewUrl: process.env.NODE_ENV === "production" ? undefined : verifyUrl };
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: email,
    subject: "Sign in to Startup Village Borneo",
    html: `
      <p>Hi — use the link below to sign in to your SVB participant profile.</p>
      <p><a href="${verifyUrl}">Sign in to Startup Village Borneo</a></p>
      <p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>
    `,
  });

  return { sent: true };
}
