# InterviewIQ AI — API Reference

## Base URL
`/api` (Proxied in development from Vite `http://localhost:5173/api` to `http://localhost:5000/api`)

---

### System & Health

#### `GET /api/health`
Checks server status and environment.
- **Response `200 OK`**:
```json
{
  "status": "ok",
  "service": "InterviewIQ AI Backend",
  "timestamp": "2026-10-28T13:11:48.030Z",
  "environment": "development"
}
```

---

### Question Bank

#### `GET /api/questions/filters`
Retrieves roles, topics, difficulties, styles, and answer modes.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "roles": ["Frontend Developer", "Backend Developer", "..."],
    "difficulties": ["Beginner", "Intermediate", "Advanced"],
    "styles": ["Technical", "HR", "Mixed"],
    "answerModes": ["Text", "Audio", "Both"],
    "topicsByRole": {
      "Frontend Developer": ["React & State Management", "JavaScript Fundamentals", "..."]
    },
    "totalQuestions": 14
  }
}
```

#### `GET /api/questions`
Query parameters:
- `role` (optional, string)
- `topic` (optional, string)
- `difficulty` (optional, string)
- `limit` (optional, integer, default: 5)

Returns list of sanitized questions (excluding expected answer & key concepts before submission).

---

### Interview Session (Phase 1 Validation)

#### `POST /api/interviews/answers/validate`
Validates candidate text answer for development sessions.
- **Request Body**:
```json
{
  "questionId": "fe-react-001",
  "answerText": "Props are immutable parameters passed to components..."
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Answer validated and accepted for development session.",
  "data": {
    "questionId": "fe-react-001",
    "answerLength": 64,
    "submittedAt": "2026-10-28T13:15:00.000Z",
    "role": "Frontend Developer"
  }
}
```
