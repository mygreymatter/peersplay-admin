<template>
    <div>
        <h1>{{title}}</h1>
        <router-view default="{name:'profile-view'}"></router-view>
    </div>
</template>

<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Profile from './profile-component.vue'
import Vocabulary from './vocabulary-component.vue'

const routes = [
    {path:'/dashboard/profile',name:'profile-view',component:Profile},
    {path:'/dashboard/vocabulary',name:'vocabulary-view',component:Vocabulary},
    
];
const router = new VueRouter({ mode: 'history',routes });

export default{
    data(){
        return{
            title:'Main Content'
        }
    },
    router,
    components:{Profile,Vocabulary},
    mounted(){
        console.log('MainContent Created');
        router.replace('/dashboard/profile');
        
    }
}
</script>