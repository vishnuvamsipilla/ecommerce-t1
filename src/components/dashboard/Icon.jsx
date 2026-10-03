import React from "react";
import styles from "./dashboard.module.scss";

const paths = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  box: "M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9ZM4 7.5l8 4.5 8-4.5M12 12v9",
  tag: "M20 13 13 20 4 11V4h7l9 9ZM8 8h.01",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 12.5-11.5Z",
  trash: "M3 6h18M8 6V4h8v2m-9 0 1 15h8l1-15M10 10v7m4-7v7",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6M9 15h4",
  users:
    "M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm5-6.5a3 3 0 0 1 0 5.8M17 14.2a4.5 4.5 0 0 1 3 4.3V20",
  bell: "M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4",
  download: "M12 3v12m0 0 4-4m-4 4-4-4M5 21h14",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  logout: "M10 5H5v14h5m5-4 4-3-4-3m4 3H9",
  trend: "M4 16l5-5 3 3 7-8M15 6h4v4",
};

export default function Icon({ name }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
