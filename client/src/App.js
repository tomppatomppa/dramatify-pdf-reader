import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import useCurrentScripts from './hooks/useCurrentScripts'
import { useEffect } from 'react'
import { BASE_URI } from './config'

function App() {
  const { currentScripts, setCurrentScripts } = useCurrentScripts()
  console.log(BASE_URI)
  const loadScripts = () => {
    const scripts = localStorage.getItem('scripts')
    if (scripts) {
      setCurrentScripts(JSON.parse(scripts))
      //navigate('/home')
    }
  }

  useEffect(() => {
    loadScripts()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App ">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          element={
            <ProtectedRoute
              isAllowed={currentScripts.length}
              redirectPath="/"
            />
          }
        >
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

const ProtectedRoute = ({ isAllowed, redirectPath = '/', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />
}

export default App
