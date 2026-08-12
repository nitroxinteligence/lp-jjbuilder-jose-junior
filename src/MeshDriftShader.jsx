import { useEffect, useRef } from 'react'
import fragmentShaderSource from './shaders/mesh-drift.frag?raw'

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const shaderColors = new Float32Array([
  0.003, 0.003, 0.003,
  0.208, 0.063, 0.012,
  0.443, 0.188, 0.0,
  0.718, 0.267, 0.031,
  0.949, 0.392, 0.098,
  0.0, 0.0, 0.0,
  0.0, 0.0, 0.0,
  0.0, 0.0, 0.0,
])

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader

  const message = gl.getShaderInfoLog(shader) || 'Falha ao compilar o shader.'
  gl.deleteShader(shader)
  throw new Error(message)
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program

  const message = gl.getProgramInfoLog(program) || 'Falha ao vincular o shader.'
  gl.deleteProgram(program)
  throw new Error(message)
}

export default function MeshDriftShader() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })

    if (!canvas || !gl) return undefined

    let vertexShader
    let fragmentShader
    let program

    try {
      vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
      fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
      program = createProgram(gl, vertexShader, fragmentShader)
    } catch (error) {
      console.warn('Mesh drift shader indisponível:', error)
      return undefined
    }

    const positionBuffer = gl.createBuffer()
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const uniforms = {
      colors: gl.getUniformLocation(program, 'u_colors[0]'),
      scene: gl.getUniformLocation(program, 'u_scene'),
      shape: gl.getUniformLocation(program, 'u_shape'),
      surface: gl.getUniformLocation(program, 'u_surface'),
      finish: gl.getUniformLocation(program, 'u_finish'),
      transform: gl.getUniformLocation(program, 'u_transform'),
      space: gl.getUniformLocation(program, 'u_space'),
      cursor: gl.getUniformLocation(program, 'u_cursor'),
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    gl.uniform3fv(uniforms.colors, shaderColors)
    gl.uniform4f(uniforms.shape, 1.16, 0.34, 0.5, 0)
    gl.uniform4f(uniforms.surface, 2.4, 1.16, 0, 1)
    gl.uniform4f(uniforms.finish, 0, 0, 0, 0.09)
    gl.uniform4f(uniforms.transform, 1453, 0, 0, 0)

    const pointer = { x: 0, y: 0, presence: 0 }
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let prefersReducedMotion = motionPreference.matches
    let isVisible = true
    let isDisposed = false
    let animationFrame = 0

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75)
      const width = Math.max(1, Math.round(bounds.width * pixelRatio))
      const height = Math.max(1, Math.round(bounds.height * pixelRatio))

      if (canvas.width === width && canvas.height === height) return

      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
    }

    const draw = (timestamp = 0) => {
      resizeCanvas()
      gl.useProgram(program)
      gl.uniform4f(
        uniforms.scene,
        canvas.width,
        canvas.height,
        (timestamp / 1000) * 0.73,
        5,
      )
      gl.uniform4f(uniforms.space, 0, 0, pointer.x, pointer.y)
      gl.uniform4f(uniforms.cursor, pointer.presence, 2, 0.65, 0.46)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const scheduleFrame = () => {
      if (
        isDisposed ||
        prefersReducedMotion ||
        !isVisible ||
        animationFrame
      ) {
        return
      }

      animationFrame = requestAnimationFrame((timestamp) => {
        animationFrame = 0
        draw(timestamp)
        scheduleFrame()
      })
    }

    const stopAnimation = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }

    const updatePointer = (event) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = (1 - (event.clientY - bounds.top) / bounds.height) * 2 - 1
      pointer.presence = 1
    }

    const clearPointer = () => {
      pointer.presence = 0
    }

    const handleMotionPreference = (event) => {
      prefersReducedMotion = event.matches

      if (prefersReducedMotion) {
        stopAnimation()
        draw(0)
      } else {
        scheduleFrame()
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
      if (prefersReducedMotion) draw(0)
    })
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) scheduleFrame()
        else stopAnimation()
      },
      { threshold: 0.05 },
    )

    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    canvas.addEventListener('pointermove', updatePointer)
    canvas.addEventListener('pointerleave', clearPointer)
    motionPreference.addEventListener('change', handleMotionPreference)

    draw(0)
    scheduleFrame()

    return () => {
      isDisposed = true
      stopAnimation()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      canvas.removeEventListener('pointermove', updatePointer)
      canvas.removeEventListener('pointerleave', clearPointer)
      motionPreference.removeEventListener('change', handleMotionPreference)
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  return <canvas className="metrics-shader" ref={canvasRef} aria-hidden="true" />
}
