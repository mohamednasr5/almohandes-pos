// ===== Printing Functions =====

function printReceipt(cartItems, totalAmount) {
  if (!cartItems || cartItems.length === 0) {
    alert('لا أصناف لطباعاتها');
    return;
  }

  let receiptHTML = `
    <div style="width: 80mm; margin: 0 auto; font-family: 'Courier New', monospace;">
      <h2 style="text-align: center; margin: 10px 0;">المهندس للمبيعات</h2>
      <hr style="border: 1px solid #000;">
      <p style="text-align: center; font-size: 10px;">رقم الثبيات: ${new Date().getTime()}</p>
      <p style="text-align: center; font-size: 10px;">العارضة: ${new Date().toLocaleString('ar-EG')}</p>
      <hr style="border: 1px solid #000;">
      
      <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #000;">
            <td>المنتج</td>
            <td style="text-align: center;">الكمية</td>
            <td style="text-align: right;">السعر</td>
          </tr>
        </thead>
        <tbody>
  `;

  cartItems.forEach(item => {
    receiptHTML += `
      <tr>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.qty}</td>
        <td style="text-align: right;">${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `;
  });

  receiptHTML += `
        </tbody>
      </table>
      <hr style="border: 1px solid #000;">
      <div style="text-align: right; font-size: 14px; font-weight: bold;">
        الإجمالي: ${totalAmount} ج.m
      </div>
      <hr style="border: 1px solid #000;">
      <p style="text-align: center; font-size: 10px; margin-top: 10px;">شكرا لتعاطيكم</p>
    </div>
  `;

  const printWindow = window.open('', '', 'width=300,height=500');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>طباعة الفاتورة</title>
      <style>
        body { margin: 0; padding: 10px; font-family: 'Courier New', monospace; }
      </style>
    </head>
    <body>
      ${receiptHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
