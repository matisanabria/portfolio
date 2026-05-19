import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");

    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem("name")    as HTMLInputElement).value,
      email:   (form.elements.namedItem("email")   as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Error al enviar");
      }

      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Algo salió mal. Intentá de nuevo.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-card border border-[var(--line)] rounded-[24px] p-7 shadow-form"
    >
      {state === "success" && (
        <div className="px-[18px] py-4 rounded-[12px] mb-[18px] bg-[color-mix(in_oklab,var(--color-accent2)_20%,transparent)] text-accent border border-[color-mix(in_oklab,var(--color-accent)_20%,transparent)] text-[14px]">
          ✓ ¡Mensaje enviado! Te respondo en menos de 24h.
        </div>
      )}

      {state === "error" && (
        <div className="px-[18px] py-4 rounded-[12px] mb-[18px] bg-[rgba(248,81,73,.1)] text-[#f85149] border border-[rgba(248,81,73,.2)] text-[14px]">
          {error}
        </div>
      )}

      <div className="mb-[18px]">
        <label className="block text-[13px] text-ink font-medium mb-2">
          Nombre <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Tu nombre"
          required
          className="w-full font-sans text-[14.5px] text-ink bg-[#1C2030] border border-[var(--line)] rounded-[10px] px-[14px] py-[13px] outline-none [transition:border-color_.2s_ease,background_.2s_ease,box-shadow_.2s_ease] focus:border-accent focus:bg-[#20253A] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]"
        />
      </div>

      <div className="mb-[18px]">
        <label className="block text-[13px] text-ink font-medium mb-2">
          Email <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="tu@email.com"
          required
          className="w-full font-sans text-[14.5px] text-ink bg-[#1C2030] border border-[var(--line)] rounded-[10px] px-[14px] py-[13px] outline-none [transition:border-color_.2s_ease,background_.2s_ease,box-shadow_.2s_ease] focus:border-accent focus:bg-[#20253A] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]"
        />
      </div>

      <div className="mb-[22px]">
        <label className="block text-[13px] text-ink font-medium mb-2">
          Mensaje <span className="text-accent">*</span>
        </label>
        <textarea
          name="message"
          placeholder="Contame qué necesitás — funcionalidades, objetivos, plazos…"
          required
          rows={5}
          className="w-full font-sans text-[14.5px] text-ink bg-[#1C2030] border border-[var(--line)] rounded-[10px] px-[14px] py-[13px] outline-none resize-y min-h-[120px] [transition:border-color_.2s_ease,background_.2s_ease,box-shadow_.2s_ease] focus:border-accent focus:bg-[#20253A] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]"
        />
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className={`w-full rounded-[12px] px-[18px] py-[15px] font-bold text-[15px] tracking-[-0.005em] text-[#0A1A1F] border-none transition-[background,transform] duration-200 ${
          state === "loading"
            ? "bg-[color-mix(in_oklab,var(--color-accent)_60%,transparent)] cursor-not-allowed"
            : "bg-accent cursor-pointer hover:-translate-y-px"
        }`}
      >
        {state === "loading" ? "Enviando…" : "Enviar mensaje"}
      </button>

      <p className="text-center text-[12px] text-muted mt-[14px]">
        Al enviar, aceptás que te contacte sobre tu consulta.
      </p>
    </form>
  );
}
