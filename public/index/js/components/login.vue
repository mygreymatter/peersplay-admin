<template>
    <div>
        
        <div class="columns"  v-show="canShowViews">
            <div class="column is-hidden-mobile"></div>
            <div class="column">
                <div class="card authentication-card">
                    
                    <footer class="card-footer authentication-header  has-text-centered">
                        <a class="card-footer-item" :class={isActive:isLoginSelected} @click="showLogin">Login</a>
                        <a class="card-footer-item" :class={isActive:!isLoginSelected} @click="showSignup">Signup</a>
                    </footer>

                    <div class="content authentication-content">
                    
                        <!-- Login Content - start -->
                        <div class="columns" id="login-content" v-show="isLoginSelected">
                            <div class="column">
                                
                                <div class="field">
                                    <label for="username" class="label">Username</label>
                                    <p class="control has-icons-left has-icons-right">
                                        <input type="email" name="username" id="emailaddress" tabindex="1" class="input" placeholder="Enter username"  v-model="user.username">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-user"></i>
                                        </span>
                                    </p>
                                </div>
                                
                                <div class="field">
                                    <label for="password" class="label">Password</label>
                                    <p class="control has-icons-left has-icons-right">
                                        <input type="password"  name="password" id="password" tabindex="2" class="input" placeholder="Enter password" v-model="user.password">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-key"></i>
                                        </span>
                                    </p>
                                </div>
                                
                                <nav class="level is-flex-touch">
                                    <p class="level-item has-text-centered">
                                        <button class="button is-primary" @click="login">Login</button>
                                    </p>
                                    <p class="level-item has-text-centered">
                                        <button class="button is-primary">Cancel</button>
                                    </p>
                                </nav>

                            </div>
                        </div>
                        <!-- Login Content - end -->


                        <!-- Signup Content - start -->
                        <div class="columns" id="signup-content" v-show="!isLoginSelected">
                            <div class="column">
                                
                                <div class="field">
                                    <label for="username" class="label">Username</label>
                                    <p class="control has-icons-left has-icons-right">
                                        <input type="email" name="username" id="emailaddress" tabindex="1" class="input" placeholder="Enter username"  v-model="user.username">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-user"></i>
                                        </span>
                                    </p>
                                </div>
                                
                                <div class="field">
                                    <label for="password" class="label">Password</label>
                                    <p class="control has-icons-left has-icons-right">
                                        <input type="password" name="password" id="password" tabindex="2" class="input" placeholder="Enter password"  v-model="user.password">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-key"></i>
                                        </span>
                                    </p>
                                </div>

                                <div class="field">
                                    <label for="confirmpassword" class="label">Confirm Password</label>
                                    <p class="control has-icons-left has-icons-right">
                                        <input type="password" name="password" id="password" tabindex="3" class="input" placeholder="Reenter password"  v-model="user.confirmPassword">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-key"></i>
                                        </span>
                                    </p>
                                </div>
                                
                                <nav class="level is-flex-touch">
                                    <p class="level-item has-text-centered">
                                        <button class="button is-primary" @click="signup">Signup</button>
                                    </p>
                                    <p class="level-item has-text-centered">
                                        <button class="button is-primary">Cancel</button>
                                    </p>
                                </nav>

                            </div>
                        </div>
                        <!-- Signup Content - end -->

                    </div>
                    <!-- content - end -->
                </div>
                <!-- card - end -->
            </div>
            <div class="column is-hidden-mobile"></div>
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

.main-container{
    margin-top:4%;
    padding:5%;
}

.authentication-header a{
    color:#AEAEAE;
}

.authentication-header a:hover{
    color:#000000;
}

footer.card-footer.authentication-header{
    border-bottom:1px solid #dbdbdb;
    border-top:0px;
}

.authentication-content{
    padding:10px;
    padding-bottom:0;
}

p.control.has-icons-left,
p.level-item.has-text-centered,
div#login-content,
div#signup-content{
    margin-bottom:0;
}

.authentication-content button.button.is-primary{
    width:120px;
}
.authentication-content nav{
    padding-left:10%;
    padding-right:10%;
}

a.card-footer-item.isActive{
    color:#333;
}

@media only screen and (min-width: 768px){
    .main-container{
        margin-top:4%;
        padding:2%;
    }   
}

</style>