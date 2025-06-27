import { test, expect } from '@playwright/test';

import { LoginPage } from './pages/LoginPage';
import { ReservationPage } from './pages/ReservationPage'
import { readCsvData } from './utilities/read_csv';

//CSV読み込み
const records = readCsvData('C:/Users/hyejeong.cha/Desktop/Playwright_Typescript/data_reservation/reservation.csv');

for (const record of records) {
    test(`login & reservation: ${record.case_no}`, async ({ page }) => {

        //ページに遷移
        await page.goto('https://hotel-example-site.takeyaqa.dev/ja/index.html?');

        //ログインPageObject
        const loginPage = new LoginPage(page);
        await loginPage.login(record.mailaddress, record.password);

        //宿泊予約PageObject
        const reservation = new ReservationPage(page);
        //宿泊予約ポップアップを開く
        const reservationPopup = await reservation.openReservationPopup();
        //予約の入力を実施（氏名とかは必要な値を指定）
        await reservation.reserve(reservationPopup, {
            date: record.date,
            nights: record.term,
            guests: record['head-count'],
            contact: record.contact,
            expectedName: record.name
});

    //宿泊プランページに戻ったことを確認
    await expect(page).toHaveURL('https://hotel-example-site.takeyaqa.dev/ja/plans.html');
  }); // ←test() の閉じる括弧
}  // ← forループの閉じる中括弧