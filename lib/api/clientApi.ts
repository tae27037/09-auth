import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

type AuthPayload = {
  email: string;
  password: string;
};

type UpdateUserPayload = {
  username: string;
};

type FetchNotesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
};

type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export async function register(payload: AuthPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: AuthPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | null>("/auth/session");
  return data ?? null;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
