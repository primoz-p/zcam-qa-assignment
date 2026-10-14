import {expect, test} from '../../fixtures/test.fixture';
import {Pet} from '../../api/pet.model';

test.describe('Petstore API: Pet', () => {
  test.describe.configure({mode: 'serial'});

  const dogName = 'AutomationDog';
  const dogCategoryName = 'Dogs';
  const photoUrl = 'https://example.com/dog.jpg';
  const statusAvailable = 'available';
  const statusPending = 'pending';
  const statusSold = 'sold';

  const testPetId = Date.now();
  const testPet: Pet = {
    id: testPetId,
    name: dogName,
    category: {id: 1, name: dogCategoryName},
    photoUrls: [photoUrl],
    tags: [{id: 10, name: 'trained'}],
    status: statusAvailable
  };

  function checkPet(pet: any, petName: string = dogName, petStatus: String = statusAvailable) {
    expect(pet.id).toBe(testPetId);
    expect(pet.name).toBe(petName);
    expect(pet.category.name).toBe(dogCategoryName)
    expect(pet.photoUrls.length).toBe(1);
    expect(pet.photoUrls).toContain(photoUrl);
    expect(pet.status).toBe(petStatus);
  }

  function checkPetsByStatus(pets: any, shouldExists: boolean = true) {
    expect(Array.isArray(pets)).toBeTruthy();
    expect(pets.length).toBeGreaterThanOrEqual(1);
    const hasTestPet1 = pets.some((item: { id: number; }) => item.id === testPetId);
    expect(hasTestPet1).toBe(shouldExists);
  }

  test('API-PET-01: Create a new pet', async ({petApi}) => {
    const response = await petApi.create(testPet);

    expect(response.status()).toBe(200);

    const body = await response.json();
    checkPet(body)
  });

  test('API-PET-02: get pet by ID', async ({petApi}) => {
    const response = await petApi.getById(testPetId);

    expect(response.status()).toBe(200);

    const body = await response.json();
    checkPet(body)
  });

  test('API-PET-03: Find pets by status "available"', async ({petApi}) => {
    const response = await petApi.getPetsByStatus(statusAvailable);

    expect(response.status()).toBe(200);

    const body = await response.json();
    checkPetsByStatus(body)
  });

  test('API-PET-04: Find pets by status "sold"', async ({petApi}) => {
    const response = await petApi.getPetsByStatus(statusSold);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('API-PET-05: Update existing pet name and status', async ({petApi}) => {
    const updatedPet: Pet = {...testPet, name: 'UpdatedDogName', status: statusPending};
    const responseUpdate = await petApi.update(updatedPet);

    expect(responseUpdate.status()).toBe(200);

    const responseGet = await petApi.getById(testPetId);
    const body = await responseGet.json();
    checkPet(body, 'UpdatedDogName', statusPending)
  });

  test('API-PET-06: Update existing pet status', async ({petApi}) => {
    const updatedPet: Pet = {...testPet, status: statusSold};
    const responseUpdate = await petApi.update(updatedPet);

    expect(responseUpdate.status()).toBe(200);

    const responseGet = await petApi.getById(testPetId);
    const body = await responseGet.json();
    checkPet(body, dogName, statusSold)
  });

  test('API-PET-07: Return 404 for non-existent pet ID', async ({petApi}) => {
    const response = await petApi.getById(Date.now() + 999999999999);

    expect(response.status()).toBe(404);
  });

  test('API-PET-08: Return error for invalid pet status query', async ({petApi}) => {
    const response = await petApi.getPetsByStatus('invalid_status_type');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.length).toBe(0);
  });

  test('API-PET-09: Should delete pet by ID successfully', async ({petApi}) => {
    const responseDelete = await petApi.delete(testPetId);

    expect(responseDelete.status()).toBe(200);

    const responseGet = await petApi.getById(testPetId);
    expect(responseGet.status()).toBe(404);
  });

  test('API-PET-10: Combined - reate, update, get and delete', async ({petApi}) => {
    const responseCreate = await petApi.create(testPet);
    expect(responseCreate.status()).toBe(200);
    const bodyCreate = await responseCreate.json();
    checkPet(bodyCreate);

    const responseGet = await petApi.getById(testPetId);
    expect(responseGet.status()).toBe(200);
    const bodyGet = await responseGet.json();
    checkPet(bodyGet)

    const responseStatusAvailable1 = await petApi.getPetsByStatus(statusAvailable);
    expect(responseStatusAvailable1.status()).toBe(200);
    const bodyStatusAvailable1 = await responseStatusAvailable1.json();
    checkPetsByStatus(bodyStatusAvailable1);

    const responseStatusPending1 = await petApi.getPetsByStatus(statusPending);
    expect(responseStatusPending1.status()).toBe(200);
    const bodyStatusPending1 = await responseStatusPending1.json();
    checkPetsByStatus(bodyStatusPending1, false);

    const updatedPet: Pet = {...testPet, name: 'UpdatedDogName', status: statusPending};
    const responseUpdate = await petApi.update(updatedPet);
    expect(responseUpdate.status()).toBe(200);

    const responseGet2 = await petApi.getById(testPetId);
    const bodyGet2 = await responseGet2.json();
    checkPet(bodyGet2, 'UpdatedDogName', statusPending)

    const responseStatusAvailable2 = await petApi.getPetsByStatus(statusAvailable);
    expect(responseStatusAvailable2.status()).toBe(200);
    const bodyStatusAvailable2 = await responseStatusAvailable2.json();
    checkPetsByStatus(bodyStatusAvailable2, false);

    const responseStatusPending2 = await petApi.getPetsByStatus(statusPending);
    expect(responseStatusPending2.status()).toBe(200);
    const bodyStatusPending2 = await responseStatusPending2.json();
    checkPetsByStatus(bodyStatusPending2, true);

    const responseDelete = await petApi.delete(testPetId);
    expect(responseDelete.status()).toBe(200);
    const responseGet3 = await petApi.getById(testPetId);
    expect(responseGet3.status()).toBe(404);
  });

  test('API-PET-11: Simulate 50 concurrent API requests', async ({petApi}) => {
    const responseCreate = await petApi.create(testPet);
    expect(responseCreate.status()).toBe(200);

    const concurrentRequests = 50;
    const requests = Array.from({length: concurrentRequests}, (_, i) =>
        petApi.getById(testPetId)
    );

    const responses = await Promise.all(requests);
    for (const response of responses) {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.id).toBe(testPetId);
    }
  });
});
