<template>
    <div>

        <div class="container" id="words-list-container" v-show="!isEditMode">
            <!-- Search - start -->
            <div class="container" id="search-view">

                <div class="columns">
                    <div class="column"></div>
                    <div class="column is-half">
                        <!-- Search bar View -->
                        <div>
                            <p v-bind:class="{'is-loading': isLoading}" class="control has-icons-right">
                                <input class="input" type="text" id="search-input" placeholder="Search here..." v-model="query">
                            </p>
                        </div>
                    </div>
                    <div class="column has-text-centered">
                        <span class="icon plus is-large is-pulled-right" @click="showEditor">
                            &#65291;
                        </span>
                    </div>
                    <div class="column"></div>
                </div>

                <div class="columns">
                    <!-- Results View -->
                        <div class="results">
                            <ul>
                                <li v-for="name in names">
                                    <div class="search-result">
                                        {{name}}
                                    </div>
                                </li>
                            </ul>
                        </div><!-- results - end -->
                </div>
            </div>
            <!-- Search - end -->

            <!--List of words - start -->
            <div class="container" id="list-words-container">
                <!-- container - start -->
                    <div class="container words-container" v-show="canShowWords">
                            <!-- words View -->
                            <div class="word-card card" v-for="n in 20">
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
                                            <span class="word-more-examples is-pulled-right">
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

        <!-- Editor - start -->
        
        <div class="container word-input-container" id="Editor" v-show="isEditMode">
        
            <p class="control back-control">
                <a class="button is-medium" >
                    <span class="icon is-small">
                        <i class="fa fa-arrow-left"></i>
                    </span>
                    <span>Back To Words</span>
                </a>
            </p>

            <div class="field">
                <label class="label">Word/Phrasal Verb</label>
                <p class="control">
                    <input class="input" type="text" placeholder="Enter a word or phrasal verb">
                </p>
            </div>

            <div class="field">
                <label class="label">Meaning</label>
                <p class="control">
                    <input class="input" type="text" placeholder="Enter meaning">
                </p>
            </div>

            <div class="field">
                <label class="label is-pulled-left">Example</label>
                <span class="icon plus is-large" @click="addExample">&#65291;</span>
                <p class="control" id="example-control">
                    <input class="input example-input" type="text" placeholder="Example" v-for="n in range">
                </p>
            </div>
        
        </div>

        <!-- Editor - end -->
        
    </div>
</template>

<script>
export default{
    data(){
        return{
            query:'',
            isLoading : false,
            names:[],
            canShowWords:true,
            isEditMode:true,
            examples:[],
            range:1
        }
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
                
        }
    },methods:{
        showEditor(){
            this.isEditMode = true;
            console.log("Edit Mode: " + this.isEditMode);
        },addExample(){
            this.range += 1;
        }
    }
}
</script>
<style scoped>

#search-input{
    padding:10px;
    width:100%;
    height:40px;
    background-color: transparent;
    border: 1px solid;
    color: #CCC;
    font-size:20px;
}

#search-input:focus{
  outline:none;
  color:#000;
  border: 1px #ccc solid;
}
.search-result{
    border-bottom: 1px #AEAEAE solid;
    border-right: 1px #AEAEAE solid;
    border-left: 1px #AEAEAE solid;
    padding: 5px;
    font-weight:lighter;
}

.card{
    margin-bottom:5px;
}

.box,.card-content{
    padding:1rem;
}

.word{
    font-weight:bold;
    font-size:24px;
}

.word-type{
    font-weight:lighter;
    color:blueviolet;
    font-style:italic;
    font-size:18px;
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
}
.word-example{
    font-weight:lighter;
    color:#000000;
}
.word-more-examples{
    font-weight:300;
    font-style:italic;
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
</style>