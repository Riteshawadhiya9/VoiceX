import React, { useContext } from 'react';
import { userDataContext } from '../contextApi/UserContext';

const Card = ({ image }) => {

    const { selectedImage, setSelectedImage, setBackendImage, setFrontendImage } = useContext(userDataContext);

    return (
        <div
            className={`
                w-[80px] h-[150px] 
                lg:w-[200px] lg:h-[300px] 
                bg-[#030326] 
                border-2 border-blue-500 
                rounded-2xl 
                overflow-hidden 
                cursor-pointer 
                hover:shadow-blue-950 
                hover:border-4 hover:border-white
                ${selectedImage === image ? 'border-4 border-white' : ''}
            `}
            onClick={() => {
                setSelectedImage(image)
                setBackendImage(null)
                setFrontendImage(null)
            }}
        >
            <img
                src={image}
                alt="card"
                className='w-full h-full object-cover'
            />
        </div>
    );
};

export default Card;