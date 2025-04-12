
-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS portal;

-- Use the database
USE portal;

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requester VARCHAR(100) NOT NULL,
    room VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    date_start DATETIME NOT NULL,
    date_end DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create LOGIN_USUARIO table if it doesn't exist (for birthdays)
CREATE TABLE IF NOT EXISTS LOGIN_USUARIO (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nm_dsc_usu VARCHAR(100) NOT NULL,
    nm_dep VARCHAR(100) NOT NULL,
    nm_cid VARCHAR(100) NOT NULL,
    dt_nac DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into meetings table
INSERT INTO meetings (requester, room, subject, location, date_start, date_end) VALUES
('Carlos Silva', 'Sala Executiva 01', 'Planejamento Estratégico', 'São Paulo', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)),
('Ana Rodrigues', 'Sala de Reuniões 01', 'Revisão de Projeto', 'São Paulo', DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 3 HOUR)),
('Lucas Mendes', 'Auditório', 'Apresentação de Resultados', 'São Paulo', DATE_ADD(NOW(), INTERVAL -2 HOUR), DATE_ADD(NOW(), INTERVAL -1 HOUR)),
('Mariana Costa', 'Sala Executiva 02', 'Entrevista de Contratação', 'São Paulo', DATE_ADD(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 5 HOUR));

-- Insert sample data for Rio de Janeiro
INSERT INTO meetings (requester, room, subject, location, date_start, date_end) VALUES
('Roberto Almeida', 'Sala Executiva 01', 'Planejamento Anual', 'Rio de Janeiro', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)),
('Juliana Santos', 'Sala de Reuniões 02', 'Review de Marketing', 'Rio de Janeiro', DATE_ADD(NOW(), INTERVAL 3 HOUR), DATE_ADD(NOW(), INTERVAL 4 HOUR));

-- Insert sample data into LOGIN_USUARIO table (for birthdays)
INSERT INTO LOGIN_USUARIO (nm_dsc_usu, nm_dep, nm_cid, dt_nac) VALUES
('Carlos Silva', 'Financeiro', 'São Paulo', '1985-04-15'),
('Ana Rodrigues', 'Marketing', 'São Paulo', '1990-04-18'),
('Lucas Mendes', 'TI', 'São Paulo', '1988-04-20'),
('Mariana Costa', 'RH', 'São Paulo', '1992-04-12'),
('Roberto Almeida', 'Vendas', 'Rio de Janeiro', '1980-04-14'),
('Juliana Santos', 'Marketing', 'Rio de Janeiro', '1995-04-16'),
('Fernando Oliveira', 'Operações', 'Belo Horizonte', '1982-04-13'),
('Patricia Souza', 'Administração', 'Curitiba', '1987-04-19'),
('Ricardo Lima', 'Financeiro', 'Brasília', '1978-04-17');
