-- Function: get_monthly_sales_trend(p_year INT DEFAULT NULL)
-- Returns comprehensive monthly sales trend data

CREATE OR REPLACE FUNCTION get_monthly_sales_trend(p_year INT DEFAULT NULL)
RETURNS TABLE(
    sales_year INT,
    sales_month INT,
    month_name VARCHAR,
    total_revenue NUMERIC,
    total_orders INT,
    total_customers INT,
    total_products_sold INT,
    avg_order_value NUMERIC,
    revenue_growth_pct NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
    prev_revenue NUMERIC := 0;
    cur CURSOR FOR
        SELECT
            EXTRACT(YEAR FROM o.order_date)::INT AS sales_year,
            EXTRACT(MONTH FROM o.order_date)::INT AS sales_month,
            TO_CHAR(o.order_date, 'Month') AS month_name,
            SUM(oi.quantity * oi.unit_price)::NUMERIC AS total_revenue,
            COUNT(DISTINCT o.order_id)::INT AS total_orders,
            COUNT(DISTINCT o.customer_id)::INT AS total_customers,
            SUM(oi.quantity)::INT AS total_products_sold,
            (SUM(oi.quantity * oi.unit_price) / COUNT(DISTINCT o.order_id))::NUMERIC AS avg_order_value
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE (p_year IS NULL OR EXTRACT(YEAR FROM o.order_date)::INT = p_year)
        GROUP BY 
            EXTRACT(YEAR FROM o.order_date),
            EXTRACT(MONTH FROM o.order_date),
            TO_CHAR(o.order_date, 'Month')
        ORDER BY sales_year ASC, sales_month ASC;
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
        total_customers := rec.total_customers;
        total_products_sold := rec.total_products_sold;
        avg_order_value := rec.avg_order_value;
        
        -- Calculate revenue growth percentage
        IF prev_revenue > 0 THEN
            revenue_growth_pct := ((rec.total_revenue - prev_revenue) / prev_revenue * 100)::NUMERIC;
        ELSE
            revenue_growth_pct := 0;
        END IF;
        
        prev_revenue := rec.total_revenue;
        
        RETURN NEXT;
    END LOOP;

    CLOSE cur;
END;
$$;

-- Test for all years
SELECT * FROM get_monthly_sales_trend();

-- Test for a specific year
SELECT * FROM get_monthly_sales_trend(2024);