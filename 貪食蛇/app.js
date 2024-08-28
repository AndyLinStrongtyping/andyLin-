const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getComtext() method回傳一個canvas的drawing context
//drawing context可以在canvas裡畫圖
const unit = 20;
const row = canvas.height / unit; // 400 / 20 = 20
const column = canvas.width / unit; // 400 / 20 = 20


let snake = []; //array中每個元素,都是個物件
function createSnake() {
    //物件工作是儲存身體x,y做鰾
  snake[0] = {
      x:80,
      y:0,
  };

  snake[1] = {
      x:60,
      y:0,
  };

  snake[2] = {
      x:40,
      y:0,
  };

  snake[3] = {
      x:20,
      y:0,
  };
}

class Fruit {
    constructor() {
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
    }

    drawFruit() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y ,unit ,unit);
    }

    pickALocation() {
        let overlapping = false;
        let new_x;
        let new_y;

        function checkOverlap(new_x,new_y) {
            for (let i = 0; i < snake.length; i++) {
                if (new_x == snake[i].x && new_y == snake[i].y) {
                    overlapping = true;
                    return;
                } else {
                    overlapping = false;
                }
            }
        }

        do {
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            checkOverlap(new_x,new_y);
        } while(overlapping);

        this.x = new_x;
        this.y = new_y;
    }
}

//初始設定
createSnake();
let myFruit = new Fruit();
window.addEventListener("keydown",changeDirection)
let d = "Right";
function changeDirection(e) {
    if (e.key == "ArrowLeft" && d != "Right") {
        d = "Left";
    } else if (e.key == "ArrowRight" && d != "Left") {
        d = "Right";
    } else if (e.key == "ArrowUp" && d != "Down") {
        d = "Up";
    } else if (e.key == "ArrowDown" && d != "Up") {
        d = "Down";
    }

  // 每次按下上下左右鍵之後，在下一幀被畫出來之前，
  // 不接受任何keydown事件
  // 這樣可以防止按太快撞到
  window.removeEventListener("keydown", changeDirection);
    
}

let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "吃到的果實:" + score;
document.getElementById("myScore2").innerHTML = "吃到過最多的果實:" + highestScore;

function draw() {
    //產生新頭前,確認沒碰到自己
    for (let i = 1 ; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            clearInterval(myGame);
            alert("你可以在喜馬拉雅山上煎雞蛋嗎");
            return;
        }
    }

    //背景全黑
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    myFruit.drawFruit();

    //畫蛇
    for (let i = 0; i < snake.length; i++) {
        if (i == 0){
            ctx.fillStyle = "LightSkyBlue";
        } else {
            ctx.fillStyle = "DarkGoldenRod"; 
        }
        ctx.strokeStyle = "white";

        if (snake[i].x >= canvas.width) {
            snake[i].x = 0
        }

        if (snake[i].x < 0) {
            snake[i].x = canvas.width - unit;
        }

        if (snake[i].y >= canvas.height) {
            snake[i].y = 0
        }

        if (snake[i].y < 0) {
            snake[i].y = canvas.height - unit;
        }

         //x,y,width,height填滿正方形
        ctx.fillRect(snake[i].x,snake[i].y,unit,unit); 
        ctx.strokeRect(snake[i].x,snake[i].y,unit,unit);
    };
    
    //以目前d的變數方向來決定蛇的下一塊放在哪個座標
    let snakeX = snake[0].x; // snake[0]是物件，但snake[0].x是number
    let snakeY = snake[0].y;
    if (d == "Left") {
        snakeX -= unit;
    } else if (d == "Up") {
        snakeY -= unit
    } else if (d == "Right") {
        snakeX += unit;
    } else if (d == "Down") {
        snakeY += unit;
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    //確認蛇是否有吃到果實
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y){
        myFruit.pickALocation();
        score++;
        setHighestScore(score);
        document.getElementById("myScore").innerHTML = "吃到的果實:" + score;
        document.getElementById("myScore2").innerHTML = "吃到過最多的果實:" + highestScore;

        //畫出心果實
        //加分
    } else {
        snake.pop();
    }

   
    snake.unshift(newHead);
    window.addEventListener("keydown",changeDirection);
};


let myGame = setInterval(draw, 100);

function loadHighestScore() {
    if (localStorage.getItem("highestScore") == null) {
        highestScore = 0; 
    } else {
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}

function setHighestScore(score) {
    if (score > highestScore) {
        localStorage.setItem("highestScore",score);
        highestScore = score;
    }
}