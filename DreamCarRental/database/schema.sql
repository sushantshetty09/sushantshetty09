CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15) NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  type ENUM('SUV', 'Sedan', 'Luxury', 'Economy', 'Sports') NOT NULL,
  year INT NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  transmission ENUM('Automatic', 'Manual') NOT NULL,
  seats INT NOT NULL,
  fuel_type VARCHAR(20),
  image_url VARCHAR(255),
  features JSON,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  pickup_date DATETIME NOT NULL,
  return_date DATETIME NOT NULL,
  pickup_location VARCHAR(100) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  additional_options JSON,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
