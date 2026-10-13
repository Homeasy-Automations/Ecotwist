/* ============================
   Which page shows at "/", and which footer shows on every page

   HOME_PAGE
     "diwali"  -> the Diwali special home page (src/pages/DiwaliHome.tsx)
                  and the Diwali footer (src/components/DiwaliFooter.tsx)
     "default" -> the regular home page (src/pages/Home.tsx)
                  and the regular footer (src/components/Footer.tsx)

   DIWALI_HOME_UNTIL
     Safety net: from this date (midnight, India time) the regular home page
     comes back on its own, even if HOME_PAGE is still "diwali". It is checked
     in each visitor's browser, so no redeploy is needed for it to switch.
============================ */

export const HOME_PAGE: "default" | "diwali" = "diwali";

export const DIWALI_HOME_UNTIL = "2026-11-16";

export function showDiwaliHome(now = new Date()) {
  return HOME_PAGE === "diwali" && now < new Date(`${DIWALI_HOME_UNTIL}T00:00:00+05:30`);
}

// The Diwali footer switches together with the Diwali home page
export const showDiwaliFooter = showDiwaliHome;
