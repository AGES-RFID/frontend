export type ParkingPricesDto = {
  parkingPriceId: string;
  toleranceMinutes: number;
  basePrice: number;
  thresholdMinutes: number;
  hourlyRate: number;
  createdAt: string;
};

export type UpdateParkingPricesDto = {
  toleranceMinutes: number;
  basePrice: number;
  hourlyRate: number;
};
