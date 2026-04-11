import { Trash2 } from "lucide-react";

type VehicleCardProps = {
  size?: "lg" | "sm";
  hasDelete?: boolean;
  licensePlate: string;
  onClick?: () => void;
  onDelete?: () => void;
};

export function VehicleCard({
  size = "lg",
  hasDelete = false,
  licensePlate,
  onClick,
  onDelete,
}: VehicleCardProps) {
  const isLarge = size === "lg";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-blue-900 font-bold ${isLarge ? "h-[149px] w-[149px]" : "h-[74px] w-[74px]"}
      `}
    >
      {/*ícone carro*/}
      <svg
        width={isLarge ? 64 : 28}
        height={isLarge ? 64 : 28}
        viewBox="0 0 100 88"
        fill="none"
        className="text-blue-900"
        role="img"
        aria-label="Ícone de carro"
      >
        <path
          d="M26.4062 16.6797L21.3086 31.25H78.6914L73.5937 16.6797C72.7148 14.1797 70.3516 12.5 67.6953 12.5H32.3047C29.6484 12.5 27.2852 14.1797 26.4062 16.6797ZM7.73437 32.1875L14.6094 12.5586C17.2461 5.03906 24.3359 0 32.3047 0H67.6953C75.6641 0 82.7539 5.03906 85.3906 12.5586L92.2656 32.1875C96.7969 34.0625 100 38.5352 100 43.75V81.25C100 84.707 97.207 87.5 93.75 87.5H87.5C84.043 87.5 81.25 84.707 81.25 81.25V75H18.75V81.25C18.75 84.707 15.957 87.5 12.5 87.5H6.25C2.79297 87.5 0 84.707 0 81.25V43.75C0 38.5352 3.20312 34.0625 7.73437 32.1875ZM25 53.125C25 51.4674 24.3415 49.8777 23.1694 48.7056C21.9973 47.5335 20.4076 46.875 18.75 46.875C17.0924 46.875 15.5027 47.5335 14.3306 48.7056C13.1585 49.8777 12.5 51.4674 12.5 53.125C12.5 54.7826 13.1585 56.3723 14.3306 57.5444C15.5027 58.7165 17.0924 59.375 18.75 59.375C20.4076 59.375 21.9973 58.7165 23.1694 57.5444C24.3415 56.3723 25 54.7826 25 53.125ZM81.25 59.375C82.9076 59.375 84.4973 58.7165 85.6694 57.5444C86.8415 56.3723 87.5 54.7826 87.5 53.125C87.5 51.4674 86.8415 49.8777 85.6694 48.7056C84.4973 47.5335 82.9076 46.875 81.25 46.875C79.5924 46.875 78.0027 47.5335 76.8306 48.7056C75.6585 49.8777 75 51.4674 75 53.125C75 54.7826 75.6585 56.3723 76.8306 57.5444C78.0027 58.7165 79.5924 59.375 81.25 59.375Z"
          fill="currentColor"
        />
      </svg>

      {/*placa*/}
      <span
        className={`text-black ${isLarge ? "mt-2 text-[28px]" : "mt-1 text-[14px]"}
        `}
      >
        {licensePlate}
      </span>

      {/*delete*/}
      {hasDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="absolute top-1 right-1 text-black hover:text-red-600"
        >
          <Trash2 size={isLarge ? 18 : 14} />
        </button>
      )}
    </button>
  );
}
