class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3, color = "blue") {

        // Car Attributes
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        // Car physics
        this.speed = 0
        this.acceleration = 0.2
        this.maxSpeed = maxSpeed
        this.friction = 0.05
        this.angle = 0
        this.damaged = false

        this.useBrain = controlType == "AI"

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this)
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            )
        }
        this.controls = new Controls(controlType)

        this.image = new Image()
        this.image.src = "assets/car.png"

        this.mask = document.createElement("canvas")
        this.mask.width = width;
        this.mask.height = height;

        const maskCtx = this.mask.getContext("2d")
        this.image.onload = () => {
            maskCtx.fillStyle = color
            maskCtx.rect(0, 0, this.width, this.height)
            maskCtx.fill()

            maskCtx.globalCompositeOperation = "destination-atop"
            maskCtx.drawImage(this.image, 0, 0, this.width, this.height)
        }

    }

    update(road_borders, traffic) {
        if (!this.damaged) {
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(road_borders, traffic)
        }

        if (this.sensor) {
            this.sensor.update(road_borders, traffic)
            const offsets = this.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offset
            )
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)

            if (this.useBrain) {
                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.reverse = outputs[3]
            }
        }
    }

    #assessDamage(roadBorders, traffic) {
        // check if the car has touched the edge of the road (the road borders)
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true
            }
        }

        return false
    }

    #createPolygon() {
        const points = []
        const rad = Math.hypot(this.width, this.height) / 2
        const alpha = Math.atan2(this.width, this.height)
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        })

        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        })

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        })

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        })

        return points
    }

    #move() {
        // Adding functionality to make it feel like a real car
        if (this.controls.forward) { // forward
            this.speed += this.acceleration
        }

        if (this.controls.reverse) { // backward
            this.speed -= this.acceleration
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1 // if the speed is greater than 0, flip is 1, otherwise its -1
            if (this.controls.left) { // left
                this.angle += 0.01 * flip // "flip" will flip + to - (if the case)
            }

            if (this.controls.right) { // right
                this.angle -= 0.01 * flip // "flip" will flip the - to + (if the case)
            }
        }



        if (this.speed > this.maxSpeed) { // max forward speed
            this.speed = this.maxSpeed
        }

        if (this.speed < -this.maxSpeed / 2) { // max reverse speed
            this.speed = -this.maxSpeed / 2
        }

        if (this.speed > 0) { // (slowing down the car) Friction applied if car is moving
            this.speed -= this.friction
        }

        if (this.speed < 0) {
            this.speed += this.friction
        }

        if (Math.abs(this.speed) < this.friction) { // Completely stopping the car
            this.speed = 0
        }

        // Making it turn like a real car
        this.x -= Math.sin(this.angle) * this.speed // Trig to find x movement of car
        this.y -= Math.cos(this.angle) * this.speed // Trig to find y movement of car
    }

    draw(ctx, drawSensor = false) {
        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx) // making it the car's "responsibility" to draw the sensor    
        }

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)

        if (!this.damaged) {
            ctx.drawImage(this.mask, -this.width/2, -this.height/2, this.width, this.height)
            ctx.globalCompositeOperation = "multiply"
        }
        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height)
        ctx.restore()
    }
}