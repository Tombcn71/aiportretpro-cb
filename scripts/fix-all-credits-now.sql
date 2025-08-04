-- Fix all existing purchases and give credits
UPDATE purchases SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE status = 'pending';

-- Count total purchases for user 1
WITH purchase_count AS (
  SELECT user_id, COUNT(*) as total_purchases 
  FROM purchases 
  WHERE user_id = 1 AND status = 'completed'
  GROUP BY user_id
)
-- Add credits equal to number of purchases
INSERT INTO credits (user_id, credits, created_at, updated_at)
SELECT user_id, total_purchases, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM purchase_count
ON CONFLICT (user_id) 
DO UPDATE SET 
  credits = purchase_count.total_purchases,
  updated_at = CURRENT_TIMESTAMP;
