import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { middleApi } from './API/middleSlice/middleApi'
import { clearSelect } from './API/topSlice/topSlice'
import { userApi } from './API/userSlice/userApi'
import { Logout } from './API/userSlice/userSlice'
import './App.css'
import Login from './Components/Login'
import Logined from './Components/Logined'
import Regis from './Components/Regis'


function App() {
  const dispatch = useDispatch()
  const {auth, user} = useSelector(state => state.userSlice)
  const {selected} = useSelector(state => state.topSlice)

  const [refreshFunc, {error}] = userApi.useRefreshMutation()
  const [logoutFunc, otherOptions2] = userApi.useLazyLogoutQuery()
  const [onlineFunc, otherOptions3] = middleApi.useOnlineMutation()

  const [mood, setMood] = useState(0)
  const [change, setChange] = useState({first: false, second: false})
  const [searchMood, setSearchMood] = useState(5678)

  useEffect(() => {
    if(localStorage.getItem('refresh') && localStorage.getItem('access')){
      refreshFunc({userUnique: localStorage.getItem('lastUser')})
      if(localStorage.getItem('lastUser')){
        setSearchMood(6789)
      }
    }
  }, [])

  useEffect(() => {
    if(error){
        logoutFunc()
        setMood(0)
        setChange({first: false, second: false})
        setSearchMood(5678)
        dispatch(clearSelect())   
    }
  }, [error])

  let base = <>
      <Login mood={mood} setMood={setMood}/>
      <Regis mood={mood} setMood={setMood}/>

      <button onClick={(ev) => {
        ev.stopPropagation()
        setMood(23456)
      }}>Regis</button>

      <button onClick={(ev) => {
        ev.stopPropagation()
        setMood(12345)
        }}>Login</button>
        
    </>

    if(auth){
      base = <>
      <Logined mood={mood} setMood={setMood} change={change} setChange={setChange} searchMood={searchMood} setSearchMood={setSearchMood}/>
      </>
    }

  return (
    <div onClick={() => {
      setMood(0)
      setChange({first: false, second: false})
      }} className={mood?"main modal__on":'main'}>
    {base}
    </div>
  )
}

export default App
