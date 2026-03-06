import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

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

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export async function checkSession(): Promise<User | null> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<User | null>("/auth/session", {
    headers: { Cookie: cookieHeader },
  });

  return data ?? null;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: cookieHeader },
  });

  return data;
}

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: { Cookie: cookieHeader },
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });

  return data;
}
