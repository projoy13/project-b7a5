1. Login
POST /api/auth/login
Frontend: /auth/login/page.tsx
Note: Customer, Provider, Admin login


2. Register
POST /api/auth/register
Frontend: /auth/register/page.tsx
Note: Customer and Provider registration


3. Get Current User
GET /api/users/me
Frontend: /dashboard/page.tsx
Note: Get logged-in user's information


4. Get All Users
GET /api/admin/users
Frontend: /admin/getallusers/page.tsx
Note: Admin only - Get all users


5. Update User Status
PATCH /api/admin/users/:id
Frontend: /admin/updateuser/page.tsx
Note: Admin only - Activate or suspend user


6. Create Gear
POST /api/gear
Frontend: /gear/create/page.tsx
Note: Provider only - Create new gear


7. Get All Gear
GET /api/gear
Frontend: /gear/page.tsx
Note: Show all gear


8. Get Gear By ID
GET /api/gear/:id
Frontend: /gear/[id]/page.tsx
Note: Show details of one gear


9. Update Gear
PATCH /api/gear/:id
Frontend: /gear/[id]/edit/page.tsx
Note: Provider only - Update own gear


10. Delete Gear
DELETE /api/gear/:id
Frontend: /gear/[id]/delete/page.tsx
Note: Provider only - Delete own gear


11. Create Category
POST /api/categories
Frontend: /categories/create/page.tsx
Note: Admin only - Create category


12. Get All Categories
GET /api/categories
Frontend: /categories/page.tsx
Note: Get all categories


13. Get Category By ID
GET /api/categories/:id
Frontend: /categories/[id]/page.tsx
Note: Get one category


14. Update Category
PATCH /api/categories/:id
Frontend: /categories/[id]/edit/page.tsx
Note: Admin only - Update category


15. Delete Category
DELETE /api/categories/:id
Frontend: /categories/[id]/delete/page.tsx
Note: Admin only - Delete category


16. Create Rental
POST /api/rentals
Frontend: /rentals/create/page.tsx
Note: Customer - Create rental order


17. Get All Rentals
GET /api/rentals
Frontend: /rentals/page.tsx
Note: Get rental orders


18. Update Rental
PATCH /api/rentals/:id
Frontend: /rentals/[id]/page.tsx
Note: Update rental/order status


19. Create Payment
POST /api/payments/create
Frontend: /payment/create/page.tsx
Note: Customer - Create payment record


20. Get All Payments
GET /api/payments
Frontend: /payment/page.tsx
Note: Admin only - Get all payments


21. Get Payment By ID
GET /api/payments/:id
Frontend: /payment/[id]/page.tsx
Note: Admin only - Get payment details


22. Stripe Checkout
POST /api/payments/checkout/:id
Frontend: /payment/checkout/page.tsx
Note: Create Stripe Checkout Session


23. Stripe Webhook
POST /api/payments/webhook
Frontend: No page
Note: Stripe calls this backend automatically


24. Payment Success
Frontend: /payment/success/page.tsx
Note: Show successful payment message


25. Payment Cancel
Frontend: /payment/cancel/page.tsx
Note: Show cancelled payment message


26. Create Review
POST /api/reviews
Frontend: /reviews/create/page.tsx
Note: Customer - Create review


27. Get All Reviews
GET /api/reviews
Frontend: /reviews/page.tsx
Note: Get all reviews


28. Update Review
PATCH /api/reviews/:id
Frontend: /reviews/[id]/edit/page.tsx
Note: Customer - Update own review


29. Get Gear Reviews
GET /api/reviews/gear/:id
Frontend: /reviews/gear/[id]/page.tsx
Note: Get reviews for a specific gear