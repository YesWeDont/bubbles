//By @YesWeDont, under the MIT licence
//bubbles system

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
    this.r=r||Math.max(( Bubble.prototype._radius*0.2 + Bubble.prototype._radius*Math.random()*0.8 ),5);
    this.s=s||[(Math.random()-0.5)*Bubble.prototype._speed,(Math.random()-0.5)*Bubble.prototype._speed];
    this.color=color||(Math.random()<0.1?"blue":(Math.random()<0.1?"purple":"red"));
    if(this.color==="green"){
        this.s=[0,0]
        return this;
    }
    if(avoid instanceof Bubble){
        while(this.distance(avoid)<avoidDist){
            this.reposition();
        }
    }
    if(this.color==="blue"){
        this.s[1]=0;
        if(this.s[0]>0){
            this.position[0]=0
        }else{
            this.position[0]=x
        }
        return this;
    }
    if(this.color==="purple"){
        this.s[0]=0;
        if(this.s[1]>0){
            this.position[1]=0
        }else{
            this.position[1]=y
        }
        return this
    }
}


Bubble.prototype._radius=10
Bubble.prototype._speed=5


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
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.position[0],this.position[1],this.r,0,2*Math.PI,false);
    ctx.fill();
}