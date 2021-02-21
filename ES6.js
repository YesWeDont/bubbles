class Bubble{
    constructor(coords=[0,0],speed,r,colour){
        this.pos=coords;
        this.speed=speed||[(Math.random()-0.5)*20,(Math.random()-0.5)*20];
        this.r=r||(5+Math.random()*5);
        this.colour=colour;
    }
    draw(ctx){
        ctx.fillStyle=this.colour;
        ctx.beginPath();
        ctx.arc(this.pos[0],this.pos[1],this.r,0,2*Math.PI);
        cts.fill();
    }
    updatePos(dT){
        this.pos[0]+=this.speed[0]*dT/1000;
        this.pos[1]+=this.speed[1]*dT/1000;
    }
    distanceTo(that){
        Math.hypot((this.pos[0]-that.pos[0]),(this.pos[1]-that.pos[1]));
    }
    collide(that){
        return this.distanceTo(that)<(this.r+that.r)
    }
}
class Manager{
    constructor(player,ctx){
        this.player=player;
        this.ctx=ctx;
        this.bubbles=[];
        this.lastRender=Date.now()
    }
    drawAll(){
        this.bubbles.forEach(i=>i.draw(ctx));
    }
    updateAll(){
        this.bubbles.forEach(i=>{i.updatePos(Date.now()-this.lastRender)});
        this.drawAll();
        this.populate();
        this.bubbles=this.bubbles.filter(i=>{
            if((i.pos[0]<0)||(i.pos[1]<0)) return false;
        })
        this.lastRender=Date.now();
        requestAnimationFrame(()=>this.updateAll())
        //this.bubbles.map(i=>)
    }
    populate(){
        for(let i=0;i<(20-this.bubbles.length);i++){
            let b=new Bubble(0,0,0,"red");
            while(this.player.distanceTo(b)<20) b=new Bubble(0,0,0,"red");
            this.bubbles.push(b)
        }
    }
}
const canvas=document.querySelector("canvas");
canvas.style.height="100vh";
canvas.style.width="100vw";
const x=canvas.clientWidth;
const y