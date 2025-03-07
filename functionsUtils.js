export const excludeTimestamps = (obj) => {
    const { created_at, updated_at, ...rest } = obj;
    return rest;
};
  