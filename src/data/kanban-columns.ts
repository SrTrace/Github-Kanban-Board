import { Status } from "../types";

export const KANBAN_COLUMNS: { id: Status; title: string }[] = [
  { id: "toDo", title: "ToDo" },
  { id: "inProgress", title: "In Progress" },
  { id: "done", title: "Done" },
];
