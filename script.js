document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử từ HTML
    const keyInput = document.getElementById('keyInput');
    const claimButton = document.getElementById('claimButton');
    const balanceDisplay = document.getElementById('balance');
    const messageDisplay = document.getElementById('message');

    // Khởi tạo số dư ban đầu
    let balance = 0; 
    balanceDisplay.textContent = formatCurrency(balance);

    // Xử lý sự kiện khi click nút "Nhận Tiền"
    claimButton.addEventListener('click', async () => { // Thêm async để xử lý bất đồng bộ
        const key = keyInput.value.trim();

        if (key === '') {
            showMessage('Vui lòng nhập mã thưởng.', 'red');
            return;
        }

        // Vô hiệu hóa nút để tránh gửi yêu cầu nhiều lần
        claimButton.disabled = true;
        showMessage('Đang xử lý...', 'blue');

        try {
            // Gửi key đến API /redeem-key của backend (web1)
            const response = await fetch('http://127.0.0.1:5001/redeem-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: key })
            });

            const result = await response.json();

            if (response.ok) {
                // Key hợp lệ, nhận tiền thưởng từ backend
                const amount = result.amount;
                balance += amount;
                balanceDisplay.textContent = formatCurrency(balance);
                showMessage(`Chúc mừng! Bạn đã nhận được ${formatCurrency(amount)}.`, 'green');
                keyInput.value = ''; // Xóa nội dung ô input
            } else {
                // Key không hợp lệ, hiển thị thông báo lỗi từ backend
                showMessage(`Lỗi: ${result.message}`, 'red');
            }
        } catch (error) {
            // Xử lý lỗi khi không thể kết nối đến server
            showMessage('Không thể kết nối đến server. Vui lòng thử lại sau.', 'red');
        } finally {
            // Luôn bật lại nút sau khi hoàn thành
            claimButton.disabled = false;
        }
    });

    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return `${amount.toLocaleString('vi-VN')} VNĐ`;
    }

    // Hàm hiển thị thông báo
    function showMessage(message, color) {
        messageDisplay.textContent = message;
        messageDisplay.style.color = color;
        // Có thể bỏ dòng này nếu bạn muốn giữ thông báo lại
        // setTimeout(() => {
        //     messageDisplay.textContent = '';
        // }, 3000); 
    }
});