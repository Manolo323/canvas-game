const canvas = document.querySelector('canvas');
//Specifying a 2-dimensional game
const context = canvas.getContext('2d')

//Setting width and height to full screen
canvas.width = innerWidth
canvas.height = innerHeight

//Creating a player
class Player {
    //Will give a unique property to differentiate new players
    constructor(x, y, radius, color) {
        //Position of Character
        this.x = x
        this.y = y

        //Size and color of character
        this.radius = radius
        this.color = color
    }

    draw () {
        //Specifies we want to draw on the screen
        context.beginPath()
        //Arc function: context.arc(x: Int, y: Int, r: Int, startAngle: Float, endAngle: Float, drawCounterClockwise: Boolean)
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        //Specifies players color: Blue
        context.fillStyle = this.color
        context.fill()
    }
}

//This will create a projectile being shot to the middle of the screen
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw () {
        //Specifies we want to draw on the screen
        context.beginPath()
        //Arc function: context.arc(x: Int, y: Int, r: Int, startAngle: Float, endAngle: Float, drawCounterClockwise: Boolean)
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        //Specifies players color: Blue
        context.fillStyle = this.color
        context.fill()
    }
}

//This will set the x coordinate to the middle of the screen by dividing the width by half
const x = canvas.width / 2
//This will set the y coordinate to the middle of the screen by dividing the height by half
const y = canvas.height / 2

const player = new Player(x, y, 30, 'purple')
//This will tell the player to call the draw() function
player.draw()

console.log(player)

addEventListener('click', (event) => {
    const Projectile = new Projectile()
})