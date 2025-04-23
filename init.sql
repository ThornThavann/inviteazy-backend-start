CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_datetime TIMESTAMP NOT NULL,
  location VARCHAR(255),
  description TEXT, -- optional by default
  user_id uuid NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);