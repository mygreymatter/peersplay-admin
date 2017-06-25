<template>
    <div>

    <div class="container">
    
        <div class="row">

                <div class="col l1"></div>
                <div class="col l10">
                    <div class="card hoverable profile-card">
                        <div class="right-align">
                            <a class="waves-light waves-effect btn" @click="editProfile">{{modeLabel}}</a>
                        </div>
                        <div class="card-content">
                            
                            <div class="row profile">
                                <div class="col s3">
                                    <img src="images/yuna.jpg" alt="" class="circle responsive-img">
                                </div>
                                <div class="col s9 valign-wrapper">
                                    <div class="row">
                                        <div class="input-field col s12">
                                            <input type="text" class="input-field" placeholder="Your Name" tabindex="1" v-model="user.name">
                                            <label for="">Your Name</label>
                                            
                                        </div>
                                        <div class="input-field col s12">
                                            <input type="email" class="input-field" placeholder="Email Address" tabindex="2" v-model="user.emailaddress">
                                            <label for="">Email Address</label>
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col s12">
                                    <div class="row datepick">
                                        <div class="input-field col s3">
                                           <span class="name-label">Date of Birth:</span>
                                        </div>
                                        <div class="input-field col s9">
                                            <input type="date" required>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col s12 input-field">
                                            <p>
                                                <span class="name-label">Subscription:</span>
                                                <span class="name">Not subscribed</span>
                                                <span class="subscription-change">
                                                    <a class="waves-light">Change</a>
                                                </span>
                                            </p>                                        
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="row top-border">
                            <div class="col s6">
                                <p class="center-align">
                                    <span class="name-label">Quizes Played:</span>
                                    <span class="name">5</span>
                                </p>    
                            </div>
                            <div class="col s6">
                                <p class="center-align">
                                    <span class="name-label">Quizes Won:</span>
                                    <span class="name">5</span>
                                </p>
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

    export default{
        data(){
            return{
                isEditMode:false,
                modeLabel:'Edit',
                user:{
                    name:'',
                    emailaddress:''
                }
            }
        },methods:{
            editProfile(){
                this.isEditMode = !this.isEditMode;
                this.modeLabel = this.isEditMode ? "Save" : "Edit";

            },cancel(){
                this.isEditMode = false;
            },save(){
                this.isEditMode = false;
            }
        }
    }
</script>
<style scoped>
    .row{
        margin-bottom:0;
    }
    .profile{
        padding:10px;
    }

    .profile-card{
        padding:10px 10px 10px 10px;
    }

    .profile,.profile>.col.s9{
        height:170px;
    }

    .name-label{
        font-size:larger;
    }
    span.name{
        padding-top: 2px;
        padding-left: 10px;
        color:#FF5722;
    }
    .subscription-change{
        margin-left:10px;
    }
    .subscription-change:hover{
        cursor:pointer;
    }
    input[type=date]{
        width:100%;
        margin-bottom:0;
    }
    input[type=date]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        display: none;
    }
    .datepick>.input-field.col.s9{
        margin-top:0;
    }

</style>