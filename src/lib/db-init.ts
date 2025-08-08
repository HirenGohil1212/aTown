
'use server';

import { query } from './db';

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createProductsTable = `
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    image VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createCategoriesTable = `
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createBannersTable = `
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imageUrl VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createSettingsTable = `
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    allowSignups BOOLEAN DEFAULT FALSE,
    whatsappNumber VARCHAR(20) DEFAULT '911234567890',
    minOrderQuantity INT DEFAULT 4
);
`;

const insertDefaultSettings = `
INSERT IGNORE INTO settings (id, allowSignups, whatsappNumber, minOrderQuantity)
VALUES (1, FALSE, '911234567890', 4);
`;


export async function initializeDatabase() {
  try {
    await query(createUsersTable);
    console.log("Users table created or already exists.");

    await query(createProductsTable);
    console.log("Products table created or already exists.");

    await query(createCategoriesTable);
    console.log("Categories table created or already exists.");
    
    await query(createBannersTable);
    console.log("Banners table created or already exists.");
    
    await query(createSettingsTable);
    console.log("Settings table created or already exists.");

    await query(insertDefaultSettings);
    console.log("Default settings inserted or already exist.");


    return { success: true, message: "All database tables initialized successfully." };
  } catch (error) {
    console.error("Database initialization failed:", error);
    if (error instanceof Error) {
        return { success: false, message: `Database initialization failed: ${error.message}` };
    }
    return { success: false, message: "An unknown error occurred during database initialization." };
  }
}
