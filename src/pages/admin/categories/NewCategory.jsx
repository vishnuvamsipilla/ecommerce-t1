import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import axiosClient from "../../../api/axiosClient";
import { clearAuthToken } from "../../../utils/auth";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";
import dashboardStyles from "../../../components/dashboard/dashboard.module.scss";
import styles from "./category.module.scss";

export default function NewCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const isEditMode = Boolean(categoryId);
  const [activeNav, setActiveNav] = useState("Categories");
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", description: "", slug: "" } });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadCategory = async () => {
      try {
        const response = await axiosClient.get(`/categories/${categoryId}`);
        const category = response.data?.data;

        if (!category) {
          setNotice("Category could not be found.");
          return;
        }

        reset({
          name: category.name,
          description: category.description || "",
          slug: category.slug,
        });
      } catch (error) {
        if (error.response?.status === 401) {
          clearAuthToken();
          navigate("/login", { replace: true });
          return;
        }

        setNotice("Category details could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [categoryId, isEditMode, navigate, reset]);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login");
  };

  const saveCategory = async (data) => {
    setNotice(null);

    try {
      if (isEditMode) {
        await axiosClient.patch(`/categories/${categoryId}`, data);
      } else {
        await axiosClient.post("/categories", data);
      }
      navigate("/admin/categories");
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthToken();
        navigate("/login", { replace: true });
        return;
      }

      setNotice(
        error.response?.data?.message ||
          "Category could not be created. Please try again.",
      );
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
        <Topbar title={isEditMode ? "Edit category" : "New category"} />
        <div className={styles.categoryContent}>
          <header className={styles.pageHeader}>
            <div>
              <p className={styles.eyebrow}>Catalog management</p>
              <h1>{isEditMode ? "Edit category" : "Create category"}</h1>
              <p>
                {isEditMode
                  ? "Update this collection's catalog details."
                  : "Add a collection for your store catalog."}
              </p>
            </div>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate("/admin/categories")}
            >
              Back to categories
            </button>
          </header>
          {notice && (
            <div className={`${styles.notice} ${styles.error}`} role="alert">
              {notice}
            </div>
          )}
          <article className={styles.formCard}>
            <div className={styles.cardHeading}>
              <span className={styles.headingIcon}>+</span>
              <div>
                <h2>Category details</h2>
                <p>Name, slug, and description for this collection.</p>
              </div>
            </div>
            {isLoading ? (
              <div className={styles.emptyState}>
                Loading category details...
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(saveCategory)}
                className={styles.categoryForm}
                noValidate
              >
                <label htmlFor="category-name">Name</label>
                <input
                  id="category-name"
                  placeholder="e.g. Mens"
                  {...register("name", {
                    required: "Category name is required",
                  })}
                />
                {errors.name && (
                  <span className={styles.fieldError}>
                    {errors.name.message}
                  </span>
                )}
                <label htmlFor="category-slug">Slug</label>
                <input
                  id="category-slug"
                  placeholder="e.g. /mens"
                  {...register("slug", {
                    required: "Category slug is required",
                  })}
                />
                {errors.slug && (
                  <span className={styles.fieldError}>
                    {errors.slug.message}
                  </span>
                )}
                <label htmlFor="category-description">
                  Description <span>Optional</span>
                </label>
                <textarea
                  id="category-description"
                  rows="5"
                  placeholder="Describe the products in this category"
                  {...register("description")}
                />
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save changes"
                      : "Create category"}
                </button>
              </form>
            )}
          </article>
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
