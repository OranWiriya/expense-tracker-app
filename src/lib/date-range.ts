const TZ = "Asia/Bangkok";

export type DateRangeFilter = {
  from?: string; // "yyyy-MM-dd"
  to?: string;
};

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: TZ,
  }).format(new Date(iso));

export const toBangkokDay = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(iso));
