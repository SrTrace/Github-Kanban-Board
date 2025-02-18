import { useRef, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCurrentRepo } from "../redux/slices/repoSlice";
import Breadcrumbs from "./Breadcrumbs";
import { formatIssue } from "../utils/formatIssue";
import { fetchRepoData } from "../utils/client";

export const RepoIssuesLoader = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [repoStars, setRepoStars] = useState<number | null>(null);

  const fetchRepoIssues = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const inputData = formData.get("repoUrl") as string;

      if (inputData.trim() === "") return;

      const { repoName, stars, issues } = await fetchRepoData(inputData);

      setRepoStars(stars);

      dispatch(
        setCurrentRepo({
          repoName,
          formatedIssues: issues.map(formatIssue),
        })
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <section id="repo-input-section" className="p-2 ">
      <Form className="d-flex" onSubmit={fetchRepoIssues}>
        <Form.Control
          ref={inputRef}
          type="text"
          name="repoUrl"
          placeholder="Enter repo URL (e.g., https://github.com/facebook/react or just facebook/react)"
          className="flex-grow-1"
        />
        <Button
          type="submit"
          variant="light"
          className="ms-2 border-1 border-dark"
          style={{ width: "25%" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner
              animation="border"
              size="sm"
              data-testid="loading-spinner"
            />
          ) : (
            "Load issues"
          )}
        </Button>
      </Form>
      {errorMessage ? (
        <section className="text-danger p-2" data-testid="error-message">
          {errorMessage}
        </section>
      ) : (
        <Breadcrumbs stars={repoStars} />
      )}
    </section>
  );
};
