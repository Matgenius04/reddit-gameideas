const c = document.getElementById("screen");
const mapc = document.createElement("canvas");
const draw = c.getContext("2d");
const map = mapc.getContext("2d");
const keys = [];
const fps = 60;
document.body.appendChild(mapc);
let mapData;
let mapTool = "move";

let mouseX;
let mouseY;
let mouseDown = 0;

const mousevariable = {
    x: undefined,
    y: undefined
};

const pmousevariable = {
    x: undefined,
    y: undefined
};

const ocean = "#1853b2";
const land = "#4bc944";
const lines = "#33333380";

const intran = {
    a: 0.5237827897071838,
    b: -0.5237827897071838,
    c: 1.0878565311431885,
    d: 1.0878565311431885,
    e: 0,
    f: 0
};
let scale = 1;
let prevscale = 1;
const translate = {
    x: 0,
    y: 0
};
const prevtranslate = {
    x: 0,
    y: 0
};

function setup() {
    mapc.height = 2000; // resolution
    mapc.width = 2000; // resolution
    map.fillStyle = ocean;
    map.fillRect(0, 0, mapc.width, mapc.height);

    map.fillStyle = land;
    map.beginPath();
    map.arc(mapc.width / 2, mapc.height / 2, mapc.width / 16, 0, Math.PI * 2);
    map.fill();

    mapData = map.getImageData(0, 0, mapc.width, mapc.height)

    draw.save();
    c.style.width = "100%";
    c.style.height = "100%";
    c.width = c.clientWidth;
    c.height = c.clientHeight;
    draw.translate(c.width / 2, c.height / 2);
    draw.scale(1, -1);
    draw.rotate(45 * Math.PI / 180); // rotate 45 degrees
    draw.transform(1, -0.35, -0.35, 1, 0, 0); // skew by 0.35
    console.log(draw.mozCurrentTransformInverse);
    window.addEventListener("resize", (ev) => {
        draw.restore();
        c.style.width = "100%";
        c.style.height = "100%";
        c.width = c.clientWidth;
        c.height = c.clientHeight;
        draw.translate(c.width / 2, c.height / 2);
        draw.scale(1, -1);
        draw.clearRect(-c.width / 2, -c.height / 2, c.width, c.height);
        draw.rotate(45 * Math.PI / 180); // rotate 45 degrees
        draw.transform(1, -0.35, -0.35, 1, 0, 0);
    });
    window.addEventListener("keydown", (ev) => {
        if (keys.find((v) => v == ev.key) == undefined) {
            keys.push(ev.key);
        }
    });
    window.addEventListener("keyup", (ev) => {
        keys.splice(keys.findIndex((v) => v == ev.key), 1);
    });
    const lastpos = {
        x: undefined,
        y: undefined
    };
    window.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();

        mousevariable.x = (1 / scale) * ((intran.a * ((ev.clientX - (c.width / 2)) - translate.x)) + (intran.c * ((-ev.clientY + (c.height / 2)) - translate.y)));
        mousevariable.y = (1 / scale) * ((intran.b * ((ev.clientX - (c.width / 2)) - translate.x)) + (intran.d * ((-ev.clientY + (c.height / 2)) - translate.y)));
        // mapTool = "land";
    });
    window.addEventListener("mousedown", (ev) => {
        mouseDown = ev.button;
        if (ev.button == 0) {
            lastpos.x = (ev.clientX - (c.width / 2));
            lastpos.y = (-ev.clientY + (c.height / 2));
        }
        // console.log("lastpos.y = " + lastpos.y);
    });
    window.addEventListener("mousemove", (ev) => {
        if (lastpos.x != undefined && lastpos.y != undefined) {
            translate.x += ((ev.clientX - (c.width / 2)) - lastpos.x);
            translate.y += ((-ev.clientY + (c.height / 2)) - lastpos.y);
            lastpos.x = (ev.clientX - (c.width / 2));
            lastpos.y = (-ev.clientY + (c.height / 2));
        }

        mouseX = ev.clientX;
        mouseY = ev.clientY;

        mousevariable.x = (1 / scale) * ((intran.a * ((ev.clientX - (c.width / 2)) - translate.x)) + (intran.c * ((-ev.clientY + (c.height / 2)) - translate.y)));
        mousevariable.y = (1 / scale) * ((intran.b * ((ev.clientX - (c.width / 2)) - translate.x)) + (intran.d * ((-ev.clientY + (c.height / 2)) - translate.y)));
        // console.log("x: " + String((ev.clientX-(c.width/2))-lastpos.x));
        // console.log("y: " + String((-ev.clientY+(c.height/2))-lastpos.y));
    });
    window.addEventListener("mouseup", (ev) => {
        lastpos.x = undefined;
        lastpos.y = undefined;
        mouseDown = 0;
    });
    window.addEventListener("wheel", (ev) => {
        console.log({
            x: ev.deltaX,
            y: ev.deltaY
        });
        scale -= ev.deltaY / 100;
        translate.y += ev.deltaY;
    });
    window.requestAnimationFrame(frame);
}

function frame() {
    setTimeout(() => {
        window.requestAnimationFrame(frame);
    }, 1000 / fps);

    if (mouseDown == 2) {
        terraform()
    }

    pmousevariable.x = mousevariable.x;
    pmousevariable.y = mousevariable.y;

    map.putImageData(mapData, 0, 0);

    map.strokeStyle = lines;
    map.lineWidth = 2;

    map.fillStyle = "#000000"
    map.beginPath();
    map.arc(mousevariable.x, mousevariable.y, mapc.width / 1028, 0, Math.PI * 2);
    map.fill();

    for (let i = 0; i < mapc.width; i += mapc.width / 16) {
        map.beginPath();
        map.moveTo(i, 0);
        map.lineTo(i, mapc.height);
        map.stroke();
    }

    for (let j = 0; j < mapc.height; j += mapc.height / 16) {
        map.beginPath();
        map.moveTo(0, j);
        map.lineTo(mapc.width, j);
        map.stroke();
    }
    draw.transform(intran.a, intran.b, intran.c, intran.d, 0, 0);
    draw.scale(1 / prevscale, 1 / prevscale);
    draw.translate(-prevtranslate.x, -prevtranslate.y);
    draw.clearRect(-c.width / 2, -c.height / 2, c.width, c.height);
    draw.translate(translate.x, translate.y);
    draw.scale(scale, scale);
    prevtranslate.x = translate.x;
    prevtranslate.y = translate.y;
    prevscale = scale;
    draw.rotate(45 * Math.PI / 180);
    draw.transform(1, -0.35, -0.35, 1, 0, 0);
    draw.drawImage(mapc, 0, 0);
}

function terraform() {
    map.putImageData(mapData, 0, 0);

    if (mapTool == "land") {
        map.strokeStyle = land;
        map.lineWidth = 10;
        map.beginPath();
        map.moveTo(pmousevariable.x, pmousevariable.y);
        map.lineTo(mousevariable.x, mousevariable.y);
        map.stroke();
    }

    if (mapTool == "ocean") {
        map.strokeStyle = ocean;
        map.lineWidth = 10;
        map.beginPath();
        map.moveTo(pmousevariable.x, pmousevariable.y);
        map.lineTo(mousevariable.x, mousevariable.y);
        map.stroke();
     }

    mapData = map.getImageData(0, 0, mapc.width, mapc.height)
}

setup();