import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("interviewiq_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

export const getQuestionFilters = async () => {
  const response = await api.get("/questions/filters");
  return response.data;
};

export const getQuestions = async (params) => {
  const response = await api.get("/questions", { params });
  return response.data;
};

export const validateAnswer = async ({ questionId, answerText }) => {
  const response = await api.post("/interviews/answers/validate", {
    questionId,
    answerText
  });
  return response.data;
};

export const createInterviewSession = async (sessionData) => {
  const response = await api.post("/interviews", sessionData);
  return response.data;
};

export const getInterviewSession = async (id) => {
  const response = await api.get(`/interviews/${id}`);
  return response.data;
};

export const saveInterviewAnswer = async (sessionId, answerData) => {
  const response = await api.post(`/interviews/${sessionId}/answers`, answerData);
  return response.data;
};

export const evaluateInterviewAnswer = async (sessionId, answerId, providerPreference) => {
  const response = await api.post(`/interviews/${sessionId}/answers/${answerId}/evaluate`, {
    providerPreference
  });
  return response.data;
};

export const getUserInterviewHistory = async () => {
  const response = await api.get("/interviews");
  return response.data;
};

export default api;
