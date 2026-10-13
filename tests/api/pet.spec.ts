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

  test('API-PET-01: Create a new pet', async ({petApi}) => {
    const response = await petApi.create(testPet);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(testPetId);
    expect(body.name).toBe(dogName);
    expect(body.photoUrls.length).toBe(1);
    expect(body.photoUrls).toContain(photoUrl);
    expect(body.status).toBe(statusAvailable);
  });

  test('API-PET-02: get pet by ID', async ({petApi}) => {
    const response = await petApi.getById(testPetId);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(testPetId);
    expect(body.name).toBe(dogName);
    expect(body.photoUrls.length).toBe(1);
    expect(body.photoUrls).toContain(photoUrl);
    expect(body.status).toBe(statusAvailable);
  });

  test('API-PET-03: Find pets by status "available"', async ({petApi}) => {
    const response = await petApi.getPetsByStatus(statusAvailable);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThanOrEqual(1);

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
    expect(body.id).toBe(testPetId);
    expect(body.name).toBe('UpdatedDogName');
    expect(body.photoUrls.length).toBe(1);
    expect(body.photoUrls).toContain(photoUrl);
    expect(body.status).toBe(statusPending);
  });

  test('API-PET-06: Update existing pet status', async ({petApi}) => {
    const updatedPet: Pet = {...testPet, status: statusSold};
    const responseUpdate = await petApi.update(updatedPet);

    expect(responseUpdate.status()).toBe(200);

    const responseGet = await petApi.getById(testPetId);
    const body = await responseGet.json();
    expect(body.id).toBe(testPetId);
    expect(body.name).toBe(dogName);
    expect(body.photoUrls.length).toBe(1);
    expect(body.photoUrls).toContain(photoUrl);
    expect(body.status).toBe(statusSold);
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
    expect(bodyCreate.id).toBe(testPetId);
    expect(bodyCreate.name).toBe(dogName);
    expect(bodyCreate.category.name).toBe(dogCategoryName)
    expect(bodyCreate.photoUrls.length).toBe(1);
    expect(bodyCreate.photoUrls).toContain(photoUrl);
    expect(bodyCreate.status).toBe(statusAvailable);

    const responseGet = await petApi.getById(testPetId);
    expect(responseGet.status()).toBe(200);
    const bodyGet = await responseGet.json();
    expect(bodyGet.id).toBe(testPetId);
    expect(bodyGet.name).toBe(dogName);
    expect(bodyCreate.category.name).toBe(dogCategoryName)
    expect(bodyGet.photoUrls.length).toBe(1);
    expect(bodyGet.photoUrls).toContain(photoUrl);
    expect(bodyGet.status).toBe(statusAvailable);

    const responseStatusAvailable1 = await petApi.getPetsByStatus(statusAvailable);
    expect(responseStatusAvailable1.status()).toBe(200);
    const bodyStatusAvailable1 = await responseStatusAvailable1.json();
    expect(Array.isArray(bodyStatusAvailable1)).toBeTruthy();
    expect(bodyStatusAvailable1.length).toBeGreaterThanOrEqual(1);
    const hasTestPet1 = bodyStatusAvailable1.some((item: { id: number; }) => item.id === testPetId);
    expect(hasTestPet1).toBe(true);

    const responseStatusPending1 = await petApi.getPetsByStatus(statusPending);
    expect(responseStatusPending1.status()).toBe(200);
    const bodyStatusPending1 = await responseStatusPending1.json();
    expect(Array.isArray(bodyStatusPending1)).toBeTruthy();
    expect(bodyStatusPending1.length).toBeGreaterThanOrEqual(1);
    const hasTestPet2 = bodyStatusPending1.some((item: { id: number; }) => item.id === testPetId);
    expect(hasTestPet2).toBe(false);

    const updatedPet: Pet = {...testPet, name: 'UpdatedDogName', status: statusPending};
    const responseUpdate = await petApi.update(updatedPet);
    expect(responseUpdate.status()).toBe(200);

    const responseGet2 = await petApi.getById(testPetId);
    const bodyGet2 = await responseGet2.json();
    expect(bodyGet2.id).toBe(testPetId);
    expect(bodyGet2.name).toBe('UpdatedDogName');
    expect(bodyCreate.category.name).toBe(dogCategoryName)
    expect(bodyGet2.photoUrls.length).toBe(1);
    expect(bodyGet2.photoUrls).toContain(photoUrl);
    expect(bodyGet2.status).toBe(statusPending);

    const responseStatusAvailable2 = await petApi.getPetsByStatus(statusAvailable);
    expect(responseStatusAvailable2.status()).toBe(200);
    const bodyStatusAvailable2 = await responseStatusAvailable2.json();
    expect(Array.isArray(bodyStatusAvailable2)).toBeTruthy();
    expect(bodyStatusAvailable2.length).toBeGreaterThanOrEqual(2);
    const hasTestPet3 = bodyStatusAvailable2.some((item: { id: number; }) => item.id === testPetId);
    expect(hasTestPet3).toBe(false);

    const responseStatusPending2 = await petApi.getPetsByStatus(statusPending);
    expect(responseStatusPending2.status()).toBe(200);
    const bodyStatusPending2 = await responseStatusPending2.json();
    expect(Array.isArray(bodyStatusPending2)).toBeTruthy();
    expect(bodyStatusPending2.length).toBeGreaterThanOrEqual(2);
    const hasTestPet4 = bodyStatusPending2.some((item: { id: number; }) => item.id === testPetId);
    expect(hasTestPet4).toBe(true);

    const responseDelete = await petApi.delete(testPetId);
    expect(responseDelete.status()).toBe(200);
    const responseGet3 = await petApi.getById(testPetId);
    expect(responseGet3.status()).toBe(404);
  });
});
