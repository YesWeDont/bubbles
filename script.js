"use strict";


const canvas=document.getElementById("canvas");
canvas.height=innerHeight;
canvas.width=innerWidth;
const x=innerWidth;
const y=innerHeight;
var curr=Date.now();
const ctx=canvas.getContext("2d");
let fps=60;
const fpsElement=document.querySelector("#fps")

const player=new Bubble([x/2,y/2],10,[0,0],"green");
Bubble.prototype._playerRadius=player.r
const manager=new Manager(player,canvas.getContext("2d"));
//manager.spawn(5,5);
//manager.bindKeys();

document.addEventListener("keydown",(e)=>{
    if(!isNaN(parseInt(e.key))){
        manager.difficulty=parseInt(e.key)
        if(manager.difficulty===0) manager.difficulty=1
        ctx.fillStyle="purple"
        ctx.fillRect(0,0,x,y);
        ctx.fillStyle="yellow"
        canvas.onclick=(e)=>{
            canvas.requestPointerLock()
            if(!manager.difficulty) return;
            manager.update();
            manager.bindKeys();
            manager.player.position=[e.pageX,e.pageY]
        }
        showTextSequence(ctx,["Avoid Red Bubbles","Blue Bubbles shrink you; You get larger and larger over time","Purple Bubbles add more points","Click to start"]);
    }
})
function showTextSequence(ctx,text){
    let i=0;
    let original=ctx.canvas.onclick;
    console.log(original)
    ctx.canvas.onclick= ()=>{
        if(i===text.length){
            console.log("exit")
            ctx.canvas.onclick=original
            return;
        }
        console.log("init text "+text[i])
        ctx.fillStyle="purple"
        ctx.fillRect(0,0,x,y)
        ctx.fillStyle="yellow"
        ctx.fillText(text[i],x/2-400,y/2,800);
        i++;
    }
}
setInterval(()=>{
    if(fps===Infinity) fps=1000
    fpsElement.innerHTML=`FPS: ${fps}`
},500)