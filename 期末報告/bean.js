class coin{
    constructor(x,y){
        this.x=x;
        this.y=y
    }
    selfchk(){
        let flags=[game[this.x-1][this.y],game[this.x][this.y-1],game[this.x][this.y+1],game[this.x+1][this.y]]
        if(flags.every((e)=>e==1)){
            game[this.x][this.y]=1
        }
    }
}
let coins=[];
var game=[
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],

];
let pacman={
    x:Math.floor(Math.random()*9)+1,
    y:Math.floor(Math.random()*9)+1,
    dir:'pacman-right'
}
game[pacman.x][pacman.y]=4;
spawn()
function spawn(){
    for(let i=1;i<game.length-1;i++){
        for(let j=1;j<game.length-1;j++){
            let cr=Math.floor(Math.random()*10);
            if(cr<=3&&game[i][j]!=4){
                game[i][j]=2;
                coins.push(new coin(i,j))
            }
            else if(cr<=6&&game[i][j]!=4){
                game[i][j]=3;
            }
            else if(cr<=10&&game[i][j]!=4){
                game[i][j]=1;
            }
        }
    }
    for(let i=0;i<coins.length;i++){
        coins[i].selfchk();
    }
    let flags=[game[pacman.x-1][pacman.y],game[pacman.x-1][pacman.y+1],game[pacman.x-1][pacman.y-1],game[pacman.x][pacman.y-1],game[pacman.x][pacman.y+1],game[pacman.x+1][pacman.y],game[pacman.x+1][pacman.y+1],game[pacman.x+1][pacman.y-1]]
    while(flags.every((e)=>e==1)){
        spawn()
        flags=[game[pacman.x-1][pacman.y]==1,game[pacman.x-1][pacman.y+1]==1,game[pacman.x-1][pacman.y-1]==1,game[pacman.x][pacman.y-1]==1,game[pacman.x][pacman.y+1]==1,game[pacman.x+1][pacman.y],game[pacman.x+1][pacman.y+1],game[pacman.x+1][pacman.y-1]]
    }
}
function draw(){
    var html = "";
    var gameMap = document.getElementById("game");
    for(var i = 0;i < game.length; i++){
        for(var j = 0;j < game[i].length; j++){
            if (game[i][j] === 1){
                html += "<div class='wall'></div>";
            }else if(game[i][j] === 2){
                html += "<div class='coin'></div>";
            }else if(game[i][j] === 3){
                html += "<div class='bg'></div>";
            }else if(game[i][j] === 4){
                html += "<div class='pacman'></div>";
            }
        }
        html += "</br>";
    }
    gameMap.innerHTML = html
}
draw();

document.onkeydown = function (event){
    if (event.code === "ArrowRight"){
        pacman.dir = "pacman-right";
        if (game[pacman.x][pacman.y + 1] !== 1){
            game[pacman.x][pacman.y] = 3;
            pacman.y += 1;
            game[pacman.x][pacman.y] = 4;
            draw();
            document.getElementsByClassName("pacman")[0].style.backgroundImage = "url('../期末報告/image/pcaman.png')"
        }
    }else if (event.code === "ArrowLeft"){
        pacman.dir = "pacman-left";
        if (game[pacman.x][pacman.y - 1] !== 1){
            game[pacman.x][pacman.y] = 3;
            pacman.y -= 1;
            game[pacman.x][pacman.y] = 4;
            draw();
            document.getElementsByClassName("pacman")[0].style.backgroundImage = "url('../期末報告/image/pcaman-left.png')"
        }
    }else if (event.code === "ArrowUp"){
        pacman.dir = "pacman-up";
        if (game[pacman.x -1][pacman.y] !== 1){
            game[pacman.x][pacman.y] = 3;
            pacman.x -= 1;
            game[pacman.x][pacman.y] = 4;
            draw();
            document.getElementsByClassName("pacman")[0].style.backgroundImage = "url('../期末報告/image/pcaman-up.png')"
        } 
    }else if (event.code === "ArrowDown"){
        pacman.dir = "pacman-down";
        if (game[pacman.x +1][pacman.y] !== 1){
            game[pacman.x][pacman.y] = 3;
            pacman.x += 1;
            game[pacman.x][pacman.y] = 4;
            draw();
            document.getElementsByClassName("pacman")[0].style.backgroundImage = "url('../期末報告/image/pcaman-down.png')"
        } 
    }
    
}
