let prompt=document.querySelector("#prompt")
let submit=document.querySelector("#submit")
let chatContainer=document.querySelector("#chat-container")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")


const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAdnrQa20Fk5ag1OWWH3esScfdTOGqveT8" //add your api key
let user={
    message:null,
    file:{
        mime_type:null,
        data:null
    }
}
async function generateResponse(aiChatBox) {
    let text=aiChatBox.querySelector("#ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({"contents":[{"parts":[{"text":"user.message"},(user.file.data?[{"inline_data":user.file}]:[])
    ]
    }]
    })
    }

    try{
    let response=await fetch(Api_Url,RequestOption)
    let data=await response.json()
    let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
    text.innerHTML=apiResponse
    }
    catch(error){
        console.log(error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src= `image-logo.svg`
        image.classList.remove("choose")
        user.file={}
    }
}

function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}//it will create shape chatbox of user and AI when we click enter

function handleChatResponse(userMessage){
    user.message=userMessage
    let html=`<img src="user-logo.webp" alt="You are here" id="user-logo" width="10%">
        <div id="user-chat-area">
        ${user.message}
       
        ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`:""}
        </div>`
        prompt.value=""//this line remove what we type in message box so we don't needd to refersh

        let userChatBox=createChatBox(html,"user-chat-box")
        chatContainer.appendChild(userChatBox)//message from user go inside chatbox shape by above function

        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

        setTimeout(()=>{
    let html=`<img src="ai-logo.webp" alt="Ai here" id="ai-logo" width="7.5%">
        <div id="ai-chat-area">
        <img src="loading-logo.webp" alt="top" class="loading-logo" width="40px">
        </div>`
        let aiChatBox=createChatBox(html,"ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        generateResponse(aiChatBox)
        },600)
}

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
    handleChatResponse(prompt.value)

    }
})

submit.addEventListener("click",()=>{
    handleChatResponse(prompt.value)
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data:base64string
        }
        image.src= `data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})