const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 300
const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 500

const carContext = carCanvas.getContext("2d")
const networkContext = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)

// differentiate real car from traffic
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS") // x , y, w, h, controlType : finding the lane center
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
]

animate()

function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }
    car.update(road.borders, traffic)
    carCanvas.height = window.innerHeight // background should be constant
    networkCanvas.height = window.innerHeight // background should be constant

    carContext.save()
    carContext.translate(0, -car.y + carCanvas.height * 0.65) // adding moving road animation

    road.draw(carContext)
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carContext, "red")
    }
    car.draw(carContext, "blue")

    carContext.restore()
    Visualizer.drawNetwork(networkContext, car.brain);
    requestAnimationFrame(animate) // Making it check the speed at all times, so the speed is kept stable
}

