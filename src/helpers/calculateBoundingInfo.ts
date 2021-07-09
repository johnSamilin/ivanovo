import { BoundingInfo, Mesh, Vector3 } from "@babylonjs/core";

export function calculateBoundingInfo(meshes: Mesh[]): BoundingInfo {
    const bboxes = { x: [0], y: [0], z: [0] };
    meshes?.forEach((mesh): void => {       
        const bb = mesh.getBoundingInfo().boundingBox;
        bboxes.x.push(bb.maximumWorld.x, bb.minimumWorld.x);
        bboxes.y.push(bb.maximumWorld.y, bb.minimumWorld.y);
        bboxes.z.push(bb.maximumWorld.z, bb.minimumWorld.z);
    });
    const min = new Vector3(
        Math.min(...bboxes.x),
        Math.min(...bboxes.y),
        Math.min(...bboxes.z),
    );
    const max = new Vector3(
        Math.max(...bboxes.x),
        Math.max(...bboxes.y),
        Math.max(...bboxes.z),
    );
    return new BoundingInfo(min, max);
}