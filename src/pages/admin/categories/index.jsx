import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../../api/axiosClient";
import { clearAuthToken } from "../../../utils/auth";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";
import dashboardStyles from "../../../components/dashboard/dashboard.module.scss";
import Icon from "../../../components/dashboard/Icon";
import styles from "./category.module.scss";

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeNav, setActiveNav] = useState("Categories");
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [user, setUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [categoryResponse, userResponse] = await Promise.all([
          axiosClient.get("/categories"),
          axiosClient.get("/auth/user"),
        ]);
        setCategories(categoryResponse.data?.data || []);
        setUser(userResponse.data?.data?.user || null);
      } catch (error) {
        if (error.response?.status === 401) {
          clearAuthToken();
          navigate("/login", { replace: true });
          return;
        }

        setNotice("Categories could not be loaded. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, [navigate]);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login");
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete the ${category.name} category?`)) {
      return;
    }

    setDeletingId(category._id);
    setNotice(null);

    try {
      await axiosClient.delete(`/categories/${category._id}`);
      setCategories((currentCategories) =>
        currentCategories.filter((item) => item._id !== category._id),
      );
      setNotice("Category deleted successfully.");
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthToken();
        navigate("/login", { replace: true });
        return;
      }

      setNotice(
        error.response?.data?.message ||
          "Category could not be deleted. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={dashboardStyles.dashboardPage}>
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onLogout={handleLogout}
      />
      <main className={dashboardStyles.dashboardMain}>
        <Topbar user={user} title="Categories" />
        <div className={styles.categoryContent}>
          <header className={styles.pageHeader}>
            <div>
              <p className={styles.eyebrow}>Catalog management</p>
              <h1>Categories</h1>
              <p>Manage the collections used across your store.</p>
            </div>
            <button
              type="button"
              className={styles.createButton}
              onClick={() => navigate("/admin/categories/new")}
            >
              <Icon name="tag" /> New category
            </button>
          </header>

          {notice && (
            <div className={`${styles.notice} ${styles.error}`} role="alert">
              {notice}
            </div>
          )}

          <section className={styles.tableCard}>
            <div className={styles.tableHeading}>
              <div>
                <h2>All categories</h2>
                <p>{categories.length} categories in your catalog</p>
              </div>
              <span className={styles.activeLabel}>Active catalog</span>
            </div>
            {isLoading ? (
              <div className={styles.emptyState}>Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className={styles.emptyState}>
                No categories yet. Create your first category.
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.categoryTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Slug</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id}>
                        <td>
                          <span className={styles.categoryIdentity}>
                            <span className={styles.categoryMark}>
                              {category.name.charAt(0).toUpperCase()}
                            </span>
                            <strong>{category.name}</strong>
                          </span>
                        </td>
                        <td>
                          {category.description || "No description provided"}
                        </td>
                        <td>
                          <code>{category.slug}</code>
                        </td>
                        <td>
                          <span className={styles.statusTag}>
                            {category.status}
                          </span>
                        </td>
                        <td>{formatDate(category.createdAt)}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() =>
                              navigate(`/admin/categories/${category._id}/edit`)
                            }
                          >
                            <Icon name="edit" /> Edit
                          </button>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => deleteCategory(category)}
                            disabled={deletingId === category._id}
                          >
                            <Icon name="trash" />
                            {deletingId === category._id
                              ? "Deleting"
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
        <footer className={dashboardStyles.footer}>
          <span>© 2026 AuraStore Admin</span>
          <span>
            All systems operational <i></i>
          </span>
        </footer>
      </main>
    </div>
  );
}
