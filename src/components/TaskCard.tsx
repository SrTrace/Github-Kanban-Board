import { Card } from "react-bootstrap";
import { Issue } from "../types";
import { getDaysAgo } from "../utils/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskCardProps = {
  task: Issue;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const { id, html_url, title, number, created_at, user, comments } = task;
  const daysAgo = getDaysAgo(created_at);
  //     id,
  //   });

  // const style = transform
  //   ? {
  //       translate: `${transform.x}px ${transform.y}px`,
  //       zIndex: isDragging ? 1000 : undefined,
  //     }
  //   : undefined;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-2 shadow-sm text-start"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <Card.Title
        className="h5 fw-bold"
        style={{
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          display: "-webkit-box",
        }}
      >
        <a
          href={html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none text-dark"
        >
          {title}
        </a>
      </Card.Title>
      <Card.Text className="text-muted">
        #{number} opened {daysAgo} day{daysAgo <= 1 ? "" : "s"} ago
      </Card.Text>
      <Card.Text className="text-muted">
        {user.login} | comments: {comments}
      </Card.Text>
    </Card>
  );
};
export default TaskCard;
