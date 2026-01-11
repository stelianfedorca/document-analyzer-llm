export interface NavLink {
  href: string;
  label: string;
  /** Pattern to match against pathname for active state */
  matchPattern: string;
}

export const navLinks: NavLink[] = [
  {
    href: "/analyze/upload",
    label: "Analysis",
    matchPattern: "/analyze/upload",
  },
  // {
  //   href: "/analyze/history",
  //   label: "History",
  //   matchPattern: "/analyze/history",
  // },
];
