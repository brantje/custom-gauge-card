export const computeObjectId = (entityId: string): string =>
  entityId.substr(entityId.indexOf(".") + 1);