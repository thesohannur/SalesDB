-- Get Inactive Sellers Analytics
CREATE OR REPLACE FUNCTION get_inactive_sellers_analytics(
  p_start_date DATE,
  p_end_date DATE
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_result JSON;
  v_inactive_count INT;
  v_total_sellers INT;
  v_inactive_ratio NUMERIC;
BEGIN
  
  -- Get total sellers count
  SELECT COUNT(*) INTO v_total_sellers FROM sellers;
  
  -- Get inactive sellers count (sellers with 0 sales in range)
  SELECT COUNT(DISTINCT s.seller_id) INTO v_inactive_count
  FROM sellers s
  WHERE s.seller_id NOT IN (
    SELECT DISTINCT p.seller_id
    FROM products p
    JOIN order_items oi ON p.product_id = oi.product_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.order_date::date BETWEEN p_start_date AND p_end_date
  );
  
  -- Calculate inactive ratio
  v_inactive_ratio := ROUND((v_inactive_count::NUMERIC / NULLIF(v_total_sellers, 0) * 100), 1);
  
  -- Build final JSON response
  SELECT json_build_object(
    'summary', json_build_object(
      'inactive_count', v_inactive_count,
      'total_sellers', v_total_sellers,
      'inactive_ratio', COALESCE(v_inactive_ratio, 0)
    ),
    
    'trend_data', (
      SELECT json_agg(trend_row ORDER BY month)
      FROM (
        WITH month_series AS (
          SELECT generate_series(
            DATE_TRUNC('month', p_start_date::timestamp),
            DATE_TRUNC('month', p_end_date::timestamp),
            '1 month'::interval
          )::DATE AS month
        )
        SELECT 
          TO_CHAR(ms.month, 'YYYY-MM') AS month,
          (
            SELECT COUNT(DISTINCT s.seller_id)
            FROM sellers s
            WHERE s.seller_id NOT IN (
              SELECT DISTINCT p.seller_id
              FROM products p
              JOIN order_items oi ON p.product_id = oi.product_id
              JOIN orders o ON oi.order_id = o.order_id
              WHERE DATE_TRUNC('month', o.order_date::date::timestamp) = DATE_TRUNC('month', ms.month::timestamp)
            )
          ) AS inactive_count
        FROM month_series ms
      ) AS trend_row
    ),
    
    'inactive_sellers', (
      SELECT json_agg(seller_row ORDER BY days_inactive DESC NULLS LAST)
      FROM (
        SELECT 
          s.seller_id,
          s.seller_name,
          s.contact_email AS email,
          COALESCE(
            (
              SELECT MAX(o.order_date::date)
              FROM products p
              JOIN order_items oi ON p.product_id = oi.product_id
              JOIN orders o ON oi.order_id = o.order_id
              WHERE p.seller_id = s.seller_id
            ),
            NULL
          ) AS last_active_date,
          CASE 
            WHEN (
              SELECT MAX(o.order_date::date)
              FROM products p
              JOIN order_items oi ON p.product_id = oi.product_id
              JOIN orders o ON oi.order_id = o.order_id
              WHERE p.seller_id = s.seller_id
            ) IS NOT NULL
            THEN p_end_date - (
              SELECT MAX(o.order_date::date)
              FROM products p
              JOIN order_items oi ON p.product_id = oi.product_id
              JOIN orders o ON oi.order_id = o.order_id
              WHERE p.seller_id = s.seller_id
            )
            ELSE NULL
          END AS days_inactive
        FROM sellers s
        WHERE s.seller_id NOT IN (
          SELECT DISTINCT p.seller_id
          FROM products p
          JOIN order_items oi ON p.product_id = oi.product_id
          JOIN orders o ON oi.order_id = o.order_id
          WHERE o.order_date::date BETWEEN p_start_date AND p_end_date
        )
      ) AS seller_row
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;
