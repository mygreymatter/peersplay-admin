<template>
    <div>
        <!-- profile container start -->
        <div class="container profile-container" v-show="!isEditMode">
            <div class="card">

                <div class="card-content">
                    <span class="edit-profile is-medium is-pulled-right" @click="editProfle">
                        Edit
                    </span>
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-96x96">
                            <img src="http://bulma.io/images/placeholders/128x128.png" alt="Image">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">Mahayogi Lakshmipathi</p>
                            <p class="subtitle is-6">mygreymatter@gmail.com</p>
                        </div>
                    </div>

                    <div class="content">
                        <p>
                            <span class="name-label">Date Of Birth:</span>
                            <span class="name">06-04-1985</span>
                        </p>
                        <p>
                            <span class="name-label">Subscription:</span>
                            <span class="name">Not subscribed</span>
                            <span class="subscription-change button is-small">Change</span>
                        </p>
                    </div>
                </div>

                <footer class="card-footer">
                    <p class="card-footer-item has-text-centered">
                        <span class="name-label">Quizes Played:</span>
                        <span class="name">5</span>
                    </p>
                    <p class="card-footer-item has-text-centered">
                        <span class="name-label">Quizes Won:</span>
                        <span class="name">5</span>
                    </p>
                </footer>

            </div>
        </div>
        <!-- profile container end -->

        <!-- profile Editor container start -->
        <div class="container profile-edit-container" v-show="isEditMode">
        
            <div class="card">

                <div class="card-content">

                    <div class="media">
                        <div class="media-left has-text-centered profile-image-change">
                            <figure class="image is-96x97">
                            <img src="http://bulma.io/images/placeholders/128x128.png" alt="Image">
                            </figure>
                            <span class="">change</span>
                        </div>

                        <div class="media-content profile-input-content">
                            <div class="field">
                                <p class="control profile-input">
                                    <input class="input"  type="text" placeholder="First Name">
                                </p>
                            </div>
                            
                            <div class="field">
                                <p class="control profile-input">
                                    <input class="input"  type="text" placeholder="Middle Name(optional)">
                                </p>
                            </div>

                            <div class="field">
                                <p class="control profile-input">
                                    <input class="input" type="text" placeholder="Last Name">
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="card-content">
                        <div class="field">
                            <p class="control">
                                <span class="name-label">Date Of Birth: </span>
                                <input class="input" type="date" name="bday">
                            </p>
                        </div>
                    </div>

                </div>

                <footer class="card-footer">
                    <span class="card-footer-item has-text-centered cancel" @click="cancel">Cancel</span>
                    <span class="card-footer-item has-text-centered save" @click="save">Save</span>
                </footer>

            </div>

        </div>
        <!-- profile Editor container end -->
        
    </div>
</template>
<script>

    export default{
        data(){
            return{
                isEditMode:false
            }
        },methods:{
            editProfle(){
                this.isEditMode = true;
            },cancel(){
                this.isEditMode = false;
            },save(){
                this.isEditMode = false;
            }
        }
    }
</script>
<style scoped>
    .profile-container,.profile-edit-container{
        width:60%;
    }
    .name-label{
        font-size:larger;
    }
    .edit-profile,.profile-image-change,.cancel,.save{
        cursor:pointer;
    }
    .cancel:hover,.save:hover{
        color:#AEAEAE;
    }
    .profile-image-change:hover{
        color:#AEAEAE;
    }
    .profile-image-change{
        background:cadetblue;
    }
    span.name{
        padding-top: 2px;
        padding-left: 10px;
    }
    .profile-input-content{
        margin-top:10px;
    }
</style>