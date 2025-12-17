-- @block 

-- Delete in reverse dependency order
-- 1. First delete reports that reference the user's resources
DELETE rp FROM reports rp
JOIN resources res ON rp.resource_id = res.id
WHERE res.user_id = 226;

-- 2. Delete verification codes for the user
DELETE FROM verification_codes WHERE user_id = 226;

-- 3. Delete the user's resources
DELETE FROM resources WHERE user_id = 226;

-- 4. Finally delete the user
DELETE FROM users WHERE id = 226;

-- @block
SELECT * FROM messages;