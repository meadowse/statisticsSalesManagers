import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// Импорт стилей
import './App.css';

// const router = createBrowserRouter(ROUTES);

function App() {
    const [showActions, setShowActions] = useState(false);
    const navigate = useNavigate(null);

    function onNavigationTo(path) {
        navigate(path);
        setShowActions(false);
    }

    return (
        <div className="app">
            <Outlet />
            <div className="app__actions">
                <button
                    className="app__btn-actions"
                    style={showActions ? { borderRadius: '0' } : null}
                    onClick={showActions ? () => setShowActions(false) : () => setShowActions(true)}
                >
                    {showActions ? <img src="./img/close.png" alt="#" /> : <img src="./img/menu.png" alt="#" />}
                </button>
                {showActions ? (
                    <ul className="app__list-actions">
                        <li className="app__list-actions-item" onClick={() => onNavigationTo('/sales_plan')}>
                            План продаж
                        </li>
                        <li className="app__list-actions-item" onClick={() => onNavigationTo('/project_managers')}>
                            Менеджеры проектов
                        </li>
                    </ul>
                ) : null}
            </div>
        </div>
    );
}

export default App;
