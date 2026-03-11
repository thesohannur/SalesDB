CREATE OR REPLACE FUNCTION get_category_profit_margin(p_year INT DEFAULT NULL)
RETURNS TABLE(
    category_id INT,
    category_name VARCHAR,
    total_revenue NUMERIC,
    total_cost NUMERIC,
    total_profit NUMERIC,
    profit_margin_percentage NUMERIC,
    total_units_sold INT,
    product_count INT,
    avg_profit_per_product NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
    cur CURSOR FOR
        SELECT
            c.category_id,
            c.category_name,
            SUM(oi.quantity * oi.unit_price)::NUMERIC AS revenue,
            SUM(oi.quantity * p.cogs)::NUMERIC AS cost, --cogs->cost of goods sold
            (SUM(oi.quantity * oi.unit_price) - SUM(oi.quantity * p.cogs))::NUMERIC AS profit,
            CASE 
                WHEN SUM(oi.quantity * oi.unit_price) > 0 
                THEN ((SUM(oi.quantity * oi.unit_price) - SUM(oi.quantity * p.cogs)) / SUM(oi.quantity * oi.unit_price) * 100)::NUMERIC
                ELSE 0
            END AS profit_margin_pct,
            SUM(oi.quantity)::INT AS units_sold,
            COUNT(DISTINCT p.product_id)::INT AS prod_count,
            CASE 
                WHEN COUNT(DISTINCT p.product_id) > 0 
                THEN ((SUM(oi.quantity * oi.unit_price) - SUM(oi.quantity * p.cogs)) / COUNT(DISTINCT p.product_id))::NUMERIC
                ELSE 0
            END AS avg_profit_prod
        FROM categories c
        JOIN products p ON c.category_id = p.category_id
        JOIN order_items oi ON p.product_id = oi.product_id
        JOIN orders o ON oi.order_id = o.order_id
        WHERE (p_year IS NULL OR EXTRACT(YEAR FROM o.order_date)::INT = p_year)
        GROUP BY c.category_id, c.category_name
        ORDER BY profit DESC;
BEGIN
    OPEN cur;

    LOOP
        FETCH cur INTO rec;
        EXIT WHEN NOT FOUND;

        category_id := rec.category_id;
        category_name := rec.category_name;
        total_revenue := rec.revenue;
        total_cost := rec.cost;
        total_profit := rec.profit;
        profit_margin_percentage := rec.profit_margin_pct;
        total_units_sold := rec.units_sold;
        product_count := rec.prod_count;
        avg_profit_per_product := rec.avg_profit_prod;
        RETURN NEXT;
    END LOOP;

    CLOSE cur;
END;
$$;


SELECT * FROM get_category_profit_margin();