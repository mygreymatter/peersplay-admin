<template>
    <div>
        <div id="mySidenav" class="sidenav">
            <router-link to="/profile">Profile</router-link>
            <router-link to="/vocabulary">Vocabulary</router-link>
            <router-link to="/quiz">Quiz</router-link>
            <router-link to="/help">Help</router-link>
            <router-link to="/logout">Logout</router-link>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({ mode: 'history' });

export default {

    data(){
        return{
            title:"Navigation Race"
        }
    },router,
    methods:{
    }
}
</script>

<style>
/* Do not set the style to scoped. This style belongs to the side bar in the index.html of dashboard*/

/* The side navigation menu */

.sidenav {
    height: 100%;
    /* 100% Full-height */
    width: 270px;
    /* 0 width - change this with JavaScript */
    position: fixed;
    /* Stay in place */
    z-index: 1;
    /* Stay on top */
    top: 0;
    left: 0;
    background-color: #111;
    /* Black*/
    overflow-x: hidden;
    /* Disable horizontal scroll */
    padding-top: 30px;
    /* Place content 60px from the top */
    transition: 0.5s;
    /* 0.5 second transition effect to slide in the sidenav */
}


/* The navigation menu links */

.sidenav a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s
}

.sidenav a#logout:hover{
    cursor:pointer;
}

.sidenav a.router-link-active{
    color:#FFFFFF;
    font-size:40px;
}

/* When you mouse over the navigation links, change their color */

.sidenav a:hover,
.offcanvas a:focus {
    color: #f1f1f1;
}

/* Style page content - use this if you want to push the page content to the right when you open the side navigation */

#main {
    transition: margin-left .5s;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    margin-left: 250px;
}

/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */

@media screen and (max-height: 450px) {
    .sidenav {
        padding-top: 15px;
    }
    .sidenav a {
        font-size: 18px;
    }
}
</style>