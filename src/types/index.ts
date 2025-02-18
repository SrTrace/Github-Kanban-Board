export type Status = "toDo" | "inProgress" | "done";

export type Column = {
  id: Status;
  title: string;
};

export type Issue = {
  id: number;
  comments: number;
  html_url: string;
  title: string;
  state: "open" | "closed";
  user: { login: string; type: string };
  number: number;
  created_at: string; // ISO 8601 date string
  updated_at: string;
  status?: Status;
  assignee: { login: string } | null;
};

export type BoardState = {
  toDo: Issue[];
  inProgress: Issue[];
  done: Issue[];
  latestIssue: string;
};

export type RepoState = {
  currentRepo: string;
  repos: Record<string, BoardState>;
};
