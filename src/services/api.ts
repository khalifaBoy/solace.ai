import { getToken } from "@/services/authStorage";

const BASE_URL = "https://solace-backend-wtch.onrender.com";

// --------------------------------
// API TYPES
// --------------------------------

export interface APIMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  success: boolean;
  reply: string;
  message?: string;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  conversationId: string;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: ConversationMessage[];
}

export interface ConversationSummary {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: ConversationMessage[];
}

// --------------------------------
// AUTHENTICATED REQUEST HELPER
// --------------------------------

async function authHeaders() {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// --------------------------------
// AI CHAT
// --------------------------------

export async function sendMessage(
  messages: APIMessage[]
): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ messages }),
  });

  const data: ChatResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "AI request failed");
  }

  return data.reply;
}

// --------------------------------
// GET SINGLE CONVERSATION
// --------------------------------

export async function getConversation(
  conversationId: string
): Promise<Conversation> {
  const response = await fetch(
    `${BASE_URL}/api/conversations/${conversationId}`,
    {
      headers: await authHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to load conversation");
  }

  return data.conversation;
}

// --------------------------------
// CREATE CONVERSATION
// --------------------------------

export async function createConversation(
  title: string = "New Conversation"
): Promise<Conversation> {
  const response = await fetch(`${BASE_URL}/api/conversations`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to create conversation");
  }

  return data.conversation;
}

// --------------------------------
// GET ALL CONVERSATIONS
// --------------------------------

export async function getConversations() {
  const response = await fetch(
    `${BASE_URL}/api/conversations`,
    {
      headers: await authHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to fetch conversations");
  }

  return data.conversations;
}

// --------------------------------
// DELETE CONVERSATION
// --------------------------------

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/api/conversations/${conversationId}`,
    {
      method: "DELETE",
      headers: await authHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to delete conversation");
  }
}

// --------------------------------
// AUTHENTICATION TYPES
// --------------------------------

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// --------------------------------
// REGISTER
// --------------------------------

export async function registerUser(
  userData: RegisterData
): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

// --------------------------------
// LOGIN
// --------------------------------

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  const response = await fetch(
    `${BASE_URL}/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({
        role,
        content,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to save message");
  }

  return data.message;
}

export async function getCurrentUser() {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: await authHeaders(),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Session validation failed");
  }

  return data.user;
}

export async function createMood(
  mood: number,
  emotion: string,
  note: string
) {
  const response = await fetch(`${BASE_URL}/api/moods`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({
      mood,
      emotion,
      note,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to save mood");
  }

  return data.mood;
}

export async function getMoods() {
  const response = await fetch(`${BASE_URL}/api/moods`, {
    method: "GET",
    headers: await authHeaders(),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to retrieve mood history");
  }

  return data.moods;
}

export async function getMoodInsights() {
  const response = await fetch(`${BASE_URL}/api/insights/mood`, {
    method: "GET",
    headers: await authHeaders(),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to generate mood insights");
  }

  return data;
}


export async function getMoodActivities() {
  const response = await fetch(`${BASE_URL}/api/insights/activities`, {
    method: "GET",
    headers: await authHeaders(),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to generate suggested activities");
  }

  return data;
}

export async function completeActivity(
  activity: string,
  duration: string
) {
  const response = await fetch(`${BASE_URL}/api/activities/complete`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({
      activity,
      duration,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to save activity");
  }

  return data;
}

export async function getActivityHistory() {
  const response = await fetch(`${BASE_URL}/api/activities/history`, {
    method: "GET",
    headers: await authHeaders(),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to load activity history");
  }

  return data.activities;
}

export async function createJournalEntry(
  title: string,
  content: string,
  mood: string
) {
  const response = await fetch(`${BASE_URL}/api/journal`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({
      title,
      content,
      mood,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to save journal entry");
  }

  return data.entry;
}

export async function getJournalEntries() {
  const response = await fetch(`${BASE_URL}/api/journal`, {
    method: "GET",
    headers: await authHeaders(),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to load journal entries");
  }

  return data.entries;
}

export async function deleteJournalEntry(id: string) {
  const response = await fetch(`${BASE_URL}/api/journal/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to delete journal entry");
  }

  return data;
}

export async function updateJournalEntry(
  id: string,
  title: string,
  content: string,
  mood: string
) {
  const response = await fetch(`${BASE_URL}/api/journal/${id}`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify({
      title,
      content,
      mood,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to update journal entry");
  }

  return data.entry;
}


export async function updateProfile(
  name: string,
  email: string
) {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify({
      name,
      email,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to update profile");
  }

  return data.user;
}



// --------------------------------
// DAILY MOOD ASSESSMENT
// --------------------------------

export interface DailyMoodAssessment {
  id: string;
  assessmentDate: string;
  answers: string[];
  mood: number;
  emotion: string;
  explanation: string;
  recommendation: string;
  createdAt: string;
  userId: string;
}

export interface TodayAssessmentResponse {
  success: boolean;
  completed: boolean;
  assessment: DailyMoodAssessment | null;
}

export interface SubmitAssessmentResponse {
  success: boolean;
  message: string;
  assessment: DailyMoodAssessment;
}

// GET TODAY'S ASSESSMENT STATUS

export async function getTodayMoodAssessment(): Promise<TodayAssessmentResponse> {
  const response = await fetch(
    `${BASE_URL}/api/moods/assessment/today`,
    {
      method: "GET",
      headers: await authHeaders(),
    }
  );

  const data: TodayAssessmentResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error("Unable to retrieve today's assessment");
  }

  return data;
}

// SUBMIT DAILY MOOD ASSESSMENT

export async function submitDailyMoodAssessment(
  answers: string[]
): Promise<SubmitAssessmentResponse> {
  const response = await fetch(
    `${BASE_URL}/api/moods/assessment`,
    {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ answers }),
    }
  );

  const data: SubmitAssessmentResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to submit mood assessment");
  }

  return data;
}


// --------------------------------
// FORGOT PASSWORD
// --------------------------------

export async function forgotPassword(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to process password reset request");
  }

  return data;
}


// --------------------------------
// RESET PASSWORD
// --------------------------------

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Password reset failed");
  }

  return data;
}