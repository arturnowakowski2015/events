import type { DashboardTask, TaskStatus } from "./types";

export const DASHBOARD_STATUSES: TaskStatus[] = ["Swiadczenia", "W trakcie", "Zamkniete"];

export const DASHBOARD_STATUS_CLASS: Record<TaskStatus, string> = {
    Swiadczenia: "fdm-chip fdm-chip--blue",
    "W trakcie": "fdm-chip fdm-chip--cyan",
    Zamkniete: "fdm-chip fdm-chip--green",
};

export const DASHBOARD_SEED_TASKS: DashboardTask[] = [
    {
        id: 45,
        title: "Pakiet szkoleniowy",
        dueText: "Jutro",
        priority: "Normalny",
        assignees: 1,
        status: "Swiadczenia",
    },
    {
        id: 52,
        title: "Umowa i podpisy",
        dueText: "Za 2 dni",
        priority: "Wysoki",
        assignees: 2,
        status: "Swiadczenia",
    },
    {
        id: 58,
        title: "Dostep do systemow",
        dueText: "Dzisiaj",
        priority: "Normalny",
        assignees: 3,
        status: "W trakcie",
    },
    {
        id: 61,
        title: "Weryfikacja dokumentow",
        dueText: "Za tydzien",
        priority: "Normalny",
        assignees: 1,
        status: "Zamkniete",
    },
];

export const DASHBOARD_COPY = {
    topbarBreadcrumbs: "IC Project / Wdrozenie nowego pracownika / Wybor swiadczen",
    topbarTitle: "Wdrozenie nowego pracownika",
    detailsBreadcrumbs: "Wdrozenie nowego pracownika / Swiadczenia dodatkowe",
} as const;
