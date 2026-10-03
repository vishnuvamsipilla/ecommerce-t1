import React from "react";
import styles from "./dashboard.module.scss";
import Icon from "./Icon";

export default function Topbar({ user, title = "Overview" }) {
  const userName = user?.userName || "Admin User";
  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const role = user?.role || "admin";

  return (
    <header className={styles.topbar}>
      <div className={styles.breadcrumbs}>
        <span>Workspace</span>
        <span>/</span>
        <strong>{title}</strong>
      </div>
      <div className={styles.topbarActions}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Notifications"
        >
          <Icon name="bell" />
          <span className={styles.notificationDot}></span>
        </button>
        <div className={styles.profile}>
          <span className={styles.profileAvatar}>{initials}</span>
          <span className={styles.profileDetails}>
            <strong>{userName}</strong>
            <small>{role}</small>
          </span>
        </div>
      </div>
    </header>
  );
}
