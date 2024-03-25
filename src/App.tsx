import { useRef, useEffect, MouseEvent, useState } from 'react';
import { Ball, ballColors } from './objects/ball';
import newTable from './objects/table';
import ContextMenu, { ContextMenuProps } from './components/ContextMenu';

const clickThreshold = 100;

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

    const mouseEvent = useRef<{ mouseDown: number; mouseUp: number; ball?: Ball }>({
        mouseDown: 0,
        mouseUp: 0,
        ball: undefined,
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
        for (let i = 0; i < 10; i++) {
            const radius = Math.random() * 30 + 10; // Random radius between 10 and 40
            const x = Math.random() * (canvas.width - radius * 2) + radius; // Random x position
            const y = Math.random() * (canvas.height - radius * 2) + radius; // Random y position
            // const velocity = Math.random() * 10; // Random velocity
            const velocity = 0;
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
                ball.reflect();
                for (let j = i + 1; j < balls.current.length; j++) {
                    const ball2 = balls.current[j];
                    ball.collide(ball2);
                }
                ball.update();
            });
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const getBall = (e: MouseEvent<HTMLCanvasElement>) => {
        const x = e.clientX - e.currentTarget.offsetLeft;
        const y = e.clientY - e.currentTarget.offsetTop;
        return balls.current.find((ball) => {
            const deltaX = ball.X - x;
            const deltaY = ball.Y - y;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
            return distance <= ball.Radius;
        });
    };

    const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();

        const ball = getBall(e);
        if (!ball) {
            setContextMenuOpts({ ...contextMenuOpts, visible: false });
            return;
        }

        setContextMenuOpts({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            selected: ball.Color,
            setSelected: ball.setColor,
        });
    };

    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        mouseEvent.current.mouseDown = Date.now();
        mouseEvent.current.mouseUp = 0;
        mouseEvent.current.ball = getBall(e);
    };
    const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
        mouseEvent.current.mouseUp = Date.now();
        mouseEvent.current.ball?.uncapture();
        if (Date.now() - mouseEvent.current.mouseDown < clickThreshold) {
            handleClick(e);
        }
    };
    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!mouseEvent.current.ball || mouseEvent.current.mouseUp) {
            return;
        }
        if (Date.now() - mouseEvent.current.mouseDown < clickThreshold) {
            return;
        }
        const x = e.clientX - e.currentTarget.offsetLeft;
        const y = e.clientY - e.currentTarget.offsetTop;
        mouseEvent.current.ball.drag(x, y);
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                width={1100}
                height={500}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
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
