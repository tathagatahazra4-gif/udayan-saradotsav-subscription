export interface DashboardStats {
  totalFlats: number;
  paidFlats: number;
  pendingFlats: number;
  totalCollection: number;
  todaysCollection: number;
  collectionPercentage: string | number;
}