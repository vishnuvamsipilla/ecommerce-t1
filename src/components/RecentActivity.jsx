import React from "react";
import styles from "../dashboard.module.scss";
import { activities } from "./dashboard/dashboardData";

export default function RecentActivity() {
  return (
    <article className={`${styles.panel} ${styles.activityPanel}`}>
      <div className={styles.panelHeader}>
        <div>
          <h2>Recent activity</h2>
          <p>Latest updates from your store</p>
        </div>
        <button type="button" className={styles.textButton}>
          View all
        </button>
      </div>
      <div className={styles.activityList}>
        {activities.map((activity) => (
          <div
            className={styles.activityItem}
            key={`${activity.name}-${activity.time}`}
          >
            <span
              className={`${styles.activityAvatar} ${styles[activity.tone]}`}
            >
              {activity.initials}
            </span>
            <div>
              <p>
                <strong>{activity.name}</strong> {activity.action}
              </p>
              <small>{activity.time}</small>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
