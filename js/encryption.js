// Encryption utility using Web Crypto API
export class Encryption {
    static async generateKey() {
        const key = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
        return key;
    }

    static async exportKey(key) {
        return await window.crypto.subtle.exportKey(
            "raw",
            key
        );
    }

    static async importKey(keyData) {
        return await window.crypto.subtle.importKey(
            "raw",
            keyData,
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
    }

    static async encryptMessage(message, key) {
        const encoder = new TextEncoder();
        const messageData = encoder.encode(message);
        
        // Generate a random IV
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        
        // Encrypt the message
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            messageData
        );

        // Combine IV and encrypted data
        const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength);
        encryptedArray.set(iv);
        encryptedArray.set(new Uint8Array(encryptedData), iv.length);

        // Convert to base64 for storage
        return btoa(String.fromCharCode.apply(null, encryptedArray));
    }

    static async decryptMessage(encryptedMessage, key) {
        // Convert from base64
        const encryptedArray = new Uint8Array(
            atob(encryptedMessage).split('').map(char => char.charCodeAt(0))
        );

        // Extract IV and encrypted data
        const iv = encryptedArray.slice(0, 12);
        const data = encryptedArray.slice(12);

        // Decrypt the message
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            data
        );

        // Convert back to string
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    }
} 