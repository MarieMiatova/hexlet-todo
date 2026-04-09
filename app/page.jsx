"use client";
import taskApi from "@/lib/store/api/taskApi";
import { Button, Card, Input, Toast, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState("");
  const router = useRouter();

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";

    return localStorage.getItem("token") || "";
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!token) {
      router.push("/auth");
      return;
    }

    const result = await taskApi.getTasks({ token });

    if (!result.success) {
      toast.danger("Failed to load tasks");
      return;
    }

    setTasks(result.data || []);
  }, [token, router]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setIsLoading(true);
      await fetchTasks();
      if (isMounted) setIsLoading(false);
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [fetchTasks]);

  const onCreateTask = useCallback(async () => {
    if (!value.trim()) return;

    setIsCreating(true);

    const result = await taskApi.createTask({
      token,
      value: value.trim(),
    });

    try {
      if (!result.success) {
        toast.danger(result?.message || "Failed to create task");
        return;
      }

      const task = result;
      setTasks((prev) => [task, ...prev]);
      setValue("");
    } finally {
      setIsCreating(false);
    }
  }, [token, value]);

  const onCompleteTask = useCallback(
    async (taskId) => {
      setCompletingTaskId(taskId);

      try {
        const result = await taskApi.completeTask({
          token,
          taskId,
        });

        if (!result.success) {
          toast.danger(result?.message || "Failed to complete task");
          return;
        }

        setTasks((prev) =>
          prev.map((task) => (task._id === result._id ? result : task)),
        );
      } catch {
        toast.danger("Failed to complete task");
      } finally {
        setCompletingTaskId("");
      }
    },
    [token],
  );

  const completedCount = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <main className="min-h-full w-full px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
        <Card className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-semibold">Task Tracker</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="task-status-badge task-status-pending">
              Pending: {pendingCount}
            </span>
            <span className="task-status-badge task-status-completed">
              Completed: {completedCount}
            </span>
            <span className="task-status-badge">Total: {tasks.length}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              size="lg"
              placeholder="Task title"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onCreateTask();
                }
              }}
            />
            <Button
              size="lg"
              className="sm:min-w-28"
              onClick={onCreateTask}
              isLoading={isCreating}
              isDisabled={isCreating}
            >
              Add task
            </Button>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex flex-col gap-2 max-h-[60vh] overflow-auto pr-1">
            {isLoading && (
              <p className="text-sm text-default-500">Loading tasks...</p>
            )}

            {!isLoading && tasks.length === 0 && (
              <p className="text-sm text-default-500">
                No tasks yet. Add your first one above.
              </p>
            )}

            {tasks.map((task) => (
              <div
                key={task._id}
                className="border border-default-200 bg-white/60 rounded-large p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium wrap-break-word">{task.value}</p>
                  <p
                    className={
                      task.status === "COMPLETED"
                        ? "text-xs text-success-600"
                        : "text-xs text-warning-600"
                    }
                  >
                    {task.status}
                  </p>
                </div>

                <Button
                  size="sm"
                  color={task.status === "COMPLETED" ? "success" : "primary"}
                  variant={task.status === "COMPLETED" ? "flat" : "solid"}
                  isDisabled={task.status === "COMPLETED"}
                  isLoading={completingTaskId === task._id}
                  onClick={() => onCompleteTask(task._id)}
                  className="w-full sm:w-auto"
                >
                  {task.status === "COMPLETED" ? "Completed" : "Complete"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Toast.Provider placement="top-center" />
    </main>
  );
}
