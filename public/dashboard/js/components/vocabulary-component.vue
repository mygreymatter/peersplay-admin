<template>
    <div>

        <div class="columns">
            <div class="column is-half is-offset-one-quarter">
                <!-- Search bar View -->
                <div>
                    <p v-bind:class="{'is-loading': isLoading}" class="control has-icons-right">
                        <input class="input" type="text" id="search-input" placeholder="Search here..." v-model="query">
                    </p>
                </div>
                
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

                <!-- -->
                    

                <!-- -->

        </div><!-- container - end -->
    </div>
</template>

<script>
export default{
    data(){
        return{
            query:'',
            isLoading : false,
            names:[],
            canShowWords:true
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
</style>