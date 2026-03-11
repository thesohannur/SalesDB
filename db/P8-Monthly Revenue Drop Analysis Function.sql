-- =============================================
-- 1. MONTH-TO-MONTH REVENUE DROP ANALYSIS
-- =============================================
-- Analyzes every month compared to its previous month, categorized by year

CREATE OR REPLACE FUNCTION get_monthly_revenue_drop_analysis(p_threshold_percent NUMERIC DEFAULT 20)
RETURNS TABLE(
    analysis_year INT,
    analysis_month INT,
    month_name VARCHAR,
    current_period_start DATE,
    current_period_end DATE,
    comparison_period_start DATE,
    comparison_period_end DATE,
    current_revenue NUMERIC,
    previous_revenue NUMERIC,
    revenue_change NUMERIC,
    change_percentage NUMERIC,
    drop_severity VARCHAR,
    current_orders INT,
    previous_orders INT,
    current_customers INT,
    previous_customers INT,
    affected_category VARCHAR,
    category_drop_percentage NUMERIC,
    affected_seller VARCHAR,
    seller_drop_percentage NUMERIC,
    recommendations TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
    reference_date DATE := '2025-12-31'::DATE;
    min_date DATE;
    max_date DATE;
BEGIN

    SELECT 
        DATE_TRUNC('month', MIN(order_date))::DATE,
        DATE_TRUNC('month', MAX(order_date))::DATE
    INTO min_date, max_date
    FROM orders
    WHERE order_status NOT IN ('Cancelled', 'Refunded');


    FOR rec IN
        WITH month_series AS (
            SELECT 
                generate_series(
                    min_date + INTERVAL '1 month',
                    LEAST(max_date, DATE_TRUNC('month', reference_date)),
                    INTERVAL '1 month'
                )::DATE AS month_start
        ),
        monthly_data AS (
            SELECT
                ms.month_start,
                EXTRACT(YEAR FROM ms.month_start)::INT AS yr,
                EXTRACT(MONTH FROM ms.month_start)::INT AS mn,
                TO_CHAR(ms.month_start, 'Month')::VARCHAR AS month_nm,
                ms.month_start AS curr_start,
                (ms.month_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE AS curr_end,
                (ms.month_start - INTERVAL '1 month')::DATE AS prev_start,
                (ms.month_start - INTERVAL '1 day')::DATE AS prev_end,
                
                -- Current month 
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= ms.month_start 
                    AND o.order_date < ms.month_start + INTERVAL '1 month'
                    THEN o.total_amount 
                END), 0)::NUMERIC AS curr_rev,
                COUNT(DISTINCT CASE 
                    WHEN o.order_date >= ms.month_start 
                    AND o.order_date < ms.month_start + INTERVAL '1 month'
                    THEN o.order_id 
                END)::INT AS curr_orders,
                COUNT(DISTINCT CASE 
                    WHEN o.order_date >= ms.month_start 
                    AND o.order_date < ms.month_start + INTERVAL '1 month'
                    THEN o.customer_id 
                END)::INT AS curr_customers,
                
                -- Previous month 
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= ms.month_start - INTERVAL '1 month'
                    AND o.order_date < ms.month_start
                    THEN o.total_amount 
                END), 0)::NUMERIC AS prev_rev,
                COUNT(DISTINCT CASE 
                    WHEN o.order_date >= ms.month_start - INTERVAL '1 month'
                    AND o.order_date < ms.month_start
                    THEN o.order_id 
                END)::INT AS prev_orders,
                COUNT(DISTINCT CASE 
                    WHEN o.order_date >= ms.month_start - INTERVAL '1 month'
                    AND o.order_date < ms.month_start
                    THEN o.customer_id 
                END)::INT AS prev_customers
            FROM month_series ms
            LEFT JOIN orders o ON o.order_status NOT IN ('Cancelled', 'Refunded')
                AND o.order_date >= ms.month_start - INTERVAL '1 month'
                AND o.order_date < ms.month_start + INTERVAL '1 month'
            GROUP BY ms.month_start
        ),
        category_drops AS (
            SELECT
                md.month_start,
                c.category_name,
                CASE 
                    WHEN SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                              AND o.order_date < md.month_start THEN oi.line_total END) > 0
                    THEN ((SUM(CASE WHEN o.order_date >= md.month_start 
                              AND o.order_date < md.month_start + INTERVAL '1 month' THEN oi.line_total END) - 
                           SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                               AND o.order_date < md.month_start THEN oi.line_total END)) / 
                          SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                              AND o.order_date < md.month_start THEN oi.line_total END) * 100)::NUMERIC
                    ELSE 0
                END AS drop_pct,
                ROW_NUMBER() OVER (PARTITION BY md.month_start ORDER BY 
                    CASE 
                        WHEN SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                                  AND o.order_date < md.month_start THEN oi.line_total END) > 0
                        THEN ((SUM(CASE WHEN o.order_date >= md.month_start 
                                  AND o.order_date < md.month_start + INTERVAL '1 month' THEN oi.line_total END) - 
                               SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                                   AND o.order_date < md.month_start THEN oi.line_total END)) / 
                              SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                                  AND o.order_date < md.month_start THEN oi.line_total END) * 100)::NUMERIC
                        ELSE 0
                    END ASC
                ) AS rn
            FROM monthly_data md
            CROSS JOIN categories c
            LEFT JOIN products p ON c.category_id = p.category_id
            LEFT JOIN order_items oi ON p.product_id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.order_id
                AND o.order_status NOT IN ('Cancelled', 'Refunded')
                AND o.order_date >= md.month_start - INTERVAL '1 month'
                AND o.order_date < md.month_start + INTERVAL '1 month'
            GROUP BY md.month_start, c.category_name
        ),
        seller_drops AS (
            SELECT
                md.month_start,
                s.seller_name,
                CASE 
                    WHEN SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                              AND o.order_date < md.month_start THEN oi.line_total END) > 0
                    THEN ((SUM(CASE WHEN o.order_date >= md.month_start 
                              AND o.order_date < md.month_start + INTERVAL '1 month' THEN oi.line_total END) - 
                           SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                               AND o.order_date < md.month_start THEN oi.line_total END)) / 
                          SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                              AND o.order_date < md.month_start THEN oi.line_total END) * 100)::NUMERIC
                    ELSE 0
                END AS drop_pct,
                ROW_NUMBER() OVER (PARTITION BY md.month_start ORDER BY 
                    CASE 
                        WHEN SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                                  AND o.order_date < md.month_start THEN oi.line_total END) > 0
                        THEN ((SUM(CASE WHEN o.order_date >= md.month_start 
                                  AND o.order_date < md.month_start + INTERVAL '1 month' THEN oi.line_total END) - 
                               SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                                   AND o.order_date < md.month_start THEN oi.line_total END)) / 
                              SUM(CASE WHEN o.order_date >= md.month_start - INTERVAL '1 month' 
                                  AND o.order_date < md.month_start THEN oi.line_total END) * 100)::NUMERIC
                        ELSE 0
                    END ASC
                ) AS rn
            FROM monthly_data md
            CROSS JOIN sellers s
            LEFT JOIN products p ON s.seller_id = p.seller_id
            LEFT JOIN order_items oi ON p.product_id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.order_id
                AND o.order_status NOT IN ('Cancelled', 'Refunded')
                AND o.order_date >= md.month_start - INTERVAL '1 month'
                AND o.order_date < md.month_start + INTERVAL '1 month'
            GROUP BY md.month_start, s.seller_name
        )
        SELECT
            md.yr,
            md.mn,
            md.month_nm,
            md.curr_start,
            md.curr_end,
            md.prev_start,
            md.prev_end,
            md.curr_rev,
            md.prev_rev,
            md.curr_rev - md.prev_rev AS rev_change,
            CASE 
                WHEN md.prev_rev > 0 
                THEN ((md.curr_rev - md.prev_rev) / md.prev_rev * 100)::NUMERIC
                ELSE 0
            END AS change_pct,
            CASE 
                WHEN md.prev_rev = 0 THEN 'No Data'::VARCHAR
                WHEN ((md.curr_rev - md.prev_rev) / md.prev_rev * 100) <= -40 THEN 'Critical'::VARCHAR
                WHEN ((md.curr_rev - md.prev_rev) / md.prev_rev * 100) <= -p_threshold_percent THEN 'High'::VARCHAR
                WHEN ((md.curr_rev - md.prev_rev) / md.prev_rev * 100) <= -10 THEN 'Medium'::VARCHAR
                WHEN ((md.curr_rev - md.prev_rev) / md.prev_rev * 100) < 0 THEN 'Low'::VARCHAR
                ELSE 'None'::VARCHAR
            END AS severity,
            md.curr_orders,
            md.prev_orders,
            md.curr_customers,
            md.prev_customers,
            COALESCE(cd.category_name, 'N/A')::VARCHAR AS aff_category,
            COALESCE(cd.drop_pct, 0) AS cat_drop,
            COALESCE(sd.seller_name, 'N/A')::VARCHAR AS aff_seller,
            COALESCE(sd.drop_pct, 0) AS sell_drop,
            CASE 
                WHEN md.prev_rev = 0 THEN 'Insufficient data for analysis'
                WHEN ((md.curr_rev - md.prev_rev) / md.prev_rev * 100) <= -p_threshold_percent 
                THEN 'Revenue decline detected in ' || md.month_nm || '. Review seasonal factors and customer feedback. Focus on ' || 
                     COALESCE(cd.category_name, 'underperforming categories') || '.'
                WHEN ((md.curr_rev - md.prev_rev) / md.prev_rev * 100) >= p_threshold_percent
                THEN 'Strong growth in ' || md.month_nm || '. Analyze success factors and replicate strategies.'
                ELSE 'Performance stable. Continue monitoring.'
            END AS recommend
        FROM monthly_data md
        LEFT JOIN category_drops cd ON md.month_start = cd.month_start AND cd.rn = 1
        LEFT JOIN seller_drops sd ON md.month_start = sd.month_start AND sd.rn = 1
        ORDER BY md.month_start
    LOOP
        analysis_year := rec.yr;
        analysis_month := rec.mn;
        month_name := rec.month_nm;
        current_period_start := rec.curr_start;
        current_period_end := rec.curr_end;
        comparison_period_start := rec.prev_start;
        comparison_period_end := rec.prev_end;
        current_revenue := rec.curr_rev;
        previous_revenue := rec.prev_rev;
        revenue_change := rec.rev_change;
        change_percentage := rec.change_pct;
        drop_severity := rec.severity;
        current_orders := rec.curr_orders;
        previous_orders := rec.prev_orders;
        current_customers := rec.curr_customers;
        previous_customers := rec.prev_customers;
        affected_category := rec.aff_category;
        category_drop_percentage := rec.cat_drop;
        affected_seller := rec.aff_seller;
        seller_drop_percentage := rec.sell_drop;
        recommendations := rec.recommend;
        RETURN NEXT;
    END LOOP;
    
    RETURN;
END;
$$;


SELECT * FROM get_monthly_revenue_drop_analysis(20);