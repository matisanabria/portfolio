import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const headers = { "Content-Type": "application/json" };

  // Parse body
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Cuerpo inválido" }), { status: 400, headers });
  }

  const { name, email, message } = body;

  // Validate
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), { status: 400, headers });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Email inválido" }), { status: 400, headers });
  }

  // Send via Resend
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Servicio de email no configurado" }), { status: 500, headers });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Mati Sanabria <contacto@matisanabria.me>",
    to: ["sanabria.mati29@gmail.com"],
    replyTo: email,
    subject: `Nuevo mensaje de ${name} — Portfolio`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0C0E12; color: #EEE9DF;">
        <h2 style="margin: 0 0 24px; font-size: 22px; color: #CAFF3E;">Nuevo mensaje desde tu portfolio</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #787B85; font-size: 13px; width: 80px;">Nombre</td>
            <td style="padding: 10px 0; font-size: 14px;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #787B85; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${escapeHtml(email)}" style="color: #CAFF3E;">${escapeHtml(email)}</a></td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 20px; background: #181B24; border-radius: 12px; border: 1px solid rgba(238,233,223,.10);">
          <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      </div>
    `,
  });

  if (error) {
    return new Response(JSON.stringify({ error: "Error al enviar el email" }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
