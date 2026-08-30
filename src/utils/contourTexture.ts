import { createNoise2D } from 'simplex-noise';

export function hashString(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

function mulberry32(seed: number) {
	return function () {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function fbm(noise2D: (x: number, y: number) => number, x: number, y: number) {
	let amplitude = 1;
	let frequency = 1;
	let sum = 0;
	let norm = 0;
	for (let o = 0; o < 4; o++) {
		sum += amplitude * noise2D(x * frequency, y * frequency);
		norm += amplitude;
		amplitude *= 0.5;
		frequency *= 2;
	}
	return sum / norm;
}

function lerpColor(hex1: string, hex2: string, t: number) {
	const c1 = [parseInt(hex1.slice(1, 3), 16), parseInt(hex1.slice(3, 5), 16), parseInt(hex1.slice(5, 7), 16)];
	const c2 = [parseInt(hex2.slice(1, 3), 16), parseInt(hex2.slice(3, 5), 16), parseInt(hex2.slice(5, 7), 16)];
	const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
	const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
	const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
	return `%23${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function marchingSquaresPaths(
	grid: number[][],
	cols: number,
	rows: number,
	cellSize: number,
	threshold: number,
) {
	const segments: string[] = [];
	for (let j = 0; j < rows - 1; j++) {
		for (let i = 0; i < cols - 1; i++) {
			const tl = grid[j][i];
			const tr = grid[j][i + 1];
			const bl = grid[j + 1][i];
			const br = grid[j + 1][i + 1];
			const x = i * cellSize;
			const y = j * cellSize;
			const points: [number, number][] = [];

			if ((tl >= threshold) !== (tr >= threshold)) {
				const t = (threshold - tl) / (tr - tl);
				points.push([x + t * cellSize, y]);
			}
			if ((tr >= threshold) !== (br >= threshold)) {
				const t = (threshold - tr) / (br - tr);
				points.push([x + cellSize, y + t * cellSize]);
			}
			if ((bl >= threshold) !== (br >= threshold)) {
				const t = (threshold - bl) / (br - bl);
				points.push([x + t * cellSize, y + cellSize]);
			}
			if ((tl >= threshold) !== (bl >= threshold)) {
				const t = (threshold - tl) / (bl - tl);
				points.push([x, y + t * cellSize]);
			}

			if (points.length === 2) {
				segments.push(
					`M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)} L ${points[1][0].toFixed(1)} ${points[1][1].toFixed(1)}`,
				);
			} else if (points.length === 4) {
				if (tl >= threshold && br >= threshold) {
					segments.push(
						`M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)} L ${points[3][0].toFixed(1)} ${points[3][1].toFixed(1)}`,
					);
					segments.push(
						`M ${points[2][0].toFixed(1)} ${points[2][1].toFixed(1)} L ${points[1][0].toFixed(1)} ${points[1][1].toFixed(1)}`,
					);
				} else {
					segments.push(
						`M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)} L ${points[1][0].toFixed(1)} ${points[1][1].toFixed(1)}`,
					);
					segments.push(
						`M ${points[2][0].toFixed(1)} ${points[2][1].toFixed(1)} L ${points[3][0].toFixed(1)} ${points[3][1].toFixed(1)}`,
					);
				}
			}
		}
	}
	return segments.join(' ');
}

export function fallbackTexture(id: string) {
	const seed = hashString(id);
	const rng = mulberry32(seed);
	const noise2D = createNoise2D(rng);

	const width = 700;
	const height = 700;
	const cellSize = 4;
	const cols = Math.floor(width / cellSize) + 1;
	const rows = Math.floor(height / cellSize) + 1;
	const noiseScale = 0.03;

	const grid: number[][] = [];
	for (let j = 0; j < rows; j++) {
		const row: number[] = [];
		for (let i = 0; i < cols; i++) {
			row.push(fbm(noise2D, i * noiseScale, j * noiseScale));
		}
		grid.push(row);
	}

	const levelCount = 11;
	const primary = '#33513F';
	const secondary = '#9C6B45';
	let paths = '';

	for (let idx = 0; idx < levelCount; idx++) {
		const t = idx / (levelCount - 1);
		const level = -0.5 + t;
		const color = lerpColor(primary, secondary, t);
		const d = marchingSquaresPaths(grid, cols, rows, cellSize, level);
		paths += `<path d='${d}' stroke='${color}' fill='none' stroke-width='1' opacity='0.45' stroke-linecap='round' stroke-linejoin='round'/>`;
	}

	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>${paths}</svg>`;
	return `url("data:image/svg+xml,${svg}"), linear-gradient(var(--color-panel), var(--color-panel))`;
}