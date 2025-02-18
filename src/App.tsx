import { Stack } from "react-bootstrap";
import { RepoIssuesLoader } from "./components/RepoIssuesLoader";
import { KanbanBoard } from "./components/KanbanBoard";

function App() {
  return (
    <Stack gap={3} className="p-4 min-vh-100 bg-light">
      <RepoIssuesLoader />
      <KanbanBoard />
    </Stack>
  );
}

export default App;
