// Импорт компонентов
import ProjectManagersPage from '../pages/ProjectManagers/ProjectManagersPage';
import SalesPlanPage from '../pages/SalesPlan/SalesPlanPage';

const ROUTES = [
    {
        path: '/',
        element: <SalesPlanPage />
    },
    {
        path: 'project_managers',
        element: <ProjectManagersPage />
    }
];

export default ROUTES;
