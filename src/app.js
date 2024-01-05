import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";

const app = initializeApp({
    apiKey: "AIzaSyAMVzPxH2EuOtXPtoAKz8Bfqqg5KR38CTg",
    authDomain: "rice-memorial-baptist-church.firebaseapp.com",
    projectId: "rice-memorial-baptist-church",
    storageBucket: "rice-memorial-baptist-church.appspot.com",
    messagingSenderId: "62217025307",
    appId: "1:62217025307:web:9b0de2962b73c4b07a85be",
    measurementId: "G-ERX5K628LJ",
});

const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

burger.addEventListener("click", () => {
    document.querySelector("nav").classList.toggle("open");
});

document.querySelectorAll(".expandable_button").forEach((button) => {
    button.addEventListener("click", () => {
        const expandable_content = button.nextElementSibling;

        button.classList.toggle("expandable_button_active");

        if (button.classList.contains("expandable_button_active")) {
            expandable_content.style.maxHeight =
                expandable_content.scrollHeight + "px";
        } else {
            expandable_content.style.maxHeight = 0;
        }
    });
});

contact.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (firstName.value && lastName.value && email.value && message.value) {
        await addDoc(collection(firestore, "contactFormSubmissions"), {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phone: phone.value,
            address: address.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
            message: message.value,
        });

        firstName.value = "";
        lastName.value = "";
        email.value = "";
        phone.value = "";
        address.value = "";
        city.value = "";
        state.value = "";
        zip.value = "";
        message.value = "";

        submit.id = "submitDone";
        submitDone.innerHTML = "<img src='/icons/check.png' />";
        setTimeout(() => {
            submitDone.id = "submit";
            submit.innerHTML = "Submit";
        }, 2000);
    } else {
        inputError(firstName);
        inputError(lastName);
        inputError(email);
        inputError(message);
    }
});

onAuthStateChanged(auth, (user) => {
    if (user != null) {
        login.style.display = "none";
        hidden.style.display = "flex";
    } else {
        login.style.display = "flex";
        hidden.style.display = "none";
    }
});

// button on login view to switch to reset view
loginResetSwitch.addEventListener("click", () => {
    reset.style.display = "flex";
    login.style.display = "none";
    loginError.style.display = "none";
    loginEmail.classList.remove("inputError");
    loginPassword.classList.remove("inputError");
});

// button on reset view to switch to login view
resetSwitch.addEventListener("click", () => {
    reset.style.display = "none";
    login.style.display = "flex";
    resetError.style.display = "none";
    resetEmail.classList.remove("inputError");
});

function inputError(input) {
    if (!input.value) {
        input.classList.add("inputError");
        input.addEventListener("focus", () => {
            input.classList.remove("inputError");
        });
    }
}

// login using email and password form
login.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        await signInWithEmailAndPassword(
            auth,
            loginEmail.value,
            loginPassword.value
        );
    } catch (error) {
        if (
            error.message.includes("auth/invalid-email") ||
            error.message.includes("auth/user-not-found")
        ) {
            loginError.innerHTML = "Invalid Email";
            loginError.style.display = "block";
            inputError(loginEmail);
        } else if (
            error.message.includes("auth/wrong-password") ||
            error.message.includes("auth/internal-error")
        ) {
            loginError.innerHTML = "Invalid Password";
            loginError.style.display = "block";
            inputError(loginPassword);
        } else if (error.message.includes("auth/too-many-requests")) {
            loginError.innerHTML = "Too many requests, try again later";
            loginError.style.display = "block";
        } else {
            loginError.innerHTML = "Error";
            loginError.style.display = "block";
        }
    }
});

// send reset password email form
reset.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        await sendPasswordResetEmail(auth, resetEmail.value);
        reset.style.display = "none";
        sent.style.display = "flex";
    } catch {
        resetError.style.display = "block";
        inputError(resetEmail);
    }
});

sent.addEventListener("click", () => {
    sent.style.display = "none";
    login.style.display = "flex";
});

// logout
logout.addEventListener("click", async () => {
    await signOut(auth);
});
