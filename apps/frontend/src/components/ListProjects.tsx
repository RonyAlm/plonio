
import { useEffect, useState } from "react";
import { Edit2Icon, EyeIcon, FolderIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import Button from "./Button";

export interface Member {
    id: string
    userId: string
    projectId: string
    role: string
    createdAt: Date
    updatedAt: Date
}

export interface Project {
    id: string
    name: string
    description: string
    ownerId: string
    members: Member[]
    createdAt: Date
    updatedAt: Date
}

const ListProjects = () => {
    const [projects, setProjects] = useState<Project[] | null>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('http://localhost:3000/api/projects')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => setError(err.message))
    }, [])

    return (
        <section className="h-screen py-4 px-6 bg-linear-to-tr from-slate-50 to-slate-100 rounded-xl max-w-6xl flex flex-col gap-2 ">
            <div className="flex flex-row items-center py-4 justify-between">
                <div className="flex flex-row items-center gap-2">
                    <FolderIcon size={24} className="text-sky-500" />
                    <h2 className="text-xl font-bold text-sky-500">Proyectos</h2>
                </div>
                <Button size="small" label="Nuevo" icon={<PlusIcon size={16} />} onClick={() => { }} />
            </div>
            <div className="flex flex-row gap-2 flex-wrap">
                {
                    projects?.length === 0 && (
                        <p className="text-gray-400 text-lg">No hay proyectos</p>
                    )
                }

                {!error && projects?.map(project => (
                    <article key={project.id} className="w-full md:flex-1 p-4 mt-2 bg-white rounded-lg shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-sky-800/90 mb-2">{project.name}</h3>
                        <p className="text-gray-400">{project.description}</p>
                        <div className="flex flex-row items-center gap-2 mt-4 ml-auto">
                            <button title="Ver" className="bg-gray-200/50 text-indigo-500 p-2 ml-auto cursor-pointer rounded-full flex flex-row items-center hover:bg-gray-200">
                                <EyeIcon size={16} />
                            </button>
                            <button title="Editar" className="bg-gray-200/50 text-indigo-500 p-2 ml-auto cursor-pointer rounded-full flex flex-row items-center hover:bg-gray-200">
                                <Edit2Icon size={16} />
                            </button>
                            <button title="Eliminar" className="bg-gray-200/50 text-red-500 p-2 ml-auto cursor-pointer rounded-full flex flex-row items-center hover:bg-gray-200">
                                <Trash2Icon size={16} />
                            </button>
                        </div>
                    </article>
                ))}

            </div>
        </section>
    )
}

export default ListProjects