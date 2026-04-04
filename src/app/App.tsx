import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { ExpenseProvider } from './store/ExpenseContext';

function App() {
  return (
    <ExpenseProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </ExpenseProvider>
  );
}

export default App;
