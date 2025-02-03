const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("Unable to initialize WebGL.");
}

let time = 0.0; 

const vertexSource = ` attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); } `; 

const fragmentSource = `
precision mediump float;

uniform float time;
uniform vec2 resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    
    float r = 0.3 + 0.2 * sin(time);
    float dist = length(uv - vec2(0.0, 0.5));
    
    float heart = step(0.5, 0.25 - dist + 0.1 * sin(5.0 * time));
    
    vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 0.8), heart);
    
    gl_FragColor = vec4(color, 1.0); 
    
} 
`; 

// Compile shaders 
function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed", gl.getShaderInfoLog(shader));
        return null;
    } return shader;
}

const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource); 

// Create program 
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking failed", gl.getProgramInfoLog(program));
}

// Get attribute and uniform locations
const positionLocation = gl.getAttribLocation(program, "position");
const timeLocation = gl.getUniformLocation(program, "time");
const resolutionLocation = gl.getUniformLocation(program, "resolution");

// Create buffer
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1, 1, 1
]), gl.STATIC_DRAW);

// Set up attributes

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Render loop
function render() {
    time += 0.01;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.useProgram(program); gl.uniform1f(timeLocation, time);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    requestAnimationFrame(render); 
}
render();