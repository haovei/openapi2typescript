declare namespace API {
  type Order = {
    orderId: string;
    status?: OrderStatus;
  };

  type OrderRequest = {
    petId: string;
    quantity: number;
  };
}
