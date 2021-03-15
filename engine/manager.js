
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
    this._dt=1/60;
    this._frame=0;
    this.difficulty=0;


    ctx.fillStyle="purple";
    ctx.fillRect(0,0,x,y)
    ctx.fillStyle="blue"
    ctx.arc(x/2,y/2,4,0,2*Math.PI)
    ctx.fillStyle="yellow";
    ctx.fillText(`Hit a number key to choose difficulty`,(x/2-600),(y/2-60),x);
    console.log(`${x}*${y}`)
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
    if(this.score>30000){
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



    this._dt=Date.now()-curr;
    fps=Math.round(1000/this._dt);

    this.ctx.clearRect(0,0,x+10,y+10)
    this.ctx.strokeRect(0,0,x,y)


    this.player.r*=1+0.0004*this.difficulty
    Bubble.prototype._radius*=1+0.0001*this.difficulty
    Bubble.prototype._speed*=1+0.00016*this.difficulty
    this.player.update(this.ctx,this._dt)
    
    //console.log(`b4: ${this.player.position}`)
    this.player.position[0]%=x;
    this.player.position[1]%=y;
    if(this.player.position[0]<0) this.player.position[0]=x+this.player.position[0]
    if(this.player.position[1]<0) this.player.position[1]=y+this.player.position[1]
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
                this.player.r=Math.max(Bubble.prototype._playerRadius,this.player.r*0.6)
            }else if(bubble.color==="purple"){
                this.score=Math.floor(this.score*1.05)
            }
            return false;
        }
        return true;
    })
    this.score++;

    fpsElement.style.color=this.ctx.fillStyle;

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
    //console.log("before")
    while(this.bubbles.length<amount){
        let temp=new Bubble(false,false,false,false,this.player,spawndistance);
        //console.log(temp);
        this.bubbles.push(temp)
        //i++;
    }
}
/**
 * Binds keys for Manager.player
 */
Manager.prototype.bindKeys=function bindKeys(){
    document.onkeydown=((e)=>{
        console.log(this.player.position)
        if(e.key==="ArrowRight") this.player.s[0]+=0.5;
        if(e.key==="ArrowLeft") this.player.s[0]-=0.5;
        if(e.key==="ArrowUp") this.player.s[1]-=0.5;
        if(e.key==="ArrowDown") this.player.s[1]+=0.5;
    })
    document.onkeyup=()=>{
        this.player.s=[0,0]
    }
    onmousemove=(e)=>{
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