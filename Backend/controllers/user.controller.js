import User from '../models/user.model.js';
import uploadOnCloudinary from '../config/cloudinary.js';
import geminiResponse from '../gemini.js';
import moment from 'moment';

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Internal Server Error" })
    }
}

export const updateAssistant = async(req,res)=>{
    try{
        const {assistantName , imageUrl} = req.body;
        let assistantImage;
        if(req.file){
            assistantImage = await uploadOnCloudinary(req.file.path);
        }else{
            assistantImage = imageUrl;  
        }

        const user = await User.findByIdAndUpdate(req.userId, { assistantName, assistantImage }, { new: true }).select("-password");
        res.status(200).json(user);
    }catch(error){
        console.log(error)
        res.status(400).json({ message: "Update Assistant Error" })
    }

}

export const askToAssistant = async (req,res)=>{
    try{
        const{command} = req.body;
        const user = await User.findById(req.userId);
        const assistantName = user.assistantName || "Assistant";
        const userName = user.name || "User";
        const assistantResponse = await geminiResponse(command, assistantName, userName);

        const jsonMatch = assistantResponse.match(/\{[\s\S]*\}/);

        if(!jsonMatch){
            return res.status(400).json({response: "Sorry, I couldn't understand the response from the assistant."})
        }

        const geminiResult = JSON.parse(jsonMatch[0]);
        const type = geminiResult.type;
       
        switch(type){
            case 'get_date' :
                return res.json({
                    type,
                    userInput : geminiResult.userInput,
                    response:`currrent date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get_time' :
                 return res.json({
                    type,
                    userInput : geminiResult.userInput,
                    response:`currrent time is ${moment().format("hh:mm A")}`
                });    
            case 'get_day' :
                 return res.json({
                    type,
                    userInput : geminiResult.userInput,
                    response:`currrent day is ${moment().format("dddd")}`
                });    
            case 'get_month' :
                 return res.json({
                    type,
                    userInput : geminiResult.userInput,
                    response:`currrent month is ${moment().format("MMMM")}`
                });                   
            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'general':
            case "calculator_open":
            case "github_open":
            case "instagram_open":
            case "facebook_open":
            case "weather_show":
                return res.json({
                    type,
                    userInput : geminiResult.userInput,
                    response:geminiResult.response
                })

            default :
                return res.status(400).json({response: "Sorry, I couldn't understand the response from the assistant."})    
        }    

    }catch(error){
          console.error("askToAssistant Error:", error.message);
          return res.status(500).json({response: "Ask Assistant Error", error: error.message })    
    }
}

// 4:26:26