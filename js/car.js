class Car {
    constructor(x,y,width,height) {

        // Car Attributes
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        // Car physics
        this.speed = 0
        this.acceleration = 0.2
        this.maxSpeed = 3
        this.friction = 0.05
        this.angle = 0

        this.sensor = new Sensor(this) // passing the car into the sensor
        this.controls = new Controls()
    }

    update(road_borders) {
        this.#move()
        this.sensor.update(road_borders)
    }

    #move() {
        // Adding functionality to make it feel like a real car
        if (this.controls.forward == true) { // forward
            this.speed += this.acceleration
        }

        if (this.controls.reverse == true) { // backward
            this.speed -= this.acceleration
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1 // if the speed is greater than 0, flip is 1, otherwise its -1
            if (this.controls.left == true) { // left
                this.angle += 0.03 * flip // "flip" will flip + to - (if the case)
            }
    
            if (this.controls.right == true) { // right
                this.angle -= 0.03 * flip // "flip" will flip the - to + (if the case)
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

        if (this.speed < 0) { // (slowing down the car) Friction applied if car is not moving
            this.speed += this.friction
        }

        if (Math.abs(this.speed) < this.friction) { // Completely stopping the car
            this.speed = 0
        }

        // Making it turn like a real car
        this.x -= Math.sin(this.angle) * this.speed // Trig to find x movement of car
        this.y -= Math.cos(this.angle) * this.speed // Trig to find y movement of car
    }

    draw(ctx) {
        ctx.save() // Save the context
        ctx.translate(this.x, this.y) // Translate to the centered position for rotation 
        ctx.rotate(-this.angle)
        // Drawing the actual car
        ctx.beginPath()
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        )
        ctx.fill() // render the object to the canvas

        ctx.restore() // Prevents infinite translations 

        this.sensor.draw(ctx) // making it the car's "responsibility" to draw the sensor
    }
}