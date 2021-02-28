const canvas=document.getElementById("canvas");
canvas.style.height=innerHeight+"px";
canvas.style.width=innerWidth+"px";
const x=innerWidth;
const y=innerHeight;
var curr=Date.now();
/**
 * @constructor
 * @description Bubble constructor
* @param {Number[]} coord - Coordinates of bubble in [x,y]
* @param {Number} r - Radius of bubble, default 5-10
* @param {Number[]} s - [x,y] Components of spped, default Ran[10,10]
* @param {String} color - colour on render
* @param {Bubble} avoid - Circle of unspwawned-ness: [x,y,r]
*/
function Bubble(coord,r,s,color,avoid){
    this.position=coord||[(Math.random()*x),(Math.random()*y)]
    this.r=r||(5+5*Math.random());
    this.s=s||[(Math.random()-0.5)*5,(Math.random()-0.5)*5];
    this.color=color||"red";
    if(!avoid) return this
    if(avoid instanceof Bubble){
        while(this.collide(avoid)){
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
    this.position[0]+=(this.s[0]*(speedMultiplier));
    this.position[1]+=(this.s[1]*(speedMultiplier));
    this.render(ctx);
}
/**
 * Render the bubble
 * @param {CanvasRenderingContext2D} ctx - Context to render on
 */
Bubble.prototype.render=function render(ctx){
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
function Manager(player,ctx,score,fps){
    this.bubbles=[];
    this.player=player;
    this.ctx=ctx;
    this.finished=false;
    this.score=score;
    this.score.hidden=true;
    this.ctx.font = '60px Comic Sans MS';
    this.fps=fps||60;
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
    if(this.score.innerHTML>1000){
        this.ctx.fillStyle="blue"
        this.ctx.fillRect(0,0,x,y)
        this.ctx.fillStyle="black";
        this.ctx.font="60px Comic Sans MS"
        this.ctx.fillText("GG! You win! CTRL+R to play again",0,60)
        return;
    }
    if(this.finished){
        this.ctx.fillStyle="red"
        this.ctx.fillRect(0,0,x,y)
        this.ctx.fillStyle="white";
        this.ctx.font="60px Comic Sans MS"
        this.ctx.fillText("NOOB! You lose. CTRL+R to play again",0,60)
        return;
    }

    dt=Date.now()-curr;
    fps=Math.round(1000/dt);
    //console.log(fps);

    this.ctx.clearRect(0,0,x+10,y+10)
    this.ctx.strokeRect(0,0,x,y)
    this.player.update(this.ctx,(this.fps/fps));
    
    this.player.position[0]+=x;
    this.player.position[1]+=y
    this.player.position[0]%=x
    this.player.position[1]%=y
    ;
    this.bubbles.forEach(i=>i.update(this.ctx,this.fps/fps));
    this.bubbles=this.bubbles.filter(i=>{
        if((i.position[0]<0)||(i.position[1]<0)) return false;
        if((i.position[0]>x)||(i.position[1]>y)) return false;
        return true;
    })
    if(this.bubbles.map(i=>i.collide(this.player)).indexOf(true)>=0) this.finished=true
    this.score.innerHTML=parseInt(this.score.innerHTML)+1
    var self=this;
    manager.spawn(100,75);
    this.ctx.fillText(`FPS: ${fps}`,0,20);
    this.ctx.fillText(`Score:${this.score.innerHTML}`,0,40)
    this.ctx.fillText(`Bubble Count:${this.bubbles.length}`,0,60);
    this.ctx.fillText(`dT:${dt} ms`,0,80);
    

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
    const b=new Bubble(this.player.position,(spawndistance+this.player.r),[0,0],"");
    //console.log("before")
    while(this.bubbles.length<amount){
        let temp=new Bubble(0,10,0,"red",b);
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
    //
        this.ctx.canvas.onmousemove=(e)=>{
            let movementMultiplier=Math.random()
            this.player.s[0]=e.movementX*movementMultiplier
            this.player.s[1]=e.movementY*movementMultiplier
        }
    //}
}
const player=new Bubble([x/2,y/2],false,[0,0],"green");
const points=document.getElementById("score");
const manager=new Manager(player,canvas.getContext("2d"),points);
//manager.spawn(5,5);
//manager.bindKeys();
canvas.onclick=()=>{
    manager.update();
    manager.bindKeys();
    canvas.requestPointerLock();
}