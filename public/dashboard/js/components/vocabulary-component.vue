<template>
    <div>
        
        <div class="container" v-show="!isEditMode">
            
                <div class="row">
                    <form class="col s12">
                        <div class="col s12 valign-wrapper">
                            <div class="fixed-action-btn">
                                <a class="btn-floating btn-large waves-effect waves-light red" @click="showEditor">
                                    <i class="material-icons">add</i>
                                </a>
                            </div>
                        </div>
                        <!-- Search bar View -->
                        <div id="search-bar" class="input-field col l12">
                            <i class="material-icons prefix">search</i>
                            <input id="search-input" class="input" type="text" placeholder="Type word" v-model="query">
                        </div>
                    </form>
                </div>

                <div class="row">
                    <!-- results - start -->
                    <div class="col l12">
                        <ul>
                            <li v-for="name in names">
                                
                                <div class="word-card card hoverable">
                                    <div class="card-content">
                                        <div class="search-result">
                                            <span class="word">{{name}}</span> 
                                            <span class="word-type">
                                                <i class="material-icons">add</i>
                                            </span>
                                            <p class="word-definition">
                                                A playing card with a single spot on it, ranked as the highest card in its suit in most card games.
                                            </p>
                                            <p>
                                                <span class="word-example-title">
                                                        Example:
                                                </span>
                                                <span class="word-example">
                                                    He picked up his cards, finding the ace of diamonds he tossed it on the pile.
                                                </span>  
                                                <span class="word-more-examples">
                                                    More examples...
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div><!-- words view - end -->
                        
                            </li>
                        </ul>
                    </div>
                    <!-- results - end -->
                </div>

                <div class="row">
                    <!--List of words - start -->
                    <div id="list-words-container" class="col s12">
                        <!-- container - start -->
                            <div class="words-container" v-show="canShowWords">
                                    <!-- words View -->
                                    <div class="word-card card hoverable" v-for="n in 5">
                                        <div class="card-content">
                                            <div>
                                                <span class="word">Ace</span> <span class="word-type">figurative</span>
                                                <p class="word-definition">
                                                    A playing card with a single spot on it, ranked as the highest card in its suit in most card games.
                                                </p>
                                                <p>
                                                <span class="word-example-title">
                                                        Example:
                                                    </span>
                                                    <span class="word-example">
                                                        He picked up his cards, finding the ace of diamonds he tossed it on the pile.
                                                    </span>  
                                                    <span class="word-more-examples">
                                                        More examples...
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div><!-- words view - end -->
                            </div><!-- container - end -->
                    </div>
                    <!--List of words - end -->
                </div>

        </div>

        <!-- Editor - start -->
        
        <div class="container word-input-container" id="Editor" v-show="isEditMode">
        
                <button id="save" class="waves-effect waves-light btn left-align red" type="submit" @click="showEditor">
                    <i class="material-icons left">keyboard_arrow_left</i>
                    Back
                </button>

            <form id="form" class="col s12" novalidate="novalidate" @submit.prevent="save">
                <div class="row">
                    <div class="input-field col s12">
                        <input id="word-phrase" class="validate editor-input" :class="{'error-input':isWordRequired}" type="text" v-model="wordPhrasal">                    
                        <label for="word-phrase">Word/Phrasal Verb</label>
                    </div>
                </div>

                <div class="row" :class="{'hide':!isWordRequired}">
                    <div class="col s12">
                        <span class="error">Word or phrasal verb is required.</span>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s12">
                        <input id="word-phrase-meaning" class="validate editor-input" :class="{'error-input':isMeaningRequired}" type="text" v-model="meaning">
                        <label for="word-phrase-meaning">Meaning</label>
                    </div>
                </div>

                <div class="row" :class="{'hide':!isMeaningRequired}">
                    <div class="col s12">
                        <span class="error">The meaning of the word is required.</span>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s12">
                        <h5 class="left-align">Examples</h5>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s12">
                        <input id="example-one" class="input example-input editor-input" :class="{'error-input':isExampleRequired}" type="text" v-model="exampleOne"/>
                        <label for="example-one">Example 1</label>
                    </div>
                </div>

                <div class="row" :class="{'hide':!isExampleRequired}">
                    <div class="col s12">
                        <span class="error">At least one example is required.</span>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s12">
                        <input id="example-two" class="input example-input editor-input" type="text" v-model="exampleTwo"/>
                        <label for="example-two" >Example 2</label>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s12 right-align">
                        <button id="save" class="waves-effect waves-light btn right-align" v-bind:class="{'is-loading':isSaving}" type="submit">Save</button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Editor - end -->
        
    </div>
</template>

<script>
import $ from 'jquery'

export default{
    data(){
        return{
            query:'',
            isLoading : false,
            isSaving:false,
            names:[],
            canShowWords:true,
            isEditMode:false,
            isWordRequired:false,
            isMeaningRequired:false,
            isExampleRequired:false,
            examples:[],
            range:1,
            wordPhrasal:'',
            meaning:'',
            exampleOne:'',
            exampleTwo:''
        }
    },created(){
        // Get a reference to the database service
    },mounted(){
        // Extension materialize.css

    },watch:{
        query:function(val){
            if(val.length >= 2){
                this.isLoading = true;
                console.log('Changed :' + val);
                this.names.push('rekha');
                this.names.push('Itihaas');
                this.canShowWords = false;

            }else{
                this.isLoading = false;
                this.names = [];
                this.canShowWords = true;
            }
                
        },wordPhrasal:function(word){
            this.isWordRequired = word.length === 0;
        }
    },methods:{
        showEditor(){
            this.isEditMode = !this.isEditMode;
            this.isSaving = false;
            console.log("Edit Mode: " + this.isEditMode);
        },addExample(){
            this.range += 1;
        },save(){
            this.isWordRequired = this.wordPhrasal === '';
            this.isMeaningRequired = this.meaning === '';
            this.isExampleRequired = this.exampleOne === '';

            if(!this.isWordRequired && !this.isMeaningRequired && !this.isExampleRequired){

                var instance = this;
                this.isSaving = true;
                
                this.wordPhrasal = this.wordPhrasal.toLowerCase();

                if(this.exampleTwo !== '')
                    this.exampleTwo = this.exampleTwo.toLowerCase();

                var item ={
                    'title':this.wordPhrasal,
                    'meaning':this.meaning.toLowerCase(),
                    'example-1':this.exampleOne.toLowerCase(),
                    'example-2':this.exampleTwo
                }

                var ref = firebase.database().ref('words/' + this.wordPhrasal);
                ref.once('value').then(function(snapshot){
                    if(snapshot.val() === null){
                        ref.set(item);
                        ref.once('value',function(snapshot){
                            console.log(snapshot.val());
                            if(snapshot.val().word === instance.wordPhrasal){
                                instance.isSaving = false;
                                instance.wordPhrasal = instance.meaning = instance.exampleOne = instance.exampleTwo = '';
                            }
                        });
                    }
                });
                
            }
                
            //console.log(this.wordPhrasal + ' ' + this.meaning);
        }
    }
}
</script>
<style scoped>

.row{
    margin-bottom:0;
}

#search-input{
    color: #CCC;
    font-size:26px;
    font-weight:lighter;
}

#search-input:focus{
  color:#000;
}
.search-result>.word-type{
    float:right;
}
/*
.search-result{
    border-bottom: 1px #AEAEAE solid;
    border-right: 1px #AEAEAE solid;
    border-left: 1px #AEAEAE solid;
    border-top: 1px #AEAEAE solid;
    padding: 5px;
    margin-bottom:5px;
    font-weight:lighter;
    font-size:18px;
}
*/

.card{
    margin-bottom:5px;
}

.box,.card-content{
    padding:1rem;
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

.word-type{
    font-weight:bold;
    color:#03A9F4;
    font-style:italic;
    font-size:18px;
    font-family: robotoThin;
}

.words-container{
    margin: 0 20px 0 10px;
    width:100%;
}

.word-card:hover{
    cursor: pointer;
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

p.control.back-control{
    margin-bottom:20px;
}
.word-input-container{width:70%;}

span.icon.plus.is-large{
    margin-right: 10px;
    font-weight: lighter;
    font-size: x-large;
    margin-left:82%;
}
span.icon.plus.is-large:hover{
    cursor:pointer;
}
.example-input{
    margin-bottom:10px;
}
.icon.is-large{
    height:1.5rem;
}
a#save{
    width:15%;
}
div#search-bar{
    margin-bottom:5px;
}

input.editor-input{
    margin-bottom:5px;
}

.error{
    font-size: 10px;
    color:red;
}
input.error{
    border-bottom: 1px solid red;
    box-shadow: 0 1px 0 0 red;
}

input.error-input{
    border-bottom: 1px solid red;
    box-shadow: 0 1px 0 0 red;
}
button#save{
    padding: 0 15px 0 15px;
}
</style>