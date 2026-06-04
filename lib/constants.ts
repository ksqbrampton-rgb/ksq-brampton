export const SITE = {
  name: "Knowledge Square",
  shortName: "KSQ Brampton",
  tagline: "Nigerian NIN Enrollment Center",
  domain: "ksqbrampton.ca",
  url: "https://ksqbrampton.ca",
  email: "info@ksqbrampton.ca",
  address: {
    line1: "69 Eastern Avenue, Unit 1",
    city: "Brampton",
    province: "Ontario",
    country: "Canada",
    postal: "L6W 1Y4",
    full: "69 Eastern Avenue, Unit 1, Brampton, Ontario, Canada",
    mapsSearch: "69 Eastern Ave Unit 1, Brampton, ON L6W 1Y4",
    mapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2888.123!2d-79.7624!3d43.6834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s69+Eastern+Ave%2C+Brampton%2C+ON!5e0!3m2!1sen!2sca!4v1",
  },
  hours: {
    weekdays: "Monday – Friday: 9:00 AM – 5:00 PM",
    saturday: "Saturday: 10:00 AM – 3:00 PM",
    sunday: "Sunday: Closed",
  },
  fees: {
    newEnrollment: 50,
    bvnCompletion: 50,
    formAssistance: "Nominal",
    currency: "CAD",
  },
  social: {},
} as const;

export const NAV_LINKS = [
  { label: "About NIN", href: "/#about" },
  { label: "How to Enroll", href: "/#enroll" },
  { label: "Book", href: "/book" },
  { label: "Location", href: "/#location" },
  { label: "FAQs", href: "/#faq" },
] as const;
