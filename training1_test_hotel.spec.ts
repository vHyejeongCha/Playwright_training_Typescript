import { test, expect } from '@playwright/test';

// 日付保存_ゼロ埋め版
function toYMD(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
}

// 日付保存_「年/月/日」版
function toYMJ(date: Date): string {
    const yyyy = date.getFullYear();
    const m = date.getMonth() + 1; // 0始まり注意
    const d = date.getDate();
    return `${yyyy}年${m}月${d}日`;
}

// 「今日+1日」「今日+2日」を取得
const baseDate = new Date(); // ★今日
const plus1 = new Date(baseDate); // 「明日」
plus1.setDate(baseDate.getDate() + 1);

const plus2 = new Date(baseDate); // 「明後日」
plus2.setDate(baseDate.getDate() + 2);

// 形式1: yyyy/mm/dd
const plus1StrYMD = toYMD(plus1);
const plus2StrYMD = toYMD(plus2);

// 形式2: yyyy年m月d日
const plus1StrYMJ = toYMJ(plus1);
const plus2StrYMJ = toYMJ(plus2);
const termDisplay = `${plus1StrYMJ} 〜 ${plus2StrYMJ} 1泊`;

test('test hotel planisphere', async ({ page }) => {
    //Hotel Planisphereに遷移
    await page.goto('https://hotel-example-site.takeyaqa.dev/ja/plans.html');

    //"ログイン"ボタン押下
    await page.getByRole('button', { name: 'ログイン' }).click();

    //ログイン処理
    await page.getByRole('textbox', { name: 'メールアドレス' }).click();
    await page.getByRole('textbox', { name: 'メールアドレス' }).fill('ichiro@example.com');
    await page.getByRole('textbox', { name: 'パスワード' }).click();
    await page.getByRole('textbox', { name: 'パスワード' }).fill('password');
    await page.locator('#login-button').click();

    //マイページよりユーザー情報確認
    await expect(page.locator('#email')).toContainText('ichiro@example.com');
    await expect(page.locator('#username')).toContainText('山田一郎');
    await expect(page.locator('#rank')).toContainText('プレミアム会員');
    await expect(page.locator('#address')).toContainText('東京都豊島区池袋');
    await expect(page.locator('#tel')).toContainText('01234567891');
    await expect(page.locator('#gender')).toContainText('男性');
    await expect(page.locator('#birthday')).toContainText('未登録');
    await expect(page.locator('#notification')).toContainText('受け取る');

    //宿泊予約ページから"このプランで予約"押下
    await page.getByRole('link', { name: '宿泊予約' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.locator('.btn.btn-primary').first().click();
    const page1 = await page1Promise;

    //宿泊予約確認画面に遷移したことを確認
    expect(page1.url()).toContain('https://hotel-example-site.takeyaqa.dev/ja/reserve.html');

    //宿泊日に翌日の日付が入っていることを確認
    await expect(page1.getByRole('textbox', { name: '宿泊日 必須' })).toHaveValue(plus1StrYMD);

    //"確認のご連絡"を"希望しない"で選択
    await page1.getByLabel('確認のご連絡 必須').selectOption('no');

    //宿泊予約画面での合計金額を保存
    const aText = await page1.locator('#total-bill').innerText();

    //宿泊予約画面で表示された金額と一致するか確認
    const bText = await page1.locator('#total-bill').innerText();
    expect(aText).toBe(bText);

    //"予約内容を確認する"押下
    await page1.locator('[data-test="submit-button"]').click();

    //予約情報の確認
    await expect(page1.locator('#term')).toContainText(termDisplay);
    await expect(page1.locator('#head-count')).toContainText('1名様');
    await expect(page1.locator('#plans')).toContainText('なし');
    await expect(page1.locator('#username')).toContainText('山田一郎様');
    await expect(page1.locator('#contact')).toContainText('希望しない');
    await expect(page1.locator('#comment')).toContainText('なし');
    //"予約内容を確認する"ボタンを押下
    await page1.getByRole('button', { name: 'この内容で予約する' }).click();

    //確認ポップアップの確認
    await expect(page1.locator('h5')).toContainText('予約を完了しました');
    await expect(page1.locator('#success-modal')).toContainText('ご来館、心よりお待ちしております。');

    //ポップアップを閉じる
    await page1.getByRole('button', { name: '閉じる' }).click();

    //タブが閉じ、宿泊プラン一覧画面に戻ったことを確認
    expect(page1.url()).toBe('https://hotel-example-site.takeyaqa.dev/ja/confirm.html');
})