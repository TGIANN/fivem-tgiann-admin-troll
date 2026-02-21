const normalizeVector = (
  vector: number[],
  scale: number,
): { x: number; y: number; z: number } => {
  const length = Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
  if (length === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: (vector[0] / length) * scale,
    y: (vector[1] / length) * scale,
    z: (vector[2] / length) * scale,
  };
};

const scaleEntity = (entity: number, scale: number) => {
  const inVehicle = IsPedInAnyVehicle(entity, false);
  if (inVehicle) return;

  const [forward, right, upVector, position] = GetEntityMatrix(entity);

  // Normalize vectors and apply scale
  const forwardNorm = normalizeVector(forward, scale);
  const rightNorm = normalizeVector(right, scale);
  const upNorm = normalizeVector(upVector, scale);

  const entitySpeed = GetEntitySpeed(entity);
  const entityHeightAboveGround = GetEntityHeightAboveGround(entity);

  const adjustedZ =
    entitySpeed <= 0 && entityHeightAboveGround < 2
      ? entityHeightAboveGround - scale
      : GetEntityUprightValue(entity) - scale;

  // Disable look at the around to prevent flickering
  TaskLookAtEntity(entity, entity, 1, 2048, 3);

  SetEntityMatrix(
    entity,
    forwardNorm.x,
    forwardNorm.y,
    forwardNorm.z,
    rightNorm.x,
    rightNorm.y,
    rightNorm.z,
    upNorm.x,
    upNorm.y,
    upNorm.z,
    position[0],
    position[1],
    position[2] - adjustedZ,
  );
};

export default scaleEntity;
