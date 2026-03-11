-- Trigger: trg_customer_audit_last_activity
-- Context: Customer Engagement Tracking
-- Description: Audits user behavior by updating the 'last_active' timestamp whenever a purchase is made.

CREATE OR REPLACE FUNCTION fn_audit_customer_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Context: Customer Profile Update
    UPDATE customers
    SET last_active = NEW.order_date
    WHERE customer_id = NEW.customer_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Trigger
DROP TRIGGER IF EXISTS trg_customer_audit_last_activity ON orders;

CREATE TRIGGER trg_customer_audit_last_activity
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION fn_audit_customer_last_activity();
