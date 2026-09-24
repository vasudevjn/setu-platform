import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/index.css'
import { AppProvider } from './hooks/useApp'
import { ToastProvider } from './components/ui/Toast'
import { DataGate } from './components/DataGate'
import { router } from './router'
import { LangBoundary, LangProvider } from './lib/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <ToastProvider>
        <AppProvider>
          <DataGate>
            <LangBoundary>
              <RouterProvider router={router} />
            </LangBoundary>
          </DataGate>
        </AppProvider>
      </ToastProvider>
    </LangProvider>
  </StrictMode>,
)
