
async function translateText(text, sourceLang, targetLang) {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error("Erro na tradução:", error);
        return text;
    }
}

async function queryAI(data) {
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-3B", {
            method: "POST",
            headers: {
                Authorization: `Bearer  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`, 
                "Content-Type": "application/json",
                "x-wait-for-model": "true"
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error("Erro ao conectar com IA:", error);
        return null;
    }
}


function initChat() {
    const chatButton = document.createElement("button");
    chatButton.innerText = "💬 Chat com IA";
    Object.assign(chatButton.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#007bff",
        color: "#fff",
        padding: "10px 15px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px"
    });
    document.body.appendChild(chatButton);

    const chatBox = document.createElement("div");
    Object.assign(chatBox.style, {
        position: "fixed",
        bottom: "60px",
        right: "20px",
        width: "300px",
        height: "400px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        display: "none",
        flexDirection: "column",
        overflowY: "auto"
    });
    document.body.appendChild(chatBox);

    const messagesContainer = document.createElement("div");
    Object.assign(messagesContainer.style, {
        flex: "1",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        fontFamily: "Roboto, Arial, sans-serif"
    });
    chatBox.appendChild(messagesContainer);

    const inputContainer = document.createElement("div");
    Object.assign(inputContainer.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTop: "1px solid #ccc",
        padding: "5px",
        background: "#f9f9f9"
    });
    
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Digite sua pergunta...";
    Object.assign(input.style, {
        flex: "1",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "5px"
    });
    
    const sendButton = document.createElement("button");
    sendButton.innerText = "Enviar";
    Object.assign(sendButton.style, {
        marginLeft: "5px",
        padding: "5px 10px",
        border: "none",
        borderRadius: "5px",
        background: "#007bff",
        color: "#fff",
        cursor: "pointer"
    });
    
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    chatBox.appendChild(inputContainer);

    chatButton.addEventListener("click", () => {
        chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
        if (chatBox.style.display === "flex") {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            input.focus();
        }
    });

    sendButton.addEventListener("click", async () => {
        const userMessage = input.value.trim();
        if (!userMessage) return;
        input.value = "";
        input.disabled = true;
        const nameIA = "Rosa Coral IA: ";

        const userChat = document.createElement("p");
        userChat.innerText = userMessage;
        Object.assign(userChat.style, {
            alignSelf: "flex-end",
            background: "#007bff",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "10px"
        });
        messagesContainer.insertBefore(userChat, messagesContainer.firstChild);

        const botMessage = document.createElement("p");
        botMessage.innerText = nameIA + "Pensando...";
        Object.assign(botMessage.style, {
            alignSelf: "flex-start",
            background: "#f1f1f1",
            padding: "5px 10px",
            borderRadius: "10px"
        });
        messagesContainer.insertBefore(botMessage, messagesContainer.firstChild);

        try {
            const context = "Você é um assistente virtual especializado em ajudar clientes de uma loja de óculos de sol. Responda de forma amigável e profissional. Apenas fale sobre óculos de sol, site e atendimento, não responda perguntas fora desse contexto.";
            const translatedContext = await translateText(context, "pt", "en");
            const translatedUserMessage = await translateText(userMessage, "pt", "en");
            const finalMessage = `${translatedContext}\n\nQuestion: ${translatedUserMessage}`;
            
            const response = await queryAI({ inputs: finalMessage });
            
            if (response && response[0] && response[0].generated_text) {
                const translatedOutput = await translateText(response[0].generated_text, "en", "pt");
                botMessage.innerText = nameIA + translatedOutput;
            } else {
                botMessage.innerText = nameIA + "Desculpe, não consegui gerar uma resposta.";
            }
        } catch (error) {
            botMessage.innerText = nameIA + "Erro ao processar a solicitação.";
        } finally {
            input.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", initChat);
