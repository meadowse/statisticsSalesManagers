import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ROUTES from './routes/Routes';

// Импорт стилей
import './App.css';

const router = createBrowserRouter(ROUTES);

function App() {
    return (
        <div className="app">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
