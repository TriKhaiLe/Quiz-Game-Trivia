// Khai báo gtag trên window để TypeScript không báo lỗi
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

// Hàm ghi lại một sự kiện tùy chỉnh
// Tham khảo: https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const logEvent = (
    action: string,
    params?: { [key: string]: string | number | undefined }
): void => {
    if (typeof window.gtag !== 'function') {
        console.warn('GA not ready, skipping event:', action);
        return;
    }
    window.gtag('event', action, params);
};

// Hàm ghi lại lượt xem trang (dành cho SPA)
// Tham khảo: https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const logPageView = (path: string, title: string): void => {
    if (typeof window.gtag !== 'function') {
         console.warn('GA not ready, skipping pageview:', path);
        return;
    }
    // Bạn cần lấy Measurement ID từ một nguồn đáng tin cậy,
    // ở đây chúng ta giả định nó được nạp từ script trong index.html
    // và không cần truyền lại ở đây, vì lệnh 'config' trong index.html đã xử lý.
    // Tuy nhiên, việc gọi lại config với page_path là cách đúng để ghi nhận page view trong SPA.
    // Lấy ID từ script gốc hoặc một biến toàn cục nếu cần.
    window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_location: window.location.href
    });
    console.log(`GA PageView: ${title} (${path})`);
};
