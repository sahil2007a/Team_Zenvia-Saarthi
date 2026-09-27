import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Node.js FileReader Polyfill for Three.js GLTFExporter
if (typeof global.FileReader === 'undefined') {
  global.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend({ target: this });
        if (this.onload) this.onload({ target: this });
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result =
          'data:application/octet-stream;base64,' + Buffer.from(buf).toString('base64');
        if (this.onloadend) this.onloadend({ target: this });
        if (this.onload) this.onload({ target: this });
      });
    }
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateQutubMinar() {
  console.log('🏗️ Building Qutub Minar 3D Geometry...');

  const qutubMinarGroup = new THREE.Group();
  qutubMinarGroup.name = 'Qutub_Minar_Delhi';

  // Materials
  const redSandstoneMat = new THREE.MeshStandardMaterial({
    color: 0x9e3d24,
    roughness: 0.85,
    metalness: 0.05,
    name: 'Red_Sandstone',
  });

  const buffSandstoneMat = new THREE.MeshStandardMaterial({
    color: 0xb86b43,
    roughness: 0.88,
    metalness: 0.05,
    name: 'Buff_Sandstone',
  });

  const marbleWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf0ede6,
    roughness: 0.45,
    metalness: 0.1,
    name: 'Makrana_White_Marble',
  });

  const darkStoneMat = new THREE.MeshStandardMaterial({
    color: 0x3d352e,
    roughness: 0.9,
    metalness: 0.1,
    name: 'Basal_Stone_Plinth',
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.6,
    name: 'Gold_Finial',
  });

  // Helper for fluted cylinders (Qutub Minar style)
  function createFlutedTier(radiusBottom, radiusTop, height, segments, flutes, angularRatio, material) {
    const tierGroup = new THREE.Group();

    // Base core cylinder
    const coreGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
    const coreMesh = new THREE.Mesh(coreGeo, material);
    tierGroup.add(coreMesh);

    // Add flutings around the perimeter
    const fluteRadius = (radiusBottom * Math.PI) / (flutes * 2.2);
    for (let i = 0; i < flutes; i++) {
      const angle = (i / flutes) * Math.PI * 2;
      const isAngular = i % 2 === 0;

      // Position on circumference
      const x = Math.cos(angle) * (radiusBottom * 0.97);
      const z = Math.sin(angle) * (radiusBottom * 0.97);

      let fluteGeo;
      if (isAngular && angularRatio > 0) {
        fluteGeo = new THREE.ConeGeometry(fluteRadius * 1.1, height, 4);
        fluteGeo.rotateY(Math.PI / 4);
      } else {
        fluteGeo = new THREE.CylinderGeometry(fluteRadius * 0.85, fluteRadius * 1.05, height, 8);
      }

      const fluteMesh = new THREE.Mesh(fluteGeo, material);
      fluteMesh.position.set(x, 0, z);
      fluteMesh.scale.set(0.65, 1, 0.65);
      tierGroup.add(fluteMesh);
    }

    return tierGroup;
  }

  // Helper for corbelled projecting balcony
  function createBalcony(radius, thickness, corbelsCount, baseMaterial, accentMaterial) {
    const balconyGroup = new THREE.Group();

    // Balcony floor disc
    const floorGeo = new THREE.CylinderGeometry(radius * 1.1, radius * 1.05, thickness, 32);
    const floorMesh = new THREE.Mesh(floorGeo, baseMaterial);
    balconyGroup.add(floorMesh);

    // Balcony carved railing
    const railGeo = new THREE.CylinderGeometry(radius * 1.12, radius * 1.1, thickness * 2.5, 32, 1, true);
    const railMesh = new THREE.Mesh(railGeo, accentMaterial);
    railMesh.position.y = thickness * 1.3;
    balconyGroup.add(railMesh);

    // Decorative corbel brackets underneath
    const corbelRadius = radius * 0.95;
    for (let i = 0; i < corbelsCount; i++) {
      const angle = (i / corbelsCount) * Math.PI * 2;
      const cx = Math.cos(angle) * corbelRadius;
      const cz = Math.sin(angle) * corbelRadius;

      const bracketGeo = new THREE.BoxGeometry(0.12, thickness * 2.8, 0.28);
      const bracketMesh = new THREE.Mesh(bracketGeo, accentMaterial);
      bracketMesh.position.set(cx, -thickness * 1.2, cz);
      bracketMesh.lookAt(0, -thickness * 1.2, 0);
      balconyGroup.add(bracketMesh);
    }

    return balconyGroup;
  }

  // 1. Base Stepped Plinth
  const plinth1 = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 0.6, 16), darkStoneMat);
  plinth1.position.y = 0.3;
  qutubMinarGroup.add(plinth1);

  const plinth2 = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.7, 0.5, 16), buffSandstoneMat);
  plinth2.position.y = 0.85;
  qutubMinarGroup.add(plinth2);

  let currentY = 1.1;

  // 2. First Storey (Lowest, largest - alternating angular and circular flutings)
  const storey1Height = 4.2;
  const storey1 = createFlutedTier(2.1, 1.7, storey1Height, 24, 20, 1.0, redSandstoneMat);
  storey1.position.y = currentY + storey1Height / 2;
  qutubMinarGroup.add(storey1);

  // Calligraphic inscription band on Storey 1
  const band1 = new THREE.Mesh(new THREE.CylinderGeometry(1.92, 1.95, 0.28, 32), buffSandstoneMat);
  band1.position.y = currentY + storey1Height * 0.45;
  qutubMinarGroup.add(band1);

  const band2 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.83, 0.28, 32), buffSandstoneMat);
  band2.position.y = currentY + storey1Height * 0.75;
  qutubMinarGroup.add(band2);

  currentY += storey1Height;

  // Balcony 1
  const balcony1 = createBalcony(1.9, 0.18, 24, buffSandstoneMat, redSandstoneMat);
  balcony1.position.y = currentY;
  qutubMinarGroup.add(balcony1);
  currentY += 0.2;

  // 3. Second Storey (Circular / rounded flutings only)
  const storey2Height = 3.6;
  const storey2 = createFlutedTier(1.65, 1.35, storey2Height, 24, 20, 0.0, redSandstoneMat);
  storey2.position.y = currentY + storey2Height / 2;
  qutubMinarGroup.add(storey2);

  const band3 = new THREE.Mesh(new THREE.CylinderGeometry(1.52, 1.54, 0.22, 32), buffSandstoneMat);
  band3.position.y = currentY + storey2Height * 0.55;
  qutubMinarGroup.add(band3);

  currentY += storey2Height;

  // Balcony 2
  const balcony2 = createBalcony(1.5, 0.16, 20, buffSandstoneMat, redSandstoneMat);
  balcony2.position.y = currentY;
  qutubMinarGroup.add(balcony2);
  currentY += 0.18;

  // 4. Third Storey (Angular flutings only)
  const storey3Height = 3.0;
  const storey3 = createFlutedTier(1.3, 1.05, storey3Height, 24, 16, 1.0, redSandstoneMat);
  storey3.position.y = currentY + storey3Height / 2;
  qutubMinarGroup.add(storey3);
  currentY += storey3Height;

  // Balcony 3
  const balcony3 = createBalcony(1.2, 0.14, 16, buffSandstoneMat, redSandstoneMat);
  balcony3.position.y = currentY;
  qutubMinarGroup.add(balcony3);
  currentY += 0.16;

  // 5. Fourth Storey (White Marble and Red Sandstone Bands - Firoz Shah Tughlaq)
  const storey4Height = 2.4;
  const storey4Core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 1.0, storey4Height, 32),
    marbleWhiteMat
  );
  storey4Core.position.y = currentY + storey4Height / 2;
  qutubMinarGroup.add(storey4Core);

  const ring4 = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 0.98, 0.45, 32), redSandstoneMat);
  ring4.position.y = currentY + storey4Height * 0.5;
  qutubMinarGroup.add(ring4);

  currentY += storey4Height;

  // Balcony 4
  const balcony4 = createBalcony(1.0, 0.12, 14, marbleWhiteMat, buffSandstoneMat);
  balcony4.position.y = currentY;
  qutubMinarGroup.add(balcony4);
  currentY += 0.14;

  // 6. Fifth Storey (Crowning tier - Marble & Sandstone with Cupola)
  const storey5Height = 2.0;
  const storey5 = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.82, storey5Height, 32), redSandstoneMat);
  storey5.position.y = currentY + storey5Height / 2;
  qutubMinarGroup.add(storey5);

  const ring5 = new THREE.Mesh(new THREE.CylinderGeometry(0.77, 0.8, 0.35, 32), marbleWhiteMat);
  ring5.position.y = currentY + storey5Height * 0.6;
  qutubMinarGroup.add(ring5);

  currentY += storey5Height;

  // 7. Crowning Balcony & Lantern Cupola
  const crownRailing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.25, 24, 1, true),
    buffSandstoneMat
  );
  crownRailing.position.y = currentY + 0.15;
  qutubMinarGroup.add(crownRailing);

  // Domed Cap
  const domeGeo = new THREE.SphereGeometry(0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMesh = new THREE.Mesh(domeGeo, marbleWhiteMat);
  domeMesh.position.y = currentY + 0.25;
  qutubMinarGroup.add(domeMesh);

  // Finial / Spire
  const spireGeo = new THREE.ConeGeometry(0.12, 0.7, 12);
  const spireMesh = new THREE.Mesh(spireGeo, goldAccentMat);
  spireMesh.position.y = currentY + 0.95;
  qutubMinarGroup.add(spireMesh);

  const finialBall = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), goldAccentMat);
  finialBall.position.y = currentY + 0.62;
  qutubMinarGroup.add(finialBall);

  // Center model and set comfortable AR height
  qutubMinarGroup.position.set(0, 0, 0);
  qutubMinarGroup.scale.set(0.18, 0.18, 0.18);

  console.log('📐 Exporting to binary GLB format...');
  const exporter = new GLTFExporter();
  const gltfBinary = await exporter.parseAsync(qutubMinarGroup, { binary: true });
  const outputBuffer = Buffer.from(gltfBinary);

  // Output paths
  const assetsDir = path.join(__dirname, '..', 'assets', 'models');
  const publicDir = path.join(__dirname, '..', 'public', 'models');

  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  const assetsPath = path.join(assetsDir, 'qutub_minar_3d_model.glb');
  const publicPath = path.join(publicDir, 'qutub_minar_3d_model.glb');

  fs.writeFileSync(assetsPath, outputBuffer);
  fs.writeFileSync(publicPath, outputBuffer);

  console.log(`✅ Saved GLB to assets: ${assetsPath} (${outputBuffer.length} bytes)`);
  console.log(`✅ Saved GLB to public: ${publicPath}`);

  // Base64 Data URI for offline instant loading
  const base64String = outputBuffer.toString('base64');
  const dataUri = `data:model/gltf-binary;base64,${base64String}`;

  const base64Dir = path.join(__dirname, '..', 'data', 'models');
  fs.mkdirSync(base64Dir, { recursive: true });
  const base64FilePath = path.join(base64Dir, 'qutubMinarBase64.ts');

  const tsContent = `// Auto-generated offline-ready Base64 Data URI for Qutub Minar 3D Model
export const QUTUB_MINAR_GLB_DATA_URI =
  '${dataUri}';
`;
  fs.writeFileSync(base64FilePath, tsContent);
  console.log(`✅ Saved Base64 Data URI to: ${base64FilePath}`);
}

generateQutubMinar()
  .then(() => {
    console.log('🎉 Qutub Minar 3D model generation complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Failed to generate Qutub Minar GLB:', err);
    process.exit(1);
  });
