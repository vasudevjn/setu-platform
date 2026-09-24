import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/index.css'
import { AppProvider } from './hooks/useApp'
import { ToastProvider } from './components/ui/Toast'
import { DataGate } from './components/DataGate'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AppProvider>
        <DataGate>
          <RouterProvider router={router} />
        </DataGate>
      </AppProvider>
    </ToastProvider>
  </StrictMode>,
)
