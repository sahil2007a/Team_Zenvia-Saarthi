const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, '..', 'assets', 'models', 'india_gate_lowpoly_3d_model.glb');
const buf = fs.readFileSync(glbPath);
const b64 = buf.toString('base64');
const content = `// Auto-generated offline-ready Base64 Data URI for India Gate 3D Model
export const INDIA_GATE_GLB_DATA_URI = 'data:model/gltf-binary;base64,${b64}';
`;

const outPath = path.join(__dirname, '..', 'data', 'models', 'indiaGateBase64.ts');
fs.writeFileSync(outPath, content);
console.log('✅ India Gate Base64 created successfully at:', outPath);
