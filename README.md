# Mockup Case Management List

โปรเจกต์นี้เป็น Mockup สำหรับหน้าเว็บแสดงรายการเคส (Case Management List) พัฒนาด้วย React และ Vite และใช้ [Tailwind CSS](https://tailwindcss.com/) สำหรับ Styling

## การติดตั้งและใช้งาน

1.  **Clone a repository:**
    ```sh
    git clone <your-repository-url>
    cd mockup-case-manage-list
    ```

2.  **ติดตั้ง Dependencies:**
    ใช้ `npm` เพื่อติดตั้ง package ที่จำเป็นทั้งหมด
    ```sh
    npm install
    ```

3.  **รัน Development Server:**
    หลังจากติดตั้งเสร็จเรียบร้อย ให้รันคำสั่งข้างล่างเพื่อเปิด development server
    ```sh
    npm run dev
    ```
    จากนั้นเปิดเบราว์เซอร์ไปที่ [http://localhost:5173](http://localhost:5173) (หรือ port อื่นที่แสดงใน terminal)

## Scripts ที่มีให้ใช้งาน

-   `npm run dev`: รันแอปพลิเคชันใน development mode
-   `npm run build`: บิวด์แอปพลิเคชันสำหรับ production
-   `npm run lint`: รัน ESLint เพื่อตรวจสอบ code style
-   `npm run preview`: รัน production build ใน local server
-   `npm run deploy`: Deploy แอปพลิเคชันไปยัง GitHub Pages
