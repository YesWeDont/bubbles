const canvas=document.getElementById("canvas");
const x=canvas.clientWidth;
const y=canvas.clientHeight;
if([]) console.log("[] is true")
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
    this.s=s||[Math.random()*10,Math.random()*10];
    this.color=color;
    if(avoid instanceof Bubble){
        while(this.collide(avoid)){
            this.reposition();
            console.log("failed")
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
Bubble.prototype.reposition= function reposition(){
    this.position=[(Math.random()*1080),(Math.random()*720)]
}
/**
 * Distance between centres of bubbles
 * @param {Bubble} that - The bubble for dist. measuring
 * @returns {Number}
 */
Bubble.prototype.distance=function distance(that){
    return Math.sqrt((this.position[0]-that.position[0])^2+(this.position[1]-that.position[1])^2)
}
/**
 * Update position and calls render()
 * @param {CanvasRenderingContext2D} ctx - Context for rendering
 * @returns {void}
 */
Bubble.prototype.update=function update(ctx){
    this.position[0]+=this.s[0];
    this.position[1]+=this.s[1];
    this.render(ctx);
}
/**
 * Render the bubble
 * @param {CanvasRenderingContext2D} ctx - Context to render on
 */
Bubble.prototype.render=function render(ctx){
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false);
    ctx.fill();
}
/**
 * @constructor
 * @param {Bubble} player - Player object
 * @param {CanvasRenderingContext2D} ctx - Render players
 */
function Manager(player,ctx){
    this.bubbles=[];
    this.player=player;
    this.ctx=ctx;
    this.finished=false;
    document.onkeydown=(e)=>{
        if(e.key==="ArrowRight") this.player.s.x+=5;
        if(e.key==="ArrowLeft") this.player.s.x-=5;
        if(e.key==="ArrowUp") this.player.y-=5;
        if(e.key==="ArrowDown") this.player.y+=5;
    }
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
    this.player.update(this.ctx);
    this.bubbles.forEach((i,index)=>{
        i.update(this.ctx);
        if(((i.x>x)||(i.y>y))||((i.x<0)||(i.y<0))) this.bubbles.splice(index)
    });
    this.bubbles.forEach((i)=>{
        if(this.player.collide(i)){
            this.finished=true;
        } 
    });
    if(this.finished){
        console.log("f in chat")
        return;
    }
    this.update();
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
    console.log("before")
    while(i<amount){
        this.bubbles.push(new Bubble([],0,[],"red",b))
        console.log("after");
        i++;
    }
}
const player=new Bubble(x/2,y/2,false,false,"green")
const manager=new Manager(player,canvas.getContext("2d"));
manager.spawn(5,5)
manager.update();