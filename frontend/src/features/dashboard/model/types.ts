export type TaskStatus = "Swiadczenia" | "W trakcie" | "Zamkniete";

export type TaskPriority = "Normalny" | "Wysoki";

export type DashboardTask = {
    id: number;
    title: string;
    dueText: string;
    priority: TaskPriority;
    assignees: number;
    status: TaskStatus;
};

export type FilterValue = "Wszystkie" | TaskStatus;

export type GroupedTasks = {
    status: TaskStatus;
    tasks: DashboardTask[];
};
