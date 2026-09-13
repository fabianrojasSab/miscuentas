// funcion para formatear la fecha en formato largo DD del mes MM de AA
export function formatLarge(date: Date | undefined | null) {
    if (!date) {
        return ""
    }

    return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

// funcion para formatear la fecha en formato dd/mm/yyyy
export function formatNumeric(date: Date | string) {
    if (!date || date === "null") {
        return ""
    }

    return new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));
}

//funcion para formatear la duracion en formato legible
export const formatDuration = (time: string | null): string => {
    if (!time) return "-";

    const [hours, minutes, seconds] = time.split(":").map(Number);

    if (hours > 0) {
        return hours === 1
            ? `${hours} hora${minutes > 0 ? ` ${minutes} minuto${minutes > 1 ? "s" : ""}` : ""}`
            : `${hours} horas${minutes > 0 ? ` ${minutes} minutos` : ""}`;
    }

    if (minutes > 0) {
        return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
    }

    return `${seconds} segundo${seconds !== 1 ? "s" : ""}`;
};

//Funcion para formatear la fecha en hora HH:MM:SS
export function formatTime(date: Date | string) {
    if (!date || date === "null") {
        return ""
    }

    return new Intl.DateTimeFormat("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Cambia a true si prefieres formato 12 horas (ej: 02:30)
    }).format(new Date(date));
}

export function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

//Funcion que ingresa fecha y le devuelve los valores de cada fecha
export function getDateParts(date: string) {
    const [year, month, day] = date.split("-").map(Number);

    return {
        day,
        month,
        year,
    };
}