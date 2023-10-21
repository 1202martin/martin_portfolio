(()=>{
    "use strict";
    class s {
        constructor(s, i) {
            this.x = s || 0,
            this.y = i || 0
        }
        add(s) {
            return this.x += s.x,
            this.y += s.y,
            this
        }
        subtract(s) {
            return this.x -= s.x,
            this.y -= s.y,
            this
        }
        reduce(s) {
            return this.x *= s,
            this.y *= s,
            this
        }
        clone() {
            return new s(this.x,this.y)
        }
    }
    const i = Math.PI / 10
      , t = Math.PI / 72
      , h = Math.PI / 2
      , e = .05;
    class a {
        constructor(s) {
            this.createdTime = Date.now(),
            this.lifeTime = 1e3 * (20 * Math.random() + 10),
            this.pos = {
                x: 100,
                y: 100,
                w: 100,
                h: 100,
                depth: s,
                angle: Math.random() * Math.PI * 2
            },
            this.curYratio = 0,
            this.curXratio = 0,
            this.radius = 0,
            this.radius_bias = Math.random(),
            this.rotate_spd = i,
            this.mov_dir = (Math.random() - .5) * h,
            this.v = 2.5 * Math.random() + 2.5,
            this.v /= this.pos.depth + 1,
            this.vx = this.v * Math.cos(this.mov_dir),
            this.vy = this.v * Math.sin(this.mov_dir),
            this.SPD_P = Math.random() * (.01 - .0038) + .0038,
            this.scale_x = 1,
            this.scale_y = 1,
            this.scale_vx = 0,
            this.scale_vy = 0,
            this.isLoaded = {
                circle: !1,
                glow: !1
            },
            this.isFirstVisit = !0,
            this.circle = new Image,
            this.circle.src = "imgs/circle.png",
            this.circle.onload = ()=>{
                this.isLoaded.circle = !0
            }
            ,
            this.glow = new Image,
            this.glow.src = "imgs/glow.png",
            this.glow.onload = ()=>{
                this.isLoaded.glow = !0
            }
        }
        resize(s, i) {
            this.stageWidth = s,
            this.stageHeight = i,
            this.isFirstVisit ? (this.pos.y = 2.3 * i / 3,
            this.pos.x = 1.496141124586549 * i / 3 / 1.8,
            this.isFirstVisit = !1) : (this.pos.y = this.curYratio * i,
            this.pos.x = this.curXratio * i),
            this.curYratio = this.pos.y / i,
            this.curXratio = this.pos.x / i,
            this.max_radius = .05 * i,
            this.min_radius = .02 * i,
            this.radius_target = (this.radius_bias * (this.max_radius - this.min_radius) + this.min_radius) / (this.pos.depth + 1)
        }
        bounceWindow(s, i) {
            const t = this.radius
              , h = s - this.radius
              , a = this.radius
              , o = i - this.radius;
            this.pos.x <= t ? (this.vx += (t - this.pos.x) * e,
            this.vx < 0 && (this.scale_x = Math.max((this.radius - (t - this.pos.x)) / this.radius, .15),
            this.scale_y = 2 - this.scale_x)) : this.pos.x >= h ? (this.vx -= (this.pos.x - h) * e,
            this.vx > 0 && (this.scale_x = Math.max((this.radius - (this.pos.x - h)) / this.radius, .15),
            this.scale_y = 2 - this.scale_x)) : this.pos.y <= a ? (this.vy += (a - this.pos.y) * e,
            this.vy < 0 && (this.scale_y = Math.max((this.radius - (a - this.pos.y)) / this.radius, .15),
            this.scale_x = 2 - this.scale_y)) : this.pos.y >= o && (this.vy -= (this.pos.y - o) * e,
            this.vy > 0 && (this.scale_y = Math.max((this.radius - (this.pos.y - o)) / this.radius, .15),
            this.scale_x = 2 - this.scale_y))
        }
        elasticity() {
            const s = (1 - this.scale_x) * e;
            this.scale_vx += s,
            this.scale_vx *= .98,
            this.scale_x += this.scale_vx;
            const i = (1 - this.scale_y) * e;
            this.scale_vy += i,
            this.scale_vy *= .98,
            this.scale_y += this.scale_vy
        }
        velocity() {
            const s = (0 / Math.abs(this.vx) - 1) * this.vx;
            this.vx += s * this.SPD_P,
            this.pos.x += this.vx;
            const i = -.2 - this.vy;
            this.vy += i * this.SPD_P,
            this.pos.y += this.vy
        }
        inflate() {
            const s = this.radius_target - this.radius;
            this.radius += .075 * s
        }
        rotate() {
            const s = t - this.rotate_spd;
            this.rotate_spd += .01 * s,
            this.pos.angle += this.rotate_spd
        }
        isExpired() {
            return Date.now() - this.createdTime > this.lifeTime
        }
        isTouched(s) {
            return s.x >= this.pos.x - this.pos.w / 2 && s.x <= this.pos.x + this.pos.w / 2 && s.y >= this.pos.y - this.pos.h / 2 && s.y <= this.pos.y + this.pos.h / 2
        }
        down(s) {
            this.prevPoint = s.clone()
        }
        move(s) {
            const i = s.clone().subtract(this.prevPoint);
            this.prevPoint = s.clone(),
            this.vx += i.x / 200 / (this.pos.depth + 1),
            this.vy += i.y / 200 / (this.pos.depth + 1)
        }
        animate(s) {
            this.isLoaded.circle && this.isLoaded.glow && (this.inflate(),
            this.rotate(),
            this.bounceWindow(this.stageWidth, this.stageHeight),
            this.velocity(),
            this.elasticity(),
            s.save(),
            s.transform(this.scale_x, 0, 0, this.scale_y, this.pos.x, this.pos.y),
            s.drawImage(this.glow, 0, 0, this.glow.width, this.glow.height, -this.radius, -this.radius, 2 * this.radius, 2 * this.radius),
            s.rotate(this.pos.angle),
            s.drawImage(this.circle, 0, 0, this.circle.width, this.circle.height, -this.radius, -this.radius, 2 * this.radius, 2 * this.radius),
            s.restore()),
            this.pos.w = 2 * this.radius * this.scale_x,
            this.pos.h = 2 * this.radius * this.scale_y,
            this.curYratio = this.pos.y / this.stageHeight,
            this.curXratio = this.pos.x / this.stageHeight
        }
    }
    class o {
        constructor() {
            this.canvas = document.createElement("canvas"),
            document.body.appendChild(this.canvas),
            this.ctx = this.canvas.getContext("2d"),
            this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1,
            this.mousePos = new s,
            this.bubbles = [];
            for (let s = 0; s < 3; s++)
                for (let i = 0; i < 20; i++)
                    this.bubbles.push(new a(s));
            this.gen_time = Date.now(),
            window.addEventListener("resize", this.resize.bind(this), !1),
            this.resize(),
            this.isLoaded = !1,
            this.imgPos = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            this.image = new Image,
            this.image.src = "imgs/banksy.png",
            this.image.onload = ()=>{
                this.isLoaded = !0,
                this.drawImage()
            }
            ,
            window.requestAnimationFrame(this.animate.bind(this)),
            this.isDown = !1,
            document.addEventListener("pointerdown", this.onDown.bind(this), !1),
            document.addEventListener("pointermove", this.onMove.bind(this), !1),
            document.addEventListener("pointerup", this.onUp.bind(this), !1)
        }
        resize() {
            this.stageWidth = document.body.clientWidth,
            this.stageHeight = document.body.clientHeight,
            this.canvas.width = this.stageWidth * this.pixelRatio,
            this.canvas.height = this.stageHeight * this.pixelRatio,
            this.ctx.scale(this.pixelRatio, this.pixelRatio);
            for (let s = this.bubbles.length - 1; s > -1; s--)
                this.bubbles[s].resize(this.stageWidth, this.stageHeight)
        }
        animate() {
            window.requestAnimationFrame(this.animate.bind(this)),
            this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight),
            this.isLoaded && this.drawImage();
            let s = this.bubbles.length;
            for (let i = s - 1; i > -1; i--)
                this.bubbles[i].animate(this.ctx),
                this.bubbles[i].isExpired() && this.bubbles.splice(i, 1);
            if (s = this.bubbles.length,
            Date.now() - this.gen_time > 15e3 && s < 30) {
                for (let i = 0; i < 3; i++)
                    for (let t = 0; t < (60 - s) / 3; t++) {
                        const s = new a(i);
                        s.resize(this.stageWidth, this.stageHeight),
                        this.bubbles.push(s)
                    }
                this.gen_time = Date.now()
            }
        }
        drawImage() {
            const s = this.image.width / this.image.height;
            this.imgPos.x = 0,
            this.imgPos.y = 2 * this.stageHeight / 3,
            this.imgPos.height = this.stageHeight / 3,
            this.imgPos.width = s * this.imgPos.height,
            this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.imgPos.x, this.imgPos.y, this.imgPos.width, this.imgPos.height)
        }
        onDown(s) {
            this.isDown = !0,
            this.mousePos.x = s.clientX,
            this.mousePos.y = s.clientY;
            for (let s = this.bubbles.length - 1; s > -1; s--)
                this.bubbles[s].down(this.mousePos),
                this.bubbles[s].isTouched(this.mousePos) && this.bubbles.splice(s, 1)
        }
        onMove(s) {
            if (this.isDown) {
                this.mousePos.x = s.clientX,
                this.mousePos.y = s.clientY;
                for (let s = this.bubbles.length - 1; s > -1; s--)
                    this.bubbles[s].move(this.mousePos),
                    this.bubbles[s].isTouched(this.mousePos) && this.bubbles.splice(s, 1)
            }
        }
        onUp(s) {
            this.isDown = !1
        }
    }
    window.onload = ()=>{
        new o
    }
}
)();
