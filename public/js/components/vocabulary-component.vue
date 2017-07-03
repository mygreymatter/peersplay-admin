<template>
    <div>

        <div class="container" v-show="mode === 0">

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
                            <li v-for="(word,index) in wordsList">
                                <Word :word="word" :index="index"></Word>            
                            </li>
                        </ul>
                    </div>
                    <!-- results - end -->
                </div>
        </div>

        <!-- Editor - start -->

        <div class="container word-input-container" id="Editor" v-show="mode === 1">
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
                        <input id="word-phrase" class="validate editor-input" type="text" 
                        :class="{'error-input':isWordRequired}"
                        v-model="wordPhrasal">
                        <label for="word-phrase" :class="{'active' : (wordPhrasal !== '')}">Word/Phrasal Verb</label>
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

import {EventBus} from './event-bus.vue'
import Meaning from './meaning-component.vue'
import Word from './word-component.vue'

export default{
    data(){
        return{
            isLoading : false,
            isWordRequired:false,
            canShowWords:true,
            //0 - query; 1 - editing; 2 - detail
            mode:0,
            wordPhrasal:'',
            query:'',
            wordSelected:{},
            wordsList:[],
            words:[
              {
                id:'',
                title:this.wordPhrasal,
                index:1,
                meaning:'',
                type:'noun',
                exampleOne:'',
                exampleTwo:''
              }
            ]
        }
    },components:{
        Meaning,Word
    },created(){

        EventBus.$on('go-back',mode => {
            this.showEditor();
        });

        EventBus.$on('edit-word',index => {
            this.mode = 1;

            this.wordSelected = this.wordsList[index];

            this.wordSelected['index'] = index;
            this.words = [];
            this.words.push(this.wordSelected);
            this.wordPhrasal = this.wordSelected.title;
        });

        this.getUserWords();
        
    },mounted(){
        // Extension materialize.css

    },watch:{
        query:function(val){
            if(val.length >= 2){
                this.isLoading = true;
                this.queryFirebase(val);

            }else{
                this.isLoading = false;
                
                if(val.length == 0){
                    this.wordsList = [];
                    this.canShowWords = true;
                    this.getUserWords();
                }
            }

        },wordPhrasal:function(word){
            this.isWordRequired = word.length === 0;

            if(word.length > 0)
                EventBus.$emit('word-title',word);
        }
    },methods:{
        getUserWords(){
            var words = firebase.database().ref('words/');
            var instance = this;

            words.orderByKey()       
                .once('value')
                .then(function(snapshot){

                    if(snapshot.hasChildren()){
                        var o = snapshot.val();

                        instance.wordsList = [];
                        let index = 0;

                        Object.keys(o).forEach(function(key){
                            var w = snapshot.val()[key];
                            Object.keys(w).forEach(function(k){
                                w[k]['index'] = index++;
                                w[k]['id'] = k;
                                instance.wordsList.push(w[k]);    
                            })
                            
                        });

                    }
                    
                });

        },showEditor(){
            this.mode = (this.mode === 1 || this.mode === 2) ? 0 : 1;
            this.isSaving = false;
            console.log("Edit Mode: " + this.mode === 1);

        },addMeaning(){
            let word = {
                id:'',
                title:this.wordPhrasal,
                index: this.words.length + 1,
                meaning:'',
                type:'noun',
                exampleOne:'',
                exampleTwo:''
            };

            this.words.push(word);

        },queryFirebase(val){
            
            var words = firebase.database().ref('words/');
            var instance = this;

            words.orderByKey()       
                .once('value')
                .then(function(snapshot){

                    if(snapshot.hasChildren()){
                        var o = snapshot.val();
                        Object.keys(snapshot.val())
                              .forEach(function(key){

                                if(key.indexOf(val) === -1){
                                    delete o[key];
                                }

                              });

                        instance.wordsList = [];
                        let index = 0;

                        Object.keys(o).forEach(function(key){
                            var w = snapshot.val()[key];

                            Object.keys(w).forEach(function(k){
                                w[k]['index'] = index++;
                                w[k]['id'] = k;
                                instance.wordsList.push(w[k]);    
                            })
                            
                        });

                    }
                    
                });
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


.card{
    margin-bottom:5px;
}

.box,.card-content{
    padding:1rem;
}

.words-container{
    margin: 0 20px 0 10px;
    width:100%;
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
