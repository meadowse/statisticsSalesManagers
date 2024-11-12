// Импорт компонентов
import App from '../App';
import ProjectManagersPage from '../pages/ProjectManagers/ProjectManagersPage';
import SalesPlanPage from '../pages/SalesPlan/SalesPlanPage';

const ROUTES = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'sales_plan',
                element: <SalesPlanPage />
            },
            {
                path: 'project_managers',
                element: <ProjectManagersPage />
            }
        ]
    }
];

export default ROUTES;
