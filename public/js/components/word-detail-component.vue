<template lang="html">
	<div>
		
		<div class="container word-input-container" id="detail-view">
			
            <button id="back" class="waves-effect waves-light btn left-align button" @click="goBack">
                <i class="material-icons left">keyboard_arrow_left</i>
                Back
            </button>

            <div class="card hoverable">
            	<div class="card-content">
            		<label for="">Title</label>
            		<p>{{word.title}}</p>

            	</div>
            </div>

            <!-- <div v-for="word in words" >
              <Meaning :word="word"></Meaning>
            </div> -->

        </div>
	</div>
</template>
<script>
	import {EventBus} from './event-bus.vue'

	export default{
		props:[
			'word'
		],data(){
			return{

			}
		},methods:{
			goBack(){
				EventBus.$emit('go-back',2);
			}
		}
	}
</script>

<style scoped>

button#back{
	padding: 0 15px 0 15px;
	margin-top: 10px;
	width:15%;
}

	
</style>