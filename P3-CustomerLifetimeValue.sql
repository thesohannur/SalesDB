-- Function: get_customer_lifetime_value(p_year INT DEFAULT NULL)
-- Returns customer lifetime value metrics

CREATE OR REPLACE FUNCTION get_customer_lifetime_value(p_year INT DEFAULT NULL)
RETURNS TABLE(
    customer_id INT,
    customer_name VARCHAR,
    first_purchase_date DATE,
    last_purchase_date DATE,
    total_orders INT,
    total_revenue NUMERIC,
    avg_order_value NUMERIC,
    customer_lifetime_days INT,
    purchase_frequency NUMERIC,
    customer_segment VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH customer_metrics AS (
        SELECT
            c.customer_id,
            CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
            MIN(o.order_date)::DATE AS first_purchase,
            MAX(o.order_date)::DATE AS last_purchase,
            COUNT(DISTINCT o.order_id)::INT AS order_count,
            SUM(oi.quantity * oi.unit_price)::NUMERIC AS revenue,
            AVG(oi.quantity * oi.unit_price)::NUMERIC AS avg_order,

            (MAX(o.order_date)::DATE - MIN(o.order_date)::DATE) AS lifetime_days,
            CASE 
                WHEN (MAX(o.order_date)::DATE - MIN(o.order_date)::DATE) > 0 
                THEN COUNT(DISTINCT o.order_id)::NUMERIC / (MAX(o.order_date)::DATE - MIN(o.order_date)::DATE)::NUMERIC * 30
                ELSE 0 
            END AS frequency
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE (p_year IS NULL OR EXTRACT(YEAR FROM o.order_date)::INT = p_year)
        GROUP BY c.customer_id, c.first_name, c.last_name
    )
    SELECT
        cm.customer_id::INT,
        cm.customer_name::VARCHAR,
        cm.first_purchase::DATE,
        cm.last_purchase::DATE,
        cm.order_count::INT,
        cm.revenue::NUMERIC,
        cm.avg_order::NUMERIC,
        cm.lifetime_days::INT,
        cm.frequency::NUMERIC,
        CASE
            WHEN cm.revenue >= 6900050 THEN 'VIP'
            WHEN cm.revenue >= 1471000 THEN 'High Value'
            WHEN cm.revenue >= 808000 THEN 'Medium Value'
            ELSE 'Low Value'
        END::VARCHAR AS segment
    FROM customer_metrics cm
    ORDER BY cm.revenue DESC;
END;
$$;

SELECT * FROM get_customer_lifetime_value();
