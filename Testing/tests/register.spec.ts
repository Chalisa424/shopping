import {test, expect} from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await page.getByRole('textbox', { name: 'ชื่อ - นามสกุล' }).fill('baibai');
  await page.getByRole('textbox', { name: 'เบอร์โทรศัพท์' }).fill('123456');
  await page.getByRole('textbox', { name: 'ตั้งชื่อผู้ใช้' }).fill('baibai42');
  await page.getByRole('textbox', { name: 'รหัสผ่าน', exact: true }).fill('bai123456');
  await page.getByRole('textbox', { name: 'ยืนยันรหัสผ่าน' }).fill('bai123456');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'ลงทะเบียน' }).click();
  await page.goto('http://localhost:5173/login');

  await page.waitForTimeout(10000);

});