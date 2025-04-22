export type Category = {
    idCategory: string,
    strCategory: string,
    strCategoryThumb: string,
    strCategoryDescription: string | null,
}

export interface CategoriesResponse {
    categories: Category[];
}