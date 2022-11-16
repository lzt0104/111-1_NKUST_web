//環境變數
var updateFPS = 30
var showMouse = true
var time = 0
var bgColor ="black"

//控制
var controls = {
  value: 0
}
var gui = new dat.GUI()
gui.add(controls,"value",-2,2).step(0.01).onChange(function(value){})

document.getElementById('musicBg').play()
document.getElementById('musicBg').volume=0.5
document.getElementById('transmiting').volume=0.2
document.getElementById('step').volume=0.3
document.getElementById('musicBg').addEventListener('ended', function(){
this.currentTime = 0;
this.play();
}, false);

//------------------------
// Vec2

class Vec2{
  constructor(x,y){
    this.x = x
    this.y = y
  }
  set(x,y){
    this.x =x
    this.y =y
  }
  move(x,y){
    this.x+=x
    this.y+=y
  }
  add(v){
    return new Vec2(this.x+v.x,this.y+v.y)
  }
  sub(v){
    return new Vec2(this.x-v.x,this.y-v.y)
  }
  mul(s){
    return new Vec2(this.x*s,this.y*s)
  }
  get length(){
    return Math.sqrt(this.x*this.x+this.y*this.y)
  }
  set length(nv){
    let temp = this.unit.mul(nv)
    this.set(temp.x,temp.y)
  }
  clone(){
    return new Vec2(this.x,this.y)
  }
  toString(){
    return `(${this.x}, ${this.y})`
  }
  equal(v){
    return this.x==v.x && this.y ==v.y
  }
  get angle(){
    return Math.atan2(this.y,this.x)  
  }
  get unit(){
    return this.mul(1/this.length)
  }
  
}

//------
var canvas = document.getElementById("mycanvas")
var ctx = canvas.getContext("2d")
ctx.circle= function(v,r){
  this.arc(v.x,v.y,r,0,Math.PI*2)
}
ctx.line= function(v1,v2){
  this.moveTo(v1.x,v1.y)
  this.lineTo(v2.x,v2.y)
}

function playSound(id){
  
  document.getElementById(id).currentTime=0
  document.getElementById(id).play()
}

//遊戲物件
class Game{
  constructor(){
    this.player = null
    this.walls = []
    this.width = 700
    this.height = wh
    this.walltypes = [
      "normal","jump","slideLeft","slideRight",
      "hurt","fade"
    ]
    this.hurt=0
    this.playing=false
    this.keystatus = {
      left: false,
      right: false,
      up: false,
      down: false,
    }
    this.time=0
  }
  init(){
    //初始化先推一些牆壁進去
    this.walls=[]
    for(var i=0;i<wh/150;i++){
      this.walls.push(new Wall({
        p: new Vec2(Math.random()*this.width,i*150+100),
        type:  this.walltypes[parseInt(Math.random()*this.walltypes.length)]
      })) 
    }
    this.player = new Player({
      p: new Vec2(ww/2,200)
    })    
  }
  start(){
    
document.getElementById('musicBg').play()
    $("button").hide()
    this.init()
    this.playing=true
    this.time=0
  }
  end(){
    $("button").show()
    playSound('dead')  
    this.playing=false
  
  }
  update(){
    this.time++
    //更新玩家跟左右走
    this.player.update()
    if (this.keystatus.left){
      this.player.p.x-=8
    }
    if (this.keystatus.right){
      this.player.p.x+=8
    }
    
    //推入新的地板
    if (time%20==0){
      this.walls.push(new Wall({
        p: new Vec2(Math.random()*this.width,this.height),
        type:  this.walltypes[parseInt(Math.random()*this.walltypes.length)]
      }))
    }
    
    let touching = false
    //處理地板跟人的碰撞
    this.walls.forEach(wall=>{  
      wall.update() 
      if (wall.p.x-wall.width/2<this.player.p.x+this.player.width/2
          &&   wall.p.x+wall.width/2>this.player.p.x-this.player.width/2){
        if (this.player.p.y>wall.p.y 
            && this.player.p.y<wall.p.y+wall.height+10){ 
          touching=true
          wall.step(this.player)
          this.player.lastBlock=wall
        }
      }
    }) 
    
    //如果沒有任何接觸，清掉上一個接觸的紀錄
    if (!touching){
      this.player.lastBlock=null
      document.getElementById("transmiting").pause()
    }

    this.walls = this.walls.filter(wall=>wall.active)
    
    //被上面刺到
    if (this.player.p.y-this.player.height<0){
      if (this.hurt==0){   
        this.hurt=1
        this.player.bloodDelta(-4)
        this.player.v.y=2
        this.player.p.y=10
        TweenMax.to(this,0.5,{hurt: 0})
      }
    }
    
    //左右限制
    if (this.player.p.x-this.player.width/2<0){
      this.player.p.x=this.player.width/2
    }
    if (this.player.p.x+this.player.width/2>this.width){
      this.player.p.x=this.width-this.player.width/2
    }
    
    //掉到懸崖
    if (this.player.p.y>wh+this.player.height){
      game.end()
    }
  }
  draw(){
    ctx.save()
      //移動座標到遊戲左邊界
      ctx.translate(ww/2-this.width/2,0)
      let span = this.width/60
      ctx.beginPath()
      for(var i=0;i<=this.width/span;i++){
        ctx.lineTo(i*span,(i%2)*30)
      }  
      ctx.fillStyle="white"
      ctx.fill()
    
      //繪製界線
      ctx.beginPath()
      ctx.moveTo(0,0)
      ctx.lineTo(0,wh)
      ctx.moveTo(this.width,0)
      ctx.lineTo(this.width,wh)
      ctx.strokeStyle="rgba(255,255,255,0.3)"
      ctx.stroke()
    
      this.player.draw()
      this.walls.forEach(wall=>wall.draw())
    ctx.restore()
    
    //疼痛的血幕
    ctx.fillStyle="rgba(255,0,0,"+this.hurt+")"
    ctx.fillRect(0,0,ww,wh)
    
    //繪製血量
    this.player.drawBlood()
    
    //繪製血量
    ctx.fillStyle='white'
    ctx.font="50px Ariel"
    ctx.fillText( "地下："+(parseInt(this.time/100))+"階",40,100)
    ctx.font="10px Ariel"
  }
}

//玩家物件
class Player{
  constructor(args){
    let def = {
      p: new Vec2(0,0),
      v: new Vec2(0,0),
      a: new Vec2(0,1), 
      width: 40,
      height: 55,
      blood: 10,
      maxBlood: 10,
      lastBlock: null,
    }
    Object.assign(def,args)
    Object.assign(this,def)
  }
  update(){
    this.p=this.p.add(this.v)
    this.v=this.v.add(this.a)
    
  }
  draw(){
    //畫出人形狀
    ctx.beginPath()
    
    ctx.save()
      ctx.translate(this.p.x,this.p.y)
      ctx.fillStyle="#0047ba"
      ctx.fillRect(-this.width/2,-this.height,this.width,this.height)
      ctx.fillStyle="#ffdd38"

      ctx.fillRect(-5,-30,10,10)

      //左右眼
      ctx.beginPath()
      ctx.arc(-6,-40,5,0,Math.PI*2)
      ctx.arc(+6,-40,5,0,Math.PI*2)
      ctx.fillStyle="white"
      ctx.fill()

      //瞳孔
      ctx.beginPath()
      ctx.arc(-6,-40,3,0,Math.PI*2)
      ctx.arc(+6,-40,3,0,Math.PI*2)
      ctx.fillStyle="black"   
      ctx.fill()
    
    //右手
    ctx.save()
        ctx.translate(+this.width/2,-40)
        ctx.rotate(-Math.log(this.v.y/2))
        ctx.fillStyle="#416ee0"
        ctx.fillRect(0,0,8,this.height/2 )

      ctx.restore()

      //左手
      ctx.save()
        ctx.translate(-this.width/2,-40)
        ctx.rotate(Math.log(this.v.y/2))
        ctx.fillStyle="#416ee0"
        ctx.fillRect(-8,0,8,this.height/2 )

      ctx.restore()

    ctx.restore()
  }
  //畫出血量
  drawBlood(){
    for(var i=0;i<10;i++){
      ctx.fillStyle=i<this.blood?"red":"rgba(255,255,255,0.2)"
      ctx.fillRect(30+i*15+(i-1)*4,30,10,30)
    }
  }
  //扣血量的統一管理
  bloodDelta(delta){
    if (delta<0){
      playSound('hurt')
    }
    this.blood+=delta
    if (this.blood>this.maxBlood){
      this.blood=this.maxBlood
    }
    if (this.blood<=0){
      
     
      this.blood=0
      game.end()
    }
  }
}

//-----------------
//     牆壁物件
//-----------------
class Wall{
  constructor(args){
    let def = {
      p: new Vec2(0,0),
      v: new Vec2(0,-4),
      a: new Vec2(0,0),
      width: 150,
      height: 20, 
      extraHeight: 0,
      type: "normal",
      active: true
    }
    Object.assign(def,args)
    Object.assign(this,def)
  }
  update(){
    this.p=this.p.add(this.v)
    this.v=this.v.add(this.a)
    if (this.p.y<-20){
      this.active=false
    }
  }
  
  draw(){
    ctx.save()
    //移動到牆壁位置
    ctx.translate(this.p.x-this.width/2,this.p.y-this.extraHeight)
      ctx.fillStyle="white"
      ctx.fillText(this.type,0,30)
      
      if (this.type=="normal" || this.type=="hurt"){
        
        ctx.fillStyle="#888" 
        ctx.fillRect(0,0,this.width,this.height/2)
      }
    
      //受傷
      if (this.type=="hurt"){
        ctx.beginPath()
        let span = this.width/16
        for(var i=0;i<=this.width/span;i+=1){ 
          ctx.lineTo(0+i*span,-(i%2)*15)
        }
        ctx.fillStyle="#ddd" 
        ctx.fill()
      }
    
      //跳跳板
      if (this.type=="jump"){
        ctx.fillStyle="#53d337"
        ctx.fillRect(0,0,this.width,5)
        ctx.fillRect(0,this.height+this.extraHeight,this.width,5)
        
      }
      //穿透
      if (this.type=="fade"){
        ctx.fillStyle="#ffd428"
        ctx.fillRect(0,0,this.width,this.height)
        
      }
      //  左滑跟右滑
      if (this.type=="slideLeft" || this.type=="slideRight"){
        for(var i=-1;i<this.width/20;i+=1){ 
          let x = 0+i*20+(time%20)* (this.type=="slideLeft"?-1:1)
          let width = 10
          if (x<0){
            x=0
          } 
          if (x+width>this.width){
            width = this.width-x<0?0:(this.width-x)
          }
          ctx.fillStyle="red"
          ctx.save()
          //傾斜
          ctx.transform(1, 0,0.5, 1, 0, 0)
          ctx.fillRect(x ,0,width,this.height)
          ctx.restore()
        }
      }
      
    ctx.restore()
  } 
  //不同地板踩到時的影響
  step(player){
    player.v.y=0
    if (player.lastBlock!=this){
      player.bloodDelta(1) 
      if (this.type=="normal"){
        
        playSound('step')
      }
      if (this.type=="hurt"){
        
        playSound('hurt')
      }
      if (this.type=="jump"){
        
        playSound('jump')
      }
    }
    if (this.type=="normal"){
      player.p.y = this.p.y
    }
    if (this.type=="hurt"){
      player.p.y = this.p.y
      
      if (player.lastBlock!=this){
        player.bloodDelta(-4) 
        game.hurt=1
        TweenMax.to( game,0.2,{hurt: 0} )
      }
    }
    if (this.type=="jump"){
      player.v.y = -15
      this.extraHeight=10
      TweenMax.to(this,0.2,{extraHeight: 0})
    } 
    if (this.type=="slideLeft"){ 
      player.p.x-=3
      player.p.y = this.p.y
         document.getElementById("transmiting").play()
    }
    if (this.type=="slideRight"){
      player.p.x+=3
      player.p.y = this.p.y
         document.getElementById("transmiting").play()
    }
    if (this.type=="fade"){
      player.p.y-=3
      // player.p.y = this.p.y
    }
  }
  
}

function initCanvas(){
  ww = canvas.width = window.innerWidth
  wh = canvas.height = window.innerHeight
}
initCanvas()

var game = new Game

function init(){
  game.init()
  
}
function update(){
  time++
  if (game.playing){
    game.update()
  }
}
function draw(){
   //清空背景
  ctx.fillStyle=bgColor
  ctx.fillRect(0,0,ww,wh)
  
  //-------------------------
  //   在這裡繪製
  
  game.draw()
  
  //-----------------------
  //繪製滑鼠座標
  
  ctx.fillStyle="red"
  ctx.beginPath()
  ctx.circle(mousePos,2)
  ctx.fill()
   
  ctx.save()
  ctx.beginPath()
  ctx.translate(mousePos.x,mousePos.y)
    ctx.strokeStyle="red"
    let len = 20
    ctx.line(new Vec2(-len,0),new Vec2(len,0))
    ctx.line(new Vec2(0,-len),new Vec2(0,len))
    ctx.fillText(mousePos,10,-10)
    ctx.stroke()
  ctx.restore()
  
  //schedule next render

  requestAnimationFrame(draw)
}
function loaded(){
  initCanvas()
  init()
  requestAnimationFrame(draw)
  setInterval(update,1000/updateFPS)
}
window.addEventListener("load",loaded)
window.addEventListener("resize",initCanvas)

//滑鼠事件跟紀錄
var mousePos = new Vec2(0,0)
var mousePosDown = new Vec2(0,0)
var mousePosUp = new Vec2(0,0)

window.addEventListener("mousemove",mousemove)
window.addEventListener("mouseup",mouseup)
window.addEventListener("mousedown",mousedown)
function mousemove(evt){
  mousePos.set(evt.x,evt.y)
  // console.log(mousePos)
}
function mouseup(evt){
  mousePos.set(evt.x,evt.y)
  mousePosUp = mousePos.clone()
  
}
function mousedown(evt){
  mousePos.set(evt.x,evt.y)
  mousePosDown = mousePos.clone()
}

// keystatus= {}
window.addEventListener('keydown',function(evt){
  let key = evt.key.replace("Arrow","").toLowerCase()
  game.keystatus[key]=true
  // console.log(evt.key)
  // game.player.keyDown(evt.key)
})

window.addEventListener('keyup',function(evt){
  let key = evt.key.replace("Arrow","").toLowerCase()
  game.keystatus[key]=false
})