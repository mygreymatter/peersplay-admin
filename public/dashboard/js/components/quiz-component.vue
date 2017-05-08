<template>
    <div>

   		<!-- Quiz Container - start -->     
        <div class="container quiz-container" v-show="!isQuizProgress">
            <!-- Quiz Card - start -->            
            <div class="card quiz-card" v-for="n in 4">
                <div class="card-content quiz-card-content" @click="showQuiz(n)">
                    <p class="title is-3 has-text-centered"><strong>Quiz</strong></p>
                    <p class="quiz-type has-text-centered">
                        <span class="type-label">Type:</span><span class="type-value">MCQ</span>
                    </p>
                    <p class="quiz-status has-text-centered">
                        <span class="status-label">Status:</span><span class="status-value">Not Attempted</span>
                    </p>
                </div>
                <div class="card-footer">
                    <div class="card-footer-item has-text-centered">
                        <span class="attempts">Attempts:</span><span class="attempts-count">5</span>
                    </div>
                    <div class="card-footer-item has-text-centered">
                        <span class="success">Success:</span><span class="success-count">5</span>
                    </div>
                </div>
            </div>
            <!-- Quiz Card - end -->            
        </div>
        <!-- Quiz Container - end -->     

        <!-- Quiz Questions Container - start -->     
        <div class="container quiz-question-container" v-show="isQuizProgress">

            <p class="control back-control">
                <a class="button is-medium" @click="showQuizList">
                    <span class="icon is-small">
                        <i class="fa fa-arrow-left"></i>
                    </span>
                    <span>Back To Quizes</span>
                </a>
            </p>

            <div class="card question-card">
                <header class="card-header">
                    <p class="card-header-title is-unselectable question">
                        {{questions[questionIndex].instruction}}
                    </p>
                </header>

                <div class="card-content">
                    <div class="question-mcq" v-show="questions[questionIndex].questionType === 'mcq'">
                        <ul>
                            <li class="choice" v-for="choice in questions[questionIndex].choices">
                                <input type="radio" name="choice" v-model="yourAnswer" :value="choice" :checked="choice === questions[questionIndex].answer">
                                <label for="choice" class=" is-unselectable" @click="chosen(choice)">{{choice|titleCase}}</label>
                            </li>
                        </ul>
                    </div>
                    <div class="question-fill-blank" v-show="questions[questionIndex].questionType === 'descriptive'">
                        <p class="description">
                            {{questions[questionIndex].questionPart[0]}}<span><input type="text" v-model="yourAnswer"></span>
                            {{questions[questionIndex].questionPart[1]}}
                        </p>
                        <p><span class="your-answer">Your Answer:</span> {{yourAnswer}}</p>
                    </div>

                </div>

                <footer class="card-footer">
                    <span class="card-footer-item prev is-unselectable" v-bind:class="{disabled : isQuizBeginning}" @click="previous">Prev</span>
                    <span class="card-footer-item next is-unselectable" v-bind:class="{disabled : !hasAnswered}" @click="next">Next</span>
                </footer>

            </div>
        </div>
        <!-- Quiz Questions Container - end -->     

    </div>
</template>
<script>
export default{
    data(){
        return{
            hasAnswered:false,
            isQuizBeginning:true,
            yourAnswer:'',
            questionIndex:0,
            isQuizProgress:false,
            questions:[{
                questionType:'mcq',
                instruction:'Find out the meaning of the word "Ace"?',
                choices:[
                            'outdo someone in a competitive situation',
                            'achieve high marks in (a test or exam)',
                            'score an ace on (a hole) or with (a shot)',
                            '(in tennis and similar games) serve an ace against (an opponent)'
                        ],
                questionPart:['',''],        
                hasAnswered:false,
                answer:''
            },{
                questionType:'descriptive',
                instruction:'Fill in the correct word.',
                questionPart:['Nandal banged down eight ',' in the set.'],
                hasAnswered:false,
                answer:''
            }]
        }
    },filters:{
        titleCase:function(value){
            if(!value) return '';
            return value.substr(0,1).toUpperCase() + value.substr(1);
        }
    },methods:{
        showQuiz(n){
            console.log('Quiz selected: ' + n);
            this.isQuizProgress = true;
        },
        showQuizList(){
            this.isQuizProgress = false;
        },
        next(){
            console.log('yourAnswer: ' + this.yourAnswer);
            if(this.hasAnswered && this.questionIndex < this.questions.length - 1){
                this.questionIndex++;
                this.yourAnswer = this.questions[this.questionIndex].answer;
            }
        },
        previous(){
            if(this.questionIndex > 0){
                this.questionIndex--;
                this.yourAnswer = this.questions[this.questionIndex].answer;
            }
        },chosen(value){
            this.yourAnswer = value;
        }
    },watch:{
        yourAnswer:function(yourAnswer){
            if(yourAnswer.length === 0){
                this.hasAnswered = false;
                this.isQuizBeginning = this.questionIndex === 0;
                return yourAnswer;
            }
            this.hasAnswered = true;
            this.isQuizBeginning = this.questionIndex === 0;
            this.questions[this.questionIndex].answer = yourAnswer;
            console.log('yourAnswer: ' + this.questions[this.questionIndex].answer);
            return yourAnswer;
        }
    }
}
</script>

<style scoped>
.quiz-container{
    padding:10px;
    width:100%;
}
.quiz-card{
    width:250px;
    height:250px;
    float:left;
    margin-left:15%;
    margin-bottom:10%;
}
.quiz-card:hover{
    cursor:pointer;
}
.quiz-card-content{
    height:200px;
}
.attempts,.success,.type-label,.status-label{
    font-weight:200;
}
.attempts-count,.success-count,.type-value,.status-value{
    padding-left:5px;
    font-weight:500;
}
.attempts{
    color:orange;
}
.success{
    color:green;
}
.type-label,.type-value,.status-label,.status-value{
    font-size: larger;
}
.quiz-question-container{
    width:70%;
}
.prev,.next,input[type=radio]{
    cursor: pointer;
    color:#4A4A4A;
}
.disabled{
    color:#AEAEAE;
    cursor:not-allowed;
}
.choice>label{
    cursor:pointer;
    font-weight:lighter;
}
.question,.your-answer{
    font-weight:500;
}
.description{
    font-weight:lighter;
}
p.control.back-control{
    margin-bottom:20px;
}
</style>