USE review_kantin;

UPDATE dbo.USERS
SET password_hash = N'$2b$10$ht.02ZQLOX.TbCUbl.6et.eeJi.IHE1erp7p9oPWhWY5ZCF8KgwBq';

SELECT id, name, email, role, LEFT(password_hash, 20) AS awal_hash
FROM dbo.USERS
ORDER BY id;