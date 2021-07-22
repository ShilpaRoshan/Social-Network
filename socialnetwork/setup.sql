DROP TABLE IF EXISTS friend_requests;
DROP TABLE IF EXISTS reset_password;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    profile_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_password(
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL, 
    code VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friend_requests(
    id SERIAL PRIMARY KEY,
    accepted BOOLEAN DEFAULT FALSE,
    receiver_id INT REFERENCES users (id) NOT NULL,
    sender_id INT REFERENCES users (id) NOT NULL
    
);

/*SELECT u.id, u.first_name, u.last_name, u.profile_url, f.accepted
FROM friend_requests AS f
JOIN users AS u
ON(f.accepted = false AND f.receiver_id = 200 AND f.sender_id = u.id)
OR(f.accepted = true AND f.receiver_id = 200 AND f.sender_id = u.id)
OR(f.accepted = true AND f.sender_id = 200 AND f.receiver_id = u.id)
WHERE u.id = 6;*/