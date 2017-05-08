<template>
    <div>
        
        <div class="columns">
            <div class="column is-hidden-mobile"></div>
            <div class="column has-text-centered">
                <div class="card authentication-card">
                    <footer class="card-footer authentication-header">
                        <a class="card-footer-item">Login</a>
                        <a class="card-footer-item">Signup</a>
                    </footer>
                    <div class="content has-text-centered">
                        Hello Word
                    </div>
                </div>
            </div>
            <div class="column is-hidden-mobile"></div>
        </div>
        

    </div>
</template>

<script>

    export default{
        data(){
            return{
                title:'Login Component'
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

@media only screen and (min-width: 768px){
    .main-container{
        margin-top:4%;
        padding:2%;
    }   
}

</style>