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
                        <div class="center-align" v-show="wordsList.length === 0 && isLoading">
                            <div class="preloader-wrapper big active">
                              <div class="spinner-layer spinner-blue-only">
                                <div class="circle-clipper left">
                                  <div class="circle"></div>
                                </div>
                                <div class="gap-patch">
                                  <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                  <div class="circle"></div>
                                </div>
                              </div>
                            </div>
                        </div>

                        <ul>
                            <li v-for="(word,index) in wordsList">
                                <Word :word="word" :index="index"></Word>            
                            </li>
                        </ul>

                        <h3 class="center-align" v-show="wordsList.length === 0 && !isLoading">Your words list is empty!</h3>
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
            userWords:{},
            wordId:'',
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
        //do not display empty list message initially
        this.isLoading = true;

        EventBus.$on('go-back',mode => {
            this.showEditor();
        });

        EventBus.$on('add-word',index => {
            this.wordSelected = this.wordsList[index];
            
            var currentUser = firebase.auth().currentUser;
            var ref = firebase.database().ref("users/" + currentUser.uid);
            var instance = this;
            
            ref
            .once('value')
            .then(snapshot => {

                if(snapshot != null){
                    var user = snapshot.val();
                    var value = instance.wordSelected.id;

                    if(user.words === undefined){
                       var words = new Object;
                       words[instance.getKey(instance.wordSelected.title)] = [];
                       words[instance.getKey(instance.wordSelected.title)].push(value);
                       user['words'] = words;
                    }else{
                        var words = user['words'];

                        if(words.hasOwnProperty(instance.getKey(instance.wordSelected.title))){
                            words[instance.getKey(instance.wordSelected.title)].push(value);
                        }else{
                            words[instance.getKey(instance.wordSelected.title)] = [];
                            words[instance.getKey(instance.wordSelected.title)].push(value);
                        }

                        user['words'] = words;
                    }
                    ref.set(user);
                    instance.initUserWords();
                    instance.queryFirebase(instance.query);
                }

            });
            
        });

        EventBus.$on('delete-word',index => {
            this.wordSelected = this.wordsList[index];
            
            var currentUser = firebase.auth().currentUser;
            var ref = firebase.database().ref("users/" + currentUser.uid);
            var instance = this;
            
            ref.once('value')
                .then(snapshot => {
                    var user = snapshot.val();
                    
                    if(user.words.hasOwnProperty(this.getKey(this.wordSelected.title))){
                        var meanings = user.words[this.getKey(this.wordSelected.title)];
                        var index = meanings.indexOf(this.wordSelected.id);
                        meanings.splice(index,1)
                        if(meanings.length > 0)
                            user.words[this.getKey(this.wordSelected.title)] = meanings;
                        else
                            delete user.words[this.getKey(this.wordSelected.title)];
                    }

                    ref.set(user);
                    instance.getUserWords();

                    if(instance.query.length > 0)
                        instance.queryFirebase(instance.query);
                    
                });
        });


        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.getUserWords();
            }else{

            }
        });
        
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
        initUserWords(){
            var currentUser  = firebase.auth(). currentUser;
            var instance = this;

            firebase.database()
                    .ref('users/'+currentUser.uid)
                    .once('value')
                    .then(snapshot => {
                        if(snapshot == null){
                            instance.userWords = null;
                        }else{
                            //get user snapshsot
                            var user = snapshot.val();
                            instance.userWords = (user.words === undefined) ? null : user.words;
                        }
                    });

        },getUserWords(){
            //fetch current user
            var currentUser  = firebase.auth(). currentUser;
            var instance = this;
            this.isLoading = true;

            firebase.database()
                    .ref('users/'+currentUser.uid)
                    .once('value')
                    .then(snapshot => {
                        if(snapshot == null){
                            instance.isLoading = false;
                            return;
                        }else{
                            //get user snapshsot
                            var user = snapshot.val();
                            //check whether words added by the user
                            if(user.words === undefined){
                                instance.userWords = null;
                                instance.isLoading = false;
                                return;
                            }else{
                                
                                instance.wordsList = [];
                                instance.userWords = user.words;
                                let index = 0;

                                //iterate through the words added by the user
                                Object.keys(user.words)
                                      .forEach(function(key){
                                        //iterate through meanings of each word
                                        user.words[key].forEach(function(id){
                                            instance.wordId = id;
                                            //fetch each word with its meaning based on id
                                            firebase.database()
                                                .ref('words/' + key  + '/' + id)
                                                .once('value')
                                                .then(function(snapshot){

                                                    var word = snapshot.val();
                                                    word["id"] = instance.wordId;
                                                    word['index'] = index++;
                                                    word['isAdded'] = true;
                                                    instance.wordsList.push(word);
                                                    instance.isLoading = false;
                                                });
                                    });                                    
                                });
                            }
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
            
            var instance = this;

            //fetch words
            firebase.database().ref('words/').orderByKey()       
                .once('value')
                .then(function(snapshot){
                    //check whether there children at node 'words/'
                    if(snapshot.hasChildren()){
                        var o = snapshot.val();
                        //iterate through all words at the node 'words/'
                        Object.keys(snapshot.val())
                              .forEach(function(key){
                                //delete the word if does not contain the query word
                                if(key.indexOf(val) === -1){
                                    delete o[key];
                                }
                              });

                        instance.wordsList = [];
                        let index = 0;
                        var userWords = null;

                        //iterate through the matched words
                        Object.keys(o).forEach(function(key){
                            instance.matchedWords = snapshot.val()[key];
                            //iterate through different meanings of each word might have
                            Object.keys(instance.matchedWords).forEach(function(k){
                                instance.matchedWords[k]['index'] = index++;
                                instance.matchedWords[k]['id'] = k;
                                //push each individual meaning as a different word
                                instance.wordsList.push(instance.matchedWords[k]);    
                            })
                        });

                        //iterate through the matched words
                        instance.wordsList.forEach(word =>{

                            //check whether the word has been added by the current user
                            if(instance.userWords != null && instance.userWords.hasOwnProperty(word.title)){
                                var meanings = instance.userWords[instance.getKey(word.title)];
                                var hasAdded = false;

                                try{
                                    meanings.forEach(m => {
                                        if(m === word.id){
                                            hasAdded = true;
                                            throw BreakException;
                                        }
                                    });
                                }catch(e){

                                }

                                word['isAdded'] = hasAdded;    
                            }else{
                                word['isAdded'] = false;
                            }
                            
                        });

                    }
                    
                });
        },getKey(key){
            return key;
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
