// A small, self-contained WebGL renderer. The GPU shapes each thread from
// three attributes, so animation updates uniforms rather than geometry.
const vertexSource = `
precision highp float;
attribute vec3 aThread;
uniform vec2 uResolution;
uniform float uTime;
varying mediump float vOpacity;
varying mediump float vWarmth;

void main() {
  float segment = aThread.z;
  float strand = aThread.y;
  float progress = aThread.x;
  float angle = (0.24 + segment * 0.55 + progress * 0.49) * 3.14159265;
  float phase = uTime * 0.17;
  float twist = angle * 2.0 + sin(phase) * 0.28;
  float ribbon = strand * (0.10 + 0.025 * sin(angle * 3.0 + phase));
  float depth = sin(twist) * strand;
  float radius = 0.79 + ribbon * cos(twist);
  float x = cos(angle) * radius;
  float y = sin(angle) * (0.62 + ribbon * 0.9);
  x += sin(angle * 2.0 + phase) * 0.035 + depth * 0.07;
  y += cos(angle * 3.0 - phase) * 0.035 + ribbon * sin(twist) * 0.36;

  vec2 position = vec2(x, y);
  position.x *= mix(1.45, 1.16, smoothstep(400.0, 1000.0, uResolution.x));
  position.y = position.y * 0.95 + 0.03;
  gl_Position = vec4(position, 0.0, 1.0);

  float taper = smoothstep(0.0, 0.14, progress) * (1.0 - smoothstep(0.88, 1.0, progress));
  float shading = 0.68 + 0.32 * sin(angle * 2.0 + strand * 2.0 + phase);
  vOpacity = taper * (0.20 + shading * 0.28);
  vWarmth = smoothstep(0.35, 1.0, strand) * (0.5 + 0.5 * sin(angle));
}
`;

const fragmentSource = `
precision mediump float;
varying mediump float vOpacity;
varying mediump float vWarmth;
void main() {
  vec3 teal = vec3(0.157, 0.486, 0.451);
  vec3 sage = vec3(0.55, 0.59, 0.40);
  gl_FragColor = vec4(mix(teal, sage, vWarmth * 0.65), vOpacity);
}
`;

export type CadenceField = {
  resize: (width: number, height: number) => void;
  draw: (seconds: number) => void;
  dispose: () => void;
};

export function createCadenceField(
  canvas: HTMLCanvasElement,
): CadenceField | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    premultipliedAlpha: false,
  });
  if (!gl) return null;

  const shaders: WebGLShader[] = [];
  const buffers: WebGLBuffer[] = [];
  const program = gl.createProgram();
  function dispose() {
    buffers.forEach((buffer) => gl!.deleteBuffer(buffer));
    shaders.forEach((shader) => gl!.deleteShader(shader));
    if (program) gl!.deleteProgram(program);
  }
  if (!program) return null;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertexSource],
    [gl.FRAGMENT_SHADER, fragmentSource],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) {
      dispose();
      return null;
    }
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      dispose();
      return null;
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return null;
  }
  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const lines: number[] = [];
  const strands = 48;
  const steps = 150;
  for (let segment = 0; segment < 3; segment++) {
    for (let strand = 0; strand < strands; strand++) {
      const across = (strand / (strands - 1)) * 2 - 1;
      for (let step = 0; step < steps; step++) {
        lines.push(
          step / steps,
          across,
          segment,
          (step + 1) / steps,
          across,
          segment,
        );
      }
    }
  }
  function buffer(data: number[]) {
    const result = gl!.createBuffer();
    if (!result) return null;
    buffers.push(result);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, result);
    gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(data), gl!.STATIC_DRAW);
    return result;
  }
  const lineBuffer = buffer(lines);
  if (!lineBuffer) {
    dispose();
    return null;
  }
  const attribute = gl.getAttribLocation(program, "aThread");
  gl.enableVertexAttribArray(attribute);
  const resolution = gl.getUniformLocation(program, "uResolution");
  const time = gl.getUniformLocation(program, "uTime");

  return {
    resize(width, height) {
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        width < 600 ? 1 : 1.5,
      );
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, width, height);
    },
    draw(seconds) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(time, seconds);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
      gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.LINES, 0, lines.length / 3);
    },
    dispose,
  };
}
