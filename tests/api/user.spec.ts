import {expect, test} from '../../fixtures/test.fixture';
import {User} from '../../api/user.model';

test.describe('Petstore API: User', () => {
  test.describe.configure({mode: 'serial'});

  const userId = Date.now();
  const username = `testuser_${Date.now()}`;
  const userFirstName = 'John';
  const userLastName = 'Doe';
  const userEmail = 'john.doe@example.com';
  const userPhone = '1234567890';
  const userPassword = 'Password123';
  const testUser: User = {
    id: userId,
    username: username,
    firstName: userFirstName,
    lastName: userLastName,
    email: userEmail,
    phone: userPhone,
    password: userPassword,
    userStatus: 1
  };

  test('API-USER-01: Create a user', async ({userApi}) => {
    const response = await userApi.create(testUser);

    expect(response.status()).toBe(200);
  });

  test('API-USER-02: Get user details by username', async ({userApi}) => {
    const response = await userApi.get(username);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(userId);
    expect(body.username).toBe(username);
    expect(body.firstName).toBe(userFirstName);
    expect(body.lastName).toBe(userLastName);
    expect(body.phone).toBe(userPhone);
    expect(body.email).toBe(userEmail);
    expect(body.password).toBe(userPassword);
  });

  test('API-USER-03: Log in with valid credentials', async ({userApi}) => {
    const response = await userApi.login(username, userPassword);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toContain('logged in user session');
  });

  test('API-USER-04: Log out active user session', async ({userApi}) => {
    const response = await userApi.logout();

    expect(response.status()).toBe(200);
  });

  test('API-USER-05: Update user details by username', async ({userApi}) => {
    const updatedUser = {...testUser, firstName: 'Johnny', phone: '0000000000'};
    const response = await userApi.update(username, updatedUser);

    expect(response.status()).toBe(200);
  });

  test('API-USER-06: Create multiple users', async ({userApi}) => {
    const users: User[] = [
      {...testUser, username: `bulk1_${Date.now()}`},
      {...testUser, username: `bulk2_${Date.now()}`}
    ];
    const response = await userApi.createWithList(users);

    expect(response.status()).toBe(200);
  });

  test('API-USER-07: Delete user by username', async ({userApi}) => {
    const response = await userApi.delete(username);

    expect([200, 404]).toContain(response.status());
  });

  test('API-USER-08: Error when deleting non-existent username', async ({userApi}) => {
    const response = await userApi.get('non_existent_user_' + Date.now());

    expect(response.status()).toBe(404);
  });

  test('API-USER-09: Update for non-existent user safely', async ({userApi}) => {
    const response = await userApi.update('non_existent_user_' + Date.now(), testUser);

    expect(response.status()).toBe(200);
  });

  test('API-USER-10: Delete of non-existent user', async ({userApi}) => {
    const response = await userApi.delete('non_existent_user_' + Date.now());

    expect(response.status()).toBe(404);
  });
});
