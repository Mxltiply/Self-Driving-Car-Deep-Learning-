const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 300
const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 500

const carContext = carCanvas.getContext("2d")
const networkContext = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)

const numCars = 1000
const cars = createCars(numCars)
const traffic = []
const mutationLevel = parseFloat(prompt("Set mutation level (0-1): "))

for (let i = 1; i < 8; i++) {
    traffic.push(new Car(road.getLaneCenter(Math.random()*3), (-100*i)-50, 30, 50, "DUMMY", 2, generateRandomColor()))
}

let bestCar = cars[0]

if (localStorage.getItem("bestCarBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestCarBrain"))
        if (i > 0) {
            NeuralNetwork.mutateNetwork(cars[i].brain, mutationLevel)
        }
    }
}


animate()


function createCars(numCars) {
    const cars = []
    for (let i = 1; i <= numCars; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}

function saveCar() {
    localStorage.setItem("bestCarBrain", JSON.stringify(bestCar.brain))
}
function deleteCar() {
    if (confirm("Are you sure you want to delete your best car? You will need to re-train the model!")) {
        localStorage.removeItem("bestCarBrain")
    } 
}

function animate(t) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }
    for (const car of cars) {
        car.update(road.borders, traffic)
    }

    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)))

    carCanvas.height = window.innerHeight // background should be constant
    networkCanvas.height = window.innerHeight // background should be constant

    carContext.save()
    carContext.translate(0, -bestCar.y + carCanvas.height * 0.65) // adding moving road animation

    road.draw(carContext)
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carContext)
    }
    carContext.globalAlpha = 0.2
    for (const car of cars) {
        car.draw(carContext)
    }
    carContext.globalAlpha = 1
    bestCar.draw(carContext, true)
    carContext.restore()


    networkContext.lineDashOffset = -t / 50
    Visualizer.drawNetwork(networkContext, bestCar.brain);
    requestAnimationFrame(animate) // Making it check the speed at all times, so the speed is kept stable
}

