<template>
    <div>
    <h1>{{msg}}</h1>
    </div>
</template>
<script>
export default{
    data(){
        return{
            msg:'Dashboard'
        }
    },methods: {
        goHome() {
            console.log('Go Home');
            var url = "/";
            $(location).attr('href', url);
        }
    }
}
</script>

