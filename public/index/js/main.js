import Vue from 'vue';
import Login from './components/login.vue'

new Vue({
    el: "#app",
    data: {
        msg: 'Welcome To PeersPlay'
    },
    components: {
        Login
    }
})