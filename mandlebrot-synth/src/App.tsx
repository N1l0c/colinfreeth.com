import { useRef, useEffect, useState } from "react";
import * as Tone from "tone";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [started, setStarted] = useState(false);
  const [scale, setScale] = useState(3);
  const [offsetX, setOffsetX] = useState(-0.7);
  const [offsetY, setOffsetY] = useState(0);
  const [maxIter, setMaxIter] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const synth = new Tone.Synth().toDestination();
    return () => {
      synth.dispose();
    };
  }, []);

  useEffect(() => {
    if (!started) {
      console.log("App not started yet.");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL context not available.");
      return;
    }

    console.log("Canvas and WebGL context initialized.");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log("Canvas dimensions set:", canvas.width, canvas.height);

    // Create shaders and program
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_zoom;
      uniform vec2 u_offset;
      uniform int u_maxIter;

      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          `Shader compile error (${type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT"}):`,
          gl.getShaderInfoLog(shader)
        );
      } else {
        console.log(
          `Shader compiled successfully (${type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT"}).`
        );
      }
      return shader;
    };

    const program = gl.createProgram()!;
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    } else {
      console.log("Program linked successfully.");
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttrib = gl.getAttribLocation(program, "a_position");
    if (posAttrib === -1) {
      console.error("Attribute 'a_position' not found in shader program.");
      return;
    } else {
      console.log("Attribute 'a_position' location:", posAttrib);
    }

    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const u_resolution = gl.getUniformLocation(program, "u_resolution");
    const u_zoom = gl.getUniformLocation(program, "u_zoom");
    const u_offset = gl.getUniformLocation(program, "u_offset");
    const u_maxIter = gl.getUniformLocation(program, "u_maxIter");

    if (!u_resolution || !u_zoom || !u_offset || !u_maxIter) {
      console.error("One or more uniform locations not found:", {
        u_resolution,
        u_zoom,
        u_offset,
        u_maxIter,
      });
      return;
    } else {
      console.log("Uniform locations:", {
        u_resolution,
        u_zoom,
        u_offset,
        u_maxIter,
      });
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background

    let lastScale = scale;
    let lastOffsetX = offsetX;
    let lastOffsetY = offsetY;

    const render = () => {
      gl.useProgram(program);

      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.uniform2f(u_resolution, canvas.width, canvas.height);

      if (scale !== lastScale) {
        gl.uniform1f(u_zoom, scale);
        lastScale = scale;
      }

      if (offsetX !== lastOffsetX || offsetY !== lastOffsetY) {
        gl.uniform2f(u_offset, offsetX, offsetY);
        lastOffsetX = offsetX;
        lastOffsetY = offsetY;
      }

      gl.uniform1i(u_maxIter, maxIter);

      console.log("Uniform values:");
      console.log("u_resolution:", canvas.width, canvas.height);
      console.log("u_zoom:", scale);
      console.log("u_offset:", offsetX, offsetY);
      console.log("u_maxIter:", maxIter);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(render);
    };

    render();
  }, [started, scale, offsetX, offsetY, maxIter]);

  return (
    <>
      {!started && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            color: "white",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setStarted(true)}
            style={{
              fontSize: "1.2rem",
              padding: "1rem 2rem",
              background: "white",
              color: "black",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Tap to Start
          </button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100vw", height: "100vh" }}
      />
    </>
  );
}