# Regression calculation begin

console.log("Regression start background!");

let x_vals = []
let y_vals = []

let m, b

const learningRate = 0.02
const optimizer = tf.train.sgd(learningRate)

function setup() {
    createCanvas(400, 400)

    m = tf.variable(tf.scalar(random(1)))
    b = tf.variable(tf.scalar(random(1)))

}


