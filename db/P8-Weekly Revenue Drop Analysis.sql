-- =============================================
-- 3. WEEK-TO-WEEK REVENUE DROP ANALYSIS (OPTIMIZED)
-- =============================================
-- Analyzes every week compared to its previous week, categorized by year and month

CREATE OR REPLACE FUNCTION get_weekly_revenue_drop_analysis(p_year INT)
RETURNS TABLE(
    analysis_year INT,
    analysis_month INT,
    month_name VARCHAR,
    week_number INT,
    week_of_month INT,
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
    threshold_percent NUMERIC := 20;
BEGIN
    SELECT 
        DATE_TRUNC('week', MIN(order_date))::DATE,
        DATE_TRUNC('week', MAX(order_date))::DATE
    INTO min_date, max_date
    FROM orders
    WHERE EXTRACT(YEAR FROM order_date) = p_year
    AND order_status NOT IN ('Cancelled', 'Refunded');

    FOR rec IN
        WITH week_series AS (
            SELECT 
                generate_series(
                    min_date + INTERVAL '1 week',
                    LEAST(max_date, DATE_TRUNC('week', reference_date)),
                    INTERVAL '1 week'
                )::DATE AS week_start
            WHERE EXTRACT(YEAR FROM min_date + INTERVAL '1 week') = p_year
                OR EXTRACT(YEAR FROM min_date + INTERVAL '1 week') = p_year - 1
        ),
        weekly_data AS (
            SELECT
                ws.week_start,
                EXTRACT(YEAR FROM ws.week_start)::INT AS yr,
                EXTRACT(MONTH FROM ws.week_start)::INT AS mn,
                TO_CHAR(ws.week_start, 'Month')::VARCHAR AS month_nm,
                EXTRACT(WEEK FROM ws.week_start)::INT AS week_num,
                (EXTRACT(DAY FROM ws.week_start)::INT - 1) / 7 + 1 AS week_of_mn,
                ws.week_start AS curr_start,
                (ws.week_start + INTERVAL '6 days')::DATE AS curr_end,
                (ws.week_start - INTERVAL '1 week')::DATE AS prev_start,
                (ws.week_start - INTERVAL '1 day')::DATE AS prev_end,
                
                --...dec 25 - Jan 1 + Jan 7...
                -- Current week 
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= ws.week_start 
                    AND o.order_date < ws.week_start + INTERVAL '1 week'
                    THEN o.total_amount 
                END), 0)::NUMERIC AS curr_rev,
                COUNT(DISTINCT CASE 
                    WHEN o.order_date >= ws.week_start 
                    AND o.order_date < ws.week_start + INTERVAL '1 week'
                    THEN o.order_id 
                END)::INT AS curr_orders,
                COUNT(DISTINCT CASE 
                    WHEN o.order_date >= ws.week_start 
                    AND o.order_date < ws.week_start + INTERVAL '1 week'
                    THEN o.customer_id 
                END)::INT AS curr_customers,
                
                -- Previous week 
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= ws.week_start - INTERVAL '1 week'
                    AND o.order_date < ws.week_start
                    THEN o.total_amount 
                END), 0)::NUMERIC AS prev_rev,
                COUNT(DISTINCT CASE 
                    WHEN o.order_date >= ws.week_start - INTERVAL '1 week'
                    AND o.order_date < ws.week_start
                    THEN o.order_id 
                END)::INT AS prev_orders,
                COUNT(DISTINCT CASE 
                    WHEN o.order_date >= ws.week_start - INTERVAL '1 week'
                    AND o.order_date < ws.week_start
                    THEN o.customer_id 
                END)::INT AS prev_customers
            FROM week_series ws
            LEFT JOIN orders o ON o.order_status NOT IN ('Cancelled', 'Refunded')
                AND o.order_date >= ws.week_start - INTERVAL '1 week'
                AND o.order_date < ws.week_start + INTERVAL '1 week'
            GROUP BY ws.week_start
        ),
        category_drops AS (
            SELECT
                wd.week_start,
                c.category_name,
                CASE 
                    WHEN SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                              AND o.order_date < wd.week_start THEN oi.line_total END) > 0
                    THEN ((SUM(CASE WHEN o.order_date >= wd.week_start 
                              AND o.order_date < wd.week_start + INTERVAL '1 week' THEN oi.line_total END) - 
                           SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                               AND o.order_date < wd.week_start THEN oi.line_total END)) / 
                          SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                              AND o.order_date < wd.week_start THEN oi.line_total END) * 100)::NUMERIC
                    ELSE 0
                END AS drop_pct,
                ROW_NUMBER() OVER (PARTITION BY wd.week_start ORDER BY 
                    CASE 
                        WHEN SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                                  AND o.order_date < wd.week_start THEN oi.line_total END) > 0
                        THEN ((SUM(CASE WHEN o.order_date >= wd.week_start 
                                  AND o.order_date < wd.week_start + INTERVAL '1 week' THEN oi.line_total END) - 
                               SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                                   AND o.order_date < wd.week_start THEN oi.line_total END)) / 
                              SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                                  AND o.order_date < wd.week_start THEN oi.line_total END) * 100)::NUMERIC
                        ELSE 0
                    END ASC
                ) AS rn
            FROM weekly_data wd
            CROSS JOIN categories c
            LEFT JOIN products p ON c.category_id = p.category_id
            LEFT JOIN order_items oi ON p.product_id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.order_id
                AND o.order_status NOT IN ('Cancelled', 'Refunded')
                AND o.order_date >= wd.week_start - INTERVAL '1 week'
                AND o.order_date < wd.week_start + INTERVAL '1 week'
            GROUP BY wd.week_start, c.category_name
        ),
        seller_drops AS (
            SELECT
                wd.week_start,
                s.seller_name,
                CASE 
                    WHEN SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                              AND o.order_date < wd.week_start THEN oi.line_total END) > 0
                    THEN ((SUM(CASE WHEN o.order_date >= wd.week_start 
                              AND o.order_date < wd.week_start + INTERVAL '1 week' THEN oi.line_total END) - 
                           SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                               AND o.order_date < wd.week_start THEN oi.line_total END)) / 
                          SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                              AND o.order_date < wd.week_start THEN oi.line_total END) * 100)::NUMERIC
                    ELSE 0
                END AS drop_pct,
                ROW_NUMBER() OVER (PARTITION BY wd.week_start ORDER BY 
                    CASE 
                        WHEN SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                                  AND o.order_date < wd.week_start THEN oi.line_total END) > 0
                        THEN ((SUM(CASE WHEN o.order_date >= wd.week_start 
                                  AND o.order_date < wd.week_start + INTERVAL '1 week' THEN oi.line_total END) - 
                               SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                                   AND o.order_date < wd.week_start THEN oi.line_total END)) / 
                              SUM(CASE WHEN o.order_date >= wd.week_start - INTERVAL '1 week' 
                                  AND o.order_date < wd.week_start THEN oi.line_total END) * 100)::NUMERIC
                        ELSE 0
                    END ASC
                ) AS rn
            FROM weekly_data wd
            CROSS JOIN sellers s
            LEFT JOIN products p ON s.seller_id = p.seller_id
            LEFT JOIN order_items oi ON p.product_id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.order_id
                AND o.order_status NOT IN ('Cancelled', 'Refunded')
                AND o.order_date >= wd.week_start - INTERVAL '1 week'
                AND o.order_date < wd.week_start + INTERVAL '1 week'
            GROUP BY wd.week_start, s.seller_name
        )
        SELECT
            wd.yr,
            wd.mn,
            wd.month_nm,
            wd.week_num,
            wd.week_of_mn,
            wd.curr_start,
            wd.curr_end,
            wd.prev_start,
            wd.prev_end,
            wd.curr_rev,
            wd.prev_rev,
            wd.curr_rev - wd.prev_rev AS rev_change,
            CASE 
                WHEN wd.prev_rev > 0 
                THEN ((wd.curr_rev - wd.prev_rev) / wd.prev_rev * 100)::NUMERIC
                ELSE 0
            END AS change_pct,
            CASE 
                WHEN wd.prev_rev = 0 THEN 'No Data'::VARCHAR
                WHEN ((wd.curr_rev - wd.prev_rev) / wd.prev_rev * 100) <= -40 THEN 'Critical'::VARCHAR
                WHEN ((wd.curr_rev - wd.prev_rev) / wd.prev_rev * 100) <= -threshold_percent THEN 'High'::VARCHAR
                WHEN ((wd.curr_rev - wd.prev_rev) / wd.prev_rev * 100) <= -10 THEN 'Medium'::VARCHAR
                WHEN ((wd.curr_rev - wd.prev_rev) / wd.prev_rev * 100) < 0 THEN 'Low'::VARCHAR
                ELSE 'No Drop'::VARCHAR
            END AS severity,
            wd.curr_orders,
            wd.prev_orders,
            wd.curr_customers,
            wd.prev_customers,
            COALESCE(cd.category_name, 'N/A')::VARCHAR AS aff_category,
            COALESCE(cd.drop_pct, 0) AS cat_drop,
            COALESCE(sd.seller_name, 'N/A')::VARCHAR AS aff_seller,
            COALESCE(sd.drop_pct, 0) AS sell_drop,
            CASE 
                WHEN wd.prev_rev = 0 THEN 'Insufficient data for analysis'
                WHEN ((wd.curr_rev - wd.prev_rev) / wd.prev_rev * 100) <= -threshold_percent 
                THEN 'Weekly decline detected (Week ' || wd.week_of_mn::TEXT || ' of ' || wd.month_nm || '). ' ||
                     'Immediate review needed. Check inventory and marketing. Focus: ' || 
                     COALESCE(cd.category_name, 'all categories') || '.'
                WHEN ((wd.curr_rev - wd.prev_rev) / wd.prev_rev * 100) >= threshold_percent
                THEN 'Strong weekly growth. Analyze and replicate success factors.'
                ELSE 'Week-to-week variance within normal range. Continue monitoring.'
            END AS recommend
        FROM weekly_data wd
        LEFT JOIN category_drops cd ON wd.week_start = cd.week_start AND cd.rn = 1
        LEFT JOIN seller_drops sd ON wd.week_start = sd.week_start AND sd.rn = 1
        WHERE EXTRACT(YEAR FROM wd.week_start) = p_year
        ORDER BY 
        wd.yr DESC,
        wd.mn DESC,
        wd.week_start DESC
    LOOP
        analysis_year := rec.yr;
        analysis_month := rec.mn;
        month_name := rec.month_nm;
        week_number := rec.week_num;
        week_of_month := rec.week_of_mn;
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

-- Test 
SELECT * FROM get_weekly_revenue_drop_analysis();


-- SELECT * FROM get_weekly_revenue_drop_analysis(2022);
-- SELECT * FROM get_weekly_revenue_drop_analysis(2024);
