-- =====================================================================
-- InterviewIQ AI — MySQL 8.x Relational Database Schema
-- Compatible with MySQL Workbench & CLI
-- Character set: utf8mb4, Collation: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS interviewiq_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE interviewiq_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'candidate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  selected_role VARCHAR(100) NOT NULL,
  selected_topic VARCHAR(100) DEFAULT 'All',
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
  interview_style ENUM('Technical', 'HR', 'Mixed') DEFAULT 'Technical',
  answer_mode ENUM('Text', 'Audio', 'Both') DEFAULT 'Both',
  total_questions INT NOT NULL DEFAULT 3,
  completed_questions INT NOT NULL DEFAULT 0,
  status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  overall_score DECIMAL(5, 2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_user (user_id),
  INDEX idx_sessions_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Questions Table (Schema prepared for future database migration of questions)
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  external_question_key VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(100) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
  question_text TEXT NOT NULL,
  expected_answer TEXT NOT NULL,
  key_concepts JSON NOT NULL,
  scoring_rubric JSON NOT NULL,
  suggested_time_seconds INT DEFAULT 120,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_questions_role_diff (role, difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Interview Session Questions Table (Snapshots original question & rubric for session immutability)
CREATE TABLE IF NOT EXISTS interview_session_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  question_key VARCHAR(100) NOT NULL,
  question_order INT NOT NULL DEFAULT 1,
  question_snapshot TEXT NOT NULL,
  expected_answer_snapshot TEXT NOT NULL,
  rubric_snapshot JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_isq_session FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
  INDEX idx_isq_session (session_id),
  UNIQUE KEY uq_session_order (session_id, question_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Answers Table (Persists candidate response)
CREATE TABLE IF NOT EXISTS answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  session_question_id INT NOT NULL,
  answer_type ENUM('text', 'audio') NOT NULL DEFAULT 'text',
  answer_text LONGTEXT NULL,
  transcript LONGTEXT NULL,
  confirmed_transcript LONGTEXT NULL,
  transcription_provider VARCHAR(50) NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_answers_session FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_answers_sq FOREIGN KEY (session_question_id) REFERENCES interview_session_questions(id) ON DELETE CASCADE,
  INDEX idx_answers_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Answer Feedback Table (Stores multi-dimensional AI scoring results)
CREATE TABLE IF NOT EXISTS answer_feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  answer_id INT NOT NULL UNIQUE,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  rubric_version VARCHAR(20) DEFAULT '1.0',
  overall_score DECIMAL(5, 2) NOT NULL,
  correctness_score DECIMAL(5, 2) NOT NULL,
  relevance_score DECIMAL(5, 2) NOT NULL,
  completeness_score DECIMAL(5, 2) NOT NULL,
  conceptual_understanding_score DECIMAL(5, 2) NOT NULL,
  clarity_score DECIMAL(5, 2) NOT NULL,
  practical_application_score DECIMAL(5, 2) NOT NULL,
  strengths_json JSON NOT NULL,
  missing_concepts_json JSON NOT NULL,
  mistakes_json JSON NOT NULL,
  improvements_json JSON NOT NULL,
  suggested_answer LONGTEXT NOT NULL,
  verdict VARCHAR(255) NOT NULL,
  evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_feedback_answer FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
  INDEX idx_feedback_answer (answer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
