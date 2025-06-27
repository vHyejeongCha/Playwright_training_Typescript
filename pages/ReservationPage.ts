import { Page, expect } from '@playwright/test';

export class ReservationPage {
    readonly page: Page;

    constructor(page: Page) {
    this.page = page;
    }

    // 宿泊予約ポップアップを開いてpage1を返す
    async openReservationPopup(): Promise<Page> {
    await this.page.getByRole('link', { name: '宿泊予約' }).click();
    const page1Promise = this.page.waitForEvent('popup');
    await this.page.locator('.btn.btn-primary').first().click();
    const page1 = await page1Promise;
    return page1;
    }

    // ポップアップで宿泊予約一式を実行
    async reserve(page1: Page, params: {
    date: string;
    nights: string;
    guests: string;
    contact: string;
    expectedName: string;
    }) {
    await page1.getByRole('textbox', { name: '宿泊日 必須' }).click();
    await page1.waitForTimeout(2 * 1000); // n秒待機
    await page1.getByRole('textbox', { name: '宿泊日 必須' }).press('ControlOrMeta+a');
    await page1.getByRole('textbox', { name: '宿泊日 必須' }).fill(params.date);
    await page1.getByRole('spinbutton', { name: '宿泊数 必須' }).fill(params.nights);
    await page1.getByRole('spinbutton', { name: '人数 必須' }).fill(params.guests);
    await page1.getByLabel('確認のご連絡 必須').selectOption(params.contact);
    await expect(page1.getByRole('textbox', { name: '氏名 必須' })).toHaveValue(params.expectedName);
    await page1.locator('[data-test="submit-button"]').click();
    await page1.getByRole('button', { name: 'この内容で予約する' }).click();
    await page1.getByRole('button', { name: '閉じる' }).click();
    }
}
