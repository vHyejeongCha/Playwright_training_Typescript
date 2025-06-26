import { test, expect } from '@playwright/test';
import { DatePageObject } from './pages/datePageObject';  // 大文字で！

test('test', async ({ page }) => {
    // 日付PageObjectをインスタンス化
    const datePage = new DatePageObject();

    // 必要な日付を変数に保存
    const yesterdayStr = datePage.getYesterdayYMD();
    const date91DaysAgo = datePage.getDateBeforeNDays(91);

    //宿泊予約ページに遷移
    await page.goto('https://hotel-example-site.takeyaqa.dev/ja/reserve.html?plan-id=0');

    await page.getByRole('textbox', { name: '氏名 必須' }).fill('Cha');
    await page.getByLabel('確認のご連絡 必須').selectOption('no');

    //宿泊日を"1日前"に設定
    await page.getByRole('textbox', { name: '宿泊日 必須' }).click();
    await page.waitForTimeout(2 * 1000); // n秒待機
    await page.getByRole('textbox', { name: '宿泊日 必須' }).press('ControlOrMeta+a');
    await page.getByRole('textbox', { name: '宿泊日 必須' }).fill(yesterdayStr);
    await page.locator('[data-test="submit-button"]').click();
    await expect(page.locator('#reserve-form')).toContainText('翌日以降の日付を入力してください。');

    //3ヶ月以上前の日付で予約できないことを確認
    await page.getByRole('textbox', { name: '宿泊日 必須' }).press('ControlOrMeta+a');
    await page.getByRole('textbox', { name: '宿泊日 必須' }).fill(date91DaysAgo);
    await page.locator('[data-test="submit-button"]').click();
    await expect(page.locator('#reserve-form')).toContainText('翌日以降の日付を入力してください。');
    await page.waitForTimeout(2 * 1000); // n秒待機

    //リロード
    await page.goto('https://hotel-example-site.takeyaqa.dev/ja/reserve.html?plan-id=0');

    //氏名が空白の状態では予約できないことを確認
    await page.getByLabel('確認のご連絡 必須').selectOption('no');
    await page.locator('[data-test="submit-button"]').click();
    await expect(page.locator('#reserve-form')).toContainText('このフィールドを入力してください。');
    await page.waitForTimeout(2 * 1000); // n秒待機
});