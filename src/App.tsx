import { useRef, useEffect, MouseEvent, useState } from 'react';
import { Ball, ballColors } from './objects/ball';
import newTable from './objects/table';
import ContextMenu, { ContextMenuProps } from './components/ContextMenu';

function handleWallCollision(ball: Ball, canvas: HTMLCanvasElement) {
    const leftAngle = 90; // Angle of the left wall
    const rightAngle = 90; // Angle of the right wall
    const topAngle = 0; // Angle of the top wall
    const bottomAngle = 0; // Angle of the bottom wall

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

    const [contextMenuOpts, setContextMenuOpts] = useState<ContextMenuProps & { visible: boolean }>({
        x: 0,
        y: 0,
        selected: '',
        setSelected: () => {},
        visible: false,
    });

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

        balls.current = []; /* useEffect runs twise in dev mode */
        for (let i = 0; i < 1; i++) {
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

    const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const x = e.clientX - e.currentTarget.offsetLeft;
        const y = e.clientY - e.currentTarget.offsetTop;

        const selectedBall = balls.current.find((ball) => {
            const deltaX = ball.X - x;
            const deltaY = ball.Y - y;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
            return distance <= ball.Radius;
        });
        if (!selectedBall) {
            setContextMenuOpts({ ...contextMenuOpts, visible: false });
            return;
        }

        setContextMenuOpts({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            selected: selectedBall.Color,
            setSelected: selectedBall.setColor,
        });
        console.log(selectedBall);
    };

    return (
        <>
            <canvas ref={canvasRef} width={1100} height={500} onClick={handleClick} />
            {contextMenuOpts.visible ? (
                <ContextMenu
                    x={contextMenuOpts.x}
                    y={contextMenuOpts.y}
                    selected={contextMenuOpts.selected}
                    setSelected={contextMenuOpts.setSelected}
                />
            ) : null}
        </>
    );
};

export default App;
