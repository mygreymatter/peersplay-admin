<template lang="html">
  <div>

      <div class="card">
        <div class="card-content meaning">
          <div class="meaning-header">
            <!-- <h5 class="meaning-header">Meaning {{word.index}} </h5> -->
            <span class="left">Meaning {{word.index}}</span>
            <span class="right">{{word.id}}</span>
          </div>
          <form id="form" class="col s12" novalidate="novalidate" @submit.prevent="save">
              <div class="row">
                  <div class="input-field col s12">
                      <input id="word-phrase-meaning" class="validate editor-input" :class="{'error-input':isMeaningRequired}" type="text" v-model="word.meaning">
                      <label for="word-phrase-meaning" :class="{'active' : (word.meaning !== '')}">Meaning</label>
                  </div>
              </div>

              <div class="row" :class="{'hide':!isMeaningRequired}">
                  <div class="col s12">
                      <span class="error">The meaning of the word is required.</span>
                  </div>
              </div>

              <div class="row">
                  <div class="input-field col s12">
                      <input id="word-phrase-type" class="validate editor-input" :class="{'error-input':isTypeRequired}" type="text" v-model="word.type">
                      <label for="word-phrase-label" :class="{'active' : (word.type !== '')}">Type</label>
                  </div>
              </div>

              <div class="row" :class="{'hide':!isTypeRequired}">
                  <div class="col s12">
                      <span class="error">The label of the word is required.</span>
                  </div>
              </div>

              <h5 class="left-align">Examples</h5>

              <div class="row">
                  <div class="input-field col s12">
                      <input id="example-one" class="input example-input editor-input" :class="{'error-input':isExampleRequired}" type="text" v-model="word.exampleOne"/>
                      <label for="example-one" :class="{'active' : (word.exampleOne !== '')}">Example 1</label>
                  </div>
              </div>

              <div class="row" :class="{'hide':!isExampleRequired}">
                  <div class="col s12">
                      <span class="error">At least one example is required.</span>
                  </div>
              </div>

              <div class="row">
                  <div class="input-field col s12">
                      <input id="example-two" class="input example-input editor-input" type="text" v-model="word.exampleTwo"/>
                      <label for="example-two" :class="{'active' : (word.exampleTwo !== '')}">Example 2</label>
                  </div>
              </div>

              <div class="input-field col s12 right-align">
                  <button id="save" class="waves-effect waves-light btn right-align" v-bind:class="{'is-loading':isSaving}" type="submit">Save</button>
              </div>
          </form>
        </div>
      </div>

  </div>
</template>

<script>
import {EventBus} from './event-bus.vue'

export default {
  props:[
    'word'
],data(){
    return{
      isSaving:false,
      isMeaningRequired:false,
      isTypeRequired:false,
      isExampleRequired:false,
    }
  },created(){
    if(this.word.id === ''){
      this.word.id = (new Date()).getTime().toString();
    }

    
    EventBus.$on('word-title',title => {
      this.word.title = title;
      console.log('Word Title: ' + title);
    });

  },methods:{
    save(){
        console.log('Word Title: ' + this.word.title + " " + this.word.id);

        this.isWordRequired = this.word.title === '';
        this.isMeaningRequired = this.word.meaning === '';
        this.isTypeRequired = this.word.type === '';
        this.isExampleRequired = this.word.exampleOne === '';

        if(!this.isWordRequired && !this.isMeaningRequired && !this.isExampleRequired && !this.isTypeRequired){

            var instance = this;
            this.isSaving = true;

            this.wordPhrasal = "ace";

            if(this.word.exampleTwo !== '')
                this.word.exampleTwo = this.word.exampleTwo.toLowerCase();

            var item ={
                'title':this.word.title.toLowerCase(),
                'type':this.word.type.toLowerCase(),
                'meaning':this.word.meaning.toLowerCase(),
                'example-1':this.word.exampleOne.toLowerCase(),
                'example-2':this.word.exampleTwo.toLowerCase()
            }
            

            var ref = firebase.database().ref('words/' + this.word.title +'/'+this.word.id);
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

<style lang="css" scoped>
a#save{
    width:15%;
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
    margin-top: 10px;
    width:15%;
}
.meaning-header{
    background: #7986CB;
    height: 50px;
    padding: 12px;
    color: ghostwhite;
    margin:0;
    font-size: large;
}
.card-content.meaning{
  padding:0;
}
.card-content.meaning>form{
  padding: 10px 24px 10px 24px;
}

</style>
