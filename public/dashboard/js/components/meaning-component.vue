<template lang="html">
  <div>

      <div class="card">
        <div class="card-content meaning">
          <h5 class="meaning-header">Meaning {{word.index}} </h5>
          <form id="form" class="col s12" novalidate="novalidate" @submit.prevent="save">
              <div class="row">
                  <div class="input-field col s12">
                      <input id="word-phrase-meaning" class="validate editor-input" :class="{'error-input':isMeaningRequired}" type="text" v-model="word.meaning">
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
                      <input id="word-phrase-type" class="validate editor-input" :class="{'error-input':isTypeRequired}" type="text" v-model="word.type">
                      <label for="word-phrase-label">Type</label>
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
                      <input id="example-two" class="input example-input editor-input" type="text" v-model="word.exampleTwo"/>
                      <label for="example-two" >Example 2</label>
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
  },watch:{

  },methods:{
    updateMeaning(){
      console.log("Update Meaning: "+this.value);
    },save(){
        console.log("Save: " + this.meaning);
        this.isWordRequired = this.wordPhrasal === '';
        this.isMeaningRequired = this.word.meaning === '';
        this.isTypeRequired = this.word.type === '';
        this.isExampleRequired = this.word.exampleOne === '';

        if(!this.isWordRequired && !this.isMeaningRequired && !this.isExampleRequired && !this.isTypeRequired){

            var instance = this;
            this.isSaving = true;

            this.wordPhrasal = this.wordPhrasal.toLowerCase();

            if(this.word.exampleTwo !== '')
                this.word.exampleTwo = this.word.exampleTwo.toLowerCase();

            var item ={
                'title':this.wordPhrasal,
                'meaning':this.word.meaning.toLowerCase(),
                'example-1':this.word.exampleOne.toLowerCase(),
                'example-2':this.word.exampleTwo
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
h5.meaning-header{
    background: #7986CB;
    padding: 10px;
    color: ghostwhite;
    margin:0;
}
.card-content.meaning{
  padding:0;
}
.card-content.meaning>form{
  padding: 10px 24px 10px 24px;
}

</style>
