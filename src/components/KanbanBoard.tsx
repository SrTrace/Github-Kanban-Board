import { KANBAN_COLUMNS } from "../data/kanban-columns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { DndContext, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { updateIssueOrder } from "../redux/slices/repoSlice";
import { Column } from "./Column";
import { Col, Container, Row } from "react-bootstrap";
import { BoardState, Issue } from "../types";
import { arrayMove } from "@dnd-kit/sortable";

export const KanbanBoard = () => {
  const dispatch = useDispatch();
  const issues = useSelector(
    (state: RootState) => state.repo.repos[state.repo.currentRepo]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return;

    // Check if it's not in the same column (moved to diff column)
    if (
      active.data.current?.sortable.containerId !==
      over?.data.current?.sortable.containerId
    )
      return;

    const temp = structuredClone(issues);
    const containerName = active.data.current?.sortable
      .containerId as keyof Omit<typeof issues, "latestIssue">;

    if (!containerName || !Array.isArray(temp[containerName])) return;
    // Change the items position based on drag end target position
    const oldIdx = temp[containerName].findIndex(
      (issue) => issue.id === active.id
    );
    const newIdx = temp[containerName].findIndex(
      (issue) => issue.id === over?.id
    );

    if (oldIdx !== -1 && newIdx !== -1) {
      temp[containerName] = arrayMove(
        temp[containerName] as Issue[],
        oldIdx,
        newIdx
      );

      dispatch(updateIssueOrder({ reoderedIssues: temp }));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    // Check if item is drag to unknown area
    if (!over) return;

    // Get the initial and target sortable list name
    const initialContainer = active.data.current?.sortable
      ?.containerId as keyof Omit<BoardState, "latestIssue">;
    const targetContainer = over.data.current?.sortable
      ?.containerId as keyof Omit<BoardState, "latestIssue">;

    // if there are none initial sortable list name, then item is not sortable item
    if (!initialContainer) return;

    const temp = structuredClone(issues);
    const activeIssue = temp[initialContainer].find(
      (issue) => issue.id === active.id
    );

    if (!activeIssue) return;

    // If there are no target container then item is moved into a droppable zone
    // droppable = whole area of the sortable list (works when the sortable list is empty)
    if (!targetContainer) {
      const overId = over.id as keyof Omit<BoardState, "latestIssue">;

      // If item is already there then don't re-added it
      if ((issues[overId] as Issue[]).some((issue) => issue.id === active.id)) {
        return dispatch(updateIssueOrder({ reoderedIssues: temp }));
      }

      // Remove item from it's initial container
      temp[initialContainer] = temp[initialContainer].filter(
        (issue) => issue.id !== active.id
      );

      // Add item to it's target container which the droppable zone belongs to
      (temp[overId] as Issue[]).push(activeIssue);

      return dispatch(updateIssueOrder({ reoderedIssues: temp }));
    }

    // If the item is drag around in the same container then just reorder the list
    if (initialContainer === targetContainer) {
      const oldIdx = temp[initialContainer].findIndex(
        (issue) => issue.id === active.id
      );
      const newIdx = temp[initialContainer].findIndex(
        (issue) => issue.id === over.id
      );

      temp[initialContainer] = arrayMove(
        temp[initialContainer],
        oldIdx,
        newIdx
      );
    } else {
      // If the item is drag into another different container

      // Remove item from its initial container
      temp[initialContainer] = temp[initialContainer].filter(
        (issue) => issue.id !== active.id
      );

      // Add item to target container
      const newIdx = temp[targetContainer].findIndex(
        (issue) => issue.id === over.id
      );

      if (newIdx !== -1) {
        temp[targetContainer].splice(newIdx, 0, activeIssue);
      } else {
        temp[targetContainer].push(activeIssue);
      }
    }

    dispatch(updateIssueOrder({ reoderedIssues: temp }));
  };

  return (
    <Container
      fluid
      className="d-flex flex-column flex-grow-1"
      style={{ height: "100%" }}
    >
      <Row xs={6}>
        {KANBAN_COLUMNS.map((column) => (
          <Col key={column.id} xs={4} className="text-center fw-bold fs-4">
            {column.title}
          </Col>
        ))}
      </Row>

      <Row xs={4} className="flex-grow-1">
        <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          {KANBAN_COLUMNS.map((column) => (
            <Column key={column.id} id={column.id} issues={issues[column.id]} />
          ))}
        </DndContext>
      </Row>
    </Container>
  );
};
