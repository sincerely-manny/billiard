export const ballColors = [
    '#d90bbf',
    '#f74b49',
    '#9e06e0',
    '#0d42d1',
    '#ee8483',
    '#30d575',
    '#8b1c7b',
    '#f3e6f4',
    '#890c16',
    '#4c08b9',
    '#1df5cf',
    '#1dc520',
    '#cd4e02',
    '#6c791d',
    '#8b7253',
    '#b3c99d',
    '#0b9b81',
    '#3b5174',
    '#45da43',
    '#ed2b9f',
    '#b2d860',
    '#6662f3',
    '#5a66d1',
    '#7a230c',
    '#0852b0',
    '#39a6f3',
    '#2d8d3b',
    '#41b17a',
    '#0c2b22',
    '#d876bc',
];

const animationSpeed = 1;
const friction = 0.01;
const resilience = 0.1;

export class Ball {
    private x: number;

    private y: number;

    private velocity: number;

    private angle: number;

    private radius: number;

    private color: string;

    private ctx: CanvasRenderingContext2D;

    private captured = false;

    private lastUpdate: number;

    constructor(
        x: number,
        y: number,
        velocity: number,
        angle: number,
        radius: number,
        color: string,
        ctx: CanvasRenderingContext2D,
    ) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.angle = angle;
        this.radius = radius;
        this.color = color;
        this.ctx = ctx;
        this.lastUpdate = Date.now();
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        // hex to RGB
        const r = parseInt(this.color.substring(1, 3), 16);
        const g = parseInt(this.color.substring(3, 5), 16);
        const b = parseInt(this.color.substring(5, 7), 16);
        const glareR = Math.min(r + 100, 255);
        const glareG = Math.min(g + 100, 255);
        const glareB = Math.min(b + 100, 255);

        const gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, `rgb(${glareR}, ${glareG}, ${glareB})`);
        gradient.addColorStop(1, this.color);

        this.ctx.fillStyle = gradient;

        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.shadowColor = 'transparent';
    }

    update() {
        if (this.captured) {
            this.draw();
            return;
        }
        const v = Math.max(this.velocity, 0);
        const radians = (this.angle * Math.PI) / 180;
        const deltaX = v * Math.cos(radians) * animationSpeed;
        const deltaY = v * Math.sin(radians) * animationSpeed;

        this.x += deltaX;
        this.y += deltaY;
        this.setVelocity(this.velocity - friction);
        this.lastUpdate = Date.now();

        this.draw();
    }

    get Velocity() {
        return this.velocity;
    }

    get Boundaries() {
        return {
            top: this.y - this.radius,
            bottom: this.y + this.radius,
            left: this.x - this.radius,
            right: this.x + this.radius,
        };
    }

    get Radius() {
        return this.radius;
    }

    get Angle() {
        return this.angle;
    }

    get X() {
        return this.x;
    }

    get Y() {
        return this.y;
    }

    get Color() {
        return this.color;
    }

    setVelocity(v: number) {
        let newV = Math.max(0, v);
        newV = Math.min(newV, 15); // Speed limit
        this.velocity = newV;
    }

    setAngle(a: number) {
        let angle = a % 360;
        if (angle < 0) {
            angle += 360;
        }
        this.angle = angle;
    }

    uncapture() {
        this.captured = false;
    }

    drag(x: number, y: number) {
        this.captured = true;
        const time = Date.now();
        const deltaTime = time - this.lastUpdate;

        const distance = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
        const deltaTimeInSeconds = deltaTime / 10;
        const speed = distance / deltaTimeInSeconds;
        const angleRad = Math.atan2(y - this.y, x - this.x);
        const angleDeg = angleRad * (180 / Math.PI);

        this.x = x;
        this.y = y;
        this.lastUpdate = time;
        this.setVelocity(speed);
        this.setAngle(angleDeg);
        this.draw();
    }

    setColorUnbinded(c: string) {
        this.color = c;
        this.update();
    }

    setColor = this.setColorUnbinded.bind(this);

    reflect() {
        const { width, height } = this.ctx.canvas;
        let reflectionAngle = null;

        if (this.Boundaries.left <= 0) {
            this.x = this.radius;
            reflectionAngle = 90;
        }
        if (this.Boundaries.right >= width) {
            this.x = width - this.radius;
            reflectionAngle = 90;
        }
        if (this.Boundaries.top <= 0) {
            this.y = this.radius;
            reflectionAngle = 0;
        }
        if (this.Boundaries.bottom >= height) {
            this.y = height - this.radius;
            reflectionAngle = 0;
        }
        if (reflectionAngle === null) {
            return;
        }

        this.setAngle(2 * reflectionAngle - this.angle);
        this.setVelocity(this.velocity - resilience);
    }

    collide(ball2: Ball) {
        const deltaX = ball2.X - this.X;
        const deltaY = ball2.Y - this.Y;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        if (distance > this.Radius + ball2.Radius) {
            return;
        }
        if (distance < this.Radius + ball2.Radius) {
            const overlap = this.Radius + ball2.Radius - distance;
            const od = overlap / Math.sqrt(2);
            if (this.X > ball2.X) {
                this.x += od;
            } else {
                this.x -= od;
            }

            if (this.Y > ball2.Y) {
                this.y += od;
            } else {
                this.y -= od;
            }
        }

        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert radians to degrees

        const v1x = this.Velocity * Math.cos(this.Angle - angle);
        const v1y = this.Velocity * Math.sin(this.Angle - angle);
        const v2x = ball2.Velocity * Math.cos(ball2.Angle - angle);
        const v2y = ball2.Velocity * Math.sin(ball2.Angle - angle);

        const m1 = this.Radius; // mass proportional to radius
        const m2 = ball2.Radius;

        // Calculate the new velocities after collision
        const u1x = (v1x * (m1 - m2) + 2 * m2 * v2x) / (m1 + m2);
        const u1y = v1y;
        const u2x = (2 * m1 * v1x + v2x * (m2 - m1)) / (m1 + m2);
        const u2y = v2y;

        // Calculate the new speeds and angles after collision
        const u1 = Math.sqrt(u1x * u1x + u1y * u1y);
        const u2 = Math.sqrt(u2x * u2x + u2y * u2y);
        const newAngle1 = Math.atan2(u1y, u1x) * (180 / Math.PI) + angle;
        const newAngle2 = Math.atan2(u2y, u2x) * (180 / Math.PI) + angle;

        // Update the velocities and angles of the balls
        this.setVelocity(u1 - resilience);
        this.setAngle(newAngle1);
        ball2.setVelocity(u2 - resilience);
        ball2.setAngle(newAngle2);
    }
}
