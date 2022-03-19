var DIM = 128
let n = 8
var cam
let mandelbulb = []

class Spherical {
	constructor(r, theta, phi) {
		this.r = r
		this.theta = theta
		this.phi = phi
	}
}

function spherical(x, y, z) {
	let r = sqrt(x * x + y * y + z * z)
	let theta = atan2(sqrt(x * x + y * y), z)
	let phi = atan2(y, x)

	return new Spherical(r, theta, phi)
}

function setup() {
	var cnv = createCanvas(windowWidth, windowHeight, WEBGL)
	cnv.style('display', 'block')
	setAttributes('antialias', true)

	// fix for EasyCam to work with p5 v0.7.2
	Dw.EasyCam.prototype.apply = function (n) {
		var o = this.cam
		;(n = n || o.renderer),
			n &&
				((this.camEYE = this.getPosition(this.camEYE)),
				(this.camLAT = this.getCenter(this.camLAT)),
				(this.camRUP = this.getUpVector(this.camRUP)),
				n._curCamera.camera(
					this.camEYE[0],
					this.camEYE[1],
					this.camEYE[2],
					this.camLAT[0],
					this.camLAT[1],
					this.camLAT[2],
					this.camRUP[0],
					this.camRUP[1],
					this.camRUP[2]
				))
	}

	cam = createEasyCam({ distance: 500 })

	document.oncontextmenu = function () {
		return false
	}
	document.onmousedown = function () {
		return false
	}

	for (let i = 0; i < DIM; i++) {
		for (let j = 0; j < DIM; j++) {
			let edge = false
			for (let k = 0; k < DIM; k++) {
				let x = map(i, 0, DIM, -1, 1)
				let y = map(j, 0, DIM, -1, 1)
				let z = map(k, 0, DIM, -1, 1)

				let zeta = createVector(0, 0, 0)

				let maxIterations = 20
				let iteration = 0
				while (true) {
					let c = spherical(zeta.x, zeta.y, zeta.z)

					let newx = pow(c.r, n) * sin(c.theta * n) * cos(c.phi * n)
					let newy = pow(c.r, n) * sin(c.theta * n) * sin(c.phi * n)
					let newz = pow(c.r, n) * cos(c.theta * n)

					zeta.x = newx + x
					zeta.y = newy + y
					zeta.z = newz + z

					iteration++

					if (c.r > 2) {
						if (edge) {
							edge = false
						}
						break
					}

					if (iteration > maxIterations) {
						if (!edge) {
							edge = true
							mandelbulb.push(createVector(x * 100, y * 100, z * 100))
						}
						break
					}
				}
			}
		}
	}
}

function windowResized() {
	cnv = resizeCanvas(windowWidth, windowHeight)
	cnv.style('display', 'block')
	cam.setViewport([0, 0, windowWidth, windowHeight])
}

function draw() {
	background(11, 11, 11)

	stroke(255)
	strokeWeight(0.25)

	for (let v of mandelbulb) {
		point(v.x, v.y, v.z)
	}
}
