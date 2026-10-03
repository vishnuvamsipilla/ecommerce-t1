import { useEffect, useState } from "react";
import { Link } from "react-router";
import axiosClient from "../../api/axiosClient";
import {
  LoadingState,
  ProductCard,
  StorefrontLayout,
} from "./StorefrontLayout";
import styles from "./storefront.module.scss";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    Promise.all([axiosClient.get("/products"), axiosClient.get("/categories")])
      .then(([productsResponse, categoriesResponse]) => {
        setProducts(productsResponse.data?.data || []);
        setCategories(categoriesResponse.data?.data || []);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <StorefrontLayout categories={categories}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>The new everyday / 01</span>
          <h1>Things worth living in.</h1>
          <p>
            Quietly expressive pieces for the shape of your everyday. Designed
            to be worn often and kept close.
          </p>
          <Link className={styles.heroLink} to="/categories/all">
            Explore the collection -&gt;
          </Link>
        </div>
        <div
          className={styles.heroArt}
          aria-label="AuraStore collection artwork"
        >
          <span className={styles.heroMark}>A</span>
        </div>
      </section>

      {state === "loading" && <LoadingState />}
      {state === "error" && (
        <div className={styles.errorState}>
          The collection could not be loaded.
        </div>
      )}
      {state === "ready" && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2>New arrivals</h2>
            <Link to="/categories/all">View all pieces -&gt;</Link>
          </div>
          <div className={styles.productGrid}>
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </StorefrontLayout>
  );
}
