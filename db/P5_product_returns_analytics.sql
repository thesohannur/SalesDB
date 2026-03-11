-- Consolidates return data for All-Time, Yearly, and Monthly analysis
DROP VIEW IF EXISTS public.product_returns_analytics;

CREATE VIEW public.product_returns_analytics AS
SELECT 
    p.product_id,
    p.product_name,
    EXTRACT(YEAR FROM o.order_date) as sales_year,
    EXTRACT(MONTH FROM o.order_date) as sales_month,
    COUNT(oi.order_item_id) as total_sold,
    -- Only count 'Approved' returns
    COUNT(r.return_id) FILTER (WHERE r.return_status = 'Approved') as total_returned,
    -- Calc return rate percentage
    CASE 
        WHEN COUNT(oi.order_item_id) > 0 
        THEN (COUNT(r.return_id) FILTER (WHERE r.return_status = 'Approved')::float / COUNT(oi.order_item_id)::float) * 100 
        ELSE 0 
    END as return_rate,
    -- Calc total revenue lost
    SUM(CASE WHEN r.return_status = 'Approved' THEN (oi.unit_price * oi.quantity) ELSE 0 END) as revenue_lost
FROM public.products p
JOIN public.order_items oi ON p.product_id = oi.product_id
JOIN public.orders o ON oi.order_id = o.order_id
LEFT JOIN public.returns r ON oi.order_item_id = r.order_item_id
GROUP BY p.product_id, p.product_name, sales_year, sales_month;