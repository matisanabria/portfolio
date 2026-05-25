import { defineMiddleware } from "astro:middleware";

const SPANISH = /^es/i;

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;

  // Only intercept index pages — skip assets, api, 404, etc.
  if (path !== "/" && path !== "/en" && path !== "/en/") {
    return next();
  }

  // Respect manual user preference (cookie set by language switcher)
  const langPref = context.cookies.get("lang-pref")?.value;

  let wantsEN: boolean;
  if (langPref === "en") {
    wantsEN = true;
  } else if (langPref === "es") {
    wantsEN = false;
  } else {
    // Auto-detect from Accept-Language header (first preferred language)
    const acceptLang = context.request.headers.get("Accept-Language") ?? "";
    wantsEN = !SPANISH.test(acceptLang);
  }

  const onEN = path.startsWith("/en");

  if (wantsEN && !onEN) return context.redirect("/en", 302);
  if (!wantsEN && onEN) return context.redirect("/", 302);

  return next();
});
