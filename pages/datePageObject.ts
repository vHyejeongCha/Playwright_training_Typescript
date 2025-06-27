import { expect, type Locator, type Page } from '@playwright/test';

export class DatePageObject {
  // 今日より1日前の日付 (YYYY/MM/DD)
    getYesterdayYMD(): string {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
    }

  // 今日よりN日前の日付 (YYYY/MM/DD)
    getDateBeforeNDays(n: number): string {
    const date = new Date();
    date.setDate(date.getDate() - n);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
    }
}