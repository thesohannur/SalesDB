-- Trigger: trg_calculate_order_financial_total
-- Context: Financial Integrity & Auto-Calculation
-- Description: Automatically calculates the 'total_amount' for an order whenever order_items are added, updated, or deleted. 
--            This ensures the financial record of the order always matches the sum of its parts.

-- 1. Create the Function
CREATE OR REPLACE FUNCTION fn_calculate_order_financial_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Context: Orders Table Financial Update
    UPDATE orders
    SET total_amount = (
        SELECT COALESCE(SUM(line_total), 0)
        FROM order_items
        WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
    )
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the Trigger
-- Drop old trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS trigger_update_order_total ON order_items;
DROP TRIGGER IF EXISTS trg_calculate_order_financial_total ON order_items;

CREATE TRIGGER trg_calculate_order_financial_total
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION fn_calculate_order_financial_total();
