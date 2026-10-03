import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../../api/axiosClient";
import { clearAuthToken } from "../../../utils/auth";
import styles from "../../../components/dashboard/dashboard.module.scss";
import RecentActivity from "../../../components/dashboard/RecentActivity";
import RevenueOverview from "../../../components/dashboard/RevenueOverview";
import Sidebar from "../../../components/dashboard/Sidebar";
import StatsGrid from "../../../components/dashboard/StatsGrid";
import TopProducts from "../../../components/dashboard/TopProducts";
import Topbar from "../../../components/dashboard/Topbar";
import Icon from "../../../components/dashboard/Icon";

function Dashboard() {
  const navigate = useNavigate();
  const [range, setRange] = useState("7d");
  const [activeNav, setActiveNav] = useState("Overview");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get("/auth/user");
        setUser(response.data?.data?.user || null);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      }
    };

    fetchUser();
  }, [navigate]);

  const exportReport = () => {
    const report = [
      ["Metric", "Value"],
      ["Revenue", "$48,284"],
      ["Orders", "1,284"],
      ["Customers", "8,492"],
      ["Conversion rate", "4.6%"],
    ]
      .map((row) => row.join(","))
      .join("\n");
    const download = document.createElement("a");
    download.href = URL.createObjectURL(
      new Blob([report], { type: "text/csv" }),
    );
    download.download = "aurastore-dashboard-report.csv";
    download.click();
    URL.revokeObjectURL(download.href);
  };

  const logout = () => {
    clearAuthToken();
    navigate("/login");
  };

  return (
    <div className={styles.dashboardPage}>
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onLogout={logout}
      />
      <main className={styles.dashboardMain}>
        <Topbar user={user} />
        <div className={styles.dashboardContent}>
          <section className={styles.pageIntro}>
            <div>
              <p className={styles.eyebrow}>Friday, September 25, 2026</p>
              <h1>Good morning, {user?.userName || "there"}.</h1>
              <p className={styles.pageSubtitle}>
                Here is what is happening with your store today.
              </p>
            </div>
            <button
              type="button"
              className={styles.exportButton}
              onClick={exportReport}
            >
              <Icon name="download" />
              Export report
            </button>
          </section>
          <StatsGrid />
          <section className={styles.contentGrid}>
            <RevenueOverview range={range} onRangeChange={setRange} />
            <RecentActivity />
          </section>
          <TopProducts />
        </div>
        <footer className={styles.footer}>
          <span>© 2026 AuraStore Admin</span>
          <span>
            All systems operational <i></i>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
