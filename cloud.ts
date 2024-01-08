
const __BOARD_WIDTH=10
const __BOARD_HEIGHT=20

const __WORD_WIDTH=60
const __WORD_HEIGHT=10
const __FONT_SIZE=12

const __MOVING_RATE=0.2
const __PENALTY_RATE=1;



var insult:HTMLInputElement;
var board:HTMLDivElement;


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
    }


    move(rate_:number=__MOVING_RATE){
        this.px+=this.direction/rate_;
        if(this.px+this.width>__BOARD_WIDTH){
            this.px--;
            this.py++;
            this.direction=-1;
        }
        else if(this.px<0){
            this.px++;
            this.py++;
            this.direction=1;
        }
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
                    this.words[i][j]=this.words[i][j+1];
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
                    this.words[i][j]=this.words[i+1][j];
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
    }





}

var cloud:Cloud=new Cloud(6,4);

function Submit(){

    let inputword:string=insult.value;
    insult.value="";

    let target:number[]=cloud.findWord(inputword);

    if(target[0]==-1){
        cloud.move(__PENALTY_RATE);
    }
    else{
        cloud.killWord(target[0],target[1]);
    }

}
