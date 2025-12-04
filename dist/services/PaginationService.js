"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = void 0;
class PaginationService {
    static async paginate(repository, page = 1, limit = 10, order = {}, relations) {
        const totalRecords = await repository.count();
        const lastPage = Math.ceil(totalRecords / limit);
        if (page > lastPage && lastPage > 0) {
            throw new Error(`Página inválida. Total de páginas: ${lastPage}`);
        }
        const offset = (page - 1) * limit;
        const data = await repository.find({
            take: limit,
            skip: offset,
            order,
            relations,
        });
        return {
            error: false,
            data,
            currentPage: page,
            lastPage,
            totalRecords
        };
    }
}
exports.PaginationService = PaginationService;
