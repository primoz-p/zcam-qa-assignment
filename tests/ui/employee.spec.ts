import {expect, test} from '../../fixtures/test.fixture';

test.describe('OrangeHRM UI: Employee', () => {

      test('UI-EMPLOYEE-01: Create new employee, assign it as new admin, verify in search table, and attempt login', async ({
                                                                                                                              authenticatedPage,
                                                                                                                              dashboardPage,
                                                                                                                              pimPage,
                                                                                                                              adminPage,
                                                                                                                              loginPage,
                                                                                                                            }) => {
        const uniqueId = Date.now().toString();
        const firstName = `TestFn_${uniqueId}`;
        const lastName = `TestLn_${uniqueId}`;
        const fullName = `${firstName} ${lastName}`;
        const username = `User_${uniqueId}`;
        const password = `Pass123!_${uniqueId}`;

        // 1. Navigate to PIM module and create a new Employee
        await dashboardPage.navigateToPim();
        await authenticatedPage.waitForURL(/.*pim\/viewEmployeeList/);
        console.debug(`Adding employee ${fullName}`)
        await pimPage.addEmployee(firstName, lastName);

        // 2. Navigate to Admin module and click "Add User"
        await dashboardPage.navigateToAdmin();
        await authenticatedPage.waitForURL(/.*admin\/viewSystemUsers/);
        await adminPage.addButton.click();
        await authenticatedPage.waitForURL(/.*admin\/saveSystemUser/);

        // 3. Fill "Add User" form using the newly created Employee
        console.debug(`Adding user ${username}`)
        await adminPage.selectDropdownOption(adminPage.userRoleDropdown, 'Admin');
        await adminPage.selectDropdownOption(adminPage.statusDropdown, 'Enabled');
        await adminPage.selectEmployeeName(firstName, fullName);

        await adminPage.newUsernameInput.fill(username);
        await adminPage.passwordInput.fill(password);
        await adminPage.confirmPasswordInput.fill(password);

        // 4. Save and verify user appears in System Users list
        await adminPage.saveButton.click();
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
