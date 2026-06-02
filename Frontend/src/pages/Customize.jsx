import React from "react";
import Card from "../components/card";
import image1 from "../assets/login-robo.png";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RiImageAddLine } from "react-icons/ri";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { userDataContext } from "../contextApi/UserContext";
import { useNavigate } from "react-router-dom";
import customize2 from "./Customize2";
import { IoMdArrowRoundBack } from "react-icons/io";

const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();

  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col">
      <IoMdArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/customize")} />
      <h1 className="text-white mb-[40px] text-[30px] text-center">Select your Assistant Image</h1>

      <div className=" w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]">
        <Card image={image1} />

        <div
          className="w-[200px] h-[300px] bg-[#030326] border-2 border-[blue] rounded-2xl overflow-hidden hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center "
          onClick={() => {inputImage.current.click() }}
        >
          {!frontendImage && (
            <RiImageAddLine
              className="text-white
w-[25px] h-[25px]"
            />
          )}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {(frontendImage || backendImage || selectedImage) &&  <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-bold bg-white rounded-full text-2xl cursor-pointer" onClick={()=>navigate("/customize2")}> 
        Next
      </button>}
     
    </div>
  );
};

export default Customize;
