import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import "./CircularGallery.css";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function createTextTexture(gl, text, font = "bold 30px monospace", color = "black") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = "#545050", font = "30px sans-serif" }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, { 
      generateMipmaps: true,
      minFilter: this.gl.LINEAR_MIPMAP_LINEAR,
      magFilter: this.gl.LINEAR,
      wrapS: this.gl.CLAMP_TO_EDGE,
      wrapT: this.gl.CLAMP_TO_EDGE
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 2.0 + uTime * 0.5) * 0.7 + cos(p.y * 1.0 + uTime * 0.5) * 0.7) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uAlpha;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth anti-aliased edges
          float smoothWidth = 0.01;
          float alpha = 1.0 - smoothstep(-smoothWidth, smoothWidth, d);
          
          if(alpha < 0.01) {
            discard;
          }
          
          // Vignette effect
          float dist = distance(vUv, vec2(0.5));
          float vignette = smoothstep(0.5, 0.9, dist);
          color.rgb *= mix(1.0, 0.7, vignette); // softer vignette
          gl_FragColor = vec4(color.rgb, uAlpha * alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uAlpha: { value: 1.0 },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      texture.needsUpdate = true; // Ensure OGL updates the texture
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
    img.onerror = (e) => {
      console.error('Failed to load gallery image:', this.image, e);
    };
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      fontFamily: this.font,
    });
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    // Scale the middle card to 1.5x, others to 1x
    let isCenter = false;
    if (this.viewport && this.plane) {
      const centerX = 0;
      const dist = Math.abs(this.plane.position.x - centerX);
      const threshold = this.width / 2; // within half width is considered center
      const maxDist = this.width * 3; // fade out over 3 cards
      const targetScale = dist < threshold ? 1.5 : 1.0;
      isCenter = dist < threshold;
      // Smooth scaling
      this.plane.scale.x = lerp(this.plane.scale.x, this.baseScaleX * targetScale, 0.2);
      this.plane.scale.y = lerp(this.plane.scale.y, this.baseScaleY * targetScale, 0.2);
      // Set alpha: 1.0 at center, 1.0 at 1 card away, 0.8 at 2 away, 0.5 at 3 away, 0.2 for farther
      if (this.program && this.program.uniforms && this.program.uniforms.uAlpha) {
        let alpha = 1.0;
        if (dist < this.width * 0.5) {
          alpha = 1.0; // center card
        } else if (dist < this.width * 1.5) {
          alpha = 1.0; // adjacent cards
        } else if (dist < this.width * 2.5) {
          alpha = 0.8;
        } else if (dist < this.width * 3.5) {
          alpha = 0.5;
        } else {
          alpha = 0.2;
        }
        this.program.uniforms.uAlpha.value = alpha;
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1500;
    // Set card aspect ratio to 2:3 (width:height)
    this.plane.scale.y = ((this.viewport.height * (900 * this.scale)) / this.screen.height) * 0.5 * 1.5;
    this.plane.scale.x = this.plane.scale.y * (2.0 / 3.0);
    this.baseScaleX = this.plane.scale.x;
    this.baseScaleY = this.plane.scale.y;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 3; // increased from 2 to 3 for 1.5x spacing
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = "#ffffff",
      borderRadius = 0,
      font = "bold 30px Figtree",
      scrollSpeed = 2,
      scrollEase = 0.05,
    } = {}
  ) {
    document.documentElement.classList.remove("no-js");
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: "Bridge" },
      { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: "Desk Setup" },
      { image: `https://picsum.photos/seed/3/800/600?grayscale`, text: "Waterfall" },
      { image: `https://picsum.photos/seed/4/800/600?grayscale`, text: "Strawberries" },
      { image: `https://picsum.photos/seed/5/800/600?grayscale`, text: "Deep Diving" },
      { image: `https://picsum.photos/seed/16/800/600?grayscale`, text: "Train Track" },
      { image: `https://picsum.photos/seed/17/800/600?grayscale`, text: "Santorini" },
      { image: `https://picsum.photos/seed/8/800/600?grayscale`, text: "Blurry Lights" },
      { image: `https://picsum.photos/seed/9/800/600?grayscale`, text: "New York" },
      { image: `https://picsum.photos/seed/10/800/600?grayscale`, text: "Good Boy" },
      { image: `https://picsum.photos/seed/21/800/600?grayscale`, text: "Coastline" },
      { image: `https://picsum.photos/seed/12/800/600?grayscale`, text: "Palm Trees" },
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems;
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
    this.realLength = galleryItems.length;
  }
  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
    // Track the starting index
    if (this.medias && this.medias[0]) {
      const width = this.medias[0].width;
      this.startIndex = Math.round(this.scroll.current / width);
    } else {
      this.startIndex = 0;
    }
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
    // Only move one card per drag
    if (this.medias && this.medias[0]) {
      const width = this.medias[0].width;
      const dragDistance = this.scroll.target - this.scroll.position;
      let newIndex = this.startIndex;
      if (dragDistance > width / 4) {
        // Dragged right (move to next card)
        newIndex = this.startIndex + 1;
      } else if (dragDistance < -width / 4) {
        // Dragged left (move to previous card)
        newIndex = this.startIndex - 1;
      }
      // Clamp to valid range
      newIndex = Math.max(0, Math.min(newIndex, this.medias.length - 1));
      this.scroll.target = newIndex * width;
      if (this.scroll.position < 0) this.scroll.target = -this.scroll.target;
      this.onCheck();
    } else {
      this.onCheck();
    }
  }
  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const totalWidth = width * this.realLength;
    let rawIndex = Math.round(this.scroll.target / width);
    // Wrap index for infinite effect
    if (rawIndex < 0) rawIndex += this.realLength;
    if (rawIndex >= this.realLength) rawIndex -= this.realLength;
    const item = width * rawIndex;
    this.scroll.target = item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
    // Infinite carousel logic
    const totalWidth = this.width * this.realLength;
    if (this.scroll.current < -totalWidth) {
      this.scroll.current += totalWidth;
      this.scroll.target += totalWidth;
    } else if (this.scroll.current > totalWidth) {
      this.scroll.current -= totalWidth;
      this.scroll.target -= totalWidth;
    }
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchstart", this.boundOnTouchDown);
    window.addEventListener("touchmove", this.boundOnTouchMove);
    window.addEventListener("touchend", this.boundOnTouchUp);
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 0,
  textColor = "#ffffff",
  borderRadius = 0.12,
  font = "bold 30px Figtree",
  scrollSpeed = 2,
  scrollEase = 0.05,
  onActiveIndexChange, // <-- add this prop
}) {
  const containerRef = useRef(null);
  const autoMoveIntervalRef = useRef();
  const isUserInteractingRef = useRef(false);

  useEffect(() => {
    let lastActiveIndex = 0;
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase });
    // Patch App's onCheck to notify parent
    const origOnCheck = app.onCheck.bind(app);
    app.onCheck = function() {
      origOnCheck();
      if (app.medias && app.medias[0]) {
        const width = app.medias[0].width;
        const itemIndex = Math.round(Math.abs(app.scroll.target) / width) % items.length;
        if (itemIndex !== lastActiveIndex) {
          lastActiveIndex = itemIndex;
          if (typeof onActiveIndexChange === 'function') {
            onActiveIndexChange(itemIndex);
          }
          // Reset auto-move timer on card change
          resetAutoMoveInterval();
        }
      }
    };
    // Remove global wheel listeners from App
    if (app.boundOnWheel) {
      window.removeEventListener("mousewheel", app.boundOnWheel);
      window.removeEventListener("wheel", app.boundOnWheel);
    }
    // Remove wheel listener so page scroll works normally over the gallery

    // --- User interaction tracking ---
    const handlePointerDown = () => {
      isUserInteractingRef.current = true;
      clearInterval(autoMoveIntervalRef.current);
    };
    const handlePointerUp = () => {
      isUserInteractingRef.current = false;
      resetAutoMoveInterval();
    };
    containerRef.current.addEventListener('mousedown', handlePointerDown);
    containerRef.current.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);

    // --- Auto-move logic ---
    function resetAutoMoveInterval() {
      clearInterval(autoMoveIntervalRef.current);
      autoMoveIntervalRef.current = setInterval(() => {
        if (isUserInteractingRef.current) return;
        if (app.medias && app.medias[0]) {
          const width = app.medias[0].width;
          let currentIndex = Math.round(app.scroll.current / width);
          let nextIndex = currentIndex + 1;
          if (nextIndex < 0) nextIndex += app.realLength;
          if (nextIndex >= app.realLength) nextIndex -= app.realLength;

          // Animate scroll.target smoothly to nextIndex * width
          const start = app.scroll.target;
          const end = nextIndex * width;
          const duration = 800; // ms (longer than 700ms CSS transition)
          const startTime = performance.now();

          function animateScroll(now) {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            app.scroll.target = start + (end - start) * t;
            if (t < 1) {
              window.requestAnimationFrame(animateScroll);
            } else {
              app.scroll.target = end;
              app.onCheck();
            }
          }
          window.requestAnimationFrame(animateScroll);
        }
      }, 5000);
    }
    resetAutoMoveInterval();

    return () => {
      app.destroy();
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousedown', handlePointerDown);
        containerRef.current.removeEventListener('touchstart', handlePointerDown);
      }
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      clearInterval(autoMoveIntervalRef.current);
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, onActiveIndexChange]);
  return <div className="circular-gallery" ref={containerRef} />;
} 