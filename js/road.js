class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x
        this.width = width
        this.laneCount = laneCount

        this.left = x - width / 2
        this.right = x + width / 2

        const inf = 10000000;
        this.top = -inf
        this.bottom = inf

        const topLeft = { x: this.left, y: this.top }
        const topRight = { x: this.right, y: this.top }
        const bottomLeft = { x: this.left, y: this.bottom }
        const bottomRight = { x: this.right, y: this.bottom }
        this.borders = [
            [
                topLeft,
                bottomLeft,
            ],
            [
                topRight,
                bottomRight,
            ]
        ]
    }

    getLaneCenter(laneIndex) { // finding the center of the road
        const laneWidth = this.width / this.laneCount // width of each individual lane
        return this.left + laneWidth / 2 + // placing the car 
            Math.min(laneIndex, this.laneCount - 1) * laneWidth
    }

    draw(ctx) {
        ctx.lineWidth = 5
        ctx.strokeStyle = 'white'

        // making the lanes on the road
        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp( // a , b , t
                this.left,
                this.right,
                i / this.laneCount
            )

            // creation of the actual road
            ctx.setLineDash([20, 20])
            ctx.beginPath()
            ctx.moveTo(x, this.top)
            ctx.lineTo(x, this.bottom)
            ctx.stroke()
        }

        ctx.setLineDash([])
        this.borders.forEach((border) => {
            ctx.beginPath()
            ctx.moveTo(border[0].x, border[0].y)
            ctx.lineTo(border[1].x, border[1].y)
            ctx.stroke()
        })
    }
}