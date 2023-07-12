const canvas = document.querySelector('canvas');
//Specifying a 2-dimensional game
const context = canvas.getContext('2d')

//Setting width and height to full screen
canvas.width = innerWidth
canvas.height = innerHeight

//selects the score element span in our document to update the score
const scoreEl = document.querySelector('#scoreEl')

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

    update() {
        this.draw()
        //This will move projectile from center by adding velocity to x and y coordinates
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
//This will create an enemy
class Enemy {
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

    update() {
        this.draw()
        //This will move projectile from center by adding velocity to x and y coordinates
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

// slows  down particles
const friction = 0.97
// blueprint for explosion animation when enemy is hit
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw () {
        context.save()
        context.globalAlpha = this.alpha
        //Specifies we want to draw on the screen
        context.beginPath()
        //Arc function: context.arc(x: Int, y: Int, r: Int, startAngle: Float, endAngle: Float, drawCounterClockwise: Boolean)
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        //Specifies players color: Blue
        context.fillStyle = this.color
        context.fill()
        context.restore()
    }

    update() {
        this.draw()
        //This will move projectile from center by adding velocity to x and y coordinates
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

//This will set the x coordinate to the middle of the screen by dividing the width by half
const x = canvas.width / 2
//This will set the y coordinate to the middle of the screen by dividing the height by half
const y = canvas.height / 2

const player = new Player(x, y, 10, 'white')
//Renders multiple particles within animate loop by creating an array
const projectiles =[]
//Contains each instance for each enemy we create
const enemies = []
//Renders particles once enemy is hit
const particles = []
//This will spawn enemies
function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4
        // references x and y outside the if statement
        let x
        let y
        //calls math.random if x < 0.5
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        //adds random color to enemies
        const color = `hsl(${Math.random() * 360}, 50%,  50%)`
        //This will set the velocity of the enemies using an equation to set the angle
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )
        //Sets velocity
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}
//Animation loop will allow projectile to move from center to where ever we click on the screen
let  animationId
//increases score when an enemy is hit
let score = 0
function animate() {
    animationId = requestAnimationFrame(animate)
    //Colors in the background
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    context.fillRect(0 ,0 , canvas.width, canvas.height)
    //This will tell the player to call the draw() function
    player.draw()
    //removes particles from the screen
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    })
    projectiles.forEach((projectile, index) => {
        projectile.update()

        // removes from edges of screen
        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(()  => {
                projectiles.splice(index, 1)
            }, 0)
        }
        })

    enemies.forEach((enemy, index) => {
        enemy.update()
        // Gets distance between enemy and player
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        // Ends game
        if (dist -  enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
        }

        projectiles.forEach((projectile, projectileIndex) => {
            // Gets distance between projectile and enemy
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            //removes enemy once projectile hits enemy
            if (dist -  enemy.radius - projectile.radius < 1) {
                // creates a number of particles that are rendered to the screen
                for (let i = 0; i < enemy.radius * 2; i++) {
                    //Increases score
                    score += 100
                    scoreEl.innerHTML = score
                    particles.push(
                        new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {
                        x: (Math.random() - 0.5) * (Math.random() * 5),
                        y: (Math.random() - 0.5) * (Math.random() * 5)
                    })
                    )
                }
                //Shrinks enemy if it is hit
                if (enemy.radius - 10 > 5) {
                    //Adds shrinking animation
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(()  => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                setTimeout(()  => {
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
                }, 0)
                }
            }
        })
    })
}

//Activates code when a user clicks on the window by listening to click event
addEventListener('click', (event) => {
    //This will set the velocity of the projectiles using an equation to set the angle
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )
    //Sets velocity
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(
        canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
    )
})

animate()
spawnEnemies()