import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { contactApi } from './api/contactApi'
import './index.css'
import App from './App'

const store = configureStore({
  reducer: { [contactApi.reducerPath]: contactApi.reducer },
  middleware: (gdm) => gdm().concat(contactApi.middleware),
})

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch