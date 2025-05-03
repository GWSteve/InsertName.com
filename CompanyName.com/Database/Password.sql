-- Create the Password table if it doesn't already exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Password' AND xtype='U')
BEGIN
    CREATE TABLE Password (
        user_id UNIQUEIDENTIFIER PRIMARY KEY,
        password NVARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Username(user_id) ON DELETE CASCADE
    );
END;

-- Insert blank passwords only if the user_id is not already in Password table
IF NOT EXISTS (SELECT 1 FROM Password WHERE user_id = '550e8400-e29b-41d4-a716-446655440000')
    INSERT INTO Password (user_id, password) VALUES ('550e8400-e29b-41d4-a716-446655440000',
    '85e8d66d3be882590eb738284e54c90ed9972cd7a80f173f9fe72af518ec1b94');

IF NOT EXISTS (SELECT 1 FROM Password WHERE user_id = 'c56a4180-65aa-42ec-a945-5fd21dec0538')
    INSERT INTO Password (user_id, password) VALUES ('c56a4180-65aa-42ec-a945-5fd21dec0538',
    'db0e72748375f39de3efca577461265dd3ab4c41e94867759ca063be2e10b8c4');

IF NOT EXISTS (SELECT 1 FROM Password WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
    INSERT INTO Password (user_id, password) VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479',
    '9e56e74f79f4776f62d6cba0d6c597b9830ec01a7127bc5e9c0da74063a4f51c');
