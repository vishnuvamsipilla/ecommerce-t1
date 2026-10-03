import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../../api/axiosClient";
import {
  LoadingState,
  ProductCard,
  StorefrontLayout,
} from "./StorefrontLayout";
import styles from "./storefront.module.scss";

export default function CategoryListing() {
  const { categorySlug = "all" } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState("featured");
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

  const categoryPath = `/${categorySlug}`;
  const activeCategory = categories.find(
    (category) => category.slug === categoryPath,
  );
  const visibleProducts = useMemo(() => {
    const filtered = activeCategory
      ? products.filter(
          (product) =>
            product.category?._id === activeCategory._id ||
            product.category === activeCategory._id,
        )
      : products;
    return [...filtered].sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      return first.name.localeCompare(second.name);
    });
  }, [activeCategory, products, sort]);

  return (
    <StorefrontLayout categories={categories}>
      <header className={styles.listingHeader}>
        <span className={styles.kicker}>
          The collection / {visibleProducts.length} pieces
        </span>
        <h1>{activeCategory?.name || "All pieces"}</h1>
        <p>
          {activeCategory?.description ||
            "A considered edit of essentials, layers, and everyday favorites."}
        </p>
      </header>
      {state === "loading" && <LoadingState text="Loading pieces" />}
      {state === "error" && (
        <div className={styles.errorState}>
          The collection could not be loaded.
        </div>
      )}
      {state === "ready" && (
        <section className={styles.section}>
          <div className={styles.filterBar}>
            <span>{visibleProducts.length} results</span>
            <label>
              Sort by{" "}
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>
          <div className={styles.productGrid}>
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </StorefrontLayout>
  );
}
