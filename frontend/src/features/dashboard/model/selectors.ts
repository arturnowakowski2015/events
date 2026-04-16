import type { DashboardTask, FilterValue, GroupedTasks, TaskStatus } from "./types";

export function filterTasks(tasks: DashboardTask[], statusFilter: FilterValue): DashboardTask[] {
    if (statusFilter === "Wszystkie") {
        return tasks;
    }

    return tasks.filter((task) => task.status === statusFilter);
}

export function groupTasksByStatus(tasks: DashboardTask[], statuses: TaskStatus[]): GroupedTasks[] {
    return statuses.map((status) => ({
        status,
        tasks: tasks.filter((task) => task.status === status),
    }));
}

export function getActiveTask(tasks: DashboardTask[], activeTaskId: number): DashboardTask {
    return tasks.find((task) => task.id === activeTaskId) ?? tasks[0];
}
