-- Trigger: trg_inventory_enforce_stock_limit_on_sale
-- Context: Inventory Control & Stock Safety
-- Description: Automatically deducts stock when an item is sold AND prevents the sale if stock is insufficient.

CREATE OR REPLACE FUNCTION fn_enforce_stock_limit_on_sale()
RETURNS TRIGGER AS $$
DECLARE
    current_stock INT;
BEGIN
    -- Check current stock regarding this specific Product Context
    SELECT stock_remaining INTO current_stock
    FROM inventory
    WHERE product_id = NEW.product_id;

    -- Business Logic: Cannot sell what you don't have
    IF current_stock IS NULL OR current_stock < NEW.quantity THEN
        RAISE EXCEPTION 'Inventory Error: Insufficient stock for Product ID %. Available: %, Requested: %', 
            NEW.product_id, COALESCE(current_stock, 0), NEW.quantity;
    END IF;

    -- Context: Inventory Ledger Update
    UPDATE inventory
    SET stock_remaining = stock_remaining - NEW.quantity
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Trigger
DROP TRIGGER IF EXISTS trg_inventory_enforce_stock_limit_on_sale ON order_items;

CREATE TRIGGER trg_inventory_enforce_stock_limit_on_sale
BEFORE INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION fn_enforce_stock_limit_on_sale();
