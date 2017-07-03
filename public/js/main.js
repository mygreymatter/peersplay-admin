import Vue from 'vue'
import VueCookie from 'vue-cookie';
import VueRouter from 'vue-router'
import $ from 'jquery'

Vue.use(VueCookie);
Vue.use(VueRouter)

import Login from './components/login.vue'
import Navigation from './components/navigation.vue'
import MainContent from './components/main-content.vue'
import TitleComponent from './components/title-component.vue'
import Profile from './components/profile-component.vue'
import Vocabulary from './components/vocabulary-component.vue'
import Quiz from './components/quiz-component.vue'
import Help from './components/help-component.vue'


const paths = [
    '/home',
    '/profile',
    '/vocabulary',
    '/quiz',
    '/help'
];

const routes = [
    { path: paths[0], name: 'home-view', component: Login },
    { path: paths[1], name: 'profile-view', component: Profile },
    { path: paths[2], name: 'vocabulary-view', component: Vocabulary },
    { path: paths[3], name: 'quiz-view', component: Quiz },
    { path: paths[4], name: 'help-view', component: Help },
];
const router = new VueRouter({ mode: 'history', routes });

let isSigningOut;

new Vue({
    el: "#app",
    data: {
        msg: 'Welcome To PlanetMentor',
        isAuthenticating:true
    },
    router,
    components: { Login, TitleComponent, Navigation, MainContent, Profile, Vocabulary, Quiz, Help },
    created() {
        isSigningOut = false;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('User: ' + user.displayName);
                this.isAuthenticating = false;
                router.replace(paths[2]);
            } else {
                if (isSigningOut) {
                    window.cookie.set('remember_me', 0);
                    var url = "/";
                    $(location).attr('href', url);
                }
                console.log('User is not signed in.');
                this.isAuthenticating = true;
                router.replace(paths[0]);
            }
        });
    },
    mounted() {
        window.cookie = this.$cookie;
        console.log('Current Path: ' + router.currentRoute.path);
        console.log('Cookie: ' + window.cookie);

        let currentPath;
        switch (router.currentRoute.path) {
            case paths[0]:
                currentPath = paths[0];
                break;
            case paths[1]:
                currentPath = paths[1];
                break;
            case paths[2]:
                currentPath = paths[2];
                break;
            case paths[3]:
                currentPath = paths[3];
                break;
            case paths[4]:
                currentPath = paths[4];
                break;
            default:
                currentPath = paths[0];
                break;
        }
        console.log('New Path: ' + currentPath);
        router.replace(currentPath);
    },
    methods: {
        logout() {
            console.log('Logout');

            if (firebase.auth().currentUser) {
                isSigningOut = true;

                firebase.auth().signOut();
            }
        }
    }
})