import { Dashboard } from "../components/Dashboard";
import { useDashboardState } from "../features/dashboard/hooks/useDashboardState";
import "./FleetDashboardMockup.css";

export default function FleetDashboardMockup() {
    const {
        activeTask,
        activeTaskId,
        groupedTasks,
        isLoading,
        statusFilter,
        statuses,
        statusClass,
        copy,
        setActiveTaskId,
        setStatusFilter,
    } = useDashboardState();

    return (
        <Dashboard>
            <Dashboard.LeftNav />
            <div className="fdm-board-area">
                <Dashboard.Topbar
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    breadcrumbs={copy.topbarBreadcrumbs}
                    title={copy.topbarTitle}
                    statuses={statuses}
                />
                <Dashboard.Board
                    groupedTasks={groupedTasks}
                    activeTaskId={activeTaskId}
                    onTaskSelect={setActiveTaskId}
                    statusClass={statusClass}
                    isLoading={isLoading}
                />
            </div>

            <Dashboard.Details
                activeTask={activeTask}
                breadcrumbsPath={copy.detailsBreadcrumbs}
            />
        </Dashboard>
    );
}



