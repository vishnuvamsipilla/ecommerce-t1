import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axiosClient from "../../api/axiosClient";
import { LoadingState, StorefrontLayout } from "./StorefrontLayout";
import styles from "./storefront.module.scss";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [state, setState] = useState("loading");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    Promise.all([
      axiosClient.get(`/products/${productId}`),
      axiosClient.get("/categories"),
    ])
      .then(([productResponse, categoriesResponse]) => {
        setProduct(productResponse.data?.data || null);
        setCategories(categoriesResponse.data?.data || []);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, [productId]);

  if (state === "loading")
    return (
      <StorefrontLayout categories={categories}>
        <LoadingState />
      </StorefrontLayout>
    );
  if (state === "error" || !product)
    return (
      <StorefrontLayout categories={categories}>
        <div className={styles.errorState}>
          This product could not be found.
        </div>
      </StorefrontLayout>
    );

  const unavailable = product.status === "inactive" || product.stock <= 0;
  const category = categories.find(
    (item) => item._id === (product.category?._id || product.category),
  );

  return (
    <StorefrontLayout categories={categories}>
      <section className={styles.detail}>
        <div className={styles.detailVisual}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} />
          ) : (
            <span>{product.name.slice(0, 1)}</span>
          )}
        </div>
        <div className={styles.detailCopy}>
          <span className={styles.kicker}>
            {category?.name || "AuraStore collection"}
          </span>
          <h1>{product.name}</h1>
          <p className={styles.detailDescription}>
            {product.description || "A considered piece for everyday wear."}
          </p>
          <div className={styles.detailMeta}>
            <span>${Number(product.price).toFixed(2)}</span>
            <span>
              {unavailable ? "Unavailable" : `${product.stock} in stock`}
            </span>
          </div>
          <button
            className={styles.addButton}
            type="button"
            disabled={unavailable}
            onClick={() => setAdded(true)}
          >
            {added
              ? "Added to bag"
              : unavailable
                ? "Currently unavailable"
                : "Add to bag"}
          </button>
          <p className={styles.detailDescription}>
            <Link to="/categories/all">
              Continue browsing the collection -&gt;
            </Link>
          </p>
        </div>
      </section>
    </StorefrontLayout>
  );
}
