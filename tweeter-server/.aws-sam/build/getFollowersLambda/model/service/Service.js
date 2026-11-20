"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
// AI-assisted: see AI-ATTRIBUTION.md
class Service {
    // Converts a page of domain objects (User, Status, ...) into a page of
    // their DTOs, keeping the hasMore flag.
    toDtoPage(page) {
        const [items, hasMore] = page;
        return [items.map((item) => item.dto), hasMore];
    }
}
exports.Service = Service;
