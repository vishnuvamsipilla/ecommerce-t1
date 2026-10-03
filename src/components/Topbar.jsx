import React from "react";
import styles from "../dashboard.module.scss";
import Icon from "./dashboard/Icon";

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.breadcrumbs}>
        <span>Workspace</span>
        <span>/</span>
        <strong>Overview</strong>
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
          <span className={styles.profileAvatar}>VA</span>
          <span className={styles.profileDetails}>
            <strong>Vishnu Admin</strong>
            <small>Administrator</small>
          </span>
        </div>
      </div>
    </header>
  );
}
