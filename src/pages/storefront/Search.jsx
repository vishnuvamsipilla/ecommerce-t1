import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import axiosClient from "../../api/axiosClient";
import {
  LoadingState,
  ProductCard,
  StorefrontLayout,
} from "./StorefrontLayout";
import styles from "./storefront.module.scss";

const initialFilters = {
  query: "",
  category: "all",
  minPrice: "",
  maxPrice: "",
  availability: "all",
  sort: "featured",
};
const PAGE_SIZE = 8;

function categoryId(product) {
  return typeof product.category === "string"
    ? product.category
    : product.category?._id;
}

function getSortPayload(sort) {
  if (sort === "price-low") return { fieldname: "price", value: 1 };
  if (sort === "price-high") return { fieldname: "price", value: -1 };
  if (sort === "name") return { fieldname: "name", value: 1 };
  return { fieldname: "createdAt", value: -1 };
}

function getSearchPayload(filters, skip) {
  const payload = {
    query: filters.query.trim(),
    category: filters.category === "all" ? undefined : filters.category,
    availability: filters.availability,
    sort: getSortPayload(filters.sort),
    skip,
    limit: PAGE_SIZE,
  };

  if (filters.minPrice !== "" || filters.maxPrice !== "") {
    payload.price = {};
    if (filters.minPrice !== "")
      payload.price.minPrice = Number(filters.minPrice);
    if (filters.maxPrice !== "")
      payload.price.maxPrice = Number(filters.maxPrice);
  }

  return payload;
}

export default function ProductSearch() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...initialFilters,
    query: searchParams.get("q") || "",
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [state, setState] = useState("loading");
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadSearchResults = async () => {
      setState("loading");
      try {
        const [searchResponse, categoryResponse] = await Promise.all([
          axiosClient.post("/products/search", getSearchPayload(filters, 0)),
          axiosClient.get("/categories"),
        ]);
        if (cancelled) return;
        const batch = Array.isArray(searchResponse.data?.data)
          ? searchResponse.data.data
          : searchResponse.data?.data
            ? [searchResponse.data.data]
            : [];
        setProducts(batch);
        setHasMore(batch.length === PAGE_SIZE);
        setCategories(categoryResponse.data?.data || []);
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    };

    loadSearchResults();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    try {
      const response = await axiosClient.post(
        "/products/search",
        getSearchPayload(filters, products.length),
      );
      const data = response.data?.data;
      const batch = Array.isArray(data) ? data : data ? [data] : [];
      setProducts((currentProducts) => [...currentProducts, ...batch]);
      setHasMore(batch.length === PAGE_SIZE);
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const visibleProducts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const minPrice = filters.minPrice === "" ? 0 : Number(filters.minPrice);
    const maxPrice =
      filters.maxPrice === "" ? Infinity : Number(filters.maxPrice);
    const filtered = products.filter((product) => {
      const searchableText = [product.name, product.description, product.sku]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !query || searchableText.includes(query);
      const matchesCategory =
        filters.category === "all" || categoryId(product) === filters.category;
      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;
      const matchesAvailability =
        filters.availability === "all" ||
        (filters.availability === "in-stock" &&
          product.stock > 0 &&
          product.status === "active") ||
        (filters.availability === "out-of-stock" &&
          (product.stock <= 0 || product.status === "inactive"));
      return (
        matchesQuery && matchesCategory && matchesPrice && matchesAvailability
      );
    });

    return [...filtered].sort((first, second) => {
      if (filters.sort === "price-low") return first.price - second.price;
      if (filters.sort === "price-high") return second.price - first.price;
      if (filters.sort === "name") return first.name.localeCompare(second.name);
      return 0;
    });
  }, [filters, products]);

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  return (
    <StorefrontLayout categories={categories}>
      <header className={styles.listingHeader}>
        <span className={styles.kicker}>
          Search / {visibleProducts.length} pieces
        </span>
        <h1>
          {filters.query ? `Results for "${filters.query}"` : "Find your piece"}
        </h1>
        <p>
          Search by product, SKU, or description, then narrow the collection by
          category, price, and availability.
        </p>
      </header>
      <section className={styles.searchSection}>
        <div className={styles.searchFilters}>
          <label className={styles.filterField}>
            Search
            <input
              value={filters.query}
              onChange={(event) => updateFilter("query", event.target.value)}
              placeholder="Product name or SKU"
            />
          </label>
          <label className={styles.filterField}>
            Category
            <select
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.filterField}>
            Min price
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => updateFilter("minPrice", event.target.value)}
              placeholder="$0"
            />
          </label>
          <label className={styles.filterField}>
            Max price
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
              placeholder="$999"
            />
          </label>
          <label className={styles.filterField}>
            Availability
            <select
              value={filters.availability}
              onChange={(event) =>
                updateFilter("availability", event.target.value)
              }
            >
              <option value="all">Everything</option>
              <option value="in-stock">In stock</option>
              <option value="out-of-stock">Unavailable</option>
            </select>
          </label>
          <label className={styles.filterField}>
            Sort
            <select
              value={filters.sort}
              onChange={(event) => updateFilter("sort", event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="name">Name</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
          <button
            className={styles.resetButton}
            type="button"
            onClick={resetFilters}
          >
            Reset filters
          </button>
        </div>

        {state === "loading" && (
          <LoadingState text="Searching the collection" />
        )}
        {state === "error" && (
          <div className={styles.errorState}>
            Search is unavailable right now.
          </div>
        )}
        {state === "ready" &&
          (visibleProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {visibleProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              No pieces match these filters.
            </div>
          ))}
        {state === "ready" && visibleProducts.length > 0 && hasMore && (
          <div className={styles.loadMoreWrap}>
            <button
              className={styles.loadMoreButton}
              type="button"
              onClick={loadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading more" : "Load more"}
            </button>
          </div>
        )}
      </section>
    </StorefrontLayout>
  );
}
