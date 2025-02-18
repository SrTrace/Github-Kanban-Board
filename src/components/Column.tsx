import { useDroppable } from "@dnd-kit/core";
import { Issue } from "../types";
import TaskCard from "./TaskCard";
import { SortableContext } from "@dnd-kit/sortable";
import { Col } from "react-bootstrap";

type ColumnProps = {
  id: string;
  issues: Issue[];
};

export const Column = ({ id, issues }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Col xs={4} className="flex-grow-1">
      <SortableContext id={id} items={issues}>
        <div
          ref={setNodeRef}
          className="h-100 bg-secondary text-white rounded p-3 d-flex flex-column gap-2 "
        >
          {issues.map((issue) => (
            <TaskCard key={issue.id} task={issue} />
          ))}
        </div>
      </SortableContext>
    </Col>
  );
};
