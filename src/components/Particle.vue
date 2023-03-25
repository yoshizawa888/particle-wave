<script lang="ts" setup>
import { ref, onMounted } from 'vue';

import { WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, Clock, Points, BufferAttribute, ShaderMaterial } from 'three';

import vertexShader from '../assets/shaders/shader.vert?raw';
import fragmentShader from '../assets/shaders/shader.frag?raw';

const canvas = ref<HTMLDivElement>();

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3);

const scene = new Scene();

const particleCount = 15000;
const range = 3;
const diameter = 0.8;
const positions = new Float32Array(particleCount * 3);
const positions2 = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
	positions[i * 3] = Math.random() * range * 2 - (range * 2) / 2;
	positions[i * 3 + 1] = Math.random() * diameter;
	positions[i * 3 + 2] = Math.random() * diameter;
	positions2[i * 3] = Math.random() * range * 2 - (range * 2) / 2;
	positions2[i * 3 + 1] = Math.random() * diameter;
	positions2[i * 3 + 2] = Math.random() * diameter;

	sizes[i] = 3;
}

const geometry = new BufferGeometry();
geometry.setAttribute('position', new BufferAttribute(positions, 3));
geometry.setAttribute('size', new BufferAttribute(sizes, 1));

const geometry2 = new BufferGeometry();
geometry2.setAttribute('position', new BufferAttribute(positions2, 3));
geometry2.setAttribute('size', new BufferAttribute(sizes, 1));

const material = new ShaderMaterial({
	vertexShader: vertexShader,
	fragmentShader: fragmentShader,
});

const mesh = new Points(geometry, material);
scene.add(mesh);

const mesh2 = new Points(geometry2, material);
scene.add(mesh2);

addEventListener(
	'resize',
	() => {
		camera.aspect = innerWidth / innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(innerWidth, innerHeight);
	},
	false
);

const clock = new Clock();
const render = () => {
	requestAnimationFrame(() => {
		render();
	});
	renderer.render(scene, camera);
	const elapsedTime = clock.getElapsedTime();

	for (let i = 0; i < particleCount; i++) {
		positions[i * 3] += 0.01;
		positions[i * 3 + 1] += Math.sin(positions[i * 3] * 1 + elapsedTime) * 0.02 + Math.cos(positions[i * 3] * 2.5 + elapsedTime) * 0.015;
		positions[i * 3 + 2] += Math.tan(positions[i * 3 + 1] * 3 + elapsedTime) * 0.0015;

		if (positions[i * 3] > range) {
			positions[i * 3] = -range;
			positions[i * 3 + 1] = Math.random() * diameter;
			positions[i * 3 + 2] = Math.random() * diameter;
		}

		positions2[i * 3] += 0.01;
		positions2[i * 3 + 1] += Math.cos(positions2[i * 3] * 2 + elapsedTime) * 0.02;
		positions2[i * 3 + 2] += Math.cos(positions2[i * 3 + 1] * 2 + elapsedTime) * 0.01 + Math.tan(positions2[i * 3 + 1] * 1.5 + elapsedTime) * 0.0015;

		if (positions2[i * 3] > range) {
			positions2[i * 3] = -range;
			positions2[i * 3 + 1] = Math.random() * diameter;
			positions2[i * 3 + 2] = Math.random() * diameter;
		}
	}
	geometry.attributes.position.needsUpdate = true;
	geometry2.attributes.position.needsUpdate = true;
};

onMounted(() => {
	canvas.value!.appendChild(renderer.domElement);
	render();
});
</script>

<template>
	<div ref="canvas" id="canvas"></div>
</template>

<style scoped></style>
