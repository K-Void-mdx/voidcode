-- ============================================================================
-- K-VOID PROGRAMMING HUB - SUPABASE SCHEMA
-- PostgreSQL Database Setup
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE (User accounts & gamification state)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  completed_lessons INT DEFAULT 0,
  completed_courses INT DEFAULT 0,
  role TEXT DEFAULT 'student', -- 'student', 'admin'
  email_verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  total_study_minutes INT DEFAULT 0,
  theme TEXT DEFAULT 'dark', -- 'dark' or 'light'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. LESSON PROGRESS TABLE (Track completed lessons)
-- ============================================================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  status TEXT DEFAULT 'completed', -- 'started', 'completed', 'reviewed'
  completion_percentage INT DEFAULT 100,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent_minutes INT DEFAULT 0,
  review_status TEXT DEFAULT 'not_reviewed', -- 'not_reviewed', 'reviewed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_lesson_progress_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE,
  UNIQUE(user_id, lesson_id, course_id)
);

-- ============================================================================
-- 3. CERTIFICATES TABLE (Course completion certificates)
-- ============================================================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_title TEXT,
  certificate_code TEXT UNIQUE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  final_score INT DEFAULT 100,
  verification_status TEXT DEFAULT 'verified', -- 'verified', 'pending', 'revoked'
  shared_publicly BOOLEAN DEFAULT FALSE,
  verification_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_certificate_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id)
);

-- ============================================================================
-- 4. QUIZ ATTEMPTS TABLE (User quiz submissions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  attempt_number INT,
  score INT,
  total_questions INT,
  passed BOOLEAN,
  time_taken_minutes INT DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answers JSONB DEFAULT '{}',
  feedback_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_quiz_attempts_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- ============================================================================
-- 5. ACHIEVEMENTS TABLE (Badge definitions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  badge_color TEXT,
  xp_reward INT DEFAULT 0,
  unlock_criteria TEXT, -- JSON description of how to unlock
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. USER ACHIEVEMENTS TABLE (User earned badges)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user_achievements_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE,
  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- 7. NOTIFICATIONS TABLE (In-app notifications)
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  notification_type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- ============================================================================
-- 8. SETTINGS TABLE (User preferences)
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  theme TEXT DEFAULT 'dark',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_on_milestone BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'en',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- ============================================================================
-- 9. NOTES TABLE (User notes on lessons)
-- ============================================================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- ============================================================================
-- 10. BOOKMARKS TABLE (Saved lessons/courses)
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id)
);

-- ============================================================================
-- 11. LEARNING EVENTS TABLE (Analytics/tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS learning_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'lesson_started', 'lesson_completed', 'quiz_passed', etc.
  course_id TEXT,
  lesson_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_learning_events_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course ON lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_lesson ON quiz_attempts(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_events_user ON learning_events(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_events_type ON learning_events(event_type);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (user_id = current_user_id() OR role = 'admin');

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (user_id = current_user_id());

-- Lesson Progress: Users can view/update their own progress
CREATE POLICY "Users can view their own lesson progress"
  ON lesson_progress FOR SELECT
  USING (user_id = current_user_id());

CREATE POLICY "Users can update their own lesson progress"
  ON lesson_progress FOR INSERT
  USING (user_id = current_user_id());

-- Certificates: Users can view their own certificates
CREATE POLICY "Users can view their own certificates"
  ON certificates FOR SELECT
  USING (user_id = current_user_id());

-- Quiz Attempts: Users can view/insert their own quiz attempts
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (user_id = current_user_id());

CREATE POLICY "Users can insert quiz attempts"
  ON quiz_attempts FOR INSERT
  USING (user_id = current_user_id());

-- User Achievements: Users can view their own achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (user_id = current_user_id());

-- Notifications: Users can view/update their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = current_user_id());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = current_user_id());

-- Settings: Users can view/update their own settings
CREATE POLICY "Users can view their own settings"
  ON settings FOR SELECT
  USING (user_id = current_user_id());

CREATE POLICY "Users can update their own settings"
  ON settings FOR UPDATE
  USING (user_id = current_user_id());

-- Notes: Users can view/update their own notes
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (user_id = current_user_id());

CREATE POLICY "Users can insert their own notes"
  ON notes FOR INSERT
  USING (user_id = current_user_id());

-- Bookmarks: Users can view/manage their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (user_id = current_user_id());

CREATE POLICY "Users can insert bookmarks"
  ON bookmarks FOR INSERT
  USING (user_id = current_user_id());

-- Learning Events: Users can view their own events
CREATE POLICY "Users can view their own learning events"
  ON learning_events FOR SELECT
  USING (user_id = current_user_id());

-- ============================================================================
-- HELPER FUNCTION: Get current user ID (for auth)
-- ============================================================================
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN auth.uid()::text;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- DONE!
-- ============================================================================
