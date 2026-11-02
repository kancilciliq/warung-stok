CREATE DATABASE IF NOT EXISTS warung_madura_stok
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE warung_madura_stok;

CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  username    VARCHAR(50)  NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin','staff') NOT NULL DEFAULT 'staff',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS suppliers (
  id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name    VARCHAR(100) NOT NULL,
  phone   VARCHAR(30)  NULL,
  address VARCHAR(255) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id INT UNSIGNED NOT NULL,
  code        VARCHAR(30)  NOT NULL,
  name        VARCHAR(150) NOT NULL,
  unit        VARCHAR(20)  NOT NULL DEFAULT 'pcs',
  stock       INT NOT NULL DEFAULT 0,
  min_stock   INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_code (code),
  KEY idx_products_category (category_id),
  CONSTRAINT chk_products_stock CHECK (stock >= 0),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES categories (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stock_transactions (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  transaction_code VARCHAR(40)  NOT NULL,
  user_id          INT UNSIGNED NOT NULL,
  supplier_id      INT UNSIGNED NULL,
  type             ENUM('in','out') NOT NULL,
  transaction_date DATE NOT NULL,
  note             VARCHAR(255) NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_trx_code (transaction_code),
  KEY idx_trx_type_date (type, transaction_date),
  CONSTRAINT fk_trx_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_trx_supplier FOREIGN KEY (supplier_id)
    REFERENCES suppliers (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stock_transaction_details (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  transaction_id INT UNSIGNED NOT NULL,
  product_id     INT UNSIGNED NOT NULL,
  quantity       INT UNSIGNED NOT NULL,
  stock_before   INT NOT NULL,
  stock_after    INT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_detail_trx (transaction_id),
  KEY idx_detail_product (product_id),
  CONSTRAINT chk_detail_qty CHECK (quantity > 0),
  CONSTRAINT fk_detail_trx FOREIGN KEY (transaction_id)
    REFERENCES stock_transactions (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_detail_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;
