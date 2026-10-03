import React from "react";
import styles from "./dashboard.module.scss";
import Icon from "./Icon";

const stats = [
  ["Net revenue", "$", "$48,284", "12.8%", "statIconBlue"],
  ["Orders", "#", "1,284", "8.4%", "statIconViolet"],
  ["Customers", "+", "8,492", "6.2%", "statIconAmber"],
  ["Conversion rate", "%", "4.6%", "2.1%", "statIconGreen"],
];

export default function StatsGrid() {
  return (
    <section className={styles.statsGrid} aria-label="Store performance">
      {stats.map(([label, icon, value, change, iconStyle]) => (
        <article className={styles.statCard} key={label}>
          <div className={styles.statHeader}>
            <span>{label}</span>
            <span className={styles[iconStyle]}>{icon}</span>
          </div>
          <strong>{value}</strong>
          <span className={styles.statChange}>
            <Icon name="trend" /> {change} <em>vs last month</em>
          </span>
        </article>
      ))}
    </section>
  );
}
