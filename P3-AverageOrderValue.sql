-- Function: get_average_order_value(p_year INT DEFAULT NULL)
-- Returns average order value data with detailed metrics

CREATE OR REPLACE FUNCTION get_average_order_value(p_year INT DEFAULT NULL)
RETURNS TABLE(
    sales_year INT,
    sales_month INT,
    month_name VARCHAR,
    total_revenue NUMERIC,
    total_orders INT,
    avg_order_value NUMERIC,
    min_order_value NUMERIC,
    max_order_value NUMERIC,
    median_order_value NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH order_values AS (
        SELECT
            o.order_id,
            EXTRACT(YEAR FROM o.order_date)::INT AS year_val,
            EXTRACT(MONTH FROM o.order_date)::INT AS month_val,
            TO_CHAR(o.order_date, 'Month') AS month_val_name,
            SUM(oi.quantity * oi.unit_price) AS order_value
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE (p_year IS NULL OR EXTRACT(YEAR FROM o.order_date)::INT = p_year)
        GROUP BY o.order_id, o.order_date
    )
    SELECT
        year_val::INT,
        month_val::INT,
        month_val_name::VARCHAR,
        SUM(order_value)::NUMERIC,
        COUNT(order_id)::INT,
        AVG(order_value)::NUMERIC,
        MIN(order_value)::NUMERIC,
        MAX(order_value)::NUMERIC,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY order_value)::NUMERIC
    FROM order_values
    GROUP BY year_val, month_val, month_val_name
    ORDER BY year_val ASC, month_val ASC;
END;
$$;

-- Test for all years
SELECT * FROM get_average_order_value();

