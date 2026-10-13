/* ============================
   Festival option on the Get Proposal page (/configurator)

   ACTIVE_FESTIVAL picks the festival shown as the highlighted first option in
   step 1 (Occasion). Change it for the next festival, or set it to null to
   hide the option. Edit a preset (or add one) to change its wording.

   Links to /configurator?occasion=festival open the form with the active
   festival already selected.
============================ */

export interface Festival {
  title: string;            // shown on the card and sent with the proposal as the occasion
  desc: string;
  greeting: string;
  icon: string;
  accent: [string, string]; // gradient for the card's border and badge
  tint: string;             // card background
}

export const FESTIVALS = {
  diwali: {
    title: "Diwali Gifting",
    desc: "Festive hampers, soya wax diyas and sweets for the festival of lights.",
    greeting: "शुभ दीपावली",
    icon: "🪔",
    accent: ["#F59E0B", "#B45309"],
    tint: "#FFF8EB",
  },
  holi: {
    title: "Holi Gifting",
    desc: "Colourful hampers to celebrate the festival of colours.",
    greeting: "Happy Holi",
    icon: "🎨",
    accent: ["#EC4899", "#8B5CF6"],
    tint: "#FDF2F8",
  },
  rakhi: {
    title: "Raksha Bandhan Gifting",
    desc: "Thoughtful hampers that celebrate the bond between siblings.",
    greeting: "Happy Raksha Bandhan",
    icon: "🎀",
    accent: ["#F43F5E", "#F59E0B"],
    tint: "#FFF1F2",
  },
  christmas: {
    title: "Christmas Gifting",
    desc: "Seasonal hampers to spread holiday cheer across your teams.",
    greeting: "Merry Christmas",
    icon: "🎄",
    accent: ["#16A34A", "#B91C1C"],
    tint: "#F0FDF4",
  },
  newYear: {
    title: "New Year Gifting",
    desc: "Start the year with gifts your people will use every day.",
    greeting: "Happy New Year",
    icon: "🎆",
    accent: ["#1E3A8A", "#C5A059"],
    tint: "#EFF6FF",
  },
  eid: {
    title: "Eid Gifting",
    desc: "Elegant hampers of dry fruits and sweets for Eid celebrations.",
    greeting: "Eid Mubarak",
    icon: "🌙",
    accent: ["#047857", "#C5A059"],
    tint: "#ECFDF5",
  },
} satisfies Record<string, Festival>;

export const ACTIVE_FESTIVAL: keyof typeof FESTIVALS | null = "diwali";

export const activeFestival: Festival | null = ACTIVE_FESTIVAL ? FESTIVALS[ACTIVE_FESTIVAL] : null;
