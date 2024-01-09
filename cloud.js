var __BOARD_WIDTH = 12;
var __BOARD_HEIGHT = 20;
var __WORD_WIDTH = 72;
var __WORD_HEIGHT = 18;
var __FONT_SIZE = 14;
var __MOVING_RATE = 0.2;
var __PENALTY_RATE = 1;
var __MAX_WIDTH = 8;
var __MAX_HEIGHT = 10;
var __BASE_SPEED = 10; //default 10;
var __ANIMATION_INTERVAL = 400; //millisecond
var __HINT_TIMER = 6000;
var __GAME_WIDTH = 7;
var __GAME_HEIGHT = 5;
var student = [
    ["스나오오카미", "시로코"],
    ["타카나시", "호시노"],
    ["쿠로미", "세리카"],
    ["이자요이", "노노미"],
    ["오쿠소라", "아야네"],
    ["나츠메", "이로하"],
    ["소라사키", "히나"],
    ["아마우", "아코"],
    ["시로미", "이오리"],
    ["히노미야", "치나츠"],
    ["리쿠하치마", "아루"],
    ["아사기", "무츠키"],
    ["오니카타", "카요코"],
    ["이구사", "하루카"],
    ["쿠로다테", "하루나"],
    ["시시도우", "이즈미"],
    ["와니부치", "아카리"],
    ["아카시", "준코"],
    ["아이키요", "후우카"],
    ["우시마키", "주리"],
    ["히무로", "세나"],
    ["우시오", "노아"],
    ["하야세", "유우카"],
    ["쿠로사키", "코유키"],
    ["하나오카", "유즈"],
    ["텐도", "아리스"],
    ["사이바", "모모이"],
    ["사이바", "미도리"],
    ["미카모", "네루"],
    ["이치노세", "아스나"],
    ["카쿠다테", "카린"],
    ["무로카사", "아카네"],
    ["아스마", "토키"],
    ["아케보시", "히마리"],
    ["카가미", "치히로"],
    ["오마가리", "하레"],
    ["코누리", "마키"],
    ["오토세", "코타마"],
    ["시라이시", "우타하"],
    ["네코즈카", "히비키"],
    ["토요미", "코토리"],
    ["오토하나", "스미레"],
    ["이즈미모토", "에이미"],
    ["키리후지", "나기사"],
    ["미소노", "미카"],
    ["아지타니", "히후미"],
    ["우라와", "하나코"],
    ["시라스", "아즈사"],
    ["시모에", "코하루"],
    ["모리즈키", "스즈미"],
    ["우자와", "레이사"],
    ["코제키", "우이"],
    ["엔도우", "시미코"],
    ["이바라기", "요시미"],
    ["쿠리무라", "아이리"],
    ["쿄야마", "카즈사"],
    ["유토리", "나츠"],
    ["아오모리", "미네"],
    ["스미", "세리나"],
    ["아사가오", "하나에"],
    ["켄자키", "츠루기"],
    ["하네카와", "하스미"],
    ["시즈야마", "마시로"],
    ["와카바", "히나타"],
    ["이오치", "마리"],
    ["와라쿠", "치세"],
    ["카와와", "시즈코"],
    ["아사히나", "피나"],
    ["카스가", "츠바키"],
    ["미즈하", "미모리"],
    ["이사미", "카에데"],
    ["치도리", "미치루"],
    ["쿠다", "이즈나"],
    ["오노", "츠쿠요"],
    ["코사카", "와카모"],
    ["코노에", "미나"],
    ["야쿠시", "사야"],
    ["스노하라", "슌"],
    ["스노하라", "코코나"],
    ["아케시로", "루미"],
    ["렌카와", "체리노"],
    ["사시로", "토모에"],
    ["이케쿠라", "마리나"],
    ["아마미", "노도카"],
    ["마요이", "시구레"],
    ["야스모리", "미노리"],
    ["오가타", "칸나"],
    ["나카츠카사", "키리노"],
    ["네무가키", "후부키"],
    ["츠키유키", "미야코"],
    ["소라이", "사키"],
    ["카제쿠라", "모에"],
    ["조마에", "사오리"],
    ["하카리", "아츠코"],
    ["이마시노", "미사키"],
    ["츠치나가", "히요리"]
];
var __VARIABLE_DIFFICULTY_RATE = 1;
window.console.log("JS loaded");
var input_insult = document.getElementById("input_typingInput");
var input_submitButton = document.getElementById("input_typingSubmit");
var div_board = document.getElementById("div_board");
var span_hint = document.getElementById("span_hint");
var hintOn = false;
div_board.style.width = ((__BOARD_WIDTH * (__WORD_WIDTH)) + "px"); //864
div_board.style.height = ((__BOARD_HEIGHT * (__WORD_HEIGHT)) + "px"); //360
var startTime, liveTime, hintTime;
var requestAnimationFrameSession;
var gameLive = false;
var score = 0;
var Word = /** @class */ (function () {
    function Word(key_, value_) {
        this.k = key_;
        this.v = value_;
        this.status = true;
        this.object = document.createElement("span");
        this.object.style.position = "absolute";
        this.object.className = "studentName";
        this.object.innerHTML = key_;
        div_board.appendChild(this.object);
    }
    Word.prototype.die = function () {
        this.status = false;
        this.object.innerHTML = "";
    };
    Word.prototype.copy = function (w_) {
        this.k = w_.k;
        this.v = w_.v;
        this.status = w_.status;
        this.object.innerHTML = w_.object.innerHTML;
    };
    return Word;
}());
var Cloud = /** @class */ (function () {
    function Cloud(w_, h_) {
        if (w_ > __MAX_WIDTH)
            w_ = __MAX_WIDTH;
        if (h_ > __MAX_HEIGHT)
            w_ = __MAX_HEIGHT;
        this.width = w_;
        this.height = h_;
        this.px = 0;
        this.py = 0;
        this.direction = 1;
        this.words = [];
        //단어 수가 학생수보다 적으면 중복 없이 뽑아 준다.
        if (this.width * this.height < student.length) {
            var studentlist = [];
            var temp_student = [];
            for (var i = 0; i < student.length; i++) {
                temp_student[i] = [];
                temp_student[i][0] = student[i][0];
                temp_student[i][1] = student[i][1];
            }
            for (var i = 0; i < this.width * this.height; i++) {
                var p = Math.floor(Math.random() * (student.length - i));
                studentlist[i] = [];
                studentlist[i][0] = temp_student[p][0];
                studentlist[i][1] = temp_student[p][1];
                for (var j = p; j < student.length - i - 1; j++) {
                    temp_student[j][0] = temp_student[j + 1][0];
                    temp_student[j][1] = temp_student[j + 1][1];
                }
            }
            for (var i = 0; i < this.width; i++) {
                this.words[i] = [];
                for (var j = 0; j < this.height; j++) {
                    this.words[i][j] = new Word(studentlist[j * this.width + i][1], studentlist[j * this.width + i][0]);
                }
            }
        }
        //단어 수가 학생 수보다 많으면 그냥 랜덤으로 뽑는다.
        else {
            alert("단어 구름 크기가 너무 커서 중복된 단어가 나옵니다.");
            for (var i = 0; i < this.width; i++) {
                this.words[i] = [];
                for (var j = 0; j < this.height; j++) {
                    this.words[i][j] = new Word(student[Math.floor(Math.random() * j * this.width + i)][1], student[Math.floor(Math.random() * j * this.width + i)][0]);
                }
            }
        }
        this.display();
    }
    Cloud.prototype.move = function (rate_) {
        if (rate_ === void 0) { rate_ = __MOVING_RATE; }
        this.px += this.direction * rate_;
        if (this.px + this.width > __BOARD_WIDTH) {
            this.px = __BOARD_WIDTH - this.width;
            this.py++;
            this.direction = -1;
        }
        else if (this.px < 0) {
            this.px = 0;
            this.py++;
            this.direction = 1;
        }
        if (this.py + this.height >= __BOARD_HEIGHT) {
            gameOver(false);
        }
        this.display();
    };
    Cloud.prototype.findWord = function (value_) {
        var position = [0, 0];
        var failed = true;
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.words[i][j].v == value_ && this.words[i][j].status == true) {
                    position[0] = i;
                    position[1] = j;
                    failed = false;
                }
            }
        }
        if (failed) {
            position[0] = -1;
            position[1] = -1;
        }
        return position;
    };
    Cloud.prototype.killWord = function (x_, y_) {
        this.words[x_][y_].die();
        if (x_ == 0 || x_ == this.width - 1 || y_ == 0 || y_ == this.height - 1) {
            this.optimizeSize();
        }
        this.display();
        if (this.height == 0) {
            gameOver(true);
        }
    };
    Cloud.prototype.display = function () {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.words[i][j].object.style.marginLeft = ((this.px + i) * __WORD_WIDTH).toString();
                this.words[i][j].object.style.marginTop = ((this.py + j) * __WORD_HEIGHT).toString();
            }
        }
    };
    Cloud.prototype.optimizeSize = function () {
        //윗줄 제거
        var cut = true;
        for (var i = 0; i < this.width; i++) {
            if (this.words[i][0].status == true) {
                cut = false;
            }
        }
        if (cut) {
            for (var i = 0; i < this.width; i++) {
                for (var j = 0; j < this.height - 1; j++) {
                    this.words[i][j].copy(this.words[i][j + 1]);
                }
                this.words[i][this.height - 1].die();
            }
            this.height--;
            this.py++;
        }
        if (this.height == 0) {
            return;
        }
        //아랫줄 제거
        cut = true;
        for (var i = 0; i < this.width; i++) {
            if (this.words[i][this.height - 1].status == true) {
                cut = false;
            }
        }
        if (cut) {
            this.height--;
        }
        //왼쪽 줄 제거
        cut = true;
        for (var j = 0; j < this.height; j++) {
            if (this.words[0][j].status == true) {
                cut = false;
            }
        }
        if (cut) {
            for (var j = 0; j < this.height; j++) {
                for (var i = 0; i < this.width - 1; i++) {
                    this.words[i][j].copy(this.words[i + 1][j]);
                }
                this.words[this.width - 1][j].die();
            }
            this.width--;
            this.px++;
        }
        //오른쪽 줄 제거
        cut = true;
        for (var j = 0; j < this.height; j++) {
            if (this.words[this.width - 1][j].status == true) {
                cut = false;
            }
        }
        if (cut) {
            this.width--;
        }
        this.display();
    };
    return Cloud;
}());
var cloud = new Cloud(0, 0);
function Submit() {
    var inputword = input_insult.value;
    input_insult.value = "";
    input_insult.focus();
    var target = cloud.findWord(inputword);
    if (target[0] == -1) {
        cloud.move(__PENALTY_RATE);
    }
    else {
        cloud.killWord(target[0], target[1]);
        score++;
        span_hint.innerHTML = "";
        hintOn = false;
        hintTime = Date.now();
    }
}
//gameStart();
function gameStart() {
    document.getElementById("table_preparation").style.display = "none";
    document.getElementById("table_gameboard").style.display = "block";
    document.getElementById("table_winscreen").style.display = "none";
    document.getElementById("table_defeatscreen").style.display = "none";
    hintOn = false;
    span_hint.innerHTML = "";
    cloud = new Cloud(__GAME_WIDTH, __GAME_HEIGHT);
    score = 0;
    input_insult.focus();
    startTime = Date.now();
    liveTime = startTime;
    gameLive = true;
    hintTime = Date.now();
    requestAnimationFrameSession = requestAnimationFrame(gameFlow);
}
function gameFlow() {
    if (Date.now() - liveTime > __ANIMATION_INTERVAL) {
        cloud.move(((__BOARD_WIDTH - cloud.width) / 5) * __BASE_SPEED * __ANIMATION_INTERVAL / 10000);
        liveTime += __ANIMATION_INTERVAL;
    }
    if (gameLive) {
        requestAnimationFrameSession = requestAnimationFrame(gameFlow);
    }
    if (Date.now() - hintTime > __HINT_TIMER && !hintOn) {
        hintOn = true;
        var hintStudent = findRandomStudent();
        span_hint.innerHTML = hintStudent.v;
    }
}
function findRandomStudent() {
    var list = [];
    var p = 0;
    for (var i = 0; i < cloud.width; i++) {
        for (var j = 0; j < cloud.height; j++) {
            if (cloud.words[i][j].status == true) {
                list[p] = j * cloud.width + i;
                p++;
            }
        }
    }
    var n = Math.floor(Math.random() * p);
    return cloud.words[list[n] % cloud.width][Math.floor(list[n] / cloud.width)];
}
function gameOver(win_) {
    if (win_ === void 0) { win_ = false; }
    gameLive = false;
    if (win_) {
        alert("GAME WIN");
        document.getElementById("table_preparation").style.display = "none";
        document.getElementById("table_gameboard").style.display = "none";
        document.getElementById("table_winscreen").style.display = "block";
        document.getElementById("table_defeatscreen").style.display = "none";
    }
    else {
        alert("GAME OVER");
        var tmp_student = findRandomStudent();
        var _image = document.getElementById("img_defeat");
        //DEBUG
        console.log(score);
        if (score > __GAME_WIDTH * __GAME_HEIGHT / 2) {
            _image.src = "./result/defeat-arona2.png";
        }
        else {
            _image.src = "./result/defeat-arona1.png";
        }
        document.getElementById("span_defeatScore").innerHTML = "점수 : " + score + "/" + (__GAME_HEIGHT * __GAME_WIDTH) + " (" + Math.floor(score * 100 / (__GAME_HEIGHT * __GAME_WIDTH)) + "%)";
        document.getElementById("table_preparation").style.display = "none";
        document.getElementById("table_gameboard").style.display = "none";
        document.getElementById("table_winscreen").style.display = "none";
        document.getElementById("table_defeatscreen").style.display = "block";
    }
}
