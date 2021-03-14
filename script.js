"use strict";


const canvas=document.getElementById("canvas");
canvas.height=innerHeight;
canvas.width=innerWidth;
const x=innerWidth;
const y=innerHeight;
var curr=Date.now();
const ctx=canvas.getContext("2d");
let fps=60;
/**
 * @constructor
 * @description Bubble constructor
* @param {Number[]} coord - Coordinates of bubble in [x,y]
* @param {Number} r - Radius of bubble, default 5-10
* @param {Number[]} s - [x,y] Components of spped, default Ran[10,10]
* @param {String} color - colour on render
* @param {Bubble} avoid - Circle of unspwawned-ness: [x,y]
* @param {Number} avoidDist radius of unspwnedness
*/
function Bubble(coord,r,s,color,avoid,avoidDist){
    this.position=coord||[(Math.random()*x),(Math.random()*y)]
    this.r=r||(5+5*Math.random());
    this.s=s||[(Math.random()-0.4)*5,(Math.random()-0.4)*5];
    this.color=color||(Math.random()<0.1?"blue":(Math.random()<0.1?"purple":"red"));
    if(this.color==="green"){
        this.s=[0,0]
        return this;
    }
    /*if(this.color==="blue"){
        this.s[1]=0;
        if(this.s[0]>0){
            this.position[0]=0
        }else{
            this.position[0]=x
        }
    }else if(this.color==="purple"){
        this.s[0]=0;
        if(this.s[1]>0){
            this.position[1]=0
        }else{
            this.position[1]=y
        }
    }*/
    if(!avoid) return this
    if(avoid instanceof Bubble){
        while(this.distance(avoid)<avoidDist){
            this.reposition();
        }
    }
}
/**
 * Collision testing
 * @param {Bubble} that - The bubble for collison testing
 * @returns {Boolean}
 */
Bubble.prototype.collide= function collide(that){
    return this.distance(that)<(this.r+that.r)
}
/**
 * Repositions bubble
 */
Bubble.prototype.reposition= function reposition(){
    this.position=[(Math.random()*x),(Math.random()*y)];
    console.log("repos")
}
/**
 * Distance between centres of bubbles
 * @param {Bubble} that - The bubble for dist. measuring
 * @returns {Number}
 */
Bubble.prototype.distance=function distance(that){
    //console.log(`This:${this.position}; that:${that.position}`)
    var xdist=Math.pow(this.position[0]-that.position[0],2),
    ydist=Math.pow(this.position[1]-that.position[1],2);
    return Math.sqrt(xdist+ydist)
}
/**
 * Update position and calls render()
 * @param {CanvasRenderingContext2D} ctx - Context for rendering
 * @param {Number} speedMultiplier - SpeedMultiplier to accommadate for FPS change
 * @returns {void}
 */
Bubble.prototype.update=function update(ctx,speedMultiplier){
    if(this.color==="blue") speedMultiplier*=2
    this.position[0]+=(this.s[0]*(speedMultiplier));
    this.position[1]+=(this.s[1]*(speedMultiplier));
    this.render(ctx);
}
/**
 * Render the bubble
 * @param {CanvasRenderingContext2D} ctx - Context to render on
 */
Bubble.prototype.render=function render(ctx){
    if(this.color==="green") console.log("boooo")
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.position[0],this.position[1],this.r,0,2*Math.PI,false);
    ctx.fill();
}
/**
 * @constructor
 * @param {Bubble} player - Player object
 * @param {CanvasRenderingContext2D} ctx - Render players
 * @param {HTMLParagraphElement} score - <p> for saving the score
 * @param {Number} fps - Max fps, default 60
 */
function Manager(player,ctx,fps){
    this.bubbles=[];
    this.player=player;
    this.ctx=ctx;
    this.finished=false;
    this.score=0;
    this.ctx.font = '60px Comic Sans MS';
    this.fps=fps||60;
    this._dt=1/60


    ctx.fillStyle="purple";
    ctx.fillRect(0,0,x,y)
    ctx.fillStyle="blue"
    ctx.arc(x/2,y/2,4,0,2*Math.PI)
    ctx.fillStyle="yellow";
    ctx.fillText(`${x}*${y}`,(x/2-400),(y/2-60));
    this.ctx.font="20px Comic Sans MS"
}
/**
 * Adds bubble to list
 * @param {Bubble} b - New bubble to be pushed
 * @returns {void}
 */
Manager.prototype.add=function add(b){
    this.bubbles.push(b);
    return b;
}
/**
 * Updates all bubbles, requests new animation frame
 * @returns {void}
 */
Manager.prototype.update=function update(){
    if(this.score>100000){
        this.ctx.fillStyle="blue"
        this.ctx.fillRect(0,0,x,y)
        this.ctx.fillStyle="black";
        this.ctx.font="60px Comic Sans MS"
        this.ctx.fillText("GG! You win! CTRL+R to play again",0,60)
        this.ctx.fillText("Score: "+this.score,0,120)
        document.exitPointerLock();
        this.bindReload()
        return;
    }
    if(this.finished){
        this.ctx.fillStyle="red"
        this.ctx.fillRect(0,0,x,y)
        this.ctx.fillStyle="white";
        this.ctx.font="60px Comic Sans MS"
        document.exitPointerLock();
        this.ctx.fillText("NOOB! You lose. CTRL+R to play again",0,60);
        this.ctx.fillText("Score: "+this.score,0,120)
        this.bindReload()
        return;
    }



    this.player.render(this.ctx)


    this._dt=Date.now()-curr;
    fps=Math.round(1000/this._dt);

    this.ctx.clearRect(0,0,x+10,y+10)
    this.ctx.strokeRect(0,0,x,y)
    this.player.r*=1.002
    
    //console.log(`b4: ${this.player.position}`)
    this.player.position[0]%=x;
    this.player.position[1]%=y;
    if(this.player.position[0]<0) this.player.position[0]=x+this.player.position
    if(this.player.position[1]<0) this.player.position[1]=y+this.player.position
    //console.log(`after: ${this.player.position}`)


    this.bubbles.forEach(i=>i.update(this.ctx,this.fps/fps));
    this.bubbles=this.bubbles.filter(i=>{
        if((i.position[0]<0)||(i.position[1]<0)) return false;
        if((i.position[0]>x)||(i.position[1]>y)) return false;
        return true;
    })
    this.bubbles=this.bubbles.filter((bubble)=>{
        if(player.collide(bubble)){
            if(bubble.color==="red"&&this.score>50) this.finished=true;
            else if(bubble.color==="blue") {
                this.player.r=Math.max(10,this.player.r*0.8)
            }else if(bubble.color==="purple"){
                this.score=Math.floor(this.score*1.05)
            }
            return false;
        }
        return true;
    })
    this.score++;



    var self=this;
    manager.spawn(100,100);
    this.ctx.fillText(`Score:${this.score}`,0,40)
    this.ctx.fillText(`Bubble Count:${this.bubbles.length}`,0,60);
    

    curr=Date.now();
    requestAnimationFrame(()=>{self.update.bind(self)()});
}
/**
 * Spawns bubble
 * @param {Number} spawndistance - Dist. from player
 * @default 20
 * @param {Number} amount - Amount of dots spawned
 * @returns {void}
 */
Manager.prototype.spawn=function(spawndistance,amount){
    var spawndistance=spawndistance||20
    const b=new Bubble(this.player.position,player.r,[0,0],false);
    //console.log("before")
    while(this.bubbles.length<amount){
        let temp=new Bubble(0,10,0,false,b,spawndistance);
        //console.log(temp);
        this.bubbles.push(temp)
        //i++;
    }
    var self=this;
}
/**
 * Binds keys for Manager.player
 */
Manager.prototype.bindKeys=function bindKeys(){
    document.onkeydown=((e)=>{
        console.log("keydown")
        if(e.key==="ArrowRight") this.player.s[0]+=5;
        if(e.key==="ArrowLeft") this.player.s[0]-=5;
        if(e.key==="ArrowUp") this.player.s[1]-=5;
        if(e.key==="ArrowDown") this.player.s[1]+=5;
    })
    document.onkeyup=()=>{
        this.player.s=[0,0]
    }
    this.ctx.canvas.onmousemove=(e)=>{
        console.log("mooooo")
        this.player.position[0]+=e.movementX/2
        this.player.position[1]+=e.movementY/2
    }
}
Manager.prototype.bindReload=function bindReload(){
    document.addEventListener("click",()=>{
        let a=document.createElement("a");
        a.href=window.location.href;
        a.click();
    })
}
const player=new Bubble([0,0],false,[0,0],"green");
const manager=new Manager(player,canvas.getContext("2d"));
//manager.spawn(5,5);
//manager.bindKeys();
canvas.addEventListener("click",(e)=>{
    manager.update();
    manager.bindKeys();
    manager.player.position=[e.pageX,e.pageY]
    canvas.requestPointerLock();
})
setInterval(()=>{
    ctx.fillText(`FPS: ${fps}`,0,innerHeight);
},1000)