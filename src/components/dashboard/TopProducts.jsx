import React from "react";
import styles from "./dashboard.module.scss";
import { topProducts } from "./dashboardData";
import Icon from "./Icon";

export default function TopProducts() {
  return (
    <section className={`${styles.panel} ${styles.productsPanel}`}>
      <div className={styles.panelHeader}>
        <div>
          <h2>Top products</h2>
          <p>Your best performing products this month</p>
        </div>
        <button type="button" className={styles.textButton}>
          View products <Icon name="arrow" />
        </button>
      </div>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Units sold</th>
              <th>Revenue</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={product.name}>
                <td>
                  <span
                    className={`${styles.productThumb} ${styles[`product${index + 1}`]}`}
                  >
                    {index + 1}
                  </span>
                  <strong>{product.name}</strong>
                </td>
                <td>
                  <span className={styles.categoryTag}>{product.category}</span>
                </td>
                <td>{product.sold}</td>
                <td>
                  <strong>{product.revenue}</strong>
                </td>
                <td>
                  <span className={styles.tableTrend}>
                    <Icon name="trend" /> {product.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
