import { useEffect, useState } from "react";
import { Button } from "./buttons"
import { Input } from "./ui/input"

type CategoryForm = {
    name_category: string;
    category_type: number;
    description: string;
};

type CategoryRow = {
    id: number,
    name: string,
    category_type: number,
    description: string,
    created_at: string,
    updated_at: string,
};

type Props = {
    createCategory: (category: CategoryForm) => void;
    categoryToEdit: CategoryRow | null;
    UpdateCategory: (category: CategoryForm) => void;
};

export const Category = ({ createCategory, categoryToEdit, UpdateCategory }: Props) =>{
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<CategoryForm | null>(null);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;

        const body : CategoryForm = {
            name_category: form.name_category.value,
            category_type: form.category_type.value,
            description: form.description.value,
        };

        if (categoryToEdit) {
            UpdateCategory(body);
        } else {
            createCategory(body);
        }
        
        form.reset();
    }

    useEffect(() => {
        if (categoryToEdit) {
            setCategory({
                name_category: categoryToEdit.name,
                category_type: categoryToEdit.category_type,
                description: categoryToEdit.description,
            });
        }
    }, [categoryToEdit]);

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>Nombre categoria</label>
                <Input
                    className="mb-4"
                    type="text"
                    name="name_category"
                    value={category?.name_category ?? ""}
                    onChange={(e) =>
                        setCategory(prev => ({
                            ...prev!,
                            name_category: e.target.value
                        }))
                    }
                />
                <label>Tipo de categoria</label>
                <Input
                    className="mb-4"
                    type="number"
                    name="category_type"
                    value={category?.category_type ?? ""}
                    onChange={(e) =>
                        setCategory(prev => ({
                            ...prev!,
                            category_type: Number(e.target.value)
                        }))
                    }
                />
                <label>Description</label>
                <Input
                    className="mb-4"
                    type="text"
                    name="description"
                    value={category?.description ?? ""}
                    onChange={(e) =>
                        setCategory(prev => ({
                            ...prev!,
                            description: e.target.value
                        }))
                    }
                />
                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}
        
                <Button type="submit">
                    {categoryToEdit ? "Actualizar categoria" : "Crear categoria"}
                </Button>
                
            </form>
        </div>
    )
}