import { Issue } from "../types";

export function findNewestIssue(issues: Issue[]): string {
  const issueWithLatestDate = [...issues].sort((a, b) => {
    const latestA =
      new Date(a.created_at) > new Date(a.updated_at)
        ? a.created_at
        : a.updated_at;
    const latestB =
      new Date(b.created_at) > new Date(b.updated_at)
        ? b.created_at
        : b.updated_at;

    return new Date(latestB).getTime() - new Date(latestA).getTime();
  })[0];

  return new Date(
    new Date(issueWithLatestDate.created_at) >
    new Date(issueWithLatestDate.updated_at)
      ? issueWithLatestDate.created_at
      : issueWithLatestDate.updated_at
  ).toISOString();
}
