import React from "react";
import styles from "./dashboard.module.scss";
import { chartLabels, salesByRange } from "./dashboardData";
import Icon from "./Icon";

export default function RevenueOverview({ range, onRangeChange }) {
  return (
    <article className={`${styles.panel} ${styles.salesPanel}`}>
      <div className={styles.panelHeader}>
        <div>
          <h2>Revenue overview</h2>
          <p>Track your store performance over time</p>
        </div>
        <select
          value={range}
          onChange={(event) => onRangeChange(event.target.value)}
          className={styles.rangeSelect}
          aria-label="Revenue range"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 12 months</option>
        </select>
      </div>
      <div className={styles.chartSummary}>
        <strong>$48,284.00</strong>
        <span className={styles.statChange}>
          <Icon name="trend" /> 12.8%
        </span>
      </div>
      <div className={styles.chart}>
        <div className={styles.chartScale}>
          <span>$12k</span>
          <span>$8k</span>
          <span>$4k</span>
          <span>$0</span>
        </div>
        <div className={styles.chartPlot}>
          <div className={styles.chartGrid}>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
          <div className={styles.chartBars}>
            {salesByRange[range].map((value, index) => (
              <div className={styles.barGroup} key={`${range}-${index}`}>
                <span
                  className={`${styles.bar} ${styles[`bar${value}`]}`}
                ></span>
                <small>{chartLabels[range][index]}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
