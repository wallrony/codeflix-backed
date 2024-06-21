export function removeEntityPaginationJSONTimestamps(
  data: Record<string, unknown>,
) {
  data['items'] = (data['items'] as Array<Record<string, unknown>>).map(
    (item) => {
      delete item['created_at'];
      delete item['updated_at'];
      return item;
    },
  );
  return data;
}

export function removeEntityJSONTimestamps(data: Record<string, unknown>) {
  delete data['created_at'];
  delete data['updated_at'];
  return data;
}
