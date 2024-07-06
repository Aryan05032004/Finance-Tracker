import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import './App.css'
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { FinancialRecordsProvider } from './contexts/financial-record-context';

function App() {
  const [count, setCount] = useState(0)

  return (
<Router>
  <div className="app-container">
    <Routes>
      <Route path="/" element={
        <FinancialRecordsProvider>
          <Dashboard/>
          </FinancialRecordsProvider>} />
      <Route path ="/auth" element = {<Auth/>} />

    </Routes>


  </div>
</Router>
  )
}

export default App
