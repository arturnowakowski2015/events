import type { ReactNode } from "react";
import type { DashboardTask, FilterValue, GroupedTasks, TaskStatus } from "../features/dashboard/model/types";

export type { DashboardTask, FilterValue, GroupedTasks, TaskStatus } from "../features/dashboard/model/types";

type RootProps = {
    children: ReactNode;
};

type TopbarProps = {
    statusFilter: FilterValue;
    onStatusFilterChange: (value: FilterValue) => void;
    breadcrumbs: string;
    title: string;
    statuses?: TaskStatus[];
};

type BoardProps = {
    groupedTasks: GroupedTasks[];
    activeTaskId: number;
    onTaskSelect: (taskId: number) => void;
    statusClass: Record<TaskStatus, string>;
    isLoading?: boolean;
};

type ColumnProps = {
    status: TaskStatus;
    tasks: DashboardTask[];
    activeTaskId: number;
    onTaskSelect: (taskId: number) => void;
    statusClass: Record<TaskStatus, string>;
    isLoading?: boolean;
};

type TaskCardProps = {
    task: DashboardTask;
    isActive: boolean;
    onClick: () => void;
};

const SKELETON_COUNT = 3;

type DetailsProps = {
    activeTask: DashboardTask;
    breadcrumbsPath: string;
};

type LeftNavProps = {
    items?: Array<{ label: string; isActive?: boolean }>;
};

function DashboardRoot({ children }: RootProps) {
    return <section className="fdm-layout">{children}</section>;
}

function DashboardLeftNav({ items }: LeftNavProps) {
    const defaultItems = [
        { label: "Projekty", isActive: true },
        { label: "Zadania" },
        { label: "CRM" },
        { label: "Kalendarz" },
        { label: "Pracownicy" },
    ];

    const navItems = items || defaultItems;

    return (
        <aside className="fdm-left-nav">
            <div className="fdm-logo">ICP</div>
            <nav>
                {navItems.map((item, idx) => (
                    <button
                        key={idx}
                        className={item.isActive ? "fdm-menu-btn fdm-menu-btn--active" : "fdm-menu-btn"}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

function DashboardTopbar({
    statusFilter,
    onStatusFilterChange,
    breadcrumbs,
    title,
    statuses = [],
}: TopbarProps) {
    return (
        <header className="fdm-topbar">
            <div>
                <p className="fdm-breadcrumbs">{breadcrumbs}</p>
                <h1>{title}</h1>
                <input type="date" title="t" placeholder="mm" className="fdm-date-picker" />
            </div>
            <div className="fdm-tools">
                <input className="fdm-search" placeholder="Szukaj..." />
                <select
                    aria-label="Filtruj zadania po statusie"
                    title="Filtr statusu"
                    value={statusFilter}
                    onChange={(event) => onStatusFilterChange(event.target.value as FilterValue)}
                    className="fdm-select"
                >
                    <option>Wszystkie</option>
                    {statuses.map((status) => (
                        <option key={status}>{status}</option>
                    ))}
                </select>
            </div>
        </header>
    );
}

function DashboardTaskCard({ task, isActive, onClick }: TaskCardProps) {
    return (
        <article
            className={isActive ? "fdm-task fdm-task--active" : "fdm-task"}
            onClick={onClick}
        >
            <small>#{task.id}</small>
            <h3>{task.title}</h3>
            <p>{task.dueText}</p>
        </article>
    );
}

function DashboardTaskCardSkeleton() {
    return (
        <article className="fdm-task fdm-task--skeleton" aria-busy="true" aria-label="Ładowanie zadania...">
            <div className="fdm-skeleton-bar fdm-skeleton-bar--sm" />
            <div className="fdm-skeleton-bar fdm-skeleton-bar--md" />
            <div className="fdm-skeleton-bar fdm-skeleton-bar--lg" />
        </article>
    );
}

function DashboardColumn({
    status,
    tasks,
    activeTaskId,
    onTaskSelect,
    statusClass,
    isLoading = false,
}: ColumnProps) {
    return (
        <section className="fdm-column">
            <div className="fdm-column-head">
                <span className={statusClass[status]}>{status}</span>
                <span className="fdm-count">({isLoading ? "..." : tasks.length})</span>
            </div>

            <div className="fdm-card-stack">
                {isLoading
                    ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
                        <Dashboard.TaskCardSkeleton key={i} />
                    ))
                    : tasks.map((task) => (
                        <Dashboard.TaskCard
                            key={task.id}
                            task={task}
                            isActive={task.id === activeTaskId}
                            onClick={() => onTaskSelect(task.id)}
                        />
                    ))}

                {!isLoading && <button className="fdm-add-task">+ Nowe zadanie</button>}
            </div>
        </section>
    );
}

function DashboardBoard({
    groupedTasks,
    activeTaskId,
    onTaskSelect,
    statusClass,
    isLoading = false,
}: BoardProps) {
    return (
        <main className="fdm-board">
            {groupedTasks.map(({ status, tasks }) => (
                <Dashboard.Column
                    key={status}
                    status={status}
                    tasks={tasks}
                    activeTaskId={activeTaskId}
                    onTaskSelect={onTaskSelect}
                    statusClass={statusClass}
                    isLoading={isLoading}
                />
            ))}
        </main>
    );
}

function DashboardDetails({ activeTask, breadcrumbsPath }: DetailsProps) {
    return (
        <aside className="fdm-details">
            <p className="fdm-details-path">{breadcrumbsPath}</p>
            <h2>{activeTask.title}</h2>

            <div className="fdm-details-grid">
                <span>Status</span>
                <strong>Otwarte</strong>
                <span>Data startu</span>
                <strong>13.04.2026 7:00</strong>
                <span>Termin</span>
                <strong>14.04.2026 6:59</strong>
                <span>Priorytet</span>
                <strong>{activeTask.priority}</strong>
                <span>Ludzie</span>
                <strong>{activeTask.assignees}</strong>
            </div>
        </aside>
    );
}

export const Dashboard = Object.assign(DashboardRoot, {
    LeftNav: DashboardLeftNav,
    Topbar: DashboardTopbar,
    Board: DashboardBoard,
    Column: DashboardColumn,
    TaskCard: DashboardTaskCard,
    TaskCardSkeleton: DashboardTaskCardSkeleton,
    Details: DashboardDetails,
});
