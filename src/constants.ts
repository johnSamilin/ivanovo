export enum SELECTABLES {
    BUILDING = 'building',
    UNIT = 'unit',
}

export enum BUILDINGS {
    WAREHOUSE = 'warehouse',
}

export enum UNITS {
    BUILDER = 'Строитель',
}

export enum GOODS {
    WOOD = 'Дерево',
    APPLES = 'Яблоки',
    HONEY = 'Мёд',
}

export enum RESOURCES {
    RAW_WOOD = 'Бревна',
    BOARDS = 'Доски',
}

export const MAX_UNITS_COUNT = 200;

export const NAVMESH_PARAMS = {
    cs: 1,
    ch: 1,
    walkableRadius: 1,
    walkableSlopeAngle: 90,
    walkableHeight: 1,
    walkableClimb: 1,
    maxEdgeLen: 12.,
    maxSimplificationError: 0,
    minRegionArea: 2,
    mergeRegionArea: 5,
    maxVertsPerPoly: 6,
    detailSampleDist: 10,
    detailSampleMaxError: 0.1,
    borderSize: 1,
    tileSize: 10,
};

export const AGENT_PARAMS = {
    radius: 1,
    height: 1,
    maxAcceleration: 100,
    maxSpeed: 10,
    collisionQueryRange: 0.5,
    pathOptimizationRange: 0,
    separationWeight: 1,
};