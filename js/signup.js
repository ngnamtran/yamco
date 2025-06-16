import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
// take element of page
const formSignup = document.getElementById("formSignup");
const userNameElement = document.getElementById("userName");
const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const rePasswordElement = document.getElementById("rePassword");
// error element
const rePasswordError = document.getElementById("rePasswordError");




//event submit form 
formSignup.addEventListener("submit",  async function(e){
    //prevent event reload page
    e.preventDefault();
    //check if the password and retype is correct
    if (passwordElement.value !== rePasswordElement.value){
        rePasswordError.innerHTML = "Passwords do not match";
        rePasswordError.style.display = "block";
    }else{
        rePasswordError.style.display = "none";
    }   
    
    //send data from form to local storage
    if(userNameElement.value &&
        emailElement.value &&
        passwordElement.value&&
        rePasswordElement.value&&
        passwordElement.value == rePasswordElement.value
    ){
           try {
            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, emailElement.value, passwordElement.value);
            const user = userCredential.user;

            // Store additional user data in Firestore
            const db = getFirestore(); // Ensure Firestore is initialized
            await setDoc(doc(db, "users", user.uid), {
                userId: user.uid,
                userName: userNameElement.value,
                email: emailElement.value,
                createdAt: new Date().toISOString()
            });

            // Redirect to login page
            window.location.href = "login.html";
        } catch (error) {
            // Handle Firebase errors
            rePasswordError.style.display = "block";
            switch (error.code) {
                case "auth/email-already-in-use":
                    rePasswordError.innerHTML = "Email is already registered.";
                    break;
                case "auth/invalid-email":
                    rePasswordError.innerHTML = "Invalid email format.";
                    break;
                case "auth/weak-password":
                    rePasswordError.innerHTML = "Password is too weak. Use at least 6 characters.";
                    break;
                default:
                    rePasswordError.innerHTML = `Error: ${error.message}`;
            }
            console.error("Signup error:", error);
     }
    } else {
        rePasswordError.innerHTML = "Please fill in all fields.";
        rePasswordError.style.display = "block";
    }
});

