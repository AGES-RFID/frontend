import { useEffect, useState } from "react";


export type VehicleAddModalValue = {
    userId: string;
    plate: string;
    brand: string;
    model: string;
};

interface VehicleAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSubmitting: boolean;
    onSubmit: (values: VehicleAddModalValue) => void;
    isAdmin: boolean;
    owners: { userId: string; name: string; email: string }[];
}

const defaultValues: VehicleAddModalValue = {
    userId: "",
    plate: "",
    brand: "",
    model: "",
};

export function VehicleAddModal({
                                    isOpen,
                                    onClose,
                                    isSubmitting,
                                    onSubmit,
                                    isAdmin,
                                    owners,
                                }: VehicleAddModalProps) {
    const [formData, setFormData] =
        useState<VehicleAddModalValue>(defaultValues);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(defaultValues);
            setValidationError(null);
        }
    }, [isOpen]);

    const updateField = (field: keyof VehicleAddModalValue, value: string) => {
        if (validationError) setValidationError(null);

        if (field === "plate") {
            value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        }

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

}