document.addEventListener('DOMContentLoaded', () => {
    const keyInput = document.getElementById('keyInput');
    const claimButton = document.getElementById('claimButton');
    const balanceDisplay = document.getElementById('balance');
    const messageDisplay = document.getElementById('message');

    let balance = 0; 
    balanceDisplay.textContent = formatCurrency(balance);

    claimButton.addEventListener('click', async () => {
        const key = keyInput.value.trim();

        if (key === '') {
            showMessage('Vui lòng nhập mã thưởng.', 'red');
            return;
        }

        claimButton.disabled = true;
        showMessage('Đang xử lý...', 'blue');

        try {
            // Thay thế địa chỉ IP dưới đây bằng địa chỉ IP của máy tính bạn
            const response = await fetch('http://192.168.11.63:5001/redeem-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: key })
            });

            const result = await response.json();

            if (response.ok) {
                const amount = result.amount;
                balance += amount;
                balanceDisplay.textContent = formatCurrency(balance);
                showMessage(`Chúc mừng! Bạn đã nhận được ${formatCurrency(amount)}.`, 'green');
                keyInput.value = '';
            } else {
                showMessage(`Lỗi: ${result.message}`, 'red');
            }
        } catch (error) {
            showMessage('Không thể kết nối đến server. Vui lòng thử lại sau.', 'red');
        } finally {
            claimButton.disabled = false;
        }
    });

    function formatCurrency(amount) {
        return `${amount.toLocaleString('vi-VN')} VNĐ`;
    }

    function showMessage(message, color) {
        messageDisplay.textContent = message;
        messageDisplay.style.color = color;
        // Bỏ setTimeout để thông báo giữ lại
        // setTimeout(() => {
        //     messageDisplay.textContent = '';
        // }, 3000); 
    }
});