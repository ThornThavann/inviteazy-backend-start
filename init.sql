CREATE TABLE
  events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    event_name VARCHAR(255) NOT NULL,
    event_datetime TIMESTAMP NOT NULL,
    location VARCHAR(255),
    description TEXT, -- optional by default
    user_id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
  );

CREATE TABLE
  invitees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    event_id UUID NOT NULL REFERENCES events (id),
    user_id UUID NOT NULL REFERENCES users (id),
    status VARCHAR(50),
    qr_code TEXT,
    is_checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

/ / MARIADB / /
CREATE TABLE
  users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID ()),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    profile_picture TEXT,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

CREATE TABLE
  events (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID ()), -- UUID in MariaDB as CHAR(36)
    event_name VARCHAR(255) NOT NULL,
    event_datetime DATETIME NOT NULL,
    location VARCHAR(255),
    description TEXT,
    user_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
  );

CREATE TABLE
  IF NOT EXISTS invitees (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID ()),
    event_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    status VARCHAR(50),
    qr_code TEXT,
    is_checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );