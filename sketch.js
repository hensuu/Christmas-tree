console.log("running pickup.js");

let instructions =
    "Use the left and right arrow keys to move the player to pickup items";

let live = 5;
let count = -20;
let state = "ready";
let speed = 1
let catched = 0

function newitem(vel = 100) {
    let item = new targets.Sprite(random(10, width - 10), -30, 70, 35);
    item.addAni('color', 'assets/color_0001.png', 6);
    item.addAni('green', 'assets/green_0001.png', 3);
    item.rotationLock = true;
    item.vel.y = random(0, 2 + trees.length / 5);
}

function preload() {
    soundFormats('mp3');
    mySound = loadSound('assets/jingle_bell.mp3');
    // heart = loadImage('heart.png');
    // heart_dead = loadImage('heart_dead.png');
    lemon = loadFont("assets/lemon.otf");
}


function setup() {
    
    new Canvas(windowWidth, windowHeight*0.95);
    bg = loadImage('assets/bg.png');
    centerX = width * 0.5;
    world.gravity.x = 0;
    world.gravity.y = 10;
    trees = new Group();
    targets = new Group();

    hearts = new Group();



    chunk = new trees.Sprite(centerX, height - 50, 30, 60);
    chunk.rotationLock = true;
    chunk.color = color(159, 82, 25);
    chunk.collider = "kinematic";
    chunk.cha = 0;
    chunk.addAni('chunk', 'assets/chunk_0001.png', 1);

    trees.collide(targets, (a, b) => {
        if (a == trees[trees.length - 1]) {
            a.addJoint(b, "revolute");
            targets.remove(b);
            trees.add(b);
            a.ani.stop();
            b.ani = "color"
            b.cha = b.x - chunk.x;
            catched++;
            // console.log("yes");
            if (catched % 8 == 0) {
                speed *= 1.2
                mySound.rate(speed)
            }
        }
    });
    mySound.play();


}

function draw() {
    textFont(lemon);
    textSize(32);

    background(bg);
    trees[0].moveTowards(mouse.x - trees[trees.length - 1].cha, trees[0].y, 1);
    if (hearts.length < live) {
        let heart = new hearts.Sprite(hearts.length * 80 + 50, 50, 50, 50);
        heart.static = true
        heart.collider = "none";
        heart.addAni('color', 'assets/heart_0001.png', 1);
    } else if (hearts.length > live) {
        hearts[hearts.length - 1].static = false
        hearts[hearts.length - 1].collider = "circle"
        hearts[hearts.length - 1].vel.y = 10

        hearts[hearts.length - 1].xin = true
        
        
        if (live <= 0) {
            state = "over"
        }else{
            targets.add(hearts[hearts.length - 1])
        }
        hearts.remove(hearts[hearts.length - 1]);
    }

    if (state == "ready") {
        //load textfont


        textFont(lemon);
        textSize(32);

        text("click to start", width - 200, 40);
        if (mouse.pressing()) {
            newitem()
            userStartAudio();
            state = "play"
        }
    } else if (state == "play") {
        text("catch: " + catched, width - 200, 40)
        count++
        if (count >= 80 / speed) {
            newitem()
            count = 0
        }
        for (let i = 0; i < targets.length; i++) {
            if ((targets[i].y > height + 20) && !targets[i].xin) {
                live -= 1;
                targets.remove(targets[i])
                
            }

        }
        mySound.pan((mouse.x - centerX) / (centerX), 0);


        // trees.debug = mouse.pressing();


        if (trees[trees.length - 1].y < height / 2) {
            for (var i = 0; i < trees.length; i++) {
                trees[i].y += 10;
            }
        }
        colorMode(HSB, 255);
        trees[trees.length - 1].color = color(random(0, 255), 200, 255);


    } else if (state == "over") {
        
        text("Merry Christmas", 40, 40)
        text("Game Over", width - 200, 40)
        text("click to restart", width - 200, 80)
        targets.removeAll()
        mySound.stop();

        if (chunk.y > height) {
            chunk.moveTo(chunk.x,height - 20)
        }
        if (trees[trees.length - 1].y < 30) {
            trees[trees.length - 1].y = 30
        }


        // add star on the top of the tree
        trees[trees.length - 1].addAni('star', 'assets/star_0001.png', 1);

        if (mouse.presses()) {
            userStartAudio();
            state = "play"
            live = 5
            catched = 0
            speed = 1
            mySound.rate(speed)
            trees.removeAll()
            setup()
        }
    }
}
