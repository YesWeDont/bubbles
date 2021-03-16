//By @YesWeDont, under the MIT licence
//bubbles system
class Bubble{
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
    constructor(coord,r,s,color,avoid,avoidDist){
        this.position=coord||[(Math.random()*x),(Math.random()*y)]
        this.r=r||Math.max(( Bubble._radius*0.2 + Bubble._radius*Math.random()*0.8 ),5);
        this.s=s||[(Math.random()-0.5)*Bubble._speed,(Math.random()-0.5)*Bubble._speed];
        this.color=color||(Math.random()<0.1?"blue":(Math.random()<0.1?"purple":"red"));
        this.dead=false;
        if(color==="green"){
            this.s=[0,0]
        }
        if(avoid instanceof Bubble){
            while(this.distance(avoid)<avoidDist){
                this.reposition();
            }
        }
        if(color==="blue"){
            this.s[1]=0;
            if(this.s[0]>0){
               this.position[0]=0
            }else{
                this.position[0]=x
            }
        }
        if(color==="purple"){
            this.s[0]=0;
            if(this.s[1]>0){
                this.position[1]=0
            }else{
                this.position[1]=y
            }
        }
    }
    static _radius=10
    static _speed=5
    /**
     * Collision testing
     * @param {Bubble} that - The bubble for collison testing
     * @returns {Boolean}
     */
    collide(that){
        return this.distance(that)<(this.r+that.r)
    }
    /**
     * Repositions bubble
     */
    reposition(){
        this.position=[(Math.random()*x),(Math.random()*y)];
        console.log("repos")
    }
    /**
     * Distance between centres of bubbles
     * @param {Bubble} that - The bubble for dist. measuring
     * @returns {Number}
     */
    distance(that){
        //console.log(`This:${this.position}; that:${that.position}`)
        var xdist=this.position[0]-that.position[0],
        ydist=this.position[1]-that.position[1];
    return Math.hypot(xdist,ydist)
    }
    /**
     * Update position and calls render()
     * @param {CanvasRenderingContext2D} ctx - Context for rendering
     * @param {Number} speedMultiplier - SpeedMultiplier to accommadate for FPS change
     * @returns {void}
     */
    update(ctx,speedMultiplier){
        if(this.color==="blue") speedMultiplier*=2
        this.position[0]+=(this.s[0]*(speedMultiplier));
        this.position[1]+=(this.s[1]*(speedMultiplier));
        this.render(ctx);
    }
    /**
     * Render the bubble
     * @param {CanvasRenderingContext2D} ctx - Context to render on
     */
    render(ctx){
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(this.position[0],this.position[1],this.r,0,2*Math.PI,false);
        ctx.fill();
    }
}


class EffectBubble extends Bubble{
    constructor(){
        super(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]||false,arguments[5]||0)
        //0.3percent effect stuff
        if(Math.random()<0.5){
            if(!(this.color==="blue"||this.color==="purple")){
                console.log(this.color)
                let rng=Math.random();
                if(rng<0.3){
                    //30 percent of yellow
                    this.color="yellow"
                }else if(rng<0.7){
                    //40 percent of black
                    this.color="black"
                }else{
                    this.color="white"
                }
            }
        }
    }
    applyEffect(list){
        //list format: [speed,radius]
        let effects={
            white:()=>{
                return [2,1]
            },
            black:(effects)=>{
                return [effects[0]*0.6,effects[1]]
            },
            yellow:(effects)=>{
                return [(effects[0]*1.2),(effects[1])]
            },
            blue:(effects)=>{
                return [effects[0],effects[1]*0.6]
            }
        }
        if(!(this.color in effects)) return list
        console.log(this.color)
        return effects[this.color](list);
    }
}