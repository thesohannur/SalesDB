-- Function to generate random orders throughout 2025
CREATE OR REPLACE FUNCTION generate_2025_orders(num_orders INT DEFAULT 3000)
RETURNS void AS $$
DECLARE
    v_order_id INT;
    v_customer_id INT;
    v_order_date TIMESTAMP;
    v_total_amount DECIMAL(10,2);
    v_order_status VARCHAR(50);
    v_payment_method VARCHAR(50);
    v_num_items INT;
    v_product_id INT;
    v_quantity INT;
    v_unit_price DECIMAL(10,2);
    v_line_total DECIMAL(10,2);
    v_order_item_id INT;
    v_payment_id INT;
    v_shipping_id INT;
    i INT;
    j INT;
    v_month INT;
    v_weight FLOAT;
BEGIN
    SELECT COALESCE(MAX(order_id), 370) INTO v_order_id FROM Orders;
    SELECT COALESCE(MAX(order_item_id), 387) INTO v_order_item_id FROM Order_Items;
    SELECT COALESCE(MAX(payment_id), 350) INTO v_payment_id FROM Payments;
    SELECT COALESCE(MAX(shipping_id), 250) INTO v_shipping_id FROM Shipping;
    
    FOR i IN 1..num_orders LOOP
        v_order_id := v_order_id + 1;
        
        -- Weighted random month (more orders closer to December)
        v_weight := random();
        IF v_weight < 0.4 THEN
            v_month := 12; -- 40% in December
        ELSIF v_weight < 0.6 THEN
            v_month := 11; -- 20% in November
        ELSIF v_weight < 0.75 THEN
            v_month := 10; -- 15% in October
        ELSE
            v_month := floor(random() * 9 + 1)::INT; -- 25% in Jan-Sep
        END IF;
        
        -- Generate order date with extra density in late December
        IF v_month = 12 THEN
            IF random() < 0.5 THEN
                -- 50% of December orders in last 10 days
                v_order_date := '2025-12-21'::DATE + (random() * 10)::INT * INTERVAL '1 day' + 
                               (random() * 86400)::INT * INTERVAL '1 second';
            ELSE
                v_order_date := '2025-12-01'::DATE + (random() * 30)::INT * INTERVAL '1 day' + 
                               (random() * 86400)::INT * INTERVAL '1 second';
            END IF;
        ELSE
            v_order_date := ('2025-' || v_month || '-01')::DATE + 
                           (random() * 28)::INT * INTERVAL '1 day' + 
                           (random() * 86400)::INT * INTERVAL '1 second';
        END IF;
        
        -- Random customer
        v_customer_id := floor(random() * 50 + 1)::INT;
        
        -- Random order status (weighted towards delivered for past dates)
        IF v_order_date < CURRENT_DATE - INTERVAL '30 days' THEN
            v_order_status := 'Delivered';
        ELSIF v_order_date < CURRENT_DATE - INTERVAL '7 days' THEN
            v_order_status := CASE 
                WHEN random() < 0.7 THEN 'Delivered'
                WHEN random() < 0.9 THEN 'Shipped'
                ELSE 'Processing'
            END;
        ELSE
            v_order_status := CASE 
                WHEN random() < 0.3 THEN 'Delivered'
                WHEN random() < 0.5 THEN 'Shipped'
                WHEN random() < 0.7 THEN 'Processing'
                ELSE 'Pending'
            END;
        END IF;
        
        -- Number of items in order (1-5)
        v_num_items := floor(random() * 5 + 1)::INT;
        v_total_amount := 0;
        
        -- Calculate total amount first
        FOR j IN 1..v_num_items LOOP
            -- Popular products weighted selection
            CASE 
                WHEN random() < 0.15 THEN v_product_id := 11; -- Men's Casual Shirt (15%)
                WHEN random() < 0.25 THEN v_product_id := 29; -- LED Bulb Pack (10%)
                WHEN random() < 0.35 THEN v_product_id := 15; -- Kids T-Shirt Set (10%)
                WHEN random() < 0.45 THEN v_product_id := 40; -- Yoga Mat (10%)
                WHEN random() < 0.55 THEN v_product_id := 17; -- Nike Running Shoes (10%)
                WHEN random() < 0.65 THEN v_product_id := 27; -- Bed Sheet Set (10%)
                WHEN random() < 0.75 THEN v_product_id := 31; -- Dumbbell Set (10%)
                WHEN random() < 0.85 THEN v_product_id := 13; -- Women's Summer Dress (10%)
                ELSE v_product_id := floor(random() * 50 + 1)::INT; -- Random (15%)
            END CASE;
            
            -- Get product price
            SELECT price INTO v_unit_price FROM Products WHERE product_id = v_product_id;
            
            -- Quantity (weighted towards smaller quantities)
            v_quantity := CASE 
                WHEN v_product_id IN (11, 15, 29, 40) THEN floor(random() * 8 + 1)::INT -- 1-8 for popular items
                WHEN v_product_id IN (17, 27, 31) THEN floor(random() * 4 + 1)::INT -- 1-4 for medium items
                ELSE floor(random() * 3 + 1)::INT -- 1-3 for others
            END;
            
            v_line_total := v_unit_price * v_quantity;
            v_total_amount := v_total_amount + v_line_total;
        END LOOP;
        
        -- Insert order FIRST
        INSERT INTO Orders (order_id, order_date, customer_id, order_status, total_amount)
        VALUES (v_order_id, v_order_date, v_customer_id, v_order_status, v_total_amount);
        
        -- Now insert order items AFTER order exists
        FOR j IN 1..v_num_items LOOP
            v_order_item_id := v_order_item_id + 1;
            
            -- Popular products weighted selection
            CASE 
                WHEN random() < 0.15 THEN v_product_id := 11;
                WHEN random() < 0.25 THEN v_product_id := 29;
                WHEN random() < 0.35 THEN v_product_id := 15;
                WHEN random() < 0.45 THEN v_product_id := 40;
                WHEN random() < 0.55 THEN v_product_id := 17;
                WHEN random() < 0.65 THEN v_product_id := 27;
                WHEN random() < 0.75 THEN v_product_id := 31;
                WHEN random() < 0.85 THEN v_product_id := 13;
                ELSE v_product_id := floor(random() * 50 + 1)::INT;
            END CASE;
            
            SELECT price INTO v_unit_price FROM Products WHERE product_id = v_product_id;
            
            v_quantity := CASE 
                WHEN v_product_id IN (11, 15, 29, 40) THEN floor(random() * 8 + 1)::INT
                WHEN v_product_id IN (17, 27, 31) THEN floor(random() * 4 + 1)::INT
                ELSE floor(random() * 3 + 1)::INT
            END;
            
            v_line_total := v_unit_price * v_quantity;
            
            INSERT INTO Order_Items (order_item_id, order_id, product_id, quantity, unit_price, line_total)
            VALUES (v_order_item_id, v_order_id, v_product_id, v_quantity, v_unit_price, v_line_total);
        END LOOP;
        
        -- Insert payment
        v_payment_id := v_payment_id + 1;
        v_payment_method := CASE floor(random() * 6)::INT
            WHEN 0 THEN 'bKash'
            WHEN 1 THEN 'Nagad'
            WHEN 2 THEN 'Rocket'
            WHEN 3 THEN 'Credit Card'
            WHEN 4 THEN 'Bank Transfer'
            ELSE 'Cash on Delivery'
        END;
        
        INSERT INTO Payments (payment_id, order_id, payment_date, payment_method, payment_status, amount)
        VALUES (v_payment_id, v_order_id, v_order_date + INTERVAL '5 minutes', v_payment_method,
                CASE WHEN v_order_status IN ('Delivered', 'Shipped') THEN 'Completed' ELSE 'Pending' END,
                v_total_amount);
        
        -- Insert shipping
        v_shipping_id := v_shipping_id + 1;
        INSERT INTO Shipping (shipping_id, order_id, shipping_date, estimated_delivery, actual_delivery, delivery_status, tracking_number)
        VALUES (v_shipping_id, v_order_id, 
                (v_order_date + INTERVAL '1 day')::DATE,
                (v_order_date + INTERVAL '6 days')::DATE,
                CASE WHEN v_order_status = 'Delivered' THEN (v_order_date + INTERVAL '5 days')::DATE ELSE NULL END,
                CASE 
                    WHEN v_order_status = 'Delivered' THEN 'Delivered'
                    WHEN v_order_status = 'Shipped' THEN 'In Transit'
                    ELSE 'Pending'
                END,
                'TRK' || LPAD(v_shipping_id::TEXT, 6, '0'));
        
        -- Progress indicator every 500 orders
        IF i % 500 = 0 THEN
            RAISE NOTICE 'Generated % orders...', i;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Successfully generated % orders for 2025!', num_orders;
END;
$$ LANGUAGE plpgsql;

-- Function to generate additional inventory records for all products
CREATE OR REPLACE FUNCTION generate_inventory_data()
RETURNS void AS $$
DECLARE
    v_inventory_id INT;
    v_product_id INT;
    v_warehouse_id INT;
BEGIN
    SELECT COALESCE(MAX(inventory_id), 30) INTO v_inventory_id FROM Inventory;
    
    FOR v_product_id IN 1..50 LOOP
        FOR v_warehouse_id IN 1..50 LOOP
            -- Only create inventory for some warehouse-product combinations (not all)
            IF random() < 0.15 THEN -- 15% chance for each combination
                v_inventory_id := v_inventory_id + 1;
                
                INSERT INTO Inventory (inventory_id, product_id, warehouse_id, stock_remaining, restock_date, min_stock_level)
                VALUES (
                    v_inventory_id,
                    v_product_id,
                    v_warehouse_id,
                    floor(random() * 500 + 50)::INT, -- 50-550 stock
                    CURRENT_DATE - (floor(random() * 60)::INT * INTERVAL '1 day'),
                    floor(random() * 50 + 10)::INT -- 10-60 min stock
                );
            END IF;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Inventory data generated successfully!';
END;
$$ LANGUAGE plpgsql;

-- Function to generate return records for some delivered orders
CREATE OR REPLACE FUNCTION generate_returns_data(num_returns INT DEFAULT 200)
RETURNS void AS $$
DECLARE
    v_return_id INT;
    v_order_item_id INT;
    v_line_total DECIMAL(10,2);
    v_return_reason TEXT;
    v_return_reasons TEXT[] := ARRAY[
        'Product damaged during shipping',
        'Wrong product delivered',
        'Product not as described',
        'Quality issues',
        'Defective product',
        'Size not suitable',
        'Wrong color received',
        'Changed mind',
        'Product arrived late'
    ];
    i INT;
BEGIN
    SELECT COALESCE(MAX(return_id), 30) INTO v_return_id FROM Returns;
    
    FOR i IN 1..num_returns LOOP
        -- Select random order item from delivered orders
        SELECT oi.order_item_id, oi.line_total
        INTO v_order_item_id, v_line_total
        FROM Order_Items oi
        JOIN Orders o ON oi.order_id = o.order_id
        WHERE o.order_status = 'Delivered'
        AND oi.order_item_id NOT IN (SELECT order_item_id FROM Returns WHERE order_item_id IS NOT NULL)
        ORDER BY random()
        LIMIT 1;
        
        IF v_order_item_id IS NOT NULL THEN
            v_return_id := v_return_id + 1;
            v_return_reason := v_return_reasons[floor(random() * array_length(v_return_reasons, 1) + 1)::INT];
            
            INSERT INTO Returns (return_id, order_item_id, return_reason, return_status, return_date, refund_amount, refund_method)
            VALUES (
                v_return_id,
                v_order_item_id,
                v_return_reason,
                CASE 
                    WHEN random() < 0.7 THEN 'Approved'
                    WHEN random() < 0.9 THEN 'Processing'
                    ELSE 'Rejected'
                END,
                CURRENT_DATE - (floor(random() * 30)::INT * INTERVAL '1 day'),
                CASE WHEN random() < 0.8 THEN v_line_total ELSE 0 END,
                CASE 
                    WHEN random() < 0.3 THEN 'bKash'
                    WHEN random() < 0.5 THEN 'Nagad'
                    WHEN random() < 0.7 THEN 'Credit Card'
                    WHEN random() < 0.9 THEN 'Bank Transfer'
                    ELSE NULL
                END
            );
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Generated % return records!', num_returns;
END;
$$ LANGUAGE plpgsql;

-- Execute the functions to generate data
-- Generate 3000 orders for 2025
SELECT generate_2025_orders(3000);

-- Generate additional inventory data
SELECT generate_inventory_data();

-- Generate 200 return records
SELECT generate_returns_data(200);

-- Verify the data
SELECT 
    DATE_TRUNC('month', order_date) as month,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue
FROM Orders
WHERE EXTRACT(YEAR FROM order_date) = 2025
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

-- Check December density
SELECT 
    DATE(order_date) as order_day,
    COUNT(*) as orders_per_day
FROM Orders
WHERE order_date >= '2025-12-01' AND order_date < '2026-01-01'
GROUP BY DATE(order_date)
ORDER BY order_day;

-- Execute the functions to generate data
-- Generate 3000 orders for 2025
SELECT generate_2025_orders(3000);

-- Generate additional inventory data
SELECT generate_inventory_data();

-- Generate 200 return records
SELECT generate_returns_data(200);

-- Verify the data
SELECT 
    DATE_TRUNC('month', order_date) as month,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue
FROM Orders
WHERE EXTRACT(YEAR FROM order_date) = 2025
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

-- Check December density
SELECT 
    DATE(order_date) as order_day,
    COUNT(*) as orders_per_day
FROM Orders
WHERE order_date >= '2025-12-01' AND order_date < '2026-01-01'
GROUP BY DATE(order_date)
ORDER BY order_day;