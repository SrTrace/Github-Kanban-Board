import { Issue, Status } from "../types";

export const formatIssue = (issue: unknown): Issue | null => {
  const safeIssue = issue as Issue;

  let issueStatus: Status = "toDo";
  const isInProgress = safeIssue.assignee && safeIssue.state === "open";
  const isDone = safeIssue.state === "closed";

  if (isInProgress) issueStatus = "inProgress";
  if (isDone) issueStatus = "done";

  return {
    id: safeIssue.id,
    comments: safeIssue.comments,
    html_url: safeIssue["html_url"],
    title: safeIssue.title,
    state: safeIssue.state,
    user: { login: safeIssue.user.login, type: safeIssue.user.type },
    number: safeIssue.number,
    created_at: safeIssue.created_at,
    updated_at: safeIssue.updated_at,
    status: issueStatus,
    assignee: safeIssue.assignee ? { login: safeIssue.assignee.login } : null,
  };
};
