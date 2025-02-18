import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RepoIssuesLoader } from "../../src/components/RepoIssuesLoader";
import { Provider } from "react-redux";
import repoReducer from "../../src/redux/slices/repoSlice";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom/vitest";
import { fetchRepoData } from "../../src/utils/client";

const mockFetchRepoData = fetchRepoData as jest.MockedFunction<
  typeof fetchRepoData
>;

vi.mock("../../src/utils/client", async () => {
  const actual = await vi.importActual("../../src/utils/client");
  return {
    ...actual,
    fetchRepoData: vi.fn(),
  };
});

const setupStore = () =>
  configureStore({
    reducer: {
      repo: repoReducer,
    },
  });

const renderWithStore = () => {
  const store = setupStore();
  return render(
    <Provider store={store}>
      <RepoIssuesLoader />
    </Provider>
  );
};

describe("RepoIssuesLoader", () => {
  it("should render a placeholder", () => {
    renderWithStore();

    const placeholderElement = screen.getByPlaceholderText(
      /https:\/\/github\.com\/\w+\/\w+/i
    );

    expect(placeholderElement).toBeInTheDocument();
  });

  it("should render the button with text Load", () => {
    renderWithStore();

    expect(screen.getByRole("button", { name: /Load/i })).toBeInTheDocument();
  });

  it("should not start loading if input is empty", async () => {
    renderWithStore();
    const button = screen.getByRole("button", { name: /Load/i });

    fireEvent.click(button);
    expect(fetchRepoData).not.toHaveBeenCalled();
  });

  it("should show loader and disable button when loading", async () => {
    renderWithStore();

    const button = screen.getByRole("button", { name: /load issues/i });
    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "https://github.com/facebook/react" },
    });

    fireEvent.click(button);

    await waitFor(() => {
      const spinner = screen.queryByTestId("loading-spinner");
      expect(spinner).toBeInTheDocument();

      expect(button).toBeDisabled();
    });
  });

  it("should remove loader and enable button after fetching", async () => {
    renderWithStore();
    mockFetchRepoData.mockResolvedValueOnce({
      repoName: "test/repo",
      stars: 10,
      issues: [],
    });

    const input = screen.getByPlaceholderText(/Enter repo URL/i);
    const button = screen.getByRole("button", { name: /Load/i });

    fireEvent.change(input, { target: { value: "test/repo" } });
    fireEvent.click(button);

    await waitFor(() => expect(button).not.toBeDisabled());
    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );
  });

  it("should show an error message if input is invalid", async () => {
    renderWithStore();
    mockFetchRepoData.mockRejectedValueOnce(new Error("Invalid repo URL"));

    const input = screen.getByPlaceholderText(/Enter repo URL/i);
    const button = screen.getByRole("button", { name: /Load/i });

    fireEvent.change(input, { target: { value: "invalid input" } });
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByTestId("error-message")).toBeInTheDocument()
    );
  });
});
