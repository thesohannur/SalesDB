-- Function: get_monthly_order_count(p_year INT DEFAULT NULL)
-- Returns monthly order count, optionally filtered by year

CREATE OR REPLACE FUNCTION get_monthly_order_count(p_year INT DEFAULT NULL)
RETURNS TABLE(
    sales_year INT,
    sales_month INT,
    month_name VARCHAR,
    total_orders INT,
    total_customers INT,
    total_revenue NUMERIC,
    avg_order_value NUMERIC
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
            COUNT(DISTINCT o.order_id)::INT AS total_orders,
            COUNT(DISTINCT o.customer_id)::INT AS total_customers,
            SUM(oi.quantity * oi.unit_price)::NUMERIC AS total_revenue,
            (SUM(oi.quantity * oi.unit_price) / COUNT(DISTINCT o.order_id))::NUMERIC AS avg_order_value
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
        total_orders := rec.total_orders;
        total_customers := rec.total_customers;
        total_revenue := rec.total_revenue;
        avg_order_value := rec.avg_order_value;
        RETURN NEXT;
    END LOOP;

    CLOSE cur;
END;
$$;

-- Test for all years
SELECT * FROM get_monthly_order_count();

-- Test for a specific year
SELECT * FROM get_monthly_order_count(2024);