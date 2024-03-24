const cornerRadius = 20;
const pocketRadius = 15;

function drawTable(ctx: CanvasRenderingContext2D) {
    const { canvas } = ctx;
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(canvas.width - cornerRadius, 0);
    ctx.arcTo(canvas.width, 0, canvas.width, cornerRadius, cornerRadius);
    ctx.lineTo(canvas.width, canvas.height - cornerRadius);
    ctx.arcTo(canvas.width, canvas.height, canvas.width - cornerRadius, canvas.height, cornerRadius);
    ctx.lineTo(cornerRadius, canvas.height);
    ctx.arcTo(0, canvas.height, 0, canvas.height - cornerRadius, cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.arcTo(0, 0, cornerRadius, 0, cornerRadius);
    ctx.closePath();
    ctx.fill();
}

function drawPockets(ctx: CanvasRenderingContext2D) {
    const { canvas } = ctx;
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(cornerRadius, cornerRadius, pocketRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width - cornerRadius, cornerRadius, pocketRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cornerRadius, canvas.height - cornerRadius, pocketRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width - cornerRadius, canvas.height - cornerRadius, pocketRadius, 0, Math.PI * 2);
    ctx.fill();
}

export default function newTable(ctx: CanvasRenderingContext2D) {
    drawTable(ctx);
    drawPockets(ctx);
}
