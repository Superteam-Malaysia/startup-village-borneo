export type Judge = {
  id: string;
  name: string;
  role: string;
  photo?: string;
};

/** Demo Day judges — Summit-style speaker cards. */
export const DEMO_DAY_JUDGES: Judge[] = [
  { id: "sam", name: "Sam", role: "SOCOE", photo: "/judges/sam.jpg" },
  { id: "chaerin", name: "Chaerin", role: "Solana Foundation", photo: "/judges/chaerin.jpg" },
  { id: "seraphim", name: "Seraphim", role: "Solana Foundation", photo: "/judges/seraphim.jpg" },
  { id: "jacob", name: "Jacob", role: "Superscrypt", photo: "/speakers/jacob-ko.jpg" },
];
