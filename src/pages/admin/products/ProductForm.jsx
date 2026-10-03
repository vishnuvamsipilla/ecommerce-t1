import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import axiosClient from "../../../api/axiosClient";
import { clearAuthToken } from "../../../utils/auth";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";
import dashboardStyles from "../../../components/dashboard/dashboard.module.scss";
import styles from "./product.module.scss";

const defaultValues = {
  name: "",
  description: "",
  slug: "",
  category: "",
  price: "",
  stock: "",
  status: "active",
  imageUrls: "",
};

export default function ProductForm() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const [categories, setCategories] = useState([]);
  const [activeNav, setActiveNav] = useState("Products");
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const categoryRequest = axiosClient.get("/categories");
        const productRequest = isEditMode
          ? axiosClient.get(`/products/${productId}`)
          : Promise.resolve(null);
        const [categoryResponse, productResponse] = await Promise.all([
          categoryRequest,
          productRequest,
        ]);
        setCategories(categoryResponse.data?.data || []);

        if (isEditMode) {
          const product = productResponse.data?.data;
          if (!product) {
            setNotice("Product could not be found.");
          } else {
            reset({
              name: product.name,
              description: product.description || "",
              slug: product.slug,
              category:
                typeof product.category === "string"
                  ? product.category
                  : product.category?._id || "",
              price: product.price,
              stock: product.stock,
              status: product.status || "active",
              imageUrls: (product.images || []).join("\n"),
            });
          }
        }
      } catch (error) {
        if (error.response?.status === 401) {
          clearAuthToken();
          navigate("/login", { replace: true });
          return;
        }
        setNotice("Product details could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, [isEditMode, navigate, productId, reset]);

  const saveProduct = async (formData) => {
    setNotice(null);
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: formData.imageUrls
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    };
    delete payload.imageUrls;

    try {
      if (isEditMode)
        await axiosClient.patch(`/products/${productId}`, payload);
      else await axiosClient.post("/products", payload);
      navigate("/admin/products");
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthToken();
        navigate("/login", { replace: true });
        return;
      }
      setNotice(
        error.response?.data?.message ||
          "Product could not be saved. Please try again.",
      );
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
        <Topbar title={isEditMode ? "Edit product" : "New product"} />
        <div className={styles.productContent}>
          <header className={styles.pageHeader}>
            <div>
              <p className={styles.eyebrow}>Catalog management</p>
              <h1>{isEditMode ? "Edit product" : "Create product"}</h1>
              <p>
                {isEditMode
                  ? "Update product details and inventory."
                  : "Add a product to your catalog."}
              </p>
            </div>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate("/admin/products")}
            >
              Back to products
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
                <h2>Product details</h2>
                <p>
                  SKU is generated by the server when the product is created.
                </p>
              </div>
            </div>
            {isLoading ? (
              <div className={styles.emptyState}>
                Loading product details...
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(saveProduct)}
                className={styles.productForm}
                noValidate
              >
                <div className={styles.formGrid}>
                  <div>
                    <label htmlFor="product-name">Name</label>
                    <input
                      id="product-name"
                      placeholder="e.g. Relaxed Cotton Shirt"
                      {...register("name", {
                        required: "Product name is required",
                      })}
                    />
                    {errors.name && (
                      <span className={styles.fieldError}>
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label htmlFor="product-slug">Slug</label>
                    <input
                      id="product-slug"
                      placeholder="e.g. relaxed-cotton-shirt"
                      {...register("slug", {
                        required: "Product slug is required",
                      })}
                    />
                    {errors.slug && (
                      <span className={styles.fieldError}>
                        {errors.slug.message}
                      </span>
                    )}
                  </div>
                </div>
                <label htmlFor="product-description">
                  Description <span>Optional</span>
                </label>
                <textarea
                  id="product-description"
                  rows="4"
                  placeholder="Describe this product"
                  {...register("description")}
                />
                <div className={styles.formGrid}>
                  <div>
                    <label htmlFor="product-category">Category</label>
                    <select
                      id="product-category"
                      {...register("category", {
                        required: "Product category is required",
                      })}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option value={category._id} key={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span className={styles.fieldError}>
                        {errors.category.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label htmlFor="product-status">Status</label>
                    <select id="product-status" {...register("status")}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formGrid}>
                  <div>
                    <label htmlFor="product-price">Price</label>
                    <input
                      id="product-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...register("price", {
                        required: "Product price is required",
                        min: { value: 0, message: "Price cannot be negative" },
                      })}
                    />
                    {errors.price && (
                      <span className={styles.fieldError}>
                        {errors.price.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label htmlFor="product-stock">Stock</label>
                    <input
                      id="product-stock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      {...register("stock", {
                        required: "Stock is required",
                        min: { value: 0, message: "Stock cannot be negative" },
                      })}
                    />
                    {errors.stock && (
                      <span className={styles.fieldError}>
                        {errors.stock.message}
                      </span>
                    )}
                  </div>
                </div>
                <label htmlFor="product-images">
                  Image URLs <span>Optional, one URL per line</span>
                </label>
                <textarea
                  id="product-images"
                  rows="3"
                  placeholder="https://example.com/product-image.jpg"
                  {...register("imageUrls")}
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
                      : "Create product"}
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
