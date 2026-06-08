// After finishing the backend, I think it's worth removing the All status
export enum ShipmentStatus {
  All = -100,
  Queued = 1,
  AwaitingShipment = 2,
  OnHold = 3,
  Delivered = 4,
  Shipped = 5,
  PartiallyDelivered = 6,
  Returned = 7,
  Cancelled = 8,
  SentToPharmacy = 9,
}
