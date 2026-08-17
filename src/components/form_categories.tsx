import { useEffect, useState } from "react";
import { Button } from "@/components/buttons"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseCategoryType } from "@/emuns/ExpenseCategoryType";

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

export const FormCategory = ({ createCategory, categoryToEdit, UpdateCategory }: Props) =>{
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<CategoryForm | null>(null);

    //Funcion para crear o actualizar la categoria (la envia al componente padre)
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
        
        setCategory(null); //limpia el formulario
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
                <Select
                    name="category_type"
                    value={
                        category?.category_type != null
                        ? String(category?.category_type)
                        : ""
                    }
                    onValueChange={(value) =>
                        setCategory(prev => ({
                            ...prev!,
                            category_type: Number(value)
                        }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value={String(ExpenseCategoryType.FIXED)}>
                            Fijo
                        </SelectItem>

                        <SelectItem value={String(ExpenseCategoryType.VARIABLE)}>
                            Variable
                        </SelectItem>
                    </SelectContent>
                </Select>
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