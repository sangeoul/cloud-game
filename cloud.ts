const __BOARD_WIDTH=10;
const __BOARD_HEIGHT=20;

const __WORD_WIDTH=75;
const __WORD_HEIGHT=18;
const __FONT_SIZE=14;

const __MOVING_RATE=0.2;
const __PENALTY_RATE=1;

const __MOVE_BASE_INTERVAL=1000;
const __MOVE_SPEED=10;
const __SMOOTHER=30;

const student=[
    ["스나오오카미","시로코"],
    ["타카나시","호시노"],
    ["쿠로미","세리카"],
    ["이자요이","노노미"],
    ["오쿠소라","아야네"],
    ["나츠메","이로하"],
    ["소라사키","히나"],
    ["아마우","아코"],
    ["시로미","이오리"],
    ["히노미야","치나츠"],
    ["리쿠하치마","아루"],
    ["아사기","무츠키"],
    ["오니카타","카요코"],
    ["이구사","하루카"],
    ["쿠로다테","하루나"],
    ["시시도우","이즈미"],
    ["와니부치","아카리"],
    ["아카시","준코"],
    ["아아키요","후우카"],
    ["우시마키","주리"],
    ["히무로","세나"],
    ["우시오","노아"],
    ["하야세","유우카"],
    ["쿠로사키","코유키"],
    ["하나오카","유즈"],
    ["텐도","아리스"],
    ["사이바","모모이"],
    ["사이바","미도리"],
    ["미카모","네루"],
    ["이치노세","아스나"],
    ["카쿠다테","카린"],
    ["무로카사","아카네"],
    ["아스마","토키"],
    ["아케보시","히마리"],
    ["카가미","치히로"],
    ["오마가리","하레"],
    ["코누리","마키"],
    ["오토세","코타마"],
    ["시라이시","우타하"],
    ["네코즈카","히비키"],
    ["토요미","코토리"],
    ["오토하나","스미레"],
    ["이즈미모토","에이미"],
    ["키리후지","나기사"],
    ["미소노","미카"],
    ["아지타니","히후미"],
    ["우라와","하나코"],
    ["시라스","아즈사"],
    ["시모에","코하루"],
    ["모리즈키","스즈미"],
    ["우자와","레이사"],
    ["코제키","우이"],
    ["엔도우","시미코"],
    ["이바라기","요시미"],
    ["쿠리무라","아이리"],
    ["쿄야마","카즈사"],
    ["유토리","나츠"],
    ["아오모리","미네"],
    ["스미","세리나"],
    ["아사가오","하나에"],
    ["켄자키","츠루기"],
    ["하네카와","하스미"],
    ["시즈야마","마시로"],
    ["와카바","히나타"],
    ["이오치","마리"],
    ["와라쿠","치세"],
    ["카와와","시즈코"],
    ["아사히나","피나"],
    ["카스가","츠바키"],
    ["미즈하","미모리"],
    ["이사미","카에데"],
    ["치도리","미치루"],
    ["쿠다","이즈나"],
    ["오노","츠쿠요"],
    ["코사카","와카모"],
    ["코노에","미나"],
    ["야쿠시","사야"],
    ["스노하라","슌"],
    ["스노하라","코코나"],
    ["아케시로","루미"],
    ["렌카와","체리노"],
    ["사시로","토모에"],
    ["이케쿠라","마리나"],
    ["아마미","노도카"],
    ["마요이","시구레"],
    ["야스모리","미노리"],
    ["오가타","칸나"],
    ["나카츠카사","키리노"],
    ["네무가키","후부키"],
    ["츠키유키","미야코"],
    ["소라이","사키"],
    ["카제쿠라","모에"],
    ["조마에","사오리"],
    ["하카리","아츠코"],
    ["이마시노","미사키"],
    ["츠치나가","히요리"]
];


var __VARIABLE_DIFFICULTY_RATE=1; 

window.console.log("JS loaded");

var insult:HTMLInputElement=<HTMLInputElement>document.getElementById("typingInput");
var submitButton:HTMLInputElement=<HTMLInputElement>document.getElementById("typingSubmit");
var board:HTMLDivElement=<HTMLDivElement>document.getElementById("board");


board.style.width=<string>((__BOARD_WIDTH*(__WORD_WIDTH))+"px");
board.style.height=<string>((__BOARD_HEIGHT*(__WORD_HEIGHT))+"px");
board.style.border="solid black 1px";

class Word {
    k:string;
    v:string;
    status:boolean;
    object:HTMLSpanElement;
    
    constructor(key_,value_){
        this.k=key_;
        this.v=value_;

        this.status=true;

        this.object=document.createElement("span");
        this.object.style.position="absolute";
        this.object.innerHTML=key_;
        board.appendChild(this.object);

    }

    die(){
        this.status=false;
        this.object.innerHTML="";
    }
    copy(w_:Word){
        this.k=w_.k;
        this.v=w_.v;
        this.status=w_.status;
        this.object.innerHTML=w_.object.innerHTML;
    }
}

class Cloud{
    words:Word[][];
    px:number;
    py:number;
    width:number;
    height:number;
    direction:number;

    constructor(w_:number,h_:number){
        this.width=w_;
        this.height=h_;
        this.px=0;
        this.py=0;
        this.direction=1;
        
        this.words=[];



        for(let i=0;i<this.width;i++){
            this.words[i]=[];
            for(let j=0;j<this.height;j++){
                this.words[i][j]=new Word(student[j*this.width+i][1],student[j*this.width+i][0]);
            }
        }
        this.display();
    }


    move(rate_:number=__MOVING_RATE){
        this.px+=this.direction*rate_;
        if(this.px+this.width>__BOARD_WIDTH){
            this.px=__BOARD_WIDTH-this.width;
            this.py++;
            this.direction=-1;
        }
        else if(this.px<0){
            this.px=0;
            this.py++;
            this.direction=1;
        }
        if(this.py+this.height>=__BOARD_HEIGHT){
            gameOver();
        }

        this.display();
    }

    findWord(value_:string){
        var position:number[]=[0,0];
        var failed=true;

        for(let i:number=0;i<this.width;i++){
            for(let j:number=0;j<this.height;j++){
                if(this.words[i][j].v==value_ && this.words[i][j].status==true){
                    position[0]=i;
                    position[1]=j;
                    failed=false;
                }
            }
        }

        if(failed){
            position[0]=-1;
            position[1]=-1;
        }
        return position;
    }

    killWord(x_:number,y_:number){
        this.words[x_][y_].die();
        if(x_==0 || x_==this.width-1 || y_==0 || y_==this.height-1){
            this.optimizeSize();
        }
        this.display();
        

    }

    display(){
        
        for(let i=0;i<this.width;i++){
            for(let j=0;j<this.height;j++){
                this.words[i][j].object.style.marginLeft=((this.px+i)*__WORD_WIDTH).toString();
                this.words[i][j].object.style.marginTop=((this.py+j)*__WORD_HEIGHT).toString();
            }
        }
    }



    private optimizeSize(){

        //윗줄 제거
        let cut=true;
        for(let i=0;i<this.width;i++){
            if(this.words[i][0].status==true){
                cut=false;
            }
        }
        if(cut){
            for(let i=0;i<this.width;i++){
                for(let j=0;j<this.height-1;j++){
                    this.words[i][j].copy(this.words[i][j+1]);
                }
                this.words[i][this.height-1].die();
            }
            this.height--;
            this.py++;
        }

        //아랫줄 제거
        cut=true;
        for(let i=0;i<this.width;i++){
            if(this.words[i][this.height-1].status==true){
                cut=false;
            }
        }
        if(cut){
            this.height--;
        }
        
        //왼쪽 줄 제거
        cut=true;
        for(let j=0;j<this.height;j++){
            if(this.words[0][j].status==true){
                cut=false;
            }
        }
        if(cut){
            for(let j=0;j<this.height;j++){
                for(let i=0;i<this.width-1;i++){
                    this.words[i][j].copy(this.words[i+1][j]);
                    

                }
                this.words[this.width-1][j].die();
            }
            this.width--;
            this.px++;
        }
        
        //오른쪽 줄 제거
        cut=true;
        for(let j=0;j<this.height;j++){
            if(this.words[this.width-1][j].status==true){
                cut=false;
            }
        }
        if(cut){

            this.width--;
        }
        this.display();

    }





}

var cloud:Cloud=new Cloud(6,4);
insult.focus();

function Submit(){

    let inputword:string=insult.value;
    insult.value="";
    insult.focus();

    let target:number[]=cloud.findWord(inputword);

    if(target[0]==-1){
        cloud.move(__PENALTY_RATE);
    }
    else{
        cloud.killWord(target[0],target[1]);
    }

}

var autoMoveInterval=setInterval(autoMove,(__MOVE_BASE_INTERVAL*10/__MOVE_SPEED)/__SMOOTHER,1/__SMOOTHER);

function autoMove(interval_){
    cloud.move(interval_);
}

function gameOver(){
    clearInterval(autoMoveInterval);
    alert("GAME OVER");
}

