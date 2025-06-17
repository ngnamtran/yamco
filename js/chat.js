import { auth, db } from './firebase-config.js';
import { getDatabase, ref, set, onValue, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { Encryption } from './encryption.js';

class Chat {
    constructor() {
        this.currentUser = null;
        this.selectedUser = null;
        this.encryptionKey = null;
        this.database = getDatabase();
        this.firestore = getFirestore();
        this.messageForm = document.getElementById('messageForm');
        this.messageInput = document.getElementById('messageInput');
        this.chatMessages = document.getElementById('chatMessages');
        this.userList = document.getElementById('userList');

        this.init();
    }

    async init() {
        // Check if user is logged in
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.setupEncryption();
                this.loadUsers();
                this.setupMessageListener();
            } else {
                window.location.href = 'login.html';
            }
        });

        // Setup message form submission
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
    }

    async setupEncryption() {
        // Generate or retrieve encryption key
        const keyData = localStorage.getItem('encryptionKey');
        if (keyData) {
            this.encryptionKey = await Encryption.importKey(
                new Uint8Array(JSON.parse(keyData))
            );
        } else {
            this.encryptionKey = await Encryption.generateKey();
            const exportedKey = await Encryption.exportKey(this.encryptionKey);
            localStorage.setItem('encryptionKey', JSON.stringify(Array.from(exportedKey)));
        }
    }

    async loadUsers() {
        const usersRef = collection(this.firestore, 'users');
        const q = query(usersRef, where('userId', '!=', this.currentUser.uid));
        
        try {
            const querySnapshot = await getDocs(q);
            this.userList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                const userElement = document.createElement('div');
                userElement.className = 'user-item';
                userElement.textContent = userData.userName;
                userElement.onclick = () => this.selectUser(userData);
                this.userList.appendChild(userElement);
            });
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    selectUser(user) {
        this.selectedUser = user;
        // Update UI to show selected user
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.remove('active');
            if (item.textContent === user.userName) {
                item.classList.add('active');
            }
        });
        // Clear and reload messages
        this.chatMessages.innerHTML = '';
        this.setupMessageListener();
    }

    setupMessageListener() {
        if (!this.selectedUser) return;

        const chatId = this.getChatId(this.currentUser.uid, this.selectedUser.userId);
        const messagesRef = ref(this.database, `chats/${chatId}/messages`);

        onValue(messagesRef, async (snapshot) => {
            this.chatMessages.innerHTML = '';
            const messages = snapshot.val() || {};

            for (const [key, message] of Object.entries(messages)) {
                const messageElement = document.createElement('div');
                messageElement.className = `message ${message.senderId === this.currentUser.uid ? 'sent' : 'received'}`;
                
                try {
                    const decryptedMessage = await Encryption.decryptMessage(message.text, this.encryptionKey);
                    messageElement.textContent = decryptedMessage;
                } catch (error) {
                    messageElement.textContent = 'Error decrypting message';
                }

                this.chatMessages.appendChild(messageElement);
            }
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        });
    }

    async sendMessage() {
        if (!this.selectedUser || !this.messageInput.value.trim()) return;

        const message = this.messageInput.value.trim();
        const chatId = this.getChatId(this.currentUser.uid, this.selectedUser.userId);
        
        try {
            const encryptedMessage = await Encryption.encryptMessage(message, this.encryptionKey);
            
            const messagesRef = ref(this.database, `chats/${chatId}/messages`);
            await push(messagesRef, {
                text: encryptedMessage,
                senderId: this.currentUser.uid,
                timestamp: serverTimestamp()
            });

            this.messageInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message. Please try again.');
        }
    }

    getChatId(uid1, uid2) {
        // Create a unique chat ID by sorting user IDs
        return [uid1, uid2].sort().join('_');
    }
}

// Initialize chat when the page loads
new Chat(); 