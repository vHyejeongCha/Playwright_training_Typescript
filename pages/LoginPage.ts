import { Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
    this.page = page;
    }

    async login(email: string, password: string): Promise<void> {
    await this.page.getByRole('button', { name: 'ログイン' }).click();
    await this.page.getByRole('textbox', { name: 'メールアドレス' }).click();
    await this.page.getByRole('textbox', { name: 'メールアドレス' }).fill(email);
    await this.page.getByRole('textbox', { name: 'メールアドレス' }).press('Tab');
    await this.page.getByRole('textbox', { name: 'パスワード' }).fill(password);
    await this.page.locator('#login-button').click();
    }
}
