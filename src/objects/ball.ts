export const ballColors = [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
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
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        const v = Math.max(this.velocity, 0);
        const radians = (this.angle * Math.PI) / 180;
        const deltaX = v * Math.cos(radians) * animationSpeed;
        const deltaY = v * Math.sin(radians) * animationSpeed;

        this.x += deltaX;
        this.y += deltaY;
        this.setVelocity(this.velocity - friction);

        this.draw(); // Draw the updated ball
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

    setVelocity(v: number) {
        this.velocity = Math.max(0, v);
    }

    setAngle(a: number) {
        let angle = a % 360;
        if (angle < 0) {
            angle += 360;
        }
        this.angle = angle;
    }

    reflect(reflectionAngle: number) {
        this.setAngle(2 * (reflectionAngle - 90) - this.angle);
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

        console.log('Collision occurred!');
    }
}
