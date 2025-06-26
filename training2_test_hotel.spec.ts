import { test, expect } from '@playwright/test';

//翌月1日をYYYY/MM/DD形式で保存
function getNextMonthFirstDay(): string {
    const today = new Date();
    const year = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
    const month = today.getMonth() === 11 ? 0 : today.getMonth() + 1;
    const nextMonthFirst = new Date(year, month, 1);
    const y = nextMonthFirst.getFullYear();
    const m = String(nextMonthFirst.getMonth() + 1).padStart(2, '0');
    const d = String(nextMonthFirst.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
}

const nextMonthFirstDay = getNextMonthFirstDay();


//宿泊予約ページに遷移
test('test', async ({ page }) => {
    await page.goto('https://hotel-example-site.takeyaqa.dev/ja/reserve.html?plan-id=0');
    //宿泊日を"翌月1日"に設定
    await page.getByRole('textbox', { name: '宿泊日 必須' }).click();
        //日付入力のため待機
        await page.waitForTimeout(2 * 1000); // n秒待機
    await page.getByRole('textbox', { name: '宿泊日 必須' }).press('ControlOrMeta+a');
    await page.getByRole('textbox', { name: '宿泊日 必須' }).fill(nextMonthFirstDay);
    await page.getByRole('textbox', { name: '宿泊日 必須' }).press('Tab');

    //宿泊日数をを"3泊"に設定
    await page.getByRole('spinbutton', { name: '宿泊数 必須' }).fill('3');
    await page.getByRole('spinbutton', { name: '宿泊数 必須' }).press('Tab');

    //人数を"2人"に設定
    await page.getByRole('spinbutton', { name: '人数 必須' }).fill('2');
    await page.getByRole('spinbutton', { name: '人数 必須' }).press('Tab');

    //"お得な観光プラン"選択
    await page.getByRole('checkbox', { name: 'お得な観光プラン' }).check();

    //お名前に自分の名前を入力
    await page.getByRole('textbox', { name: '氏名 必須' }).fill('Cha');

    //確認のご連絡は"希望しない"を選択
    await page.getByLabel('確認のご連絡 必須').selectOption('no');

        //(確認用)スクリーンショット取得
        await page.screenshot({ path: 'screenshot/screenshot1.png' });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.screenshot({ path: 'screenshot/screenshot2.png' });

    //"予約内容を確認する"ボタンクリック
    await page.locator('[data-test="submit-button"]').click();

    //合計金額確認"44,000円"
    await expect(page.locator('#total-bill')).toContainText('合計 44,000円（税込み）');

});