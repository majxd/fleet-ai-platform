import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

const locales = ["ar", "en"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : "ar";

  return {
    locale,
    messages: (
      await (locale === "ar"
        ? import("../../messages/ar.json")
        : import("../../messages/en.json"))
    ).default,
  };
});
