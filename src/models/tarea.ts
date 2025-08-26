export class Tarea{
    _id: any;
    titulo: string;
    descripcion: string;
    asignado: string;
    fecha_fin: Date;
    estado: string;

    constructor() {
        this.titulo = "";
        this.descripcion = "";
        this.asignado = "";
        this.fecha_fin = new Date();
        this.estado = "";
    }
}