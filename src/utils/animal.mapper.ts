export const mapAnimal = (animal: any) => ({
  id: animal.animalId,
  attributes: {
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    dateOfBirth: animal.dateOfBirth,
    picture: animal.picture,
    weight: animal.weight,
    gender: animal.gender,
    owner: animal.owner,
    vaccines: animal.vaccines,
    visits: animal.visits,
    createdAt: animal.createdAt,
    updatedAt: animal.updatedAt,
  },
});