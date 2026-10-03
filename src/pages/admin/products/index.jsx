import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../../api/axiosClient";
import { clearAuthToken } from "../../../utils/auth";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";
import dashboardStyles from "../../../components/dashboard/dashboard.module.scss";
import Icon from "../../../components/dashboard/Icon";
import styles from "./product.module.scss";

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("Products");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [productResponse, categoryResponse, userResponse] =
          await Promise.all([
            axiosClient.get("/products"),
            axiosClient.get("/categories"),
            axiosClient.get("/auth/user"),
          ]);
        setProducts(productResponse.data?.data || []);
        setCategories(categoryResponse.data?.data || []);
        setUser(userResponse.data?.data?.user || null);
      } catch (error) {
        if (error.response?.status === 401) {
          clearAuthToken();
          navigate("/login", { replace: true });
          return;
        }
        setNotice("Products could not be loaded. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, [navigate]);

  const categoryName = (category) => {
    const categoryId = typeof category === "string" ? category : category?._id;
    return (
      categories.find((item) => item._id === categoryId)?.name ||
      "Uncategorized"
    );
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete the ${product.name} product?`)) return;
    setDeletingId(product._id);
    setNotice(null);

    try {
      await axiosClient.delete(`/products/${product._id}`);
      setProducts((currentProducts) =>
        currentProducts.filter((item) => item._id !== product._id),
      );
      setNotice("Product deleted successfully.");
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthToken();
        navigate("/login", { replace: true });
        return;
      }
      setNotice(
        error.response?.data?.message || "Product could not be deleted.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login");
  };

  return (
    <div className={dashboardStyles.dashboardPage}>
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onLogout={handleLogout}
      />
      <main className={dashboardStyles.dashboardMain}>
        <Topbar user={user} title="Products" />
        <div className={styles.productContent}>
          <header className={styles.pageHeader}>
            <div>
              <p className={styles.eyebrow}>Catalog management</p>
              <h1>Products</h1>
              <p>Manage product details, inventory, pricing, and categories.</p>
            </div>
            <button
              type="button"
              className={styles.createButton}
              onClick={() => navigate("/admin/products/new")}
            >
              <Icon name="box" /> New product
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
                <h2>All products</h2>
                <p>{products.length} products in your catalog</p>
              </div>
              <span className={styles.activeLabel}>Product catalog</span>
            </div>
            {isLoading ? (
              <div className={styles.emptyState}>Loading products...</div>
            ) : products.length === 0 ? (
              <div className={styles.emptyState}>
                No products yet. Create your first product.
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.productTable}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <span className={styles.productIdentity}>
                            <span className={styles.productMark}>
                              {product.name.charAt(0).toUpperCase()}
                            </span>
                            <span>
                              <strong>{product.name}</strong>
                              <small>{product.sku || "SKU pending"}</small>
                            </span>
                          </span>
                        </td>
                        <td>
                          <span className={styles.categoryTag}>
                            {categoryName(product.category)}
                          </span>
                        </td>
                        <td>${Number(product.price).toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span
                            className={`${styles.statusTag} ${product.status === "inactive" ? styles.inactive : ""}`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td>{formatDate(product.createdAt)}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() =>
                              navigate(`/admin/products/${product._id}/edit`)
                            }
                          >
                            <Icon name="edit" /> Edit
                          </button>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => deleteProduct(product)}
                            disabled={deletingId === product._id}
                          >
                            <Icon name="trash" />{" "}
                            {deletingId === product._id ? "Deleting" : "Delete"}
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
