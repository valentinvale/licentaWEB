import axios from "axios";
import { Client } from "@stomp/stompjs";

const API_URL = "http://localhost:8080/api/v1/chat";

class WebsocketService {
    constructor() {
        this.client = null;
    }

    connect(username, onMessageReceived, onConnected, onError) {
        this.client = new Client({
            brokerURL: "ws://localhost:8080/ws", 
            connectHeaders: {},
            debug: function (str) {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: frame => {
                this.client.subscribe(`/user/${username}/queue/messages`, message => {
                    onMessageReceived(JSON.parse(message.body));
                });
                onConnected(frame);
            },
            onStompError: onError,
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client !== null) {
            this.client.deactivate();
        }
    }

    async sendMessage(senderId, receiverId, content) {
        if (this.client && this.client.active) {
            this.client.publish({
                destination: "/app/chat",
                body: JSON.stringify({ senderId, receiverId, content })
            });
        }
    }

    async getMessages(senderId, receiverId, token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        return await axios.get(`${API_URL}/messages/${senderId}/${receiverId}`, config);
    }

    async getConversations(userId, token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        return await axios.get(`${API_URL}/conversations/${userId}`, config);
    }
}

export default new WebsocketService();
