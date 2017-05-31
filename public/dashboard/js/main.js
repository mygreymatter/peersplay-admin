import Vue from 'vue'
import VueCookie from 'vue-cookie';
import VueRouter from 'vue-router'
import $ from 'jquery'

Vue.use(VueCookie);
Vue.use(VueRouter)

import Navigation from './components/navigation.vue'
import MainContent from './components/main-content.vue'
import TitleComponent from './components/title-component.vue'

import Profile from './components/profile-component.vue'
import Vocabulary from './components/vocabulary-component.vue'
import Quiz from './components/quiz-component.vue'
import Help from './components/help-component.vue'


const paths = [
    '/dashboard/profile',
    '/dashboard/vocabulary',
    '/dashboard/quiz',
    '/dashboard/help'
];

const routes = [
    { path: paths[0], name: 'profile-view', component: Profile },
    { path: paths[1], name: 'vocabulary-view', component: Vocabulary },
    { path: paths[2], name: 'quiz-view', component: Quiz },
    { path: paths[3], name: 'help-view', component: Help },
];
const router = new VueRouter({ mode: 'history', routes });

let isSigningOut;

new Vue({
    el: "#app",
    data: {
        msg: 'Dashboard'
    },
    router,
    components: { TitleComponent, Navigation, MainContent, Profile, Vocabulary, Quiz, Help },
    created() {
        isSigningOut = false;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('User: ' + user.displayName);
                // if (!isSigningOut) {
                //     var url = "/dashboard";
                //     $(location).attr('href', url);
                // }
            } else {
                if (isSigningOut) {
                    window.cookie.set('remember_me', 0);
                    var url = "/";
                    $(location).attr('href', url);
                }
                console.log('User is not signed in.');
            }
        });
    },
    mounted() {
        console.log('Dashboard Mounted: ' + router.currentRoute.path);
        window.cookie = this.$cookie;
        console.log('Current Path: ' + router.currentRoute.path);

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