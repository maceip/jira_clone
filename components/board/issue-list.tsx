import { useStrictModeDroppable } from "@/hooks/use-strictmode-droppable";
import { isNullish } from "@/utils/helpers";
import { type IssueType } from "@/utils/types";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./issue";
import clsx from "clsx";
import { statusMap } from "../issue/issue-select-status";
import { type IssueStatus } from "@prisma/client";

const IssueList: React.FC<{ status: IssueStatus; issues: IssueType[] }> = ({
  status,
  issues,
}) => {
  const [droppableEnabled] = useStrictModeDroppable();

  if (!droppableEnabled) {
    return null;
  }

  return (
    <div className={clsx("w-[300px] rounded-md bg-gray-100 px-1.5 pb-1.5")}>
      <h2 className="sticky top-0 -mx-1.5 -mt-1.5 h-max rounded-t-md bg-gray-100 px-2 py-3 text-xs text-gray-500">
        {statusMap[status]}{" "}
        {issues.filter((issue) => issue.status == status).length}
        {issues.filter((issue) => issue.status == status).length > 1
          ? " ISSUES"
          : " ISSUE"}
      </h2>
      <Droppable droppableId={status}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div {...droppableProps} ref={innerRef} className="h-full ">
            {issues
              .sort((a, b) => {
                if (
                  !isNullish(a.boardPosition) &&
                  !isNullish(b.boardPosition)
                ) {
                  return a.boardPosition - b.boardPosition;
                } else {
                  return a.sprintPosition - b.sprintPosition;
                }
              })
              .map((issue, index) => (
                <Issue key={issue.key} index={index} issue={issue} />
              ))}
            {placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export { IssueList };
