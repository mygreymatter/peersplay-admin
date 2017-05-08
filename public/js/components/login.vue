<template>
    <div>
        
        <div class="columns">
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
                                        <input type="text" class="input" placeholder="Enter username">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-user"></i>
                                        </span>
                                    </p>
                                </div>
                                
                                <div class="field">
                                    <label for="password" class="label">Password</label>
                                    <p class="control has-icons-left has-icons-right">
                                        <input type="password" class="input" placeholder="Enter password">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-key"></i>
                                        </span>
                                    </p>
                                </div>
                                
                                <nav class="level is-flex-touch">
                                    <p class="level-item has-text-centered">
                                        <button class="button is-primary">Login</button>
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
                                        <input type="text" class="input" placeholder="Enter username">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-user"></i>
                                        </span>
                                    </p>
                                </div>
                                
                                <div class="field">
                                    <label for="password" class="label">Password</label>
                                    <p class="control has-icons-left has-icons-right">
                                        <input type="password" class="input" placeholder="Enter password">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-key"></i>
                                        </span>
                                    </p>
                                </div>

                                <div class="field">
                                    <label for="confirmpassword" class="label">Confirm Password</label>
                                    <p class="control has-icons-left has-icons-right">
                                        <input type="password" class="input" placeholder="Reenter password">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-key"></i>
                                        </span>
                                    </p>
                                </div>
                                
                                <nav class="level is-flex-touch">
                                    <p class="level-item has-text-centered">
                                        <button class="button is-primary">Signup</button>
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

    export default{
        data(){
            return{
                title:'Login Component',
                isLoginSelected:true
            }
        },methods:{
            showLogin(){
                this.isLoginSelected = true;
            },showSignup(){
                this.isLoginSelected = false;
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