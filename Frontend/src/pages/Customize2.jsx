import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { userDataContext } from '../contextApi/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io";





const Customize2 = () => {
  
  const {userData , backendImage , selectedImage , serverUrl , setUserData} = useContext(userDataContext)
  const navigate = useNavigate()
  const [AssistantName, setAssistantName] = useState(userData?.assistantName || '')

  const [loading, setLoading] = useState(false)

  const handleUpdateAssistant = async ()=>{
    setLoading(true)
    try{
      let formData = new FormData()
      formData.append("assistantName" , AssistantName)
      if(backendImage){
        formData.append("assistantImage" , backendImage)
      }else{
        formData.append("imageUrl", selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData,{withCredentials : true})
      
      console.log(result.data)
      setUserData(result.data)
      setLoading(false)
      navigate("/")
    }catch(error){

      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col relative">
      <IoMdArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/customize")} />
      <h1 className="text-white mb-[40px] text-[30px] text-center">Enter Your Assistant Name</h1>

      <input 
        type="text" 
        value={AssistantName} 
        onChange={(e) => setAssistantName(e.target.value)} 
        placeholder="Eg :- JARVISH"
        className="w-[600px] px-4 py-3 rounded-lg bg-white text-black text-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
      />

      {AssistantName && <button      
        className="
          min-w-[150px]
          h-[60px]
          mt-[30px]
          px-6
          text-black
          font-bold
          bg-white
          rounded-full
          text-2xl
          cursor-pointer
          shadow-lg
          transition-all
          duration-300
          hover:bg-gray-200
          hover:scale-105
          active:scale-95
          hover:shadow-2xl
        "
        disabled={loading}
        onClick={() => {
          setLoading(true)
          handleUpdateAssistant()

        }}
      >
        {!loading ? 'Create Your Assistant' : 'Creating...'}
      </button>}

      
        
    </div>
  )
}

export default Customize2
