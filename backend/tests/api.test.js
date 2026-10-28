import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";
import http from "node:http";

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on("error", reject);
    if (postData) {
      req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

test("Backend API Test Suite - Phase 1 & Phase 2", async (t) => {
  let server;
  let port;
  let authToken = "";

  await t.test("Setup test HTTP server", async () => {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    port = server.address().port;
    assert.ok(port > 0);
  });

  await t.test("GET /api/health should return 200 OK with database state", async () => {
    const res = await request({
      hostname: "localhost",
      port,
      path: "/api/health",
      method: "GET"
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
    assert.ok(res.body.database);
  });

  await t.test("POST /api/auth/register should create a candidate account", async () => {
    const res = await request(
      {
        hostname: "localhost",
        port,
        path: "/api/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        name: "Test Candidate",
        email: "candidate@example.com",
        password: "securePassword123!"
      }
    );
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, "candidate@example.com");
    assert.equal(res.body.user.password_hash, undefined); // Password hash must never be returned
    authToken = res.body.token;
  });

  await t.test("POST /api/auth/login should authenticate candidate and return token", async () => {
    const res = await request(
      {
        hostname: "localhost",
        port,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        email: "candidate@example.com",
        password: "securePassword123!"
      }
    );
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
  });

  await t.test("GET /api/auth/me should reject unauthorized requests", async () => {
    const res = await request({
      hostname: "localhost",
      port,
      path: "/api/auth/me",
      method: "GET"
    });
    assert.equal(res.status, 401);
  });

  await t.test("GET /api/auth/me should return authenticated user profile with valid token", async () => {
    const res = await request({
      hostname: "localhost",
      port,
      path: "/api/auth/me",
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.user.email, "candidate@example.com");
  });

  let createdSessionId = null;

  await t.test("POST /api/interviews should create a new persistent session", async () => {
    const res = await request(
      {
        hostname: "localhost",
        port,
        path: "/api/interviews",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        }
      },
      {
        role: "Frontend Developer",
        difficulty: "Intermediate",
        numQuestions: 2
      }
    );
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.selected_role, "Frontend Developer");
    createdSessionId = res.body.data.id;
  });

  await t.test("GET /api/interviews/:id should retrieve persistent session with questions", async () => {
    const res = await request({
      hostname: "localhost",
      port,
      path: `/api/interviews/${createdSessionId}`,
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id, createdSessionId);
    assert.ok(Array.isArray(res.body.data.questions));
  });

  await t.test("POST /api/interviews/:id/answers should persist answer", async () => {
    const res = await request(
      {
        hostname: "localhost",
        port,
        path: `/api/interviews/${createdSessionId}/answers`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        }
      },
      {
        sessionQuestionId: 1,
        answerText: "Virtual DOM minimizes actual browser DOM reflows via heuristic diffing."
      }
    );
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id);
  });

  await t.test("Teardown test server", async () => {
    await new Promise((resolve) => server.close(resolve));
  });
});
