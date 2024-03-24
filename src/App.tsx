import { useRef, useEffect } from 'react';
import { Ball, ballColors } from './objects/ball';
import newTable from './objects/table';

function handleWallCollision(ball: Ball, canvas: HTMLCanvasElement) {
    const leftAngle = 180; // Angle of the left wall is 180 degrees
    const rightAngle = 0; // Angle of the right wall is 0 degrees
    const topAngle = 270; // Angle of the top wall is 270 degrees
    const bottomAngle = 90; // Angle of the bottom wall is 90 degrees

    if (ball.Boundaries.left <= 0) {
        ball.reflect(leftAngle);
    }
    if (ball.Boundaries.right >= canvas.width) {
        ball.reflect(rightAngle);
    }
    if (ball.Boundaries.top <= 0) {
        ball.reflect(topAngle);
    }
    if (ball.Boundaries.bottom >= canvas.height) {
        ball.reflect(bottomAngle);
    }
}

function handleBallsCollision(ball1: Ball, ball2: Ball) {
    ball1.collide(ball2);
}

const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const balls = useRef<Ball[]>([]);

    useEffect(() => {
        if (!canvasRef.current) {
            return () => {};
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return () => {};
        }

        let animationFrameId: number;

        // Create balls
        for (let i = 0; i < 10; i++) {
            const radius = Math.random() * 30 + 10; // Random radius between 10 and 40
            const x = Math.random() * (canvas.width - radius * 2) + radius; // Random x position
            const y = Math.random() * (canvas.height - radius * 2) + radius; // Random y position
            const velocity = Math.random() * 10; // Random velocity
            const angle = Math.random() * 360; // Random angle
            const color = ballColors[Math.floor(Math.random() * ballColors.length)]; // Random color
            balls.current.push(new Ball(x, y, velocity, angle, radius, color, ctx));
        }

        // Animation loop
        const animate = () => {
            if (!ctx) {
                return;
            }
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            newTable(ctx);
            balls.current.forEach((ball, i) => {
                handleWallCollision(ball, canvas);
                for (let j = i + 1; j < balls.current.length; j++) {
                    const ball2 = balls.current[j];
                    handleBallsCollision(ball, ball2);
                }
                ball.update();
            });
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} width={1100} height={500} />;
};

export default App;
