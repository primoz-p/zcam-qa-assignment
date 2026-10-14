import {expect, test} from '../../fixtures/ui.test.fixture';

test.describe('OrangeHRM UI: Employee', () => {

      test('UI-EMPLOYEE-01: Create new employee, assign it as new admin, verify in search table, and attempt login', async ({
                                                                                                                              authenticatedPage,
                                                                                                                              dashboardPage,
                                                                                                                              pimPage,
                                                                                                                              adminPage,
                                                                                                                              loginPage,
                                                                                                                            }) => {
        const uniqueId = Date.now().toString();
        const firstName = `ppTest_Fn_${uniqueId}`;
        const lastName = `ppTes_tLn_${uniqueId}`;
        const fullName = `${firstName} ${lastName}`;
        const username = `ppTest_User_${uniqueId}`;
        const password = `Pass123!_${uniqueId}`;

        // 1. Navigate to PIM module and create a new Employee
        await dashboardPage.navigateToPim();
        await authenticatedPage.waitForURL(/.*pim\/viewEmployeeList/);
        await pimPage.addEmployee(firstName, lastName);

        // 2. Navigate to Admin module and click "Add User"
        await dashboardPage.navigateToAdmin();
        await authenticatedPage.waitForURL(/.*admin\/viewSystemUsers/);
        await adminPage.addButton.click();
        await authenticatedPage.waitForURL(/.*admin\/saveSystemUser/);

        // 3. Fill "Add User" for the newly created Employee
        await adminPage.addUser(firstName, fullName, username, password);

        // 4. Verify user appears in System Users list
        await authenticatedPage.waitForURL(/.*admin\/viewSystemUsers/);
        await adminPage.searchByUsername(username);
        await expect(adminPage.tableRows.first()).toContainText(username);

        // 5. Logout current Admin session
        await dashboardPage.logout();

        // 6. Log in with the newly created Admin user
        await loginPage.login(username, password);
        await expect(authenticatedPage).toHaveURL(/.*dashboard/);
      });
    }
);
