import { useEffect, useMemo, useState } from "react";
import {
    DASHBOARD_COPY,
    DASHBOARD_SEED_TASKS,
    DASHBOARD_STATUSES,
    DASHBOARD_STATUS_CLASS,
} from "../model/constants";
import { filterTasks, getActiveTask, groupTasksByStatus } from "../model/selectors";
import type { FilterValue } from "../model/types";

export function useDashboardState() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTaskId, setActiveTaskId] = useState<number>(45);
    const [statusFilter, setStatusFilter] = useState<FilterValue>("Wszystkie");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1400);
        return () => clearTimeout(timer);
    }, []);

    const filteredTasks = useMemo(
        () => filterTasks(DASHBOARD_SEED_TASKS, statusFilter),
        [statusFilter],
    );

    const groupedTasks = useMemo(
        () => groupTasksByStatus(filteredTasks, DASHBOARD_STATUSES),
        [filteredTasks],
    );

    const activeTask = useMemo(
        () => getActiveTask(DASHBOARD_SEED_TASKS, activeTaskId),
        [activeTaskId],
    );

    return {
        activeTask,
        activeTaskId,
        groupedTasks,
        isLoading,
        statusFilter,
        statuses: DASHBOARD_STATUSES,
        statusClass: DASHBOARD_STATUS_CLASS,
        copy: DASHBOARD_COPY,
        setActiveTaskId,
        setStatusFilter,
    };
}
