

type Status = "ativa" | "livre" | "inativa";

type StatusProps = {
    status: Status;
}

const statusConfig: Record<Status, {label: string, className: string, dot: string}> = {
    ativa: {
        label: "Ativa",
        className: "bg-light-green text-dark-gray",
        dot: "bg-green",
    },
    livre: {
        label: "Livre",
        className: "bg-yellow text-dark-gray",
        dot: "bg-dark-orange",
    },
    inativa: {
        label: "Inativa",
        className: "bg-light-red text-dark-gray",
        dot: "bg-red",
    },
}

export function StatusBadge({status}: StatusProps){
    const config = statusConfig[status];

    return(
        <div
           className={`flex flex-shrink-0 items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
        >
            <span
             className={`w-3 h-3 rounded-full ${config.dot}`}
            />
            <span>
                {config.label}
            </span>
        </div>

    );
}