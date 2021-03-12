import { imageAssets, Sprite, SpriteSheet, track, Vector, Text } from 'kontra';

const speed: number = 5;

export class Player extends Sprite.class {
    id: string;
    displayName: string;
    target: Vector;
    direction: Vector;

    playingAnimation: string;

    constructor(id: string, displayName: string, position: Vector) {
        let spriteSheet = SpriteSheet({
            image: imageAssets["bear"],
            frameWidth: 128,
            frameHeight: 128,
            animations: {
                walkFR: {
                    frames: '0..47',
                    frameRate: 48
                },
                idleFR: {
                    frames: '48..195',
                    frameRate: 0
                },
                walkFL: {
                    frames: '49..96',
                    frameRate: 48
                },
                idleFL: {
                    frames: '97..195',
                    frameRate: 0
                },
                walkBR: {
                    frames: '98..145',
                    frameRate: 48
                },
                idleBR: {
                    frames: '146...195',
                    frameRate: 0
                },
                walkBL: {
                    frames: '147..194',
                    frameRate: 48
                },
                idleBL: {
                    frames: '195..200',
                    frameRate: 0
                }
            }
        });

        super({
            type: 'player',
            x: position.x,
            y: position.y,
            dx: 0,
            dy: 0,
            image: spriteSheet.frame[48],
            animations: spriteSheet.animations,
            onDown: function(event: Event) {
                event.preventDefault();
            }
        });

        this.playAnimation('idleFR');
        this.playingAnimation = 'idleFR';

        this.id = id;
        this.displayName = displayName;
        this.target = Vector(this.x, this.y);
        track(this);
    }

    update(): void {
        let distance: number = this.target.distance(Vector(this.x, this.y));
        // also cancel movement upon collision! maybe upon collision, set target to position?
        if (distance > 4) {
            this.velocity = Vector(this.direction.x * speed, this.direction.y * speed);
        }
        else if (!this.playingAnimation.includes('idle')) {
            this.playingAnimation = this.playingAnimation.replace('walk', 'idle');
            this.playAnimation(this.playingAnimation);
            this.reportLocation();
            this.target = Vector(this.x, this.y);
            this.dx = 0;
            this.dy = 0;
        }
        super.update();
    }

    draw(): void {
        super.draw();
        let nameTag: Text = new Text({
            text: this.displayName,
            font: '16px Arial',
            color: 'black',
            width: 128,
            x: 0,
            y: 128,
            anchor: {x: 0, y: 0},
            textAlign: 'center'
        });

        nameTag.render();
    }

    setTarget(msg: any): void {
        this.target = Vector(msg["position_x"] - 128 / 2, msg["position_y"] - 128 / 2);
        this.direction = Vector(this.target.x - this.x, this.target.y - this.y).normalize();
        let left: boolean = this.direction.x <= 0;
        let right: boolean = !left;
        let backward: boolean = this.direction.y <= 0;
        let forward: boolean = !backward;
        if (forward && right) {
            this.playingAnimation = 'walkFR';
        }
        if (forward && left) {
            this.playingAnimation = 'walkFL';
        }
        if (backward && right) {
            this.playingAnimation = 'walkBR';
        }
        if (backward && left) {
            this.playingAnimation = 'walkBL';
        }
        this.playAnimation(this.playingAnimation);
    }

    setActiveTask(msg: any): void {

    }

    reportLocation(): void {
        let log: HTMLElement = document.getElementById("game-log");
        let message: HTMLParagraphElement = document.createElement("p");
        message.innerHTML = this.displayName + " is now at " + Math.round(this.x) + " on the x-axis and " + Math.round(this.y) + " on the y-axis.";
        log.appendChild(message);
    }

}