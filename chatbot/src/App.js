APP.js:

import React, { useState, useEffect } from "react";
import { Button, Input, Layout, Upload, Menu } from "antd";
import { MessageOutlined, SendOutlined, UploadOutlined, CloseOutlined } from "@ant-design/icons";
import predefinedResponses from "./responses.json";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState(""); 
  const [uploadedFile, setUploadedFile] = useState(null); 

  // Fetch chat history and uploaded file from localStorage on mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const savedFile = JSON.parse(localStorage.getItem("uploadedFile"));

    setMessages(savedMessages);
    setUploadedFile(savedFile);
  }, []);

  // Store chat messages and uploaded file in localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
    if (uploadedFile) {
      localStorage.setItem("uploadedFile", JSON.stringify(uploadedFile));
    }
  }, [messages, uploadedFile]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { sender: "user", text: input };
      let botResponseText = "";

      // Finding the bot's response based on the user's input (question)
      for (const [response, question] of Object.entries(predefinedResponses)) {
        if (input.toLowerCase().trim() === question) {
          botResponseText = response;
          break;
        }
      }

      if (!botResponseText) {
        botResponseText = "I don't understand that.";
      }

      const botResponse = { sender: "bot", text: botResponseText };
      setMessages([...messages, userMessage, botResponse]);
      setInput(""); 
    }
  };

  const handleUpload = (file) => {
    setUploadedFile(file);

    // Automatically clear the uploaded file after 10 seconds (or desired time)
    setTimeout(() => {
      setUploadedFile(null);
    }, 10000);

    return false; 
  };

  const handleCloseFile = () => {
    setUploadedFile(null); 
  };

  const handleHistoryClick = (msg) => {
    setMessages([msg]);  // Display the clicked message in the main chat
  };

  return (
    <Layout style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Sidebar as chat history */}
      <Sider width={250} style={{ backgroundColor: "#333", color: "#fff", paddingTop: "20px" }}>
        <div style={{ padding: "20px", color: "#fff" }}>
          <h3>Chat History</h3>
          <div style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
            {messages.slice(0, 5).map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  backgroundColor: "#444",
                  color: "#fff",
                  marginBottom: "10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
                onClick={() => handleHistoryClick(msg)}
              >
                {msg.sender === "user" ? "You: " : "Bot: "}
                {msg.text.length > 50 ? msg.text.substring(0, 50) + "..." : msg.text}
              </div>
            ))}
          </div>
        </div>
      </Sider>

      {/* Main layout */}
      <Layout>
        {/* Header for Chatbot */}
        <Header style={{ backgroundColor: "#333", color: "white", textAlign: "center" }}>
          <h2>ChatBot</h2>
        </Header>

        {/* Main Content where messages appear */}
        <Content
          style={{
            padding: "20px",
            overflowY: "auto",
            height: "calc(100% - 120px)",
            paddingLeft: "10%",
            paddingRight: "10%",
            backgroundColor: "#333",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "block",
                textAlign: "left",
                marginBottom: "10px",
                backgroundColor: msg.sender === "user" ? "#555" : "transparent",
                color: "#fff",
                padding: "15px 20px",
                borderRadius: "5px",
                width: "100%",
                wordWrap: "break-word",
                fontSize: "14px",
              }}
            >
              {msg.text}
            </div>
          ))}
        </Content>

        {/* Display uploaded file details above the input box */}
        {uploadedFile && (
          <div
            style={{
              backgroundColor: "#444",
              color: "#fff",
              padding: "10px",
              textAlign: "center",
              marginBottom: "10px",
              borderRadius: "5px",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Uploaded files: {uploadedFile.name}</span>
            <CloseOutlined
              onClick={handleCloseFile}
              style={{
                fontSize: "18px",
                color: "#fff",
                cursor: "pointer",
              }}
            />
          </div>
        )}

        {/* Footer - Input field with Upload and Send icons */}
        <Footer
          style={{
            backgroundColor: "#333",
            padding: "15px 20px",
            textAlign: "center",
            borderTop: "1px solid #555",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Type a message"
              style={{
                width: "70%",
                height: "60px",
                backgroundColor: "#fff",
                borderColor: "#f5f5f5",
              }}
              suffix={
                <>
                  <Upload beforeUpload={handleUpload} showUploadList={true}>
                    <UploadOutlined
                      style={{
                        fontSize: "20px",
                        color: "#333",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </Upload>
                  <SendOutlined
                    onClick={handleSend}
                    style={{ fontSize: "20px", color: "#333", cursor: "pointer" }}
                  />
                </>
              }
            />
          </div>
        </Footer>
      </Layout>

      {/* Floating button to open the chatbot */}
      {!isChatVisible && (
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined />}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#333",
            color: "#fff",
            borderColor: "#333",
          }}
          onClick={() => setIsChatVisible(true)}
        />
      )}
    </Layout>
  );
};

export default App;


