declare namespace API {
  type getPetParams = {
    /** The id of the pet */
    petId: string;
  };

  type OrderStatus = 'created' | 'fulfilled' | 'cancelled';

  type Pet = {
    id: string;
    name: string;
    petType?: PetType;
  };

  type PetsResponse = {
    items: Pet[];
    total: number;
  };

  type PetType = 'cat' | 'dog' | 'bird';
}
