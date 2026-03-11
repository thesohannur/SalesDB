# Dashboard Charts Reference

> Auto-generated documentation for all charts and graphs across every dashboard in the SalesDB application.
> Charting library: **Recharts** (React)

---

## Table of Contents

1. [Daily Sales Chart](#1-daily-sales-chart)
2. [Quantity Sold Dashboard](#2-quantity-sold-dashboard)
3. [Revenue Per Product Dashboard](#3-revenue-per-product-dashboard)
4. [Revenue Per Category Dashboard](#4-revenue-per-category-dashboard)
5. [Revenue Per Seller Dashboard](#5-revenue-per-seller-dashboard)
6. [Phase 3 — AOV Dashboard](#6-phase-3--aov-dashboard)
7. [Phase 3 — CLTV Dashboard](#7-phase-3--cltv-dashboard)
8. [Phase 3 — Monthly Order Count Dashboard](#8-phase-3--monthly-order-count-dashboard)
9. [Phase 3 — Monthly Revenue Per Year Dashboard](#9-phase-3--monthly-revenue-per-year-dashboard)
10. [Phase 3 — Monthly Sales Trend Dashboard](#10-phase-3--monthly-sales-trend-dashboard)
11. [Phase 6 — Category Profit Margin Dashboard](#11-phase-6--category-profit-margin-dashboard)
12. [Phase 6 — Product Profit Margin Dashboard](#12-phase-6--product-profit-margin-dashboard)
13. [Phase 6 — Revenue Decrease Ratio Dashboard](#13-phase-6--revenue-decrease-ratio-dashboard)
14. [Phase 6 — YoY Revenue Growth Dashboard](#14-phase-6--yoy-revenue-growth-dashboard)
15. [Phase 8 — Failed Payments Dashboard](#15-phase-8--failed-payments-dashboard)
16. [Phase 8 — Fast Moving Products Dashboard](#16-phase-8--fast-moving-products-dashboard)
17. [Phase 8 — High Return Products Dashboard](#17-phase-8--high-return-products-dashboard)
18. [Phase 8 — High Return Rate Customers Dashboard](#18-phase-8--high-return-rate-customers-dashboard)
19. [Phase 8 — Inventory Intelligence Score Dashboard](#19-phase-8--inventory-intelligence-score-dashboard)
20. [Phase 8 — Low Stock Dashboard](#20-phase-8--low-stock-dashboard)
21. [Phase 8 — Monthly Revenue Drop Dashboard](#21-phase-8--monthly-revenue-drop-dashboard)
22. [Phase 8 — Seller High Returns (All Time) Dashboard](#22-phase-8--seller-high-returns-all-time-dashboard)
23. [Phase 8 — Seller High Returns (Recent Period) Dashboard](#23-phase-8--seller-high-returns-recent-period-dashboard)
24. [Phase 8 — Warehouse Load Intelligence Dashboard](#24-phase-8--warehouse-load-intelligence-dashboard)
25. [Phase 8 — Weekly Revenue Drop Dashboard](#25-phase-8--weekly-revenue-drop-dashboard)
26. [Phase 8 — Yearly Revenue Drop Dashboard](#26-phase-8--yearly-revenue-drop-dashboard)

---

## 1. Daily Sales Chart

**File:** `src/components/DailySalesChart.jsx`

### Chart 1 — Daily Sales Trend

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | `sales_date` — Calendar date |
| **Y-Axis** | `total_sales_amount` — Revenue in USD ($) |
| **Series** | Single line: Total Sales Amount |

### Chart 2 — Daily Orders & Items Sold

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped) |
| **X-Axis** | `sales_date` — Calendar date |
| **Y-Axis** | Count (number of orders or items) |
| **Series** | Bar 1: `total_orders` (order count) · Bar 2: `total_quantity_sold` (items sold) |

---

## 2. Quantity Sold Dashboard

**File:** `src/components/QuantitySoldDashboard.jsx`
> Contains 4 switchable views controlled by a view selector.

### Chart 1 — Top 20 Products by Quantity Sold *(All-Time view)*

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `product_name` — Product name |
| **Y-Axis** | `total_quantity_sold` — Total units sold |

### Chart 2 — Top 10 Products in [Year] *(Year view)*

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `product_name` — Product name |
| **Y-Axis** | `total_quantity_sold` — Units sold in selected year |

### Chart 3 — Quantity Sold by Category *(Category view)*

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `category_name` — One slice per category |
| **Value** | `total_quantity_sold` — Units sold per category |

### Chart 4 — Top 10 Categories in [Year] *(Category-Year view)*

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `category_name` — Category name |
| **Y-Axis** | `total_quantity_sold` — Units sold in selected year |

---

## 3. Revenue Per Product Dashboard

**File:** `src/components/RevenueDashboardPerProduct.jsx`

### Chart 1 — Revenue by Product

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `total_revenue` — Revenue in USD ($) |

---

## 4. Revenue Per Category Dashboard

**File:** `src/components/RevenuePerCategory.jsx`

### Chart 1 — Revenue Distribution by Category

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `category_name` — One slice per category |
| **Value** | `total_revenue` — Revenue contribution ($) |

### Chart 2 — Products Sold Distribution by Category

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `category_name` — One slice per category |
| **Value** | `total_products_sold` — Units sold per category |

### Chart 3 — Revenue by Category

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `category_name` — Category name |
| **X-Axis** | `total_revenue` — Revenue in USD ($) |

### Chart 4 — Products Sold by Category

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `category_name` — Category name |
| **X-Axis** | `total_products_sold` — Units sold (count) |

---

## 5. Revenue Per Seller Dashboard

**File:** `src/components/RevenuePerSeller.jsx`

### Chart 1 — Revenue by Seller

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `seller_name` — Seller name |
| **X-Axis** | `total_revenue` — Revenue in USD ($) |

### Chart 2 — Products Sold by Seller

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `seller_name` — Seller name |
| **X-Axis** | `total_products_sold` — Units sold (count) |

---

## 6. Phase 3 — AOV Dashboard

**File:** `src/components/Phase3_Dashboard/AOVDashboard.jsx`
*(Average Order Value Dashboard)*

### Chart 1 — Average Order Value Trend

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart |
| **X-Axis** | `sales_month` — Month |
| **Y-Axis** | USD ($) — Order value |
| **Series** | Area: `avg_order_value` (average order value) · Line: `median_order_value` (median order value) |

### Chart 2 — Order Value Range (Min – Max)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped) |
| **X-Axis** | `sales_month` — Month |
| **Y-Axis** | USD ($) — Order value |
| **Series** | Bar 1: `min_order_value` (minimum) · Bar 2: `max_order_value` (maximum) |

### Chart 3 — Monthly Orders

| Property | Value |
|---|---|
| **Chart Type** | BarChart |
| **X-Axis** | `sales_month` — Month |
| **Y-Axis** | `total_orders` — Order count |

### Chart 4 — Monthly Revenue

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | `sales_month` — Month |
| **Y-Axis** | `total_revenue` — Revenue in USD ($) |

### Chart 5 — AOV Components (Avg vs Median)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped) |
| **X-Axis** | `sales_month` — Month |
| **Y-Axis** | USD ($) — Order value |
| **Series** | Bar 1: `avg_order_value` · Bar 2: `median_order_value` |

---

## 7. Phase 3 — CLTV Dashboard

**File:** `src/components/Phase3_Dashboard/CLTVDashboard.jsx`
*(Customer Lifetime Value Dashboard)*

### Chart 1 — Top 20 Customers by Lifetime Value

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `customer_name` — Customer name |
| **X-Axis** | `total_revenue` — Lifetime revenue in USD ($) |
| **Color Coding** | Bar color = `customer_segment` (VIP / High / Medium / Low Value) |

### Chart 2 — Revenue by Customer Segment

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | Customer segment name (VIP / High / Medium / Low Value) |
| **Value** | Total revenue per segment ($) |

### Chart 3 — Customer Count by Segment

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | Customer segment name |
| **Y-Axis** | Number of customers (count) |

---

## 8. Phase 3 — Monthly Order Count Dashboard

**File:** `src/components/Phase3_Dashboard/MonthlyOrderCount.jsx`

### Chart 1 — Monthly Order Count Trend

| Property | Value |
|---|---|
| **Chart Type** | AreaChart |
| **X-Axis** | Month |
| **Y-Axis** | `total_orders` — Order count |
| **Notes** | Gradient fill under the area |

### Chart 2 — Monthly Customers

| Property | Value |
|---|---|
| **Chart Type** | BarChart |
| **X-Axis** | Month |
| **Y-Axis** | `total_customers` — Unique customer count |

### Chart 3 — Monthly Revenue

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | Month |
| **Y-Axis** | `total_revenue` — Revenue in USD ($) |

### Chart 4 — Average Order Value by Month

| Property | Value |
|---|---|
| **Chart Type** | BarChart |
| **X-Axis** | Month |
| **Y-Axis** | `avg_order_value` — Average order value in USD ($) |

---

## 9. Phase 3 — Monthly Revenue Per Year Dashboard

**File:** `src/components/Phase3_Dashboard/MonthlyRevenuePerYear.jsx`

### Chart 1 — Monthly Revenue Trend

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | Month |
| **Y-Axis** | `total_revenue` — Revenue in USD ($) |

### Chart 2 — Monthly Orders

| Property | Value |
|---|---|
| **Chart Type** | BarChart |
| **X-Axis** | Month |
| **Y-Axis** | `total_orders` — Order count |

### Chart 3 — Products Sold

| Property | Value |
|---|---|
| **Chart Type** | BarChart |
| **X-Axis** | Month |
| **Y-Axis** | `total_products_sold` — Units sold (count) |

---

## 10. Phase 3 — Monthly Sales Trend Dashboard

**File:** `src/components/Phase3_Dashboard/MonthlySalesTrend.jsx`

### Chart 1 — Revenue & Orders Trend

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart (dual Y-axis) |
| **X-Axis** | Month |
| **Y-Axis (Left)** | `total_revenue` — Revenue in USD ($) |
| **Y-Axis (Right)** | `total_orders` — Order count |
| **Series** | Area: `total_revenue` · Line: `total_orders` |

### Chart 2 — Month-over-Month Revenue Growth

| Property | Value |
|---|---|
| **Chart Type** | BarChart |
| **X-Axis** | Month |
| **Y-Axis** | `revenue_growth_pct` — Growth percentage (%) |
| **Color Coding** | Green = positive growth · Red = negative (decline) |

### Chart 3 — Monthly Customers

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | Month |
| **Y-Axis** | `total_customers` — Unique customer count |

### Chart 4 — Products Sold

| Property | Value |
|---|---|
| **Chart Type** | BarChart |
| **X-Axis** | Month |
| **Y-Axis** | `total_products_sold` — Units sold (count) |

---

## 11. Phase 6 — Category Profit Margin Dashboard

**File:** `src/components/Phase6_Dashboard/CategoryProfitMarginDashboard.jsx`

### Chart 1 — Categories by Profit Margin %

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `category_name` — Category name |
| **X-Axis** | `profit_margin_percentage` — Profit margin (%) |
| **Color Coding** | Bar color = margin tier (High / Medium / Low / Negative) |

### Chart 2 — Revenue, Cost & Profit by Category

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped, vertical) |
| **X-Axis** | `category_name` — Category name |
| **Y-Axis** | USD ($) — Financial value |
| **Series** | Bar 1: `total_revenue` · Bar 2: `total_cost` · Bar 3: `total_profit` |

### Chart 3 — Profit Margin Distribution

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | Margin tier (High / Medium / Low / Negative) |
| **Value** | Number of categories per tier |

### Chart 4 — Revenue Distribution by Category

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `category_name` — One slice per category |
| **Value** | `total_revenue` — Revenue share ($) |

### Chart 5 — Product Count by Category

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `category_name` — Category name |
| **Y-Axis** | `product_count` — Number of products |

### Chart 6 — Average Profit per Product by Category

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `category_name` — Category name |
| **Y-Axis** | `avg_profit_per_product` — Average profit per product in USD ($) |
| **Color Coding** | Bar color = margin tier |

### Chart 7 — Category Profit Margin Comparison

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | `category_name` — Category name |
| **Y-Axis** | `profit_margin_percentage` — Profit margin (%) |

### Chart 8 — Category Profit vs Revenue Analysis

| Property | Value |
|---|---|
| **Chart Type** | ScatterChart |
| **X-Axis** | `total_revenue` — Total revenue in USD ($) |
| **Y-Axis** | `total_profit` — Total profit in USD ($) |
| **Color Coding** | Dot color = margin tier (High / Medium / Low / Negative) |

---

## 12. Phase 6 — Product Profit Margin Dashboard

**File:** `src/components/Phase6_Dashboard/ProductProfitMarginDashboard.jsx`

### Chart 1 — Top 15 Products by Profit Margin %

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `profit_margin_percentage` — Profit margin (%) |
| **Color Coding** | Bar color = margin tier (High / Medium / Low / Negative) |

### Chart 2 — Revenue, Cost & Profit Comparison (Top 15)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped, vertical) |
| **X-Axis** | `product_name` — Product name |
| **Y-Axis** | USD ($) — Financial value |
| **Series** | Bar 1: `total_revenue` · Bar 2: `total_cost` · Bar 3: `total_profit` |

### Chart 3 — Profit Margin Distribution

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | Margin tier (High / Medium / Low / Negative) |
| **Value** | Number of products per tier |

### Chart 4 — Profit vs Revenue (Top 50)

| Property | Value |
|---|---|
| **Chart Type** | ScatterChart |
| **X-Axis** | `total_revenue` — Total revenue in USD ($) |
| **Y-Axis** | `total_profit` — Total profit in USD ($) |
| **Color Coding** | Dot color = margin tier |

### Chart 5 — Average Price & Cost Analysis (Top 15)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped, vertical) |
| **X-Axis** | `product_name` — Product name |
| **Y-Axis** | USD ($) — Unit price/cost |
| **Series** | Bar 1: `avg_selling_price` · Bar 2: `avg_cost_price` · Bar 3: `avg_profit_per_unit` |

### Chart 6 — Profit Margin Trend (Top 20)

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | `product_name` — Product name |
| **Y-Axis** | `profit_margin_percentage` — Profit margin (%) |

---

## 13. Phase 6 — Revenue Decrease Ratio Dashboard

**File:** `src/components/Phase6_Dashboard/RevenueDecreaseRatioDashboard.jsx`

### Chart 1 — Revenue Comparison by Year

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped, vertical) |
| **X-Axis** | `current_year` — Year |
| **Y-Axis** | USD ($) — Revenue |
| **Series** | Bar 1: `current_year_revenue` · Bar 2: `previous_year_revenue` |

### Chart 2 — Year-over-Year Change Percentage Trend

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart |
| **X-Axis** | `current_year` — Year |
| **Y-Axis** | `change_percentage` — YoY change (%) |
| **Series** | Area: `change_percentage` · Dashed Line: zero baseline (0% reference) |

### Chart 3 — Growth vs Decline Distribution

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `change_type` — Increase / Decrease / No Change |
| **Value** | Count of years per type |

### Chart 4 — Order Volume Change YoY

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `current_year` — Year |
| **Y-Axis** | `order_change` — Change in order count |
| **Color Coding** | Green = increase · Red = decrease |

---

## 14. Phase 6 — YoY Revenue Growth Dashboard

**File:** `src/components/Phase6_Dashboard/YoYRevenueGrowthDashboard.jsx`

### Chart 1 — Monthly Revenue Comparison

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart |
| **X-Axis** | `month_name` — Month name |
| **Y-Axis** | Revenue in USD ($) |
| **Series** | Area: `current_year_revenue` · Dashed Line: `previous_year_revenue` |

### Chart 2 — Month-by-Month Growth Rate

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `month_name` — Month name |
| **Y-Axis** | `change_percentage` — Growth rate (%) |
| **Color Coding** | Green = growth · Red = decline |

---

## 15. Phase 8 — Failed Payments Dashboard

**File:** `src/components/Phase8_Dashboard/FailedPaymentsDashboard.jsx`

### Chart 1 — Failed Attempts by Customer (Top 15)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `email` — Customer email |
| **X-Axis** | `failed_attempts` — Number of failed payment attempts |
| **Color Coding** | Bar color = risk level (Critical: ≥5 attempts / High: 3–4 / Medium: 2) |

### Chart 2 — Risk Level Distribution

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | Risk tier (Critical / High / Medium) |
| **Value** | Count of customers per risk tier |

---

## 16. Phase 8 — Fast Moving Products Dashboard

**File:** `src/components/Phase8_Dashboard/FastMovingProductsDashboard.jsx`

### Chart 1 — Top Fast Moving Products

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `units_sold` — Total units sold |
| **Color Coding** | Bar color = `velocity_rating` (Very High / High / Medium / Low) |

### Chart 2 — Products by Velocity Rating

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `velocity_rating` tier (Very High / High / Medium / Low) |
| **Value** | Count of products per velocity tier |

### Chart 3 — Units Sold by Category

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `category_name` — One slice per category |
| **Value** | `units_sold` — Total units sold per category |

### Chart 4 — Average Daily Sales Rate

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `avg_daily_sales` — Average daily sales (units/day) |

### Chart 5 — Units Sold vs Daily Sales Rate

| Property | Value |
|---|---|
| **Chart Type** | ScatterChart |
| **X-Axis** | `units_sold` — Total units sold |
| **Y-Axis** | `avg_daily_sales` — Average daily sales rate (units/day) |
| **Color Coding** | Dot color / group = `velocity_rating` |

---

## 17. Phase 8 — High Return Products Dashboard

**File:** `src/components/Phase8_Dashboard/HighReturnProductsDashboard.jsx`

### Chart 1 — All Products by Return Rate

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `return_rate` — Return rate (%) |
| **Color Coding** | Bar color = `quality_risk_level` (Critical / High / Medium / Low) |

### Chart 2 — Products by Quality Risk Level

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `quality_risk_level` (Critical / High / Medium / Low) |
| **Value** | Count of products per risk level |

### Chart 3 — Total Units Returned by Product

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `units_returned` — Total units returned (count) |
| **Notes** | Red fill |

### Chart 4 — Units Sold vs Units Returned Comparison

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart (dual Y-axis) |
| **X-Axis** | `product_name` — Product name |
| **Y-Axis (Left)** | Units (count) |
| **Y-Axis (Right)** | `return_rate` — Return rate (%) |
| **Series** | Bar 1: `units_sold` · Bar 2: `units_returned` · Line: `return_rate` (right axis) |

### Chart 5 — Net Demand After Returns

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `net_demand` — Net demand after returns (units) |
| **Notes** | Green fill |

---

## 18. Phase 8 — High Return Rate Customers Dashboard

**File:** `src/components/Phase8_Dashboard/HighReturnRateCustomersDashboard.jsx`

### Chart 1 — Return Rate % (Top 15)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `email` — Customer email |
| **X-Axis** | `return_percentage` — Return rate (%) |
| **Color Coding** | Bar color = return rate severity |

### Chart 2 — Returns vs Total Items

| Property | Value |
|---|---|
| **Chart Type** | ScatterChart |
| **X-Axis** | `total_items` — Total items purchased (count) |
| **Y-Axis** | `total_returns` — Total items returned (count) |
| **Notes** | Each dot represents one customer |

---

## 19. Phase 8 — Inventory Intelligence Score Dashboard

**File:** `src/components/Phase8_Dashboard/InventoryIntelligenceScoreDashboard.jsx`

### Chart 1 — Top Priority Products (Urgent Action)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `last_30d_sales` — Units sold in last 30 days |
| **Color Coding** | Bar color = `inventory_risk` (CRITICAL / HIGH / MEDIUM / OVERSTOCKED / LOW) |

### Chart 2 — Products by Risk Level

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `inventory_risk` tier (CRITICAL / HIGH / MEDIUM / OVERSTOCKED / LOW) |
| **Value** | Count of products per risk level |

### Chart 3 — Recommended Actions Distribution

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `recommended_action` — Action text label |
| **Y-Axis** | Count of products per recommended action |
| **Notes** | Purple bars |

### Chart 4 — Products Running Out Soon (< 15 Days)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `days_of_stock_remaining` — Days of stock remaining |
| **Color Coding** | Bar color = urgency level |

### Chart 5 — Stock Level Analysis (Top 20)

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart |
| **X-Axis** | `product_name` — Product name |
| **Y-Axis** | Units (count) |
| **Series** | Bar 1: `stock_remaining` · Bar 2: `min_stock_level` · Line: `last_30d_sales` |

---

## 20. Phase 8 — Low Stock Dashboard

**File:** `src/components/Phase8_Dashboard/LowStockDashboard.jsx`

### Chart 1 — Top Products Based on Stock Deficit

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `deficit_percentage` — Deficit as percentage of minimum stock (%) |
| **Color Coding** | Bar color = severity level |

### Chart 2 — Low Stock Items by Warehouse

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `warehouse_name` — One slice per warehouse |
| **Value** | Count of low-stock items per warehouse |

### Chart 3 — Items by Severity Level

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | Severity tier (Critical / High / Medium / Low) |
| **Value** | Count of items per severity tier |

### Chart 4 — Stock Deficit (Units Needed)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `product_name` — Product name |
| **X-Axis** | `stock_deficit` — Units needed to reach minimum stock level |
| **Notes** | Orange fill |

---

## 21. Phase 8 — Monthly Revenue Drop Dashboard

**File:** `src/components/Phase8_Dashboard/MonthlyRevenueDropDashboard.jsx`

### Chart 1 — Monthly Change Percentage Trend

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart |
| **X-Axis** | `month_name` + `analysis_year` — Month and year label |
| **Y-Axis** | `change_percentage` — Month-over-month revenue change (%) |
| **Series** | Area: `change_percentage` · Dashed Line: zero baseline (0% reference) |

### Chart 2 — Current vs Previous Month Revenue

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped, vertical) |
| **X-Axis** | `month_name` + `analysis_year` — Month and year label |
| **Y-Axis** | USD ($) — Revenue |
| **Series** | Bar 1: `current_revenue` · Bar 2: `previous_revenue` |

### Chart 3 — Drop Severity Distribution

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `drop_severity` tier (Critical / High / Medium / Low / Growth) |
| **Value** | Count of months per severity |

### Chart 4 — Monthly Order Volume

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | `month_name` + `analysis_year` — Month and year label |
| **Y-Axis** | Order count |
| **Series** | Line 1: `current_orders` · Dashed Line 2: `previous_orders` |

---

## 22. Phase 8 — Seller High Returns (All Time) Dashboard

**File:** `src/components/Phase8_Dashboard/SellerHighReturnsAllTimeDashboard.jsx`

### Chart 1 — Return Rate % by Seller (Top 20)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | `seller_name` — Seller name |
| **X-Axis** | `return_percentage` — All-time return rate (%) |
| **Color Coding** | ≥ 50%: Critical red · ≥ 40%: High amber · ≥ 30%: Medium yellow · < 30%: Low green |

### Chart 2 — Risk Level Distribution

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | Risk tier (Critical / High / Medium / Low) |
| **Value** | Count of sellers per risk tier |

---

## 23. Phase 8 — Seller High Returns (Recent Period) Dashboard

**File:** `src/components/Phase8_Dashboard/SellerHighReturnsRecentDashboard.jsx`

### Chart 1 — Return Rate % by Seller (Top 15)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `seller_name` — Seller name (angled) |
| **Y-Axis** | `return_percentage` — Return rate in selected period (%) |
| **Color Coding** | ≥ 50%: red · ≥ 40%: amber · < 40%: yellow |

### Chart 2 — Items Sold vs Returns (Top 15)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped, vertical) |
| **X-Axis** | `seller_name` — Seller name |
| **Y-Axis** | Count (items) |
| **Series** | Bar 1: `items_sold` (green) · Bar 2: `returns_count` (red) |

### Chart 3 — Return Rate Trend (All Flagged Sellers)

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | `seller_name` — Seller name (ordered by rate, angled) |
| **Y-Axis** | `return_percentage` — Return rate (%) |
| **Notes** | Red line connecting all flagged sellers |

---

## 24. Phase 8 — Warehouse Load Intelligence Dashboard

**File:** `src/components/Phase8_Dashboard/WarehouseLoadDashboard.jsx`

### Chart 1 — Warehouse Performance Metrics *(per warehouse)*

| Property | Value |
|---|---|
| **Chart Type** | RadarChart |
| **Axes (spokes)** | Total Units · Products Stored · Capacity Level · Efficiency · Avg Stock · Stock Health |
| **Scale** | All metrics normalized to 0–100 |
| **Notes** | Selectable warehouse; color = `utilization_score` tier |

### Chart 2 — Total Units Stored by Warehouse

| Property | Value |
|---|---|
| **Chart Type** | BarChart (horizontal / `layout="vertical"`) |
| **Y-Axis** | Warehouse name |
| **X-Axis** | `total_units` — Total inventory units stored |
| **Color Coding** | Bar color = `utilization_score` (High / Medium / Low / Very Low Capacity) |

### Chart 3 — Warehouses by Capacity Level

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | Capacity tier (High Capacity / Medium Capacity / Low Capacity / Very Low) |
| **Value** | Count of warehouses per capacity tier |

### Chart 4 — Products Stored by Warehouse

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | Warehouse name |
| **Y-Axis** | `products_stored` — Number of product types stored |

### Chart 5 — Low Stock Items by Warehouse

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | Warehouse name |
| **Y-Axis** | `low_stock_count` — Number of items at/below minimum stock level |

### Chart 6 — Warehouse Metrics Comparison

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart (dual Y-axis) |
| **X-Axis** | Warehouse name |
| **Y-Axis (Left)** | Count (products / low stock items) |
| **Y-Axis (Right)** | `avg_stock_per_product` — Average stock units per product |
| **Series** | Bar 1: `products_stored` · Bar 2: `low_stock_count` · Line: `avg_stock_per_product` (right axis) |

---

## 25. Phase 8 — Weekly Revenue Drop Dashboard

**File:** `src/components/Phase8_Dashboard/WeeklyRevenueDropDashboard.jsx`

### Chart 1 — Weekly Revenue Change %

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart |
| **X-Axis** | Week label (`W[n] [Mon] [Year]`) |
| **Y-Axis** | `change_percentage` — Week-over-week revenue change (%) |
| **Series** | Bars: `change_percentage` (colored by `drop_severity`) · Dashed Line: zero baseline |

### Chart 2 — Current vs Previous Week Revenue (Last 15 Weeks)

| Property | Value |
|---|---|
| **Chart Type** | BarChart (grouped, vertical) |
| **X-Axis** | Week label (`W[n] [Mon] [Year]`) |
| **Y-Axis** | USD ($) — Revenue |
| **Series** | Bar 1: `current_revenue` · Bar 2: `previous_revenue` |

### Chart 3 — Drop Severity Distribution

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `drop_severity` tier (Critical / High / Medium / Low / Growth) |
| **Value** | Count of weeks per severity |

### Chart 4 — Weekly Order Volume (Last 15)

| Property | Value |
|---|---|
| **Chart Type** | LineChart |
| **X-Axis** | Week label (`W[n] [Mon] [Year]`) |
| **Y-Axis** | Order count |
| **Series** | Line 1: `current_orders` · Dashed Line 2: `previous_orders` |

---

## 26. Phase 8 — Yearly Revenue Drop Dashboard

**File:** `src/components/Phase8_Dashboard/YearlyRevenueDropDashboard.jsx`

### Chart 1 — Annual Revenue Trend

| Property | Value |
|---|---|
| **Chart Type** | ComposedChart (Area style) |
| **X-Axis** | `current_year` — Year |
| **Y-Axis** | `current_revenue` — Annual revenue in USD ($) |
| **Series** | Area: `current_revenue` with gradient fill |

### Chart 2 — YoY Change Percentage

| Property | Value |
|---|---|
| **Chart Type** | BarChart (vertical) |
| **X-Axis** | `current_year` — Year |
| **Y-Axis** | `change_percentage` — Year-over-year revenue change (%) |
| **Color Coding** | Green = positive growth · Red = decline |
| **Notes** | Dashed zero reference line overlay |

### Chart 3 — Severity Distribution

| Property | Value |
|---|---|
| **Chart Type** | PieChart |
| **Slices** | `drop_severity` tier (Critical / High / Medium / Low / Growth) |
| **Value** | Count of years per severity tier |

---

## Quick Reference — Chart Types Used

| Chart Type | Dashboards |
|---|---|
| **LineChart** | Daily Sales, AOV, Monthly Order Count, Monthly Revenue Per Year, Monthly Sales Trend, Category Profit Margin, Product Profit Margin, Seller Returns Recent, Monthly Revenue Drop, Weekly Revenue Drop |
| **BarChart (vertical)** | Quantity Sold, CLTV, AOV, Monthly Order Count, Monthly Sales Trend, Category Profit Margin, Product Profit Margin, Revenue Decrease Ratio, YoY Growth, Failed Payments, Seller Returns Recent, Warehouse Load, Weekly Drop, Yearly Drop |
| **BarChart (horizontal)** | Revenue Per Product, Revenue Per Category, Revenue Per Seller, CLTV, Fast Moving Products, High Return Products, High Return Customers, Inventory Intelligence, Low Stock, Seller Returns All Time, Warehouse Load |
| **AreaChart** | Monthly Order Count |
| **ComposedChart** | AOV, Monthly Sales Trend, Revenue Decrease Ratio, YoY Growth, High Return Products, Inventory Intelligence, Monthly Revenue Drop, Weekly Revenue Drop, Yearly Revenue Drop, Warehouse Load |
| **PieChart** | Quantity Sold, Revenue Per Category, CLTV, Category Profit Margin, Product Profit Margin, Revenue Decrease Ratio, Failed Payments, Fast Moving Products, High Return Products, Inventory Intelligence, Low Stock, Monthly Revenue Drop, Seller Returns All Time, Warehouse Load, Weekly Revenue Drop, Yearly Revenue Drop |
| **ScatterChart** | Category Profit Margin, Product Profit Margin, Fast Moving Products, High Return Customers |
| **RadarChart** | Warehouse Load Intelligence |
