import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardState, Issue, RepoState } from "../../types";
import { initialData } from "../../data/kanban-data";
import { findNewestIssue } from "../../utils/findNewesttIssue";

const loadStateFromLocalStorage = (): RepoState => {
  const savedState = localStorage.getItem("repoState");
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    currentRepo: "owner/repo", // Default repo
    repos: initialData,
  };
};

const saveStateToLocalStorage = (state: RepoState) => {
  localStorage.setItem("repoState", JSON.stringify(state));
};

const initialState: RepoState = loadStateFromLocalStorage();

const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    setCurrentRepo: (
      state,
      action: PayloadAction<{
        repoName: string;
        formatedIssues: Issue[];
      }>
    ) => {
      const { repoName, formatedIssues } = action.payload;

      if (!formatedIssues.length) return;

      if (state.repos[repoName]) {
        const latestIssueDate = state.repos[repoName].latestIssue;

        const filteredIssues = formatedIssues.filter((issue) => {
          const latestIssue =
            new Date(issue.created_at) > new Date(issue.updated_at)
              ? issue.created_at
              : issue.updated_at;

          return new Date(latestIssue).toISOString() > latestIssueDate;
        });

        filteredIssues.forEach((issue) => {
          if (issue.state === "open" && issue.assignee) {
            state.repos[repoName].inProgress.push(issue);
          } else if (issue.state === "open") {
            state.repos[repoName].toDo.push(issue);
          } else if (issue.state === "closed") {
            state.repos[repoName].done.push(issue);
          }
        });

        state.repos[repoName].latestIssue = findNewestIssue(formatedIssues);
      } else {
        const sortedIssues: {
          toDo: Issue[];
          inProgress: Issue[];
          done: Issue[];
        } = {
          toDo: [],
          inProgress: [],
          done: [],
        };

        formatedIssues.forEach((issue) => {
          switch (issue.state) {
            case "open":
              if (issue.assignee) {
                sortedIssues.inProgress.push(issue);
              } else {
                sortedIssues.toDo.push(issue);
              }
              break;
            case "closed":
              sortedIssues.done.push(issue);
              break;
          }
        });

        state.repos[repoName] = {
          toDo: sortedIssues.toDo,
          inProgress: sortedIssues.inProgress,
          done: sortedIssues.done,
          latestIssue: findNewestIssue(formatedIssues),
        };
      }

      state.currentRepo = repoName;

      saveStateToLocalStorage(state);
    },
    updateIssueOrder: (
      state,
      action: PayloadAction<{
        reoderedIssues: BoardState;
      }>
    ) => {
      state.repos[state.currentRepo] = { ...action.payload.reoderedIssues };
    },
  },
});

export const { setCurrentRepo, updateIssueOrder } = repoSlice.actions;
export default repoSlice.reducer;
