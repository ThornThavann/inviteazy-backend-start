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