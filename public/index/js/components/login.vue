<template>
    <div>
        
        <div class="container" v-show="canShowViews">

            <div class="row">

                <div class="col l1"></div>
                <div class="col l10">
                    <div class="card hoverable">
                        <div class="car-action">
                            <div class="row auth-header">
                                <div class="col s6 center-align auth-button">
                                    <a class="waves-effect waves-light" :class={isActive:isLoginSelected} @click="showLogin">Login</a>
                                </div>
                                <div class="col s6 center-align auth-button">
                                    <a class="waves-effect waves-light":class={isActive:!isLoginSelected} @click="showSignup">Signup</a>
                                </div>
                            </div>
                        </div>
                        <div class="card-content">

                            <div class="row">
                                <form action="" class="col s12">
                                    
                                    <div class="row">
                                        <div class="input-field col s12">
                                            <i class="material-icons prefix">email</i>
                                            <input placeholder="Email address" id="emailaddress" name="emailaddress" type="email" class="validate" tabindex="1" v-model="user.username">
                                            <label for="emailaddress">Email address</label>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="input-field col s12">
                                            <i class="material-icons prefix">vpn_key</i>
                                            <input placeholder="Password" id="password" name="password" type="password" tabindex="2" v-model="user.password">
                                            <label for="password">Password</label>
                                        </div>
                                    </div>

                                    <div class="row" v-show="!isLoginSelected">
                                        <div class="input-field col s12">
                                            <i class="material-icons prefix">vpn_key</i>
                                            <input placeholder="Confirm Password" id="confirm-password" name="confirm-password" type="password" tabindex="3" v-model="user.confirmPassword">
                                            <label for="password">Confirm Password</label>
                                        </div>
                                    </div>

                                    <div class="row">

                                        <div class="col s6 center-align">
                                            <a class="waves-effect waves-light btn">Cancel</a>
                                        </div>

                                        <div class="col s6 center-align" v-show="isLoginSelected">
                                            <a class="waves-effect waves-light btn" @click="login">Login</a>
                                        </div>

                                        <div class="col s6 center-align" v-show="!isLoginSelected">
                                            <a class="waves-effect waves-light btn" @click="signup">Signup</a>
                                        </div>
                                    
                                    </div>

                                </form>

                            </div>

                        </div>
                    </div>
                </div>
                <div class="col l1"></div>

            </div>

        </div>
        

    </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios'
import VueRouter from 'vue-router'
import VueCookie from 'vue-cookie';

Vue.use(VueRouter);
Vue.use(VueCookie);

const router = new VueRouter({
    mode:'history'
  });

    export default{
        data(){
            return{
                title:'Login Component',
                isLoginSelected:true,
                isSigningUp: false,
                isLogging: false,
                user:{
                    username:'',
                    password:'',
                    confirmPassword:''
                },
                authToken:null,
                canShowViews:false
            }
        },router,
        created(){
            //isSigningUp = false;
            var rememberMe = this.$cookie.get('remember_me');
            console.log('Remember Me: ' + rememberMe);

            if(rememberMe === null || rememberMe === undefined)
                this.$cookie.set('remember_me',0);

            firebase.auth().onAuthStateChanged(user =>{
                if(user){
                    console.log('User: ' + user.displayName + " " + rememberMe);

                    if(!this.isLogging && !this.isSigningUp) {
                        if(rememberMe === '0'){
                            firebase.auth().signOut();
                        }else if(rememberMe === '1'){
                            var url = "/dashboard";
                            $(location).attr('href', url);
                        }
                    }else if(this.isSigningUp){
                        this.user.username = '';
                        this.user.password = '';
                        this.user.confirmPassword = '';
                        this.isLoginSelected = true;
                        this.isSigningUp = false;
                    }else if(this.isLogging){
                        var url = "/dashboard";
                        $(location).attr('href', url);
                        this.isLogging = false;
                    }
                }else{
                    console.log('User is not signed in.');
                    this.canShowViews = true;
                }
            });
        },
        mounted(){
            console.log('Cookie onMounted:' + this.$cookie.get('auth-token'));
        },
        methods:{
            showLogin(){
                this.isLoginSelected = true;
            },showSignup(){
                this.isLoginSelected = false;
            },signup(){
        
                if(this.user.password !== this.user.confirmPassword){
                    alert('The passwords must be same.')
                    return;
                }

                this.isSigningUp = true;
                firebase.auth().createUserWithEmailAndPassword(this.user.username,this.user.password)
                .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // [START_EXCLUDE]
                    if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                    } else {
                    alert(errorMessage);
                    }
                    console.log(error);
                    this.isSigningUp = false;
            });
        
            },login(){
                console.log('Login');

                this.isLogging = true;
                firebase.auth().signInWithEmailAndPassword(this.user.username,this.user.password)
                .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
                this.isLogging = false;
                });
            },rememberMe(){
                switch(this.$cookie.get('remember_me')){
                    case '1':
                            this.$cookie.set('remember_me','0');
                        break;
                    case '0':
                            this.$cookie.set('remember_me','1');
                        break;
                }
            }
        }
    }

</script>

<style>

.card-content .row,.row.auth-header{
    margin-bottom:0;
}

.card-content i.material-icons.prefix{
    margin-top:5px;
}

.auth-header{
    padding:10px;
}

.auth-button>a.waves-effect.waves-light{
    padding:5px;
    font-size:larger;
    width:100%;
    color: #AEAEAE;
}

.auth-button>a.waves-effect.waves-light:hover{
    color: #5E5E5E;
}
.auth-button>a.waves-effect.waves-light.isActive{
    border-bottom:1px solid #5E5E5E;
    color: #5E5E5E;
}

@media only screen and (min-width: 768px){
    .main-container{
        margin-top:4%;
        padding:2%;
    }   
}

</style>