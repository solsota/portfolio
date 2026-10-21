'use client';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, events, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  useBeforePhysicsStep
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

import cardGLB from './card.glb';
import lanyard from './lanyard.webp';

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

const BLANK_PIXEL =
  'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };
const CARD_ATTACHMENT = [0, 1.51, 0];

function createLanyardEvents(state) {
  let overNavigation = false;
  return {
    ...events(state),
    compute(event, currentState) {
      // The canvas listens on the entire page; visible menus own their input.
      overNavigation = Boolean(event.target?.closest?.('.navigation'));
      if (overNavigation) return;
      // Events arrive through the page so the transparent canvas doesn't
      // block navigation. Measure the canvas to keep raycasting aligned.
      const bounds = currentState.gl.domElement.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      currentState.pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      );
      currentState.raycaster.setFromCamera(currentState.pointer, currentState.camera);
    },
    filter(intersections) {
      return overNavigation ? [] : intersections;
    }
  };
}

export default function Lanyard({
  eventSource,
  position = [0, 0, 30],
  offset = [0, 0, 0],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}) {
  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [{ width: viewportWidth, height: viewportHeight }, setViewport] = useState(
    () => ({ width: window.innerWidth, height: window.innerHeight })
  );
  const isMobile = viewportWidth < 768;
  const stacked = viewportWidth <= 700;
  // Keep the original full-width scene; fit the card to the available width
  // instead of letting tall viewports magnify it over the hero copy.
  const fittedFov = THREE.MathUtils.radToDeg(2 * Math.atan(viewportHeight / (2 * position[2] * viewportWidth * 0.143)));

  useEffect(() => {
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' });
    observer.observe(wrapperRef.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="lanyard-wrapper" ref={wrapperRef}>
      <Canvas
        frameloop={visible && pageVisible ? 'always' : 'never'}
        resize={{ scroll: false }}
        eventSource={eventSource}
        events={createLanyardEvents}
        camera={{ position, fov: stacked ? 20 : Math.max(fov, fittedFov) }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(
            new THREE.Color(0x000000),
            transparent ? 0 : 1
          )
        }
      >
        <ambientLight intensity={Math.PI} />

        <Suspense fallback={null}>
        <Physics
          gravity={gravity}
          timeStep={1 / 60}
          interpolate
          numSolverIterations={8}
          updatePriority={-2}
          paused={!visible || !pageVisible}
        >
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            offset={stacked ? [0.65, 0.5, 0] : offset}
          />
        </Physics>

        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  offset = [0, 0, 0]
}) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const cardAttachmentRef = useRef();
  const jointVisuals = useRef([]);
  const gestureRef = useRef(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyardImage || lanyard);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;

    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    const width = baseImg.width;
    const height = baseImg.height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return baseMap;

    context.drawImage(baseImg, 0, 0, width, height);

    const drawFitted = (image, rect) => {
      const rectX = rect.x * width;
      const rectY = rect.y * height;
      const rectWidth = rect.w * width;
      const rectHeight = rect.h * height;

      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(
        rectWidth / image.width,
        rectHeight / image.height
      );

      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const drawX = rectX + (rectWidth - drawWidth) / 2;
      const drawY = rectY + (rectHeight - drawHeight) / 2;

      context.save();
      context.beginPath();
      context.rect(rectX, rectY, rectWidth, rectHeight);
      context.clip();
      context.drawImage(
        image,
        drawX,
        drawY,
        drawWidth,
        drawHeight
      );
      context.restore();
    };

    if (frontImage && frontTex.image) {
      drawFitted(frontTex.image, FRONT_UV_RECT);
    }

    if (backImage && backTex.image) {
      drawFitted(backTex.image, BACK_UV_RECT);
    }

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;

    return composite;
  }, [
    frontImage,
    backImage,
    imageFit,
    frontTex,
    backTex,
    materials.base.map
  ]);

  const [curve] = useState(() => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ]);
      curve.curveType = 'chordal';
      return curve;
  });

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  const finishDrag = useCallback(() => {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    if (gesture?.target.hasPointerCapture(gesture.id)) gesture.target.releasePointerCapture(gesture.id);
    drag(false);
    hover(false);
  }, []);

  useEffect(() => {
    // A touch scroll may end with pointercancel instead of pointerup. R3F
    // doesn't forward that event to meshes, so release at the native source.
    const move = event => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.id !== event.pointerId || gesture.type !== 'touch' || gesture.dragging) return;
      const dx = Math.abs(event.clientX - gesture.x);
      const dy = Math.abs(event.clientY - gesture.y);
      if (Math.max(dx, dy) < 10) return;
      if (dy >= dx) return finishDrag();
      gesture.dragging = true;
      gesture.target.setPointerCapture(gesture.id);
      drag(gesture.offset);
    };
    const end = event => {
      if (gestureRef.current?.id === event.pointerId) finishDrag();
    };
    const onVisibility = () => { if (document.hidden) finishDrag(); };
    window.addEventListener('pointermove', move, true);
    window.addEventListener('pointerup', end, true);
    window.addEventListener('pointercancel', end, true);
    window.addEventListener('lostpointercapture', end, true);
    window.addEventListener('blur', finishDrag);
    window.addEventListener('scroll', finishDrag, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', end, true);
      window.removeEventListener('pointercancel', end, true);
      window.removeEventListener('lostpointercapture', end, true);
      window.removeEventListener('blur', finishDrag);
      window.removeEventListener('scroll', finishDrag);
      document.removeEventListener('visibilitychange', onVisibility);
      const gesture = gestureRef.current;
      gestureRef.current = null;
      if (gesture?.target.hasPointerCapture(gesture.id)) gesture.target.releasePointerCapture(gesture.id);
    };
  }, [finishDrag]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);

  useSphericalJoint(j3, card, [
    [0, 0, 0],
    CARD_ATTACHMENT
  ]);

  useEffect(() => {
    if (!hovered) return undefined;

    document.body.style.cursor = dragged ? 'grabbing' : 'grab';

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, dragged]);

  useBeforePhysicsStep(() => {
    if (!card.current || card.current.isSleeping() || dragged) return;
    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    // Apply this once per physics step, not once per rendered frame.
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, false);
  });

  // Apply drag input before Rapier advances the bodies for this frame.
  useFrame((state) => {
    if (dragged) {
      state.raycaster.setFromCamera(state.pointer, state.camera);
      state.raycaster.ray.intersectPlane(dragPlaneRef.current, vec);

      [card, j1, j2, j3, fixed].forEach((ref) =>
        ref.current?.wakeUp()
      );

      vec.sub(dragged);
      // Keep the card within the rope's reach instead of stretching the joints.
      const anchor = fixed.current.translation();
      const reach = 4.5;
      const distance = vec.distanceTo(anchor);
      if (distance > reach) vec.sub(anchor).multiplyScalar(reach / distance).add(anchor);
      card.current?.setNextKinematicTranslation({
        x: vec.x,
        y: vec.y,
        z: vec.z
      });
    }
  }, -3);

  // Read interpolated transforms after Rapier, then draw before R3F renders.
  // Explicit priorities keep this order identical in development and production.
  useFrame((_, delta) => {
    if (fixed.current && band.current && cardAttachmentRef.current) {
      [j1, j2].forEach((ref, index) => {
        // Use the same interpolated positions as the rendered card; reading
        // raw 30/60 Hz body positions makes the band jump between physics ticks.
        jointVisuals.current[index]?.getWorldPosition(vec);
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(vec);
        }

        const clampedDistance = Math.max(
          0.1,
          Math.min(
            1,
            ref.current.lerped.distanceTo(
              vec
            )
          )
        );

        ref.current.lerped.lerp(
          vec,
          1 - Math.exp(-Math.min(delta, 0.05) *
            (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
        );
      });

      cardAttachmentRef.current.getWorldPosition(curve.points[0]);
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      band.current.geometry.setPoints(
        curve.getPoints(isMobile ? 16 : 32)
      );

    }
  }, -1);

 const [offsetX, offsetY, offsetZ] = offset;

return (
  <>
    <RigidBody
      ref={fixed}
      {...segmentProps}
      type="fixed"
      position={[offsetX, 4 + offsetY, offsetZ]}
    />

    <RigidBody
      position={[offsetX, 3 + offsetY, offsetZ]}
      ref={j1}
      {...segmentProps}
    >
      <BallCollider args={[0.1]} collisionGroups={0} />
      <group ref={element => { jointVisuals.current[0] = element; }} />
    </RigidBody>

    <RigidBody
      position={[offsetX, 2 + offsetY, offsetZ]}
      ref={j2}
      {...segmentProps}
    >
      <BallCollider args={[0.1]} collisionGroups={0} />
      <group ref={element => { jointVisuals.current[1] = element; }} />
    </RigidBody>

    <RigidBody
      position={[offsetX, 1 + offsetY, offsetZ]}
      ref={j3}
      {...segmentProps}
    >
      <BallCollider args={[0.1]} collisionGroups={0} />
    </RigidBody>

    <RigidBody
      position={[offsetX, -0.51 + offsetY, offsetZ]}
      ref={card}
      {...segmentProps}
      type={dragged ? 'kinematicPosition' : 'dynamic'}
    >
      <CuboidCollider args={[0.8, 1.125, 0.01]} collisionGroups={0} />
      <group ref={cardAttachmentRef} position={CARD_ATTACHMENT} />

      <group
        scale={[2.05, 2.25, 2.25]}
        position={[0, -1.2, -0.05]}
        onPointerOver={event => { if (event.pointerType === 'mouse') hover(true); }}
        onPointerOut={() => hover(false)}
        onPointerDown={(event) => {
          if (event.button > 0 || gestureRef.current || !card.current) return;
          const offset = new THREE.Vector3().copy(event.point).sub(card.current.translation());
          dragPlaneRef.current.constant = -event.point.z;
          gestureRef.current = { id: event.pointerId, type: event.pointerType, target: event.target,
            x: event.clientX, y: event.clientY, offset, dragging: event.pointerType !== 'touch' };
          if (event.pointerType !== 'touch') {
            event.target.setPointerCapture(event.pointerId);
            drag(offset);
          }
        }}
      >
        <mesh geometry={nodes.card.geometry}>
          <meshPhysicalMaterial
            map={cardMap}
            map-anisotropy={16}
            clearcoat={isMobile ? 0 : 1}
            clearcoatRoughness={0.15}
            roughness={0.9}
            metalness={0.8}
          />
        </mesh>

        <mesh
          geometry={nodes.clip.geometry}
          material={materials.metal}
          material-roughness={0.3}
        />

        <mesh
          geometry={nodes.clamp.geometry}
          material={materials.metal}
        />
      </group>
    </RigidBody>

    <mesh ref={band}>
      <meshLineGeometry />

      <meshLineMaterial
        color="white"
        depthTest={false}
        resolution={
          isMobile ? [1000, 2000] : [1000, 1000]
        }
        useMap
        map={texture}
        map-wrapS={THREE.RepeatWrapping}
        map-wrapT={THREE.RepeatWrapping}
        repeat={[-4, 1]}
        lineWidth={lanyardWidth}
      />
    </mesh>
  </>
);
}

useGLTF.preload(cardGLB);
