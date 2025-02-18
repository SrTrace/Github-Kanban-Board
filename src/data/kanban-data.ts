import { BoardState } from "../types";

export const initialData: Record<string, BoardState> = {
  "owner/repo": {
    toDo: [
      {
        id: 101,
        comments: 5,
        html_url: "https://github.com/owner/repo/issues/101",
        title: "Fix bug #12367",
        state: "open",
        user: { login: "user1", type: "User" },
        number: 101,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "toDo",
        assignee: null, // No assignee
      },
      {
        id: 111,
        comments: 5,
        html_url: "https://github.com/owner/repo/issues/111",
        title: "Fix bug #1233434",
        state: "open",
        user: { login: "user2", type: "User" },
        number: 111,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "toDo",
        assignee: { login: "devUser1" },
      },
      {
        id: 112,
        comments: 5,
        html_url: "https://github.com/owner/repo/issues/112",
        title: "Fix bug #12319",
        state: "open",
        user: { login: "user3", type: "User" },
        number: 112,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "toDo",
        assignee: null,
      },
    ],
    inProgress: [
      {
        id: 102,
        comments: 2,
        html_url: "https://github.com/owner/repo/issues/102",
        title: "Implement feature X",
        state: "open",
        user: { login: "user4", type: "User" },
        number: 102,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "inProgress",
        assignee: { login: "devUser2" }, // Added assignee
      },
    ],
    done: [
      {
        id: 103,
        comments: 10,
        html_url: "https://github.com/owner/repo/issues/103",
        title: "Closed issue #99",
        state: "closed", // Fixed state (should be "closed" instead of "close")
        user: { login: "user5", type: "User" },
        number: 103,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "done",
        assignee: { login: "devUser3" },
      },
    ],
    latestIssue: new Date().toISOString(),
  },
};
