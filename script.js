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

const manager=new Manager(player,canvas.getContext("2d"),document.getElementById("score"));
//startup mgr
//derep
/*document.addEventListener("keydown",(e)=>{
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
        showTextSequence(ctx,["Use arrow keys/mouse to move     Click to continue","Avoid Red Bubbles","Blue Bubbles shrink you; You get larger and larger over time","Purple Bubbles add more points","You have invunerability for the first 2 seconds","Click to start"]);
    }
})*/
let layoutDiv=document.createElement("div");
layoutDiv.classList.add("fill")
let center=document.createElement("div");
center.classList.add("center")
layoutDiv.appendChild(center)
let title=document.createElement("h1")
title.innerHTML="Select Difficulty"
layoutDiv.appendChild(title)
document.body.appendChild(layoutDiv)
let temp =["Easy","Medium","Hard"];
temp.forEach((value,i)=>{
    let button=document.createElement("button");
    button.innerHTML=value;
    button.onclick=()=>{
        manager.difficulty=i;
        while(center.firstElementChild?.tagName==="BUTTON"){
            center.removeChild(center.firstElementChild)
        }
        //layoutDiv.hidden=true;
        let text=["Use arrow keys/mouse to move     Click to continue","Avoid Red Bubbles","Blue Bubbles shrink you; You get larger and larger over time","Purple Bubbles add more points","You have invunerability for the first 2 seconds","Click to start"];
        showTextSequence(layoutDiv,text,{
            backgroundColor:"grey",
            color:"white"
        },function divClickHandler(){
            layoutDiv.hidden=true;
            manager.bindKeys()
            manager.update();
        });
    }
    center.appendChild(button);
});

function showTextSequence(div,text,styleOptions,next){
    let i=0;
    div.style=styleOptions
    div.onclick= ()=>{
        if(i===text.length){
            console.log("exit")
            canvas.requestPointerLock();
            next()
            return;
        }
        else div.innerHTML=`<h1>${text[i]}</h1>`
        i++;
    }
}
setInterval(()=>{
    if(fps===Infinity) fps=1000
    fpsElement.innerHTML=`FPS: ${fps}\nBubble Count:${manager.bubbles.length}`
},500)