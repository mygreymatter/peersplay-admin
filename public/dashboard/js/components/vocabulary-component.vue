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
            <button id="back" class="waves-effect waves-light btn left-align button" @click="showEditor">
                <i class="material-icons left">keyboard_arrow_left</i>
                Back
            </button>

            <div class="col s12 valign-wrapper">
                <div class="fixed-action-btn">
                    <a class="btn-floating btn-large waves-effect waves-light button" @click="addMeaning">
                        <i class="material-icons">add</i>
                    </a>
                </div>
            </div>

            <div class="card">
              <div class="card-content">
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
              </div>
            </div>

            <div v-for="word in words" >
              <Meaning :word="word"></Meaning>
            </div>

        </div>

        <!-- Editor - end -->

    </div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Meaning from './meaning-component.vue'

export default{
    data(){
        return{
            query:'',
            isLoading : false,
            names:[],
            canShowWords:true,
            isEditMode:true,
            wordPhrasal:'',
            isWordRequired:false,
            words:[
              {
                index:1,
                meaning:'',
                type:'noun',
                exampleOne:'',
                exampleTwo:''
              },
              {
                index:2,
                meaning:'',
                type:'pronoun',
                exampleOne:'',
                exampleTwo:''
              },
            ]
        }
    },components:{
        Meaning
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
        },addMeaning(){
            this.range += 1;
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
div#search-bar{
    margin-bottom:5px;
}
</style>
