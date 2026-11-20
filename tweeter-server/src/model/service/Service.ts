// AI-assisted: see AI-ATTRIBUTION.md
export abstract class Service {
  // Converts a page of domain objects (User, Status, ...) into a page of
  // their DTOs, keeping the hasMore flag.
  protected toDtoPage<D>(
    page: [items: { readonly dto: D }[], hasMore: boolean],
  ): [D[], boolean] {
    const [items, hasMore] = page;
    return [items.map((item) => item.dto), hasMore];
  }
}
