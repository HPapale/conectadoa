-- ConectaDoa · schema.sql
SET NAMES utf8mb4;
DROP DATABASE IF EXISTS conectadoa;
CREATE DATABASE conectadoa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE conectadoa;

CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil ENUM('coordenador','voluntario') NOT NULL DEFAULT 'voluntario',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (email LIKE '%_@_%._%')
);

CREATE TABLE doador (
  id_doador INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (email LIKE '%_@_%._%')
);

CREATE TABLE categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE item (
  id_item INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  quantidade INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  prioridade ENUM('baixa','media','alta') NOT NULL DEFAULT 'media',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
);

CREATE TABLE doacao (
  id_doacao INT AUTO_INCREMENT PRIMARY KEY,
  id_doador INT NOT NULL,
  data_doacao DATE NOT NULL,
  descricao VARCHAR(255),
  status ENUM('pendente','entregue','cancelada') NOT NULL DEFAULT 'pendente',
  data_entrega DATE,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_doador) REFERENCES doador (id_doador),
  CHECK (data_entrega IS NULL OR data_entrega >= data_doacao),
  CHECK (status <> 'entregue' OR data_entrega IS NOT NULL)
);

CREATE TABLE doacao_item (
  id_doacao INT NOT NULL,
  id_item INT NOT NULL,
  quantidade INT NOT NULL CHECK (quantidade > 0),
  PRIMARY KEY (id_doacao, id_item),
  FOREIGN KEY (id_doacao) REFERENCES doacao (id_doacao) ON DELETE CASCADE,
  FOREIGN KEY (id_item) REFERENCES item (id_item)
);