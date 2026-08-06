"use client";

import { useState } from "react";

export default function AIChatPage() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello 👋 Welcome to Supreme Labs AI. How can I help you today?"
    }
  ]);


  const sendMessage = async () => {

  if (!message.trim()) return;


  const userMessage = message;


  setMessages((prev)=>[
    ...prev,
    {
      role:"user",
      text:userMessage
    },
    {
      role:"ai",
      text:"Thinking..."
    }
  ]);


  setMessage("");


  try {

    const response = await fetch("/api/chat",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        message:userMessage
      })
    });


    const data = await response.json();


    setMessages((prev)=>{

      const updated = [...prev];

      updated[updated.length-1] = {
        role:"ai",
        text:data.reply || "No response"
      };

      return updated;

    });


  } catch(error){

    setMessages((prev)=>{

      const updated=[...prev];

      updated[updated.length-1]={
        role:"ai",
        text:"Sorry, AI connection failed."
      };

      return updated;

    });

  }

};


  return (

    <main className="min-h-screen bg-[#09090B] text-white flex">


      {/* Sidebar */}

      <aside className="
      hidden md:flex
      w-72
      border-r
      border-white/10
      flex-col
      p-5
      bg-black/20
      ">


        <div>

          <h1 className="
          text-2xl
          font-bold
          bg-gradient-to-r
          from-blue-400
          to-purple-500
          text-transparent
          bg-clip-text
          ">
            Supreme Labs
          </h1>


          <p className="
          text-sm
          text-gray-400
          mt-2
          ">
            AI Workspace
          </p>

        </div>



        <button className="
        mt-8
        rounded-xl
        bg-white/10
        hover:bg-white/20
        py-3
        transition
        ">

          + New Chat

        </button>



        <div className="
        mt-8
        text-sm
        text-gray-500
        ">

          Recent Chats

        </div>


        <div className="
        mt-4
        space-y-3
        ">

          <div className="
          p-3
          rounded-lg
          bg-white/5
          text-sm
          ">
            AI Assistant
          </div>


          <div className="
          p-3
          rounded-lg
          bg-white/5
          text-sm
          ">
            Code Helper
          </div>


        </div>



      </aside>




      {/* Main Chat Area */}

      <section className="
      flex-1
      flex
      flex-col
      ">



        {/* Header */}

        <header className="
        h-20
        border-b
        border-white/10
        flex
        items-center
        px-6
        ">


          <div>

            <h2 className="
            text-xl
            font-semibold
            ">
              AI Chat Assistant
            </h2>


            <p className="
            text-sm
            text-gray-400
            ">
              Supreme Labs Intelligent Workspace
            </p>

          </div>


        </header>



        {/* Messages Area */}

        <div className="
        flex-1
        overflow-y-auto
        p-6
        space-y-5
        ">


          {messages.map((msg,index)=>(

            <div
            key={index}
            className={`
            flex
            ${msg.role==="user"
            ?"justify-end"
            :"justify-start"}
            `}
            >


              <div className={`
              max-w-xl
              px-5
              py-3
              rounded-2xl

              ${
                msg.role==="user"
                ?
                "bg-blue-600"
                :
                "bg-white/10 border border-white/10"
              }

              `}>

                {msg.text}

              </div>


            </div>

          ))}



        </div>
        {/* Input Area */}

        <div className="
        border-t
        border-white/10
        p-5
        bg-black/20
        ">


          <div className="
          max-w-4xl
          mx-auto
          flex
          gap-3
          ">


            <input

            value={message}

            onChange={(e)=>setMessage(e.target.value)}

            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                sendMessage();
              }
            }}

            placeholder="Message Supreme Labs AI..."

            className="
            flex-1
            bg-white/5
            border
            border-white/10
            rounded-2xl
            px-5
            py-4
            outline-none
            focus:border-blue-500
            transition
            "

            />



            <button

            onClick={sendMessage}

            className="
            px-6
            rounded-2xl
            bg-blue-600
            hover:bg-blue-500
            transition
            font-medium
            "

            >

              Send

            </button>



          </div>



          <p className="
          text-center
          text-xs
          text-gray-500
          mt-3
          ">
            Supreme Labs AI can make mistakes. Check important information.
          </p>


        </div>



      </section>


    </main>

  );

}