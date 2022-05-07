fillPalette(255, 0, 0);
var hoveredX = 0;
var hoveredY = 0;
var ctx;
var mousedown;
var rgb = [0, 0, 0];

function cut(val, max = 255){
    return Math.max(0, Math.min(max, val));
}

function setMouseDown(val){
    mousedown = val;
}

function updateColoursRGB(value, col){
    rgb[col] = cut(value);
    updateSlidersRGB();
    updateSlidersCMY();
    updateSlidersHSV();
}

function updateColoursCMY(value, col){
    rgb[col] = cut((1 - value) * 255);
    updateSlidersRGB();
    updateSlidersCMY();
    updateSlidersHSV();
}

function updateColoursHSV(slider){
    if (slider) {
        var s = [document.getElementById("slider-hsv-h"), document.getElementById("slider-hsv-s"), document.getElementById("slider-hsv-v")];
    } else {
        var s = [document.getElementById("input-hsv-h"), document.getElementById("input-hsv-s"), document.getElementById("input-hsv-v")];
    }
    let hsv = [cut(s[0].value, 360), cut(s[1].value, 100) / 100, cut(s[2].value, 100) / 100];
    let c = hsv[1] * hsv[2];
    let x = c * (1 - Math.abs((hsv[0] / 60) % 2 - 1));
    let m = hsv[2] - c;
    let hsv_templates = [[c, x, 0], [x ,c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]];
    let rgb_ = hsv_templates[Math.floor(hsv[0] / 60)];
    rgb = [(rgb_[0] + m) * 255, (rgb_[1] + m) * 255, (rgb_[2] + m) * 255];
    updateSlidersRGB();
    updateSlidersCMY();
    updateSlidersHSV();
}

function updateSlidersHSV(){
    let cmax = Math.max(...rgb);
    let cmin = Math.min(...rgb);
    let delta = cmax - cmin;
    if (cmax == cmin) {
        var h = 0;
    } else if (cmax == rgb[0] && rgb[1] >= rgb[2]) {
        var h = 60 * (rgb[1] - rgb[2]) / (cmax - cmin);
    } else if (cmax == rgb[0] && rgb[1] < rgb[2]) {
        var h = 60 * (rgb[1] - rgb[2]) / (cmax - cmin) + 360;
    } else if (cmax == rgb[1]) {
        var h = 60 * (rgb[2] - rgb[0]) / (cmax - cmin) + 120;
    } else if (cmax == rgb[2]) {
        var h = 60 * (rgb[0] - rgb[1]) / (cmax - cmin) + 240;
    }
    if (cmax == 0) {
        var s = 0;
    } else {
        var s = 1 - (cmin / cmax);
    }
    var v = cmax / 255;
    let hsv_ = [h, s, v];
    let slidersInputs = ["slider-hsv-h", "slider-hsv-s", "slider-hsv-v", "input-hsv-h", "input-hsv-s", "input-hsv-v"];
    for (const [index, sliderInput] of slidersInputs.entries()){
        if ((index % 3) == 0){
            document.getElementById(sliderInput).value = hsv_[index % 3];
        } else {
            document.getElementById(sliderInput).value = hsv_[index % 3] * 100;
        }
    }
}

function updateSlidersRGB(){
    let slidersInputs = ["slider-rgb-r", "slider-rgb-g", "slider-rgb-b", "input-rgb-r", "input-rgb-g", "input-rgb-b"];
    for (const [index, sliderInput] of slidersInputs.entries()){
        document.getElementById(sliderInput).value = rgb[index % 3];
    }
    document.getElementById("col-preview").style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

function updateSlidersCMY(){
    let sliders = ["slider-cmy-c", "slider-cmy-m", "slider-cmy-y"];
    for (const [index, sliderInput] of sliders.entries()){
        document.getElementById(sliderInput).value = (255 - rgb[index % 3]);
    }
    document.getElementById("col-preview").style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

    let inputs = ["input-cmy-c", "input-cmy-m", "input-cmy-y"];
    for (const [index, sliderInput] of inputs.entries()){
        document.getElementById(sliderInput).value = (255 - rgb[index % 3]) / 255;
    }
    document.getElementById("col-preview").style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

function setCoordinates(event){
    if (mousedown){
        hoveredX = Math.round(event.clientX); hoveredY = Math.round(event.clientY);
        var pixelData = ctx.getImageData(hoveredX, hoveredY, 1, 1);
        var data = pixelData.data;
        rgb = [data[0], data[1], data[2]];
        updateSlidersRGB();
        updateSlidersCMY();
        updateSlidersHSV();
    }
}

function setColour(sliderValue){
    let r = cut(- Math.abs(sliderValue) + 512) + cut(- Math.abs(sliderValue - 1536) + 512);
    let g = cut(- Math.abs(sliderValue - 512) + 512);
    let b = cut(- Math.abs(sliderValue - 1024) + 512);
    fillPalette(r, g, b);
}

function fillPalette(r, g, b){
    buffer = new Uint8ClampedArray(512 * 256 * 4)
    for(var y = 0; y < 256; y++) {
        for(var x = 0; x < 512; x++) {
            var pos = (y * 512 + x) * 4;
            buffer[pos  ] = r + (x / 2) * (255 - r) / 256 - y;    
            buffer[pos+1] = g + (x / 2) * (255 - g) / 256 - y;     
            buffer[pos+2] = b + (x / 2) * (255 - b) / 256 - y;   
            buffer[pos+3] = 255;          
        }
    }
    var canvas = document.getElementById('palette-canvas');
    ctx = canvas.getContext('2d');
    ctx.canvas.width = 512;
    ctx.canvas.height = 256;
    
    var idata = ctx.createImageData(512, 256);
    
    idata.data.set(buffer);
    
    ctx.putImageData(idata, 0, 0);
}