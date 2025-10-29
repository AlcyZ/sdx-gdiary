import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => console.log("Service Worker registriert:", reg))
            .catch((err) => console.error("SW Registrierung fehlgeschlagen:", err));
    });
}

createApp(App).mount('#app')
