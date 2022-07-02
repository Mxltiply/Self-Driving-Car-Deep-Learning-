const canvas = document.getElementById("myCanvas")
canvas.width = 200

const ctx = canvas.getContext("2d")
const road = new Road(canvas.width / 2, canvas.width * 0.9)
const car = new Car(road.getLaneCenter(1), 100, 30, 50) // x , y, w, h : finding the lane center

animate()

function animate() {
    car.update(road.borders)
    canvas.height = window.innerHeight // background should be constant

    ctx.save()
    ctx.translate(0, -car.y + canvas.height * 0.65) // adding moving road animation

    road.draw(ctx)
    car.draw(ctx)

    ctx.restore()
    requestAnimationFrame(animate) // Making it check the speed at all times, so the speed is kept stable
}
