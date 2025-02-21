// src/ChatForum.js
import React, { useState, useEffect } from "react";
import { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "./firebase";

const ChatForum = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [username, setUsername] = useState("");

    // Generate random username on component mount
    useEffect(() => {
        const adjectives = ["Happy", "Clever", "Brave", "Friendly", "Witty", "Curious", "Energetic", "Gentle"];
        const nouns = ["Penguin", "Tiger", "Eagle", "Dolphin", "Panda", "Fox", "Koala", "Wolf"];
        
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const randomNumber = Math.floor(Math.random() * 1000);
        
        const generatedUsername = `${randomAdjective}${randomNoun}${randomNumber}`;
        setUsername(generatedUsername);
        
        // Store username in localStorage to keep it consistent for this device
        localStorage.setItem("chatUsername", generatedUsername);
    }, []);

    // Fetch messages in real-time
    useEffect(() => {
        const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let messagesArray = [];
            querySnapshot.forEach((doc) => {
                messagesArray.push({ id: doc.id, ...doc.data() });
            });
            setMessages(messagesArray);
        });

        return () => unsubscribe();
    }, []);

    // Send message to Firestore
    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        try {
            await addDoc(collection(db, "chats"), {
                text: newMessage,
                sender: username,
                timestamp: serverTimestamp(),
                avatar: getAvatarColor(username), // Generate consistent avatar color based on username
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Generate consistent avatar color based on username
    const getAvatarColor = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 60%)`;
    };

    // Get initials for avatar
    const getInitials = (name) => {
        const parts = name.match(/[A-Z][a-z]+/g);
        if (parts && parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`;
        }
        return name.substring(0, 2);
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Community Chat</h1>
                <div style={styles.userInfo}>
                    <div 
                        style={{...styles.avatar, backgroundColor: getAvatarColor(username)}}
                    >
                        {getInitials(username)}
                    </div>
                    <span style={styles.username}>{username}</span>
                </div>
            </header>
            
            <div style={styles.chatContainer}>
                <div style={styles.onlineCount}>
                    <span style={styles.onlineDot}></span>
                    {Math.floor(Math.random() * 15) + 5} online
                </div>
                
                <div style={styles.chatBox}>
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            style={{
                                ...styles.messageContainer,
                                ...(msg.sender === username ? styles.ownMessage : {})
                            }}
                        >
                            <div 
                                style={{
                                    ...styles.messageAvatar,
                                    backgroundColor: msg.avatar || getAvatarColor(msg.sender)
                                }}
                            >
                                {getInitials(msg.sender)}
                            </div>
                            <div style={styles.messageContent}>
                                <div style={styles.messageSender}>{msg.sender}</div>
                                <div style={styles.messageText}>{msg.text}</div>
                                <div style={styles.messageTime}>
                                    {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <form onSubmit={sendMessage} style={styles.form}>
                    <input 
                        type="text" 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        placeholder="Type your message..." 
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Send</button>
                </form>
            </div>
            
            <div style={styles.communityInfo}>
                <h3 style={styles.infoTitle}>Community Guidelines</h3>
                <ul style={styles.guidelines}>
                    <li>Be respectful to other members</li>
                    <li>No spamming or inappropriate content</li>
                    <li>Stay on topic in discussions</li>
                </ul>
            </div>
        </div>
    );
};

// Enhanced styling
const styles = {
    container: { 
        maxWidth: "800px", 
        margin: "20px auto", 
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden"
    },
    header: {
        backgroundColor: "#4a76a8",
        color: "white",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        margin: 0,
        fontSize: "24px"
    },
    userInfo: {
        display: "flex",
        alignItems: "center"
    },
    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
        marginRight: "8px"
    },
    username: {
        fontWeight: "bold"
    },
    chatContainer: {
        padding: "0 20px 20px",
        backgroundColor: "#f5f7fa"
    },
    onlineCount: {
        padding: "10px 0",
        fontSize: "14px",
        color: "#666",
        display: "flex",
        alignItems: "center"
    },
    onlineDot: {
        width: "8px",
        height: "8px",
        backgroundColor: "#4CAF50",
        borderRadius: "50%",
        display: "inline-block",
        marginRight: "6px"
    },
    chatBox: { 
        height: "400px", 
        overflowY: "scroll", 
        padding: "15px", 
        marginBottom: "15px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e1e4e8"
    },
    messageContainer: {
        display: "flex",
        marginBottom: "15px",
        alignItems: "flex-start"
    },
    ownMessage: {
        flexDirection: "row-reverse",
    },
    messageAvatar: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
        margin: "0 10px"
    },
    messageContent: {
        maxWidth: "70%",
        backgroundColor: "#f0f2f5",
        borderRadius: "8px",
        padding: "10px 15px",
        position: "relative"
    },
    messageSender: {
        fontWeight: "bold",
        fontSize: "14px",
        marginBottom: "4px",
        color: "#4a76a8"
    },
    messageText: {
        wordBreak: "break-word"
    },
    messageTime: {
        fontSize: "12px",
        color: "#999",
        marginTop: "5px",
        textAlign: "right"
    },
    form: { 
        display: "flex", 
        gap: "10px" 
    },
    input: { 
        flex: 1, 
        padding: "12px 15px",
        borderRadius: "20px",
        border: "1px solid #ddd",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.3s"
    },
    button: { 
        padding: "10px 20px", 
        backgroundColor: "#4a76a8", 
        color: "#fff", 
        border: "none", 
        borderRadius: "20px", 
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background-color 0.3s"
    },
    communityInfo: {
        padding: "20px",
        backgroundColor: "white",
        borderTop: "1px solid #e1e4e8"
    },
    infoTitle: {
        margin: "0 0 10px 0",
        fontSize: "18px",
        color: "#333"
    },
    guidelines: {
        padding: "0 0 0 20px",
        margin: 0,
        color: "#555"
    }
};

export default ChatForum;