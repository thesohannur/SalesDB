-- Function: get_monthly_revenue_per_year(p_year INT DEFAULT NULL)
-- Returns monthly revenue, optionally filtered by year

CREATE OR REPLACE FUNCTION get_monthly_revenue_per_year(p_year INT DEFAULT NULL)
RETURNS TABLE(
    sales_year INT,
    sales_month INT,
    month_name VARCHAR,
    total_revenue NUMERIC,
    total_orders INT,
    total_products_sold INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
    cur CURSOR FOR
        SELECT
            EXTRACT(YEAR FROM o.order_date)::INT AS sales_year,
            EXTRACT(MONTH FROM o.order_date)::INT AS sales_month,
            TO_CHAR(o.order_date, 'Month') AS month_name,
            SUM(oi.quantity * oi.unit_price)::NUMERIC AS total_revenue,
            COUNT(DISTINCT o.order_id)::INT AS total_orders,
            SUM(oi.quantity)::INT AS total_products_sold
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE (p_year IS NULL OR EXTRACT(YEAR FROM o.order_date)::INT = p_year)
        GROUP BY 
            EXTRACT(YEAR FROM o.order_date),
            EXTRACT(MONTH FROM o.order_date),
            TO_CHAR(o.order_date, 'Month')
        ORDER BY sales_year DESC, sales_month ASC;
BEGIN
    OPEN cur;

    LOOP
        FETCH cur INTO rec;
        EXIT WHEN NOT FOUND;

        sales_year := rec.sales_year;
        sales_month := rec.sales_month;
        month_name := rec.month_name;
        total_revenue := rec.total_revenue;
        total_orders := rec.total_orders;
        total_products_sold := rec.total_products_sold;
        RETURN NEXT;
    END LOOP;

    CLOSE cur;
END;
$$;

-- Test for all years
SELECT * FROM get_monthly_revenue_per_year();

-- Test for a specific year
SELECT * FROM get_monthly_revenue_per_year(2024);