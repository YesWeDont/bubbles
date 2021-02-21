const canvas=document.getElementById("canvas");
const x=canvas.clientWidth;
const y=canvas.clientHeight;
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
    this.position=coord||[(Math.random()*1080),(Math.random()*720)]
    this.r=r||(5+5*Math.random());
    this.s=s||[(Math.random()-0.5)*10,(Math.random()-0.5)*10];
    this.color=color;
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
    this.position=[(Math.random()*1080),(Math.random()*720)]
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
    this.ctx.font = '20px serif';
    this.fps=fps||60;
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
    if(this.finished) return;

    dt=Date.now()-curr;
    fps=Math.round(1000/dt);
    //console.log(fps);

    this.ctx.clearRect(0,0,x+10,y+10)
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
    if(this.finished){
        console.log("f in chat")
        return;
    }
    this.score.innerHTML=parseInt(this.score.innerHTML)+1
    var self=this;
    if(Math.random()<(1/30)&&(this.bubbles.length<20))manager.spawn(20,1)
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
    var i=0;
    var spawndistance=spawndistance||20
    const b=new Bubble(this.player.position,(spawndistance+this.player.r),[0,0],"");
    //console.log("before")
    while(i<amount){
        let temp=new Bubble(0,10,0,"red",b);
        //console.log(temp);
        this.bubbles.push(temp)
        i++;
    }
    var self=this;
    setInterval(()=>{self.update.bind(self)()},1000)
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
}
const player=new Bubble([x/2,y/2],false,[0,0],"green");
const points=document.getElementById("score");
const manager=new Manager(player,canvas.getContext("2d"),points);
manager.spawn(5,5);
manager.bindKeys();
manager.update();