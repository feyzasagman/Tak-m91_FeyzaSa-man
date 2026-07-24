"use client";

import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  applicationStatuses,
  type Application,
  type ApplicationStatus,
} from "../types";
import { applicationsByStatus } from "../utils/application-utils";
import { ApplicationColumn } from "./ApplicationColumn";

export function ApplicationKanban({
  applications,
  onMove,
  onOpen,
  onStatusChange,
  onAddNote,
  onDelete,
}: {
  applications: Application[];
  onMove: (id: string, status: ApplicationStatus, beforeId?: string) => void;
  onOpen: (application: Application) => void;
  onStatusChange: (application: Application, status: ApplicationStatus) => void;
  onAddNote: (application: Application) => void;
  onDelete: (application: Application) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    if (active.id === over.id) return;
    const targetStatus = over.data.current?.status as ApplicationStatus | undefined;
    if (!targetStatus || !applicationStatuses.includes(targetStatus)) return;
    const beforeId =
      over.data.current?.type === "application" ? String(over.id) : undefined;
    onMove(String(active.id), targetStatus, beforeId);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        <div className="flex min-w-max gap-4">
          {applicationStatuses.map((status) => (
            <ApplicationColumn
              key={status}
              status={status}
              applications={applicationsByStatus(applications, status)}
              onOpen={onOpen}
              onStatusChange={onStatusChange}
              onAddNote={onAddNote}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
