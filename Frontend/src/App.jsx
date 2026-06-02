import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Customize from './pages/Customize'
import Home from './pages/Home'
import { userDataContext } from './contextApi/UserContext'
import { useContext } from 'react'
import Customize2 from './pages/Customize2'



const App = () => {
  const { serverUrl, userData, setUserData } = useContext(userDataContext)
  return (
    <Routes>
      <Route path='/' element={(userData?.assistantImage && userData?.assistantName)?<Home />:<Navigate to={"/customize"} />} />
      <Route path='/sign-in' element={userData?<Navigate to={"/"} />:<SignIn />} />
      <Route path='/sign-up' element={userData?<Navigate to={"/"} />:<SignUp />} />
      <Route path='/customize' element={userData?<Customize /> : <Navigate to={"/sign-up"} />} />
      <Route path='/customize2' element={userData?<Customize2 /> : <Navigate to={"/sign-up"} />} />
    </Routes>
  )
}

export default App

