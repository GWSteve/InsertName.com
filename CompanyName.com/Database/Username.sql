-- Create the Username table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Username' AND xtype='U')
BEGIN
    CREATE TABLE Username (
        user_id UNIQUEIDENTIFIER PRIMARY KEY,
        username NVARCHAR(50) UNIQUE NOT NULL
    );
END;

-- Insert default users if they don't already exist
IF NOT EXISTS (SELECT 1 FROM Username WHERE user_id = '550e8400-e29b-41d4-a716-446655440000')
    INSERT INTO Username (user_id, username)
    VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Guest');

IF NOT EXISTS (SELECT 1 FROM Username WHERE user_id = 'c56a4180-65aa-42ec-a945-5fd21dec0538')
    INSERT INTO Username (user_id, username)
    VALUES ('c56a4180-65aa-42ec-a945-5fd21dec0538', 'Administrator');

IF NOT EXISTS (SELECT 1 FROM Username WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
    INSERT INTO Username (user_id, username)
    VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Hacker');
