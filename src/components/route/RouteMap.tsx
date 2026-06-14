import { Card, Text, Group, Box, Badge, ActionIcon, Tooltip, SegmentedControl } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Plane, ZoomIn, ZoomOut, Move, RotateCcw, Layers, Globe, Maximize2 } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { NeonText } from '../effects/NeonText';
import { formatDistance } from '../../utils/calculations';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Attraction, Planet } from '../../types';
import { AttractionDetailModal } from './AttractionDetailModal';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
}

interface ViewState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

const EARTH_RADIUS = 6371;
const PLANET_SCALE = {
  moon: 1737,
  mars: 3389,
  europa: 1560,
  titan: 2574,
  venus: 6051,
  'kepler-442b': 8300
};

export const RouteMap = () => {
  const { destination, attractions } = useTravelStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [showScaleView, setShowScaleView] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [viewState, setViewState] = useState<ViewState>({ scale: 1, offsetX: 0, offsetY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [hoveredAttraction, setHoveredAttraction] = useState<Attraction | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const animationRef = useRef<number>();
  const progressRef = useRef(0);
  const threeSceneRef = useRef<THREE.Scene | null>(null);
  const threeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const threeRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const threeAnimationRef = useRef<number>();
  const spacecraftMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesSystemRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 200; i++) {
        newStars.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 2 + 1
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  useEffect(() => {
    if (!destination) return;
    
    const newParticles: Particle[] = [];
    const colors = ['#00f5d4', destination.color, '#ffbe0b', '#9d4edd'];
    
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: 0,
        y: 0,
        progress: Math.random(),
        speed: Math.random() * 0.003 + 0.001,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: []
      });
    }
    setParticles(newParticles);
  }, [destination]);

  const initThreeJS = useCallback(() => {
    if (!threeContainerRef.current || !destination) return;

    const width = threeContainerRef.current.clientWidth;
    const height = threeContainerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    threeSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    camera.position.set(0, 50, 150);
    camera.lookAt(0, 0, 0);
    threeCameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeContainerRef.current.appendChild(renderer.domElement);
    threeRendererRef.current = renderer;

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 2000;
      starPositions[i + 1] = (Math.random() - 0.5) * 2000;
      starPositions[i + 2] = (Math.random() - 0.5) * 2000;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    const earthGeometry = new THREE.SphereGeometry(15, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2ecc71,
      emissive: 0x1a5f3a,
      emissiveIntensity: 0.2,
      shininess: 100
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(-80, 0, 0);
    scene.add(earth);

    const earthGlowGeometry = new THREE.SphereGeometry(18, 64, 64);
    const earthGlowMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f5d4,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const earthGlow = new THREE.Mesh(earthGlowGeometry, earthGlowMaterial);
    earthGlow.position.copy(earth.position);
    scene.add(earthGlow);

    const destColor = new THREE.Color(destination.color);
    const destSize = Math.min(30, Math.max(10, (PLANET_SCALE[destination.id as keyof typeof PLANET_SCALE] || 3000) / 200));
    const destGeometry = new THREE.SphereGeometry(destSize, 64, 64);
    const destMaterial = new THREE.MeshPhongMaterial({
      color: destColor,
      emissive: destColor,
      emissiveIntensity: 0.3,
      shininess: 100
    });
    const destPlanet = new THREE.Mesh(destGeometry, destMaterial);
    destPlanet.position.set(80, 0, 0);
    scene.add(destPlanet);

    const destGlowGeometry = new THREE.SphereGeometry(destSize + 5, 64, 64);
    const destGlowMaterial = new THREE.MeshPhongMaterial({
      color: destColor,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const destGlow = new THREE.Mesh(destGlowGeometry, destGlowMaterial);
    destGlow.position.copy(destPlanet.position);
    scene.add(destGlow);

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-80, 0, 0),
      new THREE.Vector3(0, 40, 0),
      new THREE.Vector3(80, 0, 0)
    );

    const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.5, 8, false);
    const tubeMaterial = new THREE.MeshPhongMaterial({
      color: destColor,
      transparent: true,
      opacity: 0.3,
      emissive: destColor,
      emissiveIntensity: 0.2
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube);

    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const t = Math.random();
      const point = curve.getPoint(t);
      particlePositions[i * 3] = point.x;
      particlePositions[i * 3 + 1] = point.y;
      particlePositions[i * 3 + 2] = point.z;
      
      const color = new THREE.Color();
      color.setHSL(0.5 + t * 0.3, 1, 0.6);
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particlesSystemRef.current = particleSystem;

    const spacecraftGeometry = new THREE.ConeGeometry(2, 5, 8);
    const spacecraftMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f5d4,
      emissive: 0x00f5d4,
      emissiveIntensity: 0.5
    });
    const spacecraft = new THREE.Mesh(spacecraftGeometry, spacecraftMaterial);
    spacecraft.rotation.x = Math.PI / 2;
    scene.add(spacecraft);
    spacecraftMeshRef.current = spacecraft;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f5d4, 1, 500);
    pointLight1.position.set(-80, 0, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(destColor, 1, 500);
    pointLight2.position.set(80, 0, 0);
    scene.add(pointLight2);

    attractions.forEach((attraction, index) => {
      const t = (index + 1) / (attractions.length + 1);
      const point = curve.getPoint(t);
      
      const attractionGeometry = new THREE.SphereGeometry(2, 32, 32);
      const attractionMaterial = new THREE.MeshPhongMaterial({
        color: 0xffbe0b,
        emissive: 0xffbe0b,
        emissiveIntensity: 0.8
      });
      const attractionMesh = new THREE.Mesh(attractionGeometry, attractionMaterial);
      attractionMesh.position.copy(point);
      attractionMesh.userData = { attraction };
      scene.add(attractionMesh);

      const attractionGlowGeometry = new THREE.SphereGeometry(3, 32, 32);
      const attractionGlowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffbe0b,
        transparent: true,
        opacity: 0.3
      });
      const attractionGlow = new THREE.Mesh(attractionGlowGeometry, attractionGlowMaterial);
      attractionGlow.position.copy(point);
      scene.add(attractionGlow);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      for (const intersect of intersects) {
        if (intersect.object.userData.attraction) {
          setSelectedAttraction(intersect.object.userData.attraction);
          setModalOpened(true);
          break;
        }
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    const animate = () => {
      threeAnimationRef.current = requestAnimationFrame(animate);

      earth.rotation.y += 0.002;
      destPlanet.rotation.y += 0.003;

      const time = Date.now() * 0.001;
      const t = (Math.sin(time * 0.3) + 1) / 2;
      
      if (spacecraftMeshRef.current) {
        const point = curve.getPoint(t);
        spacecraftMeshRef.current.position.copy(point);
        
        const tangent = curve.getTangent(t);
        spacecraftMeshRef.current.lookAt(
          point.x + tangent.x,
          point.y + tangent.y,
          point.z + tangent.z
        );
      }

      if (particlesSystemRef.current) {
        const positions = particlesSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const t = (time * 0.1 + i / particleCount) % 1;
          const point = curve.getPoint(t);
          positions[i * 3] = point.x + (Math.random() - 0.5) * 2;
          positions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 2;
          positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 2;
        }
        particlesSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      camera.position.x = Math.sin(time * 0.1) * 20;
      camera.position.y = 50 + Math.sin(time * 0.15) * 10;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.domElement.removeEventListener('click', onMouseClick);
      if (threeAnimationRef.current) {
        cancelAnimationFrame(threeAnimationRef.current);
      }
      renderer.dispose();
      if (threeContainerRef.current && renderer.domElement.parentNode === threeContainerRef.current) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [destination, attractions]);

  useEffect(() => {
    if (viewMode === '3d' && destination) {
      const cleanup = initThreeJS();
      return cleanup;
    }
  }, [viewMode, destination, initThreeJS]);

  useEffect(() => {
    if (viewMode !== '2d' || !destination) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      progressRef.current += 0.005;
      if (progressRef.current > 1) progressRef.current = 0;

      const width = canvas.width;
      const height = canvas.height;

      ctx.save();
      ctx.translate(viewState.offsetX, viewState.offsetY);
      ctx.scale(viewState.scale, viewState.scale);

      ctx.clearRect(-viewState.offsetX / viewState.scale, -viewState.offsetY / viewState.scale, 
        width / viewState.scale, height / viewState.scale);

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        const twinkle = Math.sin(Date.now() / 1000 * star.twinkleSpeed + star.x * 10) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * (0.3 + twinkle * 0.7)})`;
        ctx.fill();
      });

      const startX = width * 0.15;
      const startY = height * 0.5;
      const endX = width * 0.85;
      const endY = height * 0.5;
      const midX = (startX + endX) / 2;
      const midY = height * 0.2;

      const path = new Path2D();
      path.moveTo(startX, startY);
      path.quadraticCurveTo(midX, midY, endX, endY);

      ctx.strokeStyle = destination.color + '33';
      ctx.lineWidth = 6;
      ctx.stroke(path);

      const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
      gradient.addColorStop(0, '#00f5d4');
      gradient.addColorStop(0.5, destination.color);
      gradient.addColorStop(1, destination.color);

      const dashOffset = -progressRef.current * 300;
      ctx.setLineDash([15, 15]);
      ctx.lineDashOffset = dashOffset;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.stroke(path);
      ctx.setLineDash([]);

      setParticles(prev => prev.map(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        
        const t = p.progress;
        p.x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
        p.y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;

        p.trail.unshift({ x: p.x, y: p.y, alpha: 1 });
        if (p.trail.length > 10) p.trail.pop();
        p.trail.forEach((point, i) => {
          point.alpha = 1 - i / p.trail.length;
        });

        return p;
      }));

      particles.forEach(p => {
        p.trail.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, p.size * point.alpha, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.floor(point.alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glow.addColorStop(0, p.color);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fill();
      });

      const progress = progressRef.current;
      const t = progress;
      const shipX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
      const shipY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;

      const shipGlow = ctx.createRadialGradient(shipX, shipY, 0, shipX, shipY, 30);
      shipGlow.addColorStop(0, '#00f5d4');
      shipGlow.addColorStop(0.5, '#00f5d466');
      shipGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = shipGlow;
      ctx.beginPath();
      ctx.arc(shipX, shipY, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f5d4';
      ctx.beginPath();
      ctx.arc(shipX, shipY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f5d4';
      ctx.beginPath();
      ctx.arc(startX, startY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a1628';
      ctx.beginPath();
      ctx.arc(startX, startY, 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(startX, startY, 14, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = destination.color;
      ctx.beginPath();
      ctx.arc(endX, endY, 18, 0, Math.PI * 2);
      ctx.fill();
      
      const planetGlow = ctx.createRadialGradient(endX, endY, 12, endX, endY, 45);
      planetGlow.addColorStop(0, destination.color + '88');
      planetGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = planetGlow;
      ctx.beginPath();
      ctx.arc(endX, endY, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = destination.color + '66';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(endX, endY, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (attractions.length > 0) {
        attractions.forEach((attraction, index) => {
          const attProgress = (index + 1) / (attractions.length + 1);
          const attX = (1 - attProgress) * (1 - attProgress) * startX + 2 * (1 - attProgress) * attProgress * midX + attProgress * attProgress * endX;
          const attY = (1 - attProgress) * (1 - attProgress) * startY + 2 * (1 - attProgress) * attProgress * midY + attProgress * attProgress * endY - 20;

          const pulse = Math.sin(Date.now() / 400 + index * 0.5) * 0.5 + 0.5;
          
          const attGlow = ctx.createRadialGradient(attX, attY, 0, attX, attY, 20 + pulse * 8);
          attGlow.addColorStop(0, `rgba(255, 190, 11, ${0.6 + pulse * 0.4})`);
          attGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = attGlow;
          ctx.beginPath();
          ctx.arc(attX, attY, 20 + pulse * 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffbe0b';
          ctx.beginPath();
          ctx.arc(attX, attY, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffbe0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(attX, attY, 12 + pulse * 3, 0, Math.PI * 2);
          ctx.stroke();

          if (hoveredAttraction?.id === attraction.id) {
            ctx.fillStyle = 'rgba(10, 22, 40, 0.95)';
            ctx.strokeStyle = 'rgba(255, 190, 11, 0.5)';
            ctx.lineWidth = 1;
            
            const textWidth = ctx.measureText(attraction.name).width + 20;
            const boxX = mousePos.x - viewState.offsetX > width / 2 ? attX - textWidth - 10 : attX + 15;
            const boxY = attY - 15;
            
            ctx.beginPath();
            ctx.roundRect(boxX, boxY, textWidth, 30, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffbe0b';
            ctx.font = '12px Orbitron, sans-serif';
            ctx.textBaseline = 'middle';
            ctx.fillText(attraction.name, boxX + 10, boxY + 15);
          }
        });
      }

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [destination, stars, attractions, particles, viewState, hoveredAttraction, mousePos, viewMode]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewState(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * delta))
    }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - viewState.offsetX, y: e.clientY - viewState.offsetY });
  }, [viewState.offsetX, viewState.offsetY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    
    if (isDragging) {
      setViewState(prev => ({
        ...prev,
        offsetX: e.clientX - dragStart.x,
        offsetY: e.clientY - dragStart.y
      }));
    } else if (viewMode === '2d' && destination && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - viewState.offsetX) / viewState.scale;
      const y = (e.clientY - rect.top - viewState.offsetY) / viewState.scale;
      
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      const startX = width * 0.15;
      const startY = height * 0.5;
      const endX = width * 0.85;
      const endY = height * 0.5;
      const midX = (startX + endX) / 2;
      const midY = height * 0.2;

      let foundAttraction: Attraction | null = null;
      
      attractions.forEach((attraction, index) => {
        const attProgress = (index + 1) / (attractions.length + 1);
        const attX = (1 - attProgress) * (1 - attProgress) * startX + 2 * (1 - attProgress) * attProgress * midX + attProgress * attProgress * endX;
        const attY = (1 - attProgress) * (1 - attProgress) * startY + 2 * (1 - attProgress) * attProgress * midY + attProgress * attProgress * endY - 20;
        
        const dist = Math.sqrt((x - attX) ** 2 + (y - attY) ** 2);
        if (dist < 20) {
          foundAttraction = attraction;
        }
      });

      setHoveredAttraction(foundAttraction);
    }
  }, [isDragging, dragStart, viewState, viewMode, destination, attractions]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (isDragging || viewMode !== '2d' || !canvasRef.current || !destination) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewState.offsetX) / viewState.scale;
    const y = (e.clientY - rect.top - viewState.offsetY) / viewState.scale;
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const startX = width * 0.15;
    const startY = height * 0.5;
    const endX = width * 0.85;
    const endY = height * 0.5;
    const midX = (startX + endX) / 2;
    const midY = height * 0.2;

    attractions.forEach((attraction, index) => {
      const attProgress = (index + 1) / (attractions.length + 1);
      const attX = (1 - attProgress) * (1 - attProgress) * startX + 2 * (1 - attProgress) * attProgress * midX + attProgress * attProgress * endX;
      const attY = (1 - attProgress) * (1 - attProgress) * startY + 2 * (1 - attProgress) * attProgress * midY + attProgress * attProgress * endY - 20;
      
      const dist = Math.sqrt((x - attX) ** 2 + (y - attY) ** 2);
      if (dist < 20) {
        setSelectedAttraction(attraction);
        setModalOpened(true);
      }
    });
  }, [isDragging, viewMode, viewState, destination, attractions]);

  const resetView = () => {
    setViewState({ scale: 1, offsetX: 0, offsetY: 0 });
  };

  const zoomIn = () => {
    setViewState(prev => ({ ...prev, scale: Math.min(3, prev.scale * 1.2) }));
  };

  const zoomOut = () => {
    setViewState(prev => ({ ...prev, scale: Math.max(0.5, prev.scale * 0.8) }));
  };

  return (
    <>
      <Card p="lg" radius="lg">
        <Group justify="space-between" mb="lg" wrap="wrap">
          <Group gap="md">
            <NeonText color="#9d4edd" size="20px">
              航线规划
            </NeonText>
            <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              ROUTE NAVIGATION
            </Text>
          </Group>
          {destination && (
            <Group gap="md">
              <Badge 
                variant="dot" 
                color="neonCyan"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <Navigation size={12} style={{ marginRight: '4px' }} />
                导航中
              </Badge>
              <Badge 
                variant="outline" 
                color="neonPurple"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {formatDistance(destination.distance)}
              </Badge>
            </Group>
          )}
        </Group>

        {destination ? (
          <>
            <Group justify="space-between" mb="md" wrap="wrap" gap="md">
              <SegmentedControl
                value={viewMode}
                onChange={(v) => setViewMode(v as '2d' | '3d')}
                data={[
                  { label: '2D 视图', value: '2d' },
                  { label: '3D 视图', value: '3d' }
                ]}
                styles={{
                  root: {
                    backgroundColor: 'rgba(10, 22, 40, 0.6)',
                    border: '1px solid rgba(157, 78, 221, 0.3)'
                  },
                  label: {
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '11px'
                  }
                }}
              />

              <Group gap="xs" wrap="nowrap">
                <Tooltip label="真实比例示意图" position="top">
                  <ActionIcon
                    size="md"
                    variant={showScaleView ? 'filled' : 'light'}
                    color="neonPurple"
                    onClick={() => setShowScaleView(!showScaleView)}
                  >
                    <Maximize2 size={16} />
                  </ActionIcon>
                </Tooltip>
                {viewMode === '2d' && (
                  <>
                    <Tooltip label="放大" position="top">
                      <ActionIcon size="md" variant="light" color="neonCyan" onClick={zoomIn}>
                        <ZoomIn size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="缩小" position="top">
                      <ActionIcon size="md" variant="light" color="neonCyan" onClick={zoomOut}>
                        <ZoomOut size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="平移模式" position="top">
                      <ActionIcon 
                        size="md" 
                        variant={isDragging ? 'filled' : 'light'} 
                        color="neonCyan"
                      >
                        <Move size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="重置视图" position="top">
                      <ActionIcon size="md" variant="light" color="neonCyan" onClick={resetView}>
                        <RotateCcw size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </>
                )}
                <Tooltip label="显示图层" position="top">
                  <ActionIcon size="md" variant="light" color="neonPurple">
                    <Layers size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {showScaleView ? (
                  <ScaleView destination={destination} />
                ) : viewMode === '2d' ? (
                  <Box
                    ref={containerRef}
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(157, 78, 221, 0.3)',
                      background: 'linear-gradient(135deg, #0a1628, #060d1a)',
                      cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleCanvasClick}
                  >
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={250}
                      style={{ width: '100%', height: '250px', display: 'block' }}
                    />
                    
                    <Box
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        pointerEvents: 'none'
                      }}
                    >
                      <Box
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#00f5d4',
                          boxShadow: '0 0 10px #00f5d4'
                        }}
                      />
                      <Text size="xs" c="silverGray.3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        地球
                      </Text>
                    </Box>

                    <Box
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        pointerEvents: 'none'
                      }}
                    >
                      <Text size="xs" c="silverGray.3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {destination.name}
                      </Text>
                      <Box
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: destination.color,
                          boxShadow: `0 0 10px ${destination.color}`
                        }}
                      />
                    </Box>

                    {viewState.scale !== 1 && (
                      <Box
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: 'rgba(10, 22, 40, 0.8)',
                          border: '1px solid rgba(0, 245, 212, 0.3)',
                          pointerEvents: 'none'
                        }}
                      >
                        <Text size="xs" c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          {Math.round(viewState.scale * 100)}%
                        </Text>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box
                    ref={threeContainerRef}
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(157, 78, 221, 0.3)',
                      background: 'linear-gradient(135deg, #0a1628, #060d1a)',
                      height: '350px'
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <Group mt="md" grow>
              <Card 
                p="sm" 
                radius="md"
                style={{
                  background: 'rgba(0, 245, 212, 0.1)',
                  border: '1px solid rgba(0, 245, 212, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Group gap="xs" justify="center" mb="xs" wrap="nowrap">
                  <Plane size={16} color="#00f5d4" />
                  <Text size="xs" c="silverGray.5">预计飞行时间</Text>
                </Group>
                <Text fw={700} size="lg" c="neonCyan.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {destination.travelDays} 天
                </Text>
              </Card>
              <Card 
                p="sm" 
                radius="md"
                style={{
                  background: 'rgba(157, 78, 221, 0.1)',
                  border: '1px solid rgba(157, 78, 221, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Group gap="xs" justify="center" mb="xs" wrap="nowrap">
                  <MapPin size={16} color="#9d4edd" />
                  <Text size="xs" c="silverGray.5">途经景点</Text>
                </Group>
                <Text fw={700} size="lg" c="neonPurple.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {attractions.length} 个
                </Text>
              </Card>
              <Card 
                p="sm" 
                radius="md"
                style={{
                  background: 'rgba(255, 190, 11, 0.1)',
                  border: '1px solid rgba(255, 190, 11, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Group gap="xs" justify="center" mb="xs" wrap="nowrap">
                  <Navigation size={16} color="#ffbe0b" />
                  <Text size="xs" c="silverGray.5">航线状态</Text>
                </Group>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Text fw={700} size="lg" c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    已锁定
                  </Text>
                </motion.div>
              </Card>
            </Group>

            <Box mt="md">
              <Group gap="xs" mb="xs" wrap="nowrap">
                <Globe size={14} color="#9d4edd" />
                <Text size="xs" c="silverGray.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  操作提示
                </Text>
              </Group>
              <Text size="xs" c="silverGray.6">
                {viewMode === '2d' 
                  ? '滚轮缩放 · 拖拽平移 · 点击景点标记查看详情 · 点击比例按钮查看真实比例示意图'
                  : '3D 模式下可点击景点标记查看详情 · 场景自动旋转展示'}
              </Text>
            </Box>
          </>
        ) : (
          <Box style={{ padding: '40px', textAlign: 'center' }}>
            <motion.div
              animate={{ 
                rotate: [0, 360],
                transition: { duration: 20, repeat: Infinity, ease: 'linear' }
              }}
            >
              <Navigation size={48} color="#9d4edd" strokeWidth={1} />
            </motion.div>
            <Text size="lg" c="silverGray.5" mt="md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              选择目的地后规划航线
            </Text>
            <Text size="sm" c="silverGray.6" mt="xs">
              系统将自动计算最优航线和途经景点
            </Text>
          </Box>
        )}
      </Card>

      <AttractionDetailModal
        attraction={selectedAttraction}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  );
};

const ScaleView = ({ destination }: { destination: Planet }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0a1628');
      gradient.addColorStop(1, '#060d1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
        ctx.fill();
      }

      const centerY = height / 2;
      const padding = 60;

      const earthRadius = 30;
      const earthX = padding + earthRadius;

      const destActualRadius = PLANET_SCALE[destination.id as keyof typeof PLANET_SCALE] || 3000;
      const scale = (earthRadius * 1.5) / destActualRadius;
      const destRadius = Math.max(8, Math.min(120, destActualRadius * scale));
      const destX = width - padding - destRadius;

      const actualDistance = destination.distance;

      ctx.strokeStyle = 'rgba(157, 78, 221, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(earthX + earthRadius, centerY);
      ctx.lineTo(destX - destRadius, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      const midX = (earthX + destX) / 2;
      ctx.fillStyle = 'rgba(157, 78, 221, 0.2)';
      ctx.fillRect(midX - 80, centerY - 20, 160, 40);
      ctx.strokeStyle = 'rgba(157, 78, 221, 0.5)';
      ctx.strokeRect(midX - 80, centerY - 20, 160, 40);
      ctx.fillStyle = '#9d4edd';
      ctx.font = 'bold 12px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatDistance(actualDistance), midX, centerY);

      const earthGlow = ctx.createRadialGradient(earthX, centerY, 0, earthX, centerY, earthRadius + 20);
      earthGlow.addColorStop(0, 'rgba(0, 245, 212, 0.6)');
      earthGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = earthGlow;
      ctx.beginPath();
      ctx.arc(earthX, centerY, earthRadius + 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.arc(earthX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3498db';
      ctx.beginPath();
      ctx.arc(earthX - 5, centerY - 8, earthRadius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1a5f3a';
      ctx.beginPath();
      ctx.arc(earthX + 8, centerY + 5, earthRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('地球', earthX, centerY + earthRadius + 25);
      ctx.fillStyle = '#6c757d';
      ctx.font = '10px Orbitron, sans-serif';
      ctx.fillText(`直径: ${EARTH_RADIUS * 2} km`, earthX, centerY + earthRadius + 42);

      const destGlow = ctx.createRadialGradient(destX, centerY, 0, destX, centerY, destRadius + 25);
      destGlow.addColorStop(0, destination.color + '88');
      destGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = destGlow;
      ctx.beginPath();
      ctx.arc(destX, centerY, destRadius + 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = destination.color;
      ctx.beginPath();
      ctx.arc(destX, centerY, destRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = destination.color + '66';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(destX, centerY, destRadius + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(destination.name, destX, centerY + destRadius + 25);
      ctx.fillStyle = '#6c757d';
      ctx.font = '10px Orbitron, sans-serif';
      ctx.fillText(`直径: ${destActualRadius * 2} km`, destX, centerY + destRadius + 42);

      const sizeRatio = (destActualRadius / 3390).toFixed(2);
      ctx.fillStyle = '#ffbe0b';
      ctx.font = '10px Orbitron, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${destination.name} 是地球的 ${sizeRatio} 倍`, width - 20, 30);

      requestAnimationFrame(animate);
    };

    animate();
  }, [destination]);

  return (
    <Box
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 190, 11, 0.3)',
        background: 'linear-gradient(135deg, #0a1628, #060d1a)'
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        style={{ width: '100%', height: '300px', display: 'block' }}
      />
      <Box
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          padding: '6px 12px',
          borderRadius: '6px',
          background: 'rgba(255, 190, 11, 0.15)',
          border: '1px solid rgba(255, 190, 11, 0.4)'
        }}
      >
        <Group gap="xs" wrap="nowrap">
          <Maximize2 size={14} color="#ffbe0b" />
          <Text size="xs" c="energyYellow.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            真实比例示意图
          </Text>
        </Group>
      </Box>
    </Box>
  );
};
