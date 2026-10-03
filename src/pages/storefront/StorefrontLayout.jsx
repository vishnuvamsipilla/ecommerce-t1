import { Link, useNavigate } from "react-router";
import { useState } from "react";
import styles from "./storefront.module.scss";

export function StorefrontLayout({ categories = [], children }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <div className={styles.storefront}>
      <div className={styles.announcement}>
        Complimentary delivery on orders over $75
      </div>
      <header className={styles.header}>
        <Link className={styles.logo} to="/">
          AURA<span>STORE</span>
        </Link>
        <form className={styles.search} onSubmit={submitSearch}>
          <span aria-hidden="true">/</span>
          <input
            aria-label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the collection"
          />
          <button type="submit" aria-label="Submit search">
            Enter
          </button>
        </form>
        <nav className={styles.headerNav} aria-label="Store navigation">
          <Link to="/">Home</Link>
          <Link to="/categories/all">Shop</Link>
          <Link to="/login">Account</Link>
          <button
            type="button"
            aria-label="Shopping bag"
            className={styles.bag}
          >
            Bag <span>0</span>
          </button>
        </nav>
      </header>
      {categories.length > 0 && (
        <nav className={styles.categoryNav} aria-label="Product categories">
          <Link to="/categories/all">All pieces</Link>
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/categories/${category.slug.replace(/^\//, "")}`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}
      <main>{children}</main>
      <footer className={styles.footer}>
        <span>AuraStore / Everyday form, considered.</span>
        <span>Customer care &nbsp; Shipping &nbsp; Returns</span>
      </footer>
    </div>
  );
}

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const unavailable = product.status === "inactive" || product.stock <= 0;

  return (
    <article className={styles.productCard}>
      <button
        type="button"
        className={styles.productVisual}
        onClick={() => navigate(`/products/${product._id}`)}
        aria-label={`View ${product.name}`}
      >
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <span>{product.name.slice(0, 1)}</span>
        )}
        {unavailable && <em>Currently unavailable</em>}
      </button>
      <div className={styles.productInfo}>
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <strong>${Number(product.price).toFixed(2)}</strong>
      </div>
    </article>
  );
}

export function LoadingState({ text = "Loading the collection" }) {
  return (
    <div className={styles.loading}>
      {text}
      <span>...</span>
    </div>
  );
}
