export class Tarea {
    UsuarioId: string;
    TareaId: string;
    Titulo: string;
    Estado: string;
    Prioridad: string;
    FechaInicio: string; // formato dd/mm/yyyy
    FechaFin: string;    // formato dd/mm/yyyy
    Pasos: string[];

    constructor() {
        this.UsuarioId = "";
        this.TareaId = "";
        this.Titulo = "";
        this.Estado = "Pendiente";
        this.Prioridad = "Media";
        this.FechaInicio = "";
        this.FechaFin = "";
        this.Pasos = [];
    }
}
