<template>
	<div>
		<div class="word-card card hoverable">
	        <div class="card-content">
	            <div class="search-result">
	                
	                <span class="word">{{word.title}}</span>
	                <span class="word-type">{{word.type}}</span>
	                <span class="add-word" @click="editWord"><i class="material-icons">edit</i></span>

	                <p class="word-definition">{{word.meaning}}</p>

	                <p>
	                    <span class="word-example-title">Example:</span>
	                    <ul>
	                    	<li class="word-example">
	                    		{{word.exampleOne}}
	                    	</li>
	                    	<li class="word-example" v-show=" word.exampleTwo !== '' ">
	                    		{{word.exampleTwo}}
	                    	</li>
	                    </ul>
	                </p>
	            </div>
	        </div>
	    </div><!-- words view - end -->
	</div>
</template>
<script>

	import {EventBus} from './event-bus.vue';

	export default{
		props:[
            'word','index'
		],
		data(){
			return{

			}
		},methods:{
			editWord(){
				console.log('Edit Word: ' + this.word.title + " " + this.index);
				EventBus.$emit('edit-word',this.index);
		    }
		}
	}
</script>

<style scoped>
.word-card:hover{
    cursor: pointer;
}

.word{
    font-weight:lighter;
    font-size:36px;
    font-family: robotoLight;
}

.word-definition{
    font-size:16px;
    font-family: robotoLight;
}


.word-example-title{
    font-weight:lighter;
    color:#616161;
    font-family: robotoLight;
    line-height:40px;
}
.word-example{
    font-weight:lighter;
    color:#000000;
    font-family: robotoLight;
}
.word-more-examples{
    font-weight:300;
    font-style:italic;
    float:right;
    line-height:40px;
}
.word-more-examples:hover{
    cursor:pointer;
    color:#AEAEAE;
}

.search-result>.add-word{
    float:right;
}

.word-type{
    font-weight:bold;
    color:#03A9F4;
    font-style:italic;
    font-size:18px;
    font-family: robotoThin;
}

ul,ul li{ 
	list-style-type: disc;
	margin-left:10px;
}

	
</style>