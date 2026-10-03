import React from "react";
import { useNavigate } from "react-router";
import styles from "./dashboard.module.scss";
import { navigationItems } from "./dashboardData";
import Icon from "./Icon";

export default function Sidebar({ activeNav, onNavChange, onLogout }) {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    onNavChange(item.label);

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>A</span>
        <span>
          <strong>AuraStore</strong>
          <small>Commerce OS</small>
        </span>
      </div>
      <div className={styles.workspaceLabel}>Workspace</div>
      <nav className={styles.sidebarNav} aria-label="Admin navigation">
        {navigationItems.map((item) => (
          <button
            type="button"
            className={`${styles.navItem} ${activeNav === item.label ? styles.navItemActive : ""}`}
            key={item.label}
            onClick={() => handleNavigation(item)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {!item.path && <span className={styles.navSoon}>Soon</span>}
          </button>
        ))}
      </nav>
      <div className={styles.sidebarBottom}>
        <div className={styles.helpPanel}>
          <span className={styles.helpIcon}>?</span>
          <div>
            <strong>Need a hand?</strong>
            <span>Visit the help center</span>
          </div>
          <Icon name="arrow" />
        </div>
        <button
          type="button"
          className={styles.logoutButton}
          onClick={onLogout}
        >
          <Icon name="logout" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
